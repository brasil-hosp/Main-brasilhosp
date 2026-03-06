import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, MessageCircle, Trash2, ArrowRight, ArrowLeft, Building, User, Mail, Phone, MapPin, Building2, ClipboardList, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const FloatingCart = () => {
  const { items, removeFromCart, cartCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Formulário State
  const [formData, setFormData] = useState({
    userType: "PJ", // Padrão
    nome: "",
    hospital: "",
    email: "",
    telefone: "",
    estado: "",
    cidade: "",
    observacoes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-preencher dados se o usuário estiver logado
  useEffect(() => {
    if (isOpen) {
      const fetchUserProfile = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setFormData(prev => ({
                ...prev,
                userType: profile.user_type || "PJ",
                nome: prev.nome || profile.full_name || "",
                hospital: prev.hospital || profile.company_name || profile.fantasy_name || "",
                email: prev.email || profile.email || session.user.email || "",
                telefone: prev.telefone || profile.phone || "",
                estado: prev.estado || profile.state || "",
                cidade: prev.cidade || profile.city || ""
              }));
            }
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário no carrinho:", error);
        }
      };

      fetchUserProfile();
    }
  }, [isOpen]);

  if (cartCount === 0 && !isOpen) return null;

  const handleNextStep = () => {
    if (step === 1 && !isAuthenticated) {
      toast({ title: "Login Necessário", description: "Por favor, faça login ou cadastre-se para solicitar um orçamento.", variant: "destructive", duration: 4000 });
      return;
    }

    if (step === 2) {
      if (!formData.nome || !formData.telefone) {
        toast({ title: "Atenção", description: "Preencha os campos obrigatórios (*).", variant: "destructive" });
        return;
      }
      if (formData.userType === "PJ" && !formData.hospital) {
        toast({ title: "Atenção", description: "Por favor, informe o nome do Hospital ou Empresa (*).", variant: "destructive" });
        return;
      }
    }
    setStep(prev => prev + 1 as 1 | 2 | 3);
  };

  const handlePrevStep = () => setStep(prev => prev - 1 as 1 | 2 | 3);

  const handleFinalize = async () => {
    setIsSubmitting(true);

    // 1. Tentar salvar no Banco de Dados (ignorar erro mudo se tabela não existir)
    try {
      await supabase.from('quotes').insert({
        client_name: formData.nome,
        hospital_name: formData.hospital,
        email: formData.email,
        phone: formData.telefone,
        state: formData.estado,
        city: formData.cidade,
        notes: formData.observacoes,
        items: items,
        status: 'novo'
      });
    } catch (e) {
      console.warn("Tabela 'quotes' pode não existir ainda no Supabase ou erro de conexão.", e);
    }

    // 2. Formatar mensagem WhatsApp Profissional
    let message = `*NOVA SOLICITAÇÃO DE ORÇAMENTO*\n\n`;
    message += `*DADOS DO CLIENTE*\n`;
    message += `👤 *Nome:* ${formData.nome}\n`;
    message += `🏷️ *Tipo:* ${formData.userType === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}\n`;
    if (formData.userType === 'PJ' && formData.hospital) message += `🏥 *Hospital/Clínica:* ${formData.hospital}\n`;
    if (formData.email) message += `📧 *E-mail:* ${formData.email}\n`;
    if (formData.telefone) message += `📱 *Telefone:* ${formData.telefone}\n`;
    if (formData.cidade || formData.estado) message += `📍 *Local:* ${formData.cidade} - ${formData.estado}\n\n`;

    message += `*ITENS DA SOLICITAÇÃO*\n`;
    items.forEach((item) => {
      message += `🔹 ${item.quantity}x ${item.name} (Ref: #${item.id})\n`;
    });

    if (formData.observacoes) {
      message += `\n*OBSERVAÇÕES:*\n_${formData.observacoes}_\n`;
    }

    // Abre WhatsApp
    window.open(`https://wa.me/559832271116?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    setIsOpen(false);
    setStep(1);
    setIsSubmitting(false);
    toast({ title: "Solicitação Enviada!", description: "Você será direcionado para um de nossos consultores no WhatsApp.", duration: 4000 });
  };

  return (
    <>
      {/* Botão Flutuante (Fixo na tela) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in zoom-in">
          <Button
            className="h-14 w-14 rounded-full shadow-xl bg-green-600 hover:bg-green-700 relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart size={24} className="text-white" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-6 w-6 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Janela do Carrinho (Modal/Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6">
          {/* Fundo escuro */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Conteúdo */}
          <div className="relative bg-white w-full sm:w-[400px] h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:slide-in-from-right-10">

            {/* Cabeçalho */}
            <div className="p-4 border-b flex flex-col gap-3 bg-gray-50 rounded-t-2xl relative">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                  <ClipboardList size={22} className="text-secondary" /> Solicitar Orçamento
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-gray-200">
                  <X size={20} />
                </Button>
              </div>

              {/* Progress Bar Steps */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <div className={`transition-colors ${step >= 1 ? 'text-primary' : ''}`}>1. Itens</div>
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`transition-colors ${step >= 2 ? 'text-primary' : ''}`}>2. Dados</div>
                <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`transition-colors ${step >= 3 ? 'text-primary' : ''}`}>3. Envio</div>
              </div>
            </div>

            {/* Conteúdo Variante por Step */}
            <ScrollArea className="flex-1 p-5 bg-white">

              {/* STEP 1: ITENS */}
              {step === 1 && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center">
                      <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
                      <p className="text-gray-500">Sua lista de orçamento está vazia.</p>
                      <Button onClick={() => setIsOpen(false)} variant="outline" className="mt-4">Explorar Catálogo</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Confira os equipamentos selecionados:</p>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center rounded-lg text-sm font-bold bg-white border border-gray-200 text-primary">
                              {item.quantity}x
                            </Badge>
                            <span className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-700 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}

                      {!isAuthenticated && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                          <Lock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-amber-800">Autenticação Necessária</p>
                            <p className="text-xs text-amber-700 mt-1 mb-3">Para gerar um orçamento corporativo formal, você precisa estar cadastrado e logado na plataforma.</p>
                            <div className="flex gap-2">
                              <Link to="/entrar" onClick={() => setIsOpen(false)}>
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">Fazer Login</Button>
                              </Link>
                              <Link to="/cadastro" onClick={() => setIsOpen(false)}>
                                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">Criar Conta</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: DADOS CADASTRAIS */}
              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-gray-600 font-medium">Revisando os dados de contato do seu perfil.</p>

                  {/* Etiqueta Visual de PF/PJ fixa */}
                  <div className="flex justify-center mb-4">
                    <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-800 border-blue-200">
                      Perfil: {formData.userType === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-700 required">Nome {formData.userType === 'PJ' ? 'do Solicitante' : 'Completo'} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-gray-400" />
                      <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Dr. João Ferreira" className="pl-10 h-11" required />
                    </div>
                  </div>

                  {formData.userType === 'PJ' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="hospital" className="text-gray-700">Hospital / Clínica / CNPJ <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
                        <Input id="hospital" name="hospital" value={formData.hospital} onChange={handleInputChange} placeholder="Ex: Hospital Santa Cruz" className="pl-10 h-11" required />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-gray-700">WhatsApp / Telefone <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                        <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(11) 90000-0000" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">E-mail Corporativo</Label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="compras@hospital.com" className="pl-10 h-11" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: LOGÍSTICA & FINALIZAÇÃO */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-gray-600 font-medium">Quase lá! Nos dê detalhes para calcularmos o melhor frete e logística.</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-gray-700">Estado (UF)</Label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                        <Input id="estado" name="estado" value={formData.estado} onChange={handleInputChange} placeholder="Ex: SP" className="pl-10 h-11 uppercase" maxLength={2} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-gray-700">Cidade</Label>
                      <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleInputChange} placeholder="Sua cidade" className="h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes" className="text-gray-700">Observações adicionais ou Urgência</Label>
                    <Textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      placeholder="Ex: Instalação é na UTI neonatal, urgência máxima..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm mt-4">
                    <Building className="shrink-0 w-8 h-8 text-blue-500" />
                    <p>Sua lista contém <strong>{items.length} itens</strong>. Ao finalizar, nossos engenheiros clínicos avaliarão seu pedido.</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Rodapé (Controladores de Passo) */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                {step > 1 && (
                  <Button variant="outline" className="h-12 w-12 shrink-0 rounded-xl" onClick={handlePrevStep}>
                    <ArrowLeft size={20} />
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    className="flex-1 bg-primary hover:bg-blue-700 h-12 text-md font-bold text-white rounded-xl shadow-md"
                    onClick={handleNextStep}
                    disabled={items.length === 0}
                  >
                    Prosseguir <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-md font-bold text-white rounded-xl shadow-md"
                    onClick={handleFinalize}
                    disabled={isSubmitting}
                  >
                    <MessageCircle className="mr-2 w-5 h-5" /> {isSubmitting ? "Enviando..." : "Enviar Cotação pelo WhatsApp"}
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;