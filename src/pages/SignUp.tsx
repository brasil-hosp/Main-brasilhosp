import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import {
  Loader2, User, Building2, MapPin, FileText, Lock,
  ChevronRight, ChevronLeft, Search, Eye, EyeOff,
  AlertTriangle, Check, Upload, Plus, Trash2
} from "lucide-react";

interface Reference {
  name: string;
  email: string;
  phone: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"PF" | "PJ">("PJ");
  const [showPassword, setShowPassword] = useState(false);

  // --- ARQUIVOS (ESTADOS) ---
  // PF
  const [rgFile, setRgFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  // PJ - Corporativo
  const [cnpjCardFile, setCnpjCardFile] = useState<File | null>(null);
  const [socialContractFile, setSocialContractFile] = useState<File | null>(null);
  const [operatingPermitFile, setOperatingPermitFile] = useState<File | null>(null);
  // PJ - Sanitário
  const [sanitaryCosmeticsFile, setSanitaryCosmeticsFile] = useState<File | null>(null);
  const [sanitaryHealthFile, setSanitaryHealthFile] = useState<File | null>(null);
  const [sanitarySanitizingFile, setSanitarySanitizingFile] = useState<File | null>(null);
  const [sanitaryMedicationFile, setSanitaryMedicationFile] = useState<File | null>(null); // NOVO

  // --- FORM DATA ---
  const [references, setReferences] = useState<Reference[]>([
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" }
  ]);

  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    fullName: "", document: "", phone: "",
    legalNature: "Entidade Empresarial",
    companyName: "", fantasyName: "", ie: "", im: "",
    buyerName: "", buyerPhone: "", buyerEmail: "",
    finName: "", finPhone: "", finEmail: "",
    cep: "", address: "", number: "", complement: "", neighborhood: "", city: "", state: "",
  });

  // --- MÁSCARAS ---
  const maskDocument = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (userType === "PF") {
      if (v.length > 11) v = v.slice(0, 11);
      return v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      if (v.length > 14) v = v.slice(0, 14);
      return v.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
    }
  };

  const maskPhone = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      setLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({ ...prev, address: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf }));
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
  };

  // --- REFERÊNCIAS ---
  const addReference = () => { setReferences([...references, { name: "", email: "", phone: "" }]); };
  const removeReference = (index: number) => {
    if (references.length <= 3) return; // Mínimo de 3 mantido
    const newRefs = [...references]; newRefs.splice(index, 1); setReferences(newRefs);
  };
  const updateReference = (index: number, field: keyof Reference, value: string) => { const newRefs = [...references]; newRefs[index][field] = value; setReferences(newRefs); };

  // --- VALIDAÇÃO ---
  const validateStep = () => {
    if (step === 1) {
      if (!formData.document || formData.document.length < 14) return "Documento inválido.";
      if (userType === "PJ") {
        if (!formData.companyName) return "Razão Social obrigatória.";
        if (!formData.ie || !formData.im) return "Inscrições Estadual e Municipal obrigatórias.";
        if (!formData.buyerName || !formData.finName) return "Nomes dos responsáveis obrigatórios.";
      } else {
        if (!formData.fullName) return "Nome completo obrigatório.";
      }
    }
    if (step === 2) {
      if (!formData.cep || !formData.address || !formData.number) return "Endereço incompleto.";
    }
    if (step === 3) {
      if (userType === "PJ") {
        if (!cnpjCardFile) return "Anexe o Cartão CNPJ.";
        if (!socialContractFile) return "Anexe o Contrato Social/Estatuto.";
        if (!operatingPermitFile) return "Anexe o Alvará de Funcionamento.";
        // Nota: Alvarás específicos não são "obrigatórios" para todos, depende da atividade, então não bloqueamos, mas o Admin vê o que falta.
        if (references.length < 3 || references.some(r => !r.name || !r.phone)) return "Preencha ao menos as 3 referências comerciais iniciais.";
      } else {
        if (!rgFile) return "Anexe seu RG/CNH.";
        if (!addressProofFile) return "Anexe o Comprovante de Endereço.";
      }
    }
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep();
    if (error) { toast({ variant: "destructive", title: "Atenção", description: error }); return; }
    setStep(prev => prev + 1);
  };

  // --- UPLOAD ---
  const uploadFile = async (userId: string, file: File, type: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('documents').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
    return publicUrl;
  };

  // --- SUBMIT ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erro", description: "Senhas não conferem." }); return;
    }

    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: userType === 'PJ' ? formData.companyName : formData.fullName,
            user_type: userType,
            document: formData.document,
            phone: formData.phone,
            legal_nature: userType === 'PJ' ? formData.legalNature : null,
            municipal_inscription: userType === 'PJ' ? formData.im : null,
            company_name: userType === 'PJ' ? formData.companyName : null,
            fantasy_name: userType === 'PJ' ? formData.fantasyName : null,
            ie: userType === 'PJ' ? formData.ie : null,
            financial_contact_name: formData.finName,
            financial_contact_phone: formData.finPhone,
            financial_contact_email: formData.finEmail,
            cep: formData.cep, address: formData.address, address_number: formData.number,
            complement: formData.complement, neighborhood: formData.neighborhood,
            city: formData.city, state: formData.state,
            commercial_references: userType === 'PJ' ? JSON.stringify(references) : null
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        const updates: any = {};
        const uid = authData.user.id;

        if (userType === 'PJ') {
          if (cnpjCardFile) updates.cnpj_card_url = await uploadFile(uid, cnpjCardFile, 'cnpj_card');
          if (socialContractFile) updates.social_contract_url = await uploadFile(uid, socialContractFile, 'ato_constitutivo');
          if (operatingPermitFile) updates.operating_permit_url = await uploadFile(uid, operatingPermitFile, 'alvara_func');

          if (sanitaryMedicationFile) updates.sanitary_medication_url = await uploadFile(uid, sanitaryMedicationFile, 'sanitario_medicamentos'); // NOVO
          if (sanitaryCosmeticsFile) updates.sanitary_cosmetics_url = await uploadFile(uid, sanitaryCosmeticsFile, 'sanitario_cosmeticos');
          if (sanitaryHealthFile) updates.sanitary_health_url = await uploadFile(uid, sanitaryHealthFile, 'sanitario_saude');
          if (sanitarySanitizingFile) updates.sanitary_sanitizing_url = await uploadFile(uid, sanitarySanitizingFile, 'sanitario_saneantes');
        } else {
          if (rgFile) updates.rg_url = await uploadFile(uid, rgFile, 'rg');
          if (addressProofFile) updates.address_proof_url = await uploadFile(uid, addressProofFile, 'comprovante_residencia');
        }

        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').update(updates).eq('id', uid);
        }
      }

      toast({ title: "Sucesso!", description: "Cadastro enviado para análise." });
      navigate("/entrar");

    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const FileInput = ({ label, file, setFile }: { label: string, file: File | null, setFile: any }) => (
    <div className="space-y-2 border p-3 rounded-lg bg-gray-50/50">
      <label className="text-xs font-bold uppercase text-gray-600">{label}</label>
      <div className="relative">
        <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="cursor-pointer file:mr-2 text-xs" />
        {file && <Check size={16} className="absolute right-3 top-2.5 text-green-600" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-4xl shadow-xl bg-white">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-xl font-bold text-blue-900">{userType === 'PJ' ? 'Cadastro Empresarial' : 'Cadastro Pessoa Física'}</CardTitle>
              <span className="text-sm text-gray-500 font-medium">Etapa {step} de 4</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${step * 25}%` }}></div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSignUp} className="space-y-6">

              {/* ETAPA 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-6 w-fit mx-auto">
                    <button type="button" onClick={() => { setUserType("PJ"); setFormData({ ...formData, document: "" }) }} className={`px-6 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${userType === "PJ" ? "bg-white text-blue-800 shadow-sm" : "text-gray-500"}`}><Building2 size={16} /> PJ</button>
                    <button type="button" onClick={() => { setUserType("PF"); setFormData({ ...formData, document: "" }) }} className={`px-6 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${userType === "PF" ? "bg-white text-blue-800 shadow-sm" : "text-gray-500"}`}><User size={16} /> PF</button>
                  </div>

                  {userType === "PF" ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-gray-600">Nome Completo *</label><Input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="uppercase" /></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-gray-600">CPF *</label><Input value={formData.document} onChange={e => setFormData({ ...formData, document: maskDocument(e.target.value) })} maxLength={14} className="font-mono" /></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-gray-600">WhatsApp *</label><Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })} /></div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800 font-semibold text-sm">Dados da Empresa</div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Natureza Jurídica *</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.legalNature} onChange={e => setFormData({ ...formData, legalNature: e.target.value })}>
                            <option>Entidade Empresarial</option>
                            <option>Administração Pública</option>
                            <option>Sem Fins Lucrativos</option>
                          </select>
                        </div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">CNPJ *</label><Input value={formData.document} onChange={e => setFormData({ ...formData, document: maskDocument(e.target.value) })} maxLength={18} className="font-mono" /></div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Inscrição Estadual (IE) *</label><Input value={formData.ie} onChange={e => setFormData({ ...formData, ie: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Inscrição Municipal (IM) *</label><Input value={formData.im} onChange={e => setFormData({ ...formData, im: e.target.value })} /></div>
                      </div>
                      <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Razão Social *</label><Input value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className="uppercase" /></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Nome Fantasia</label><Input value={formData.fantasyName} onChange={e => setFormData({ ...formData, fantasyName: e.target.value })} className="uppercase" /></div>

                      <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800 font-semibold text-sm mt-2">Dados do Comprador</div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Nome *</label><Input value={formData.buyerName} onChange={e => setFormData({ ...formData, buyerName: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">WhatsApp *</label><Input value={formData.buyerPhone} onChange={e => setFormData({ ...formData, buyerPhone: maskPhone(e.target.value) })} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">E-mail *</label><Input value={formData.buyerEmail} onChange={e => setFormData({ ...formData, buyerEmail: e.target.value })} /></div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800 font-semibold text-sm mt-2">Dados do Financeiro</div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Nome *</label><Input value={formData.finName} onChange={e => setFormData({ ...formData, finName: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">WhatsApp *</label><Input value={formData.finPhone} onChange={e => setFormData({ ...formData, finPhone: maskPhone(e.target.value) })} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-600">E-mail *</label><Input value={formData.finEmail} onChange={e => setFormData({ ...formData, finEmail: e.target.value })} /></div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ETAPA 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-600">CEP *</label><Input value={formData.cep} onChange={e => setFormData({ ...formData, cep: e.target.value })} onBlur={handleCepBlur} /></div>
                    <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-600">Cidade / UF</label><Input value={formData.city ? `${formData.city} - ${formData.state}` : ""} disabled className="bg-gray-100" /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Logradouro *</label><Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="Número" />
                    <Input value={formData.neighborhood} onChange={e => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Bairro" />
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600">Complemento</label><Input value={formData.complement} onChange={e => setFormData({ ...formData, complement: e.target.value })} /></div>
                </div>
              )}

              {/* ETAPA 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2 border-b pb-2"><FileText size={20} /> Validação Documental</div>

                  {userType === "PJ" ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 font-bold text-gray-700">Documentos Corporativos (Obrigatórios)</div>
                        <FileInput label="Cartão CNPJ *" file={cnpjCardFile} setFile={setCnpjCardFile} />
                        <FileInput label="Ato Constitutivo / Contrato Social *" file={socialContractFile} setFile={setSocialContractFile} />
                        <FileInput label="Alvará de Funcionamento *" file={operatingPermitFile} setFile={setOperatingPermitFile} />
                      </div>

                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                        <div className="font-bold text-green-800 mb-2">Alvarás Sanitários (Obrigatórios conforme Atividade)</div>
                        <p className="text-xs text-green-700 mb-4">Anexe as Autorizações de Funcionamento de Empresa (AFE) correspondentes aos produtos que deseja adquirir.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="ring-2 ring-green-500 rounded-lg p-1">
                            <FileInput label="AFE - Medicamentos *" file={sanitaryMedicationFile} setFile={setSanitaryMedicationFile} />
                          </div>
                          <FileInput label="AFE - Cosméticos" file={sanitaryCosmeticsFile} setFile={setSanitaryCosmeticsFile} />
                          <FileInput label="AFE - Prod. Saúde" file={sanitaryHealthFile} setFile={setSanitaryHealthFile} />
                          <FileInput label="AFE - Saneantes" file={sanitarySanitizingFile} setFile={setSanitarySanitizingFile} />
                        </div>
                      </div>

                      <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="font-bold text-blue-800">Referências Comerciais (Mín 3)</div>
                          <Button type="button" size="sm" variant="outline" onClick={addReference}><Plus size={14} className="mr-1" /> Adicionar</Button>
                        </div>

                        {references.map((ref, index) => (
                          <div key={index} className="grid md:grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded border relative">
                            <Input placeholder="Nome da Empresa *" value={ref.name} onChange={e => updateReference(index, 'name', e.target.value)} />
                            <Input placeholder="Telefone *" value={ref.phone} onChange={e => updateReference(index, 'phone', maskPhone(e.target.value))} />
                            <Input placeholder="E-mail" value={ref.email} onChange={e => updateReference(index, 'email', e.target.value)} />
                            {index >= 3 && <button type="button" onClick={() => removeReference(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1"><Trash2 size={12} /></button>}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-2">Para compras no cartão de crédito, a identificação é obrigatória.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FileInput label="RG ou CNH (Frente e Verso) *" file={rgFile} setFile={setRgFile} />
                        <FileInput label="Comprovante de Endereço *" file={addressProofFile} setFile={setAddressProofFile} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 4 */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2"><Lock size={20} /> Login</div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-600">E-mail de Acesso *</label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Para fazer login no site" /></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative"><label className="text-xs font-bold text-gray-600">Senha *</label><div className="relative"><Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} minLength={6} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-gray-600">Confirmar Senha *</label><Input type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} /></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                {step > 1 ? <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft size={16} className="mr-2" /> Voltar</Button> : <div />}
                {step < 4 ? <Button type="button" className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={handleNextStep}>Próxima Etapa <ChevronRight size={16} className="ml-2" /></Button> : <Button type="submit" className="bg-green-600 hover:bg-green-700 font-bold px-8 shadow-lg" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2" /> : "FINALIZAR CADASTRO"}</Button>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t p-4 bg-gray-50/50">
            <p className="text-sm text-gray-600">Já possui cadastro? <Link to="/entrar" className="text-blue-600 font-bold hover:underline">Acessar Conta</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;