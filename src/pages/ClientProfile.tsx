import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Loader2, Save, User, Building2, MapPin, FileText, ArrowLeft } from "lucide-react";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    document: "", // CPF ou CNPJ (Geralmente bloqueado para edição pois muda a identidade)
    phone: "",
    email: "", // Read-only
    user_type: "",
    // Endereço
    cep: "",
    address: "",
    address_number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    // PJ
    company_name: "",
    fantasy_name: "",
    ie: "",
    afe_number: "",
    sanitary_license: "",
    technical_responsible: "",
    council_number: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/entrar"); return; }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
            full_name: data.full_name || "",
            document: data.document || "",
            phone: data.phone || "",
            email: data.email || session.user.email || "",
            user_type: data.user_type || "PF",
            cep: data.cep || "",
            address: data.address || "",
            address_number: data.address_number || "",
            complement: data.complement || "",
            neighborhood: data.neighborhood || "",
            city: data.city || "",
            state: data.state || "",
            company_name: data.company_name || "",
            fantasy_name: data.fantasy_name || "",
            ie: data.ie || "",
            afe_number: data.afe_number || "",
            sanitary_license: data.sanitary_license || "",
            technical_responsible: data.technical_responsible || "",
            council_number: data.council_number || ""
        });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar seus dados." });
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
        }
      } catch (error) { console.error("Erro CEP", error); }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
            full_name: formData.full_name,
            phone: formData.phone,
            // Endereço
            cep: formData.cep,
            address: formData.address,
            address_number: formData.address_number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            // PJ (Se for o caso)
            company_name: formData.company_name,
            fantasy_name: formData.fantasy_name,
            ie: formData.ie,
            afe_number: formData.afe_number,
            sanitary_license: formData.sanitary_license,
            technical_responsible: formData.technical_responsible,
            council_number: formData.council_number
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Sucesso! ✅", description: "Seus dados foram atualizados." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate("/")}><ArrowLeft size={20}/></Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
                <p className="text-gray-500 text-sm">Mantenha seus dados atualizados para facilitar a entrega.</p>
            </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
            
            {/* DADOS BÁSICOS */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800"><User size={20}/> Dados Cadastrais</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">E-mail (Login)</label>
                        <Input value={formData.email} disabled className="bg-gray-100"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Documento (CPF/CNPJ)</label>
                        <Input value={formData.document} disabled className="bg-gray-100 font-mono"/>
                        <p className="text-[10px] text-gray-400">Para alterar o CNPJ, entre em contato com o suporte.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome / Responsável</label>
                        <Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Telefone / WhatsApp</label>
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                </CardContent>
            </Card>

            {/* ENDEREÇO */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800"><MapPin size={20}/> Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500">CEP</label><Input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} onBlur={handleCepBlur}/></div>
                        <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500">Cidade/UF</label><Input value={`${formData.city}/${formData.state}`} disabled className="bg-gray-100"/></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Logradouro</label><Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Número</label><Input value={formData.address_number} onChange={e => setFormData({...formData, address_number: e.target.value})}/></div>
                        <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500">Bairro</label><Input value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})}/></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Complemento</label><Input value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})}/></div>
                </CardContent>
            </Card>

            {/* DADOS PJ (Só mostra se for PJ) */}
            {formData.user_type === 'PJ' && (
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-800"><Building2 size={20}/> Dados Empresariais & Regulatórios</CardTitle>
                        <CardDescription>Mantenha AFE e Licença atualizados para evitar bloqueios de compra.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Razão Social</label><Input value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})}/></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Nome Fantasia</label><Input value={formData.fantasy_name} onChange={e => setFormData({...formData, fantasy_name: e.target.value})}/></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Inscrição Estadual</label><Input value={formData.ie} onChange={e => setFormData({...formData, ie: e.target.value})}/></div>
                        </div>
                        <div className="border-t pt-4 grid md:grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-xs font-bold text-amber-600">Número AFE</label><Input value={formData.afe_number} onChange={e => setFormData({...formData, afe_number: e.target.value})}/></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-amber-600">Licença Sanitária</label><Input value={formData.sanitary_license} onChange={e => setFormData({...formData, sanitary_license: e.target.value})}/></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-amber-600">Resp. Técnico</label><Input value={formData.technical_responsible} onChange={e => setFormData({...formData, technical_responsible: e.target.value})}/></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-amber-600">Conselho (CRF/CRM)</label><Input value={formData.council_number} onChange={e => setFormData({...formData, council_number: e.target.value})}/></div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2" size={18}/>}
                    Salvar Alterações
                </Button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default ClientProfile;