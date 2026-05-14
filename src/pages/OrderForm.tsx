import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Package, Send, Plus, Trash2, Search, User, Building2, Phone, Mail, MapPin, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import CatalogSearchModal from "@/components/order/CatalogSearchModal";
import { supabase } from "@/lib/supabase";

interface LocalItem {
  product_name: string;
  quantity: string;
  product_id?: number;
  notes?: string;
}

const OrderForm = () => {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  const { toast } = useToast();

  // Items state (local)
  const [orderItems, setOrderItems] = useState<LocalItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "1" });

  // Client info state
  const [clientType, setClientType] = useState<"PJ" | "PF">("PJ");
  const [clientInfo, setClientInfo] = useState({
    client_name: "", client_cnpj: "", client_email: "",
    client_phone: "", city: "", state: "", notes: ""
  });

  useEffect(() => {
    if (token) fetchOrder(token);
  }, [token]);

  const fetchOrder = async (t: string) => {
    setIsLoading(true);
    try {
      const data = await orderService.getByToken(t);
      if (!data) { setError("Pedido não encontrado ou link inválido."); return; }
      setOrder(data);

      // Populate items from existing order
      if (data.items && data.items.length > 0) {
        setOrderItems(data.items.map(i => ({
          product_name: i.product_name, quantity: i.quantity,
          product_id: i.product_id, notes: i.notes
        })));
      }

      // Populate client info if already filled
      if (data.client_name && data.client_name !== "Pedido via Catálogo" && data.client_name !== "Novo Pedido") {
        setClientInfo({
          client_name: data.client_name || "", client_cnpj: data.client_cnpj || "",
          client_email: data.client_email || "", client_phone: data.client_phone || "",
          city: "", state: "", notes: data.notes || ""
        });
      }

      // Auto-fill from logged-in profile
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsProfileComplete(true);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile && (!data.client_name || data.client_name === "Pedido via Catálogo" || data.client_name === "Novo Pedido")) {
          setClientType(profile.user_type === "PF" ? "PF" : "PJ");
          setClientInfo({
            client_name: profile.full_name || "",
            client_cnpj: profile.cnpj || profile.cpf || "",
            client_email: profile.email || session.user.email || "",
            client_phone: profile.phone || "",
            city: profile.city || "",
            state: profile.state || "",
            notes: ""
          });
        }
      }
    } catch (err) {
      setError("Erro ao carregar os detalhes do pedido.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    setOrderItems(prev => [...prev, { product_name: newItem.name.trim(), quantity: newItem.quantity || "1" }]);
    setNewItem({ name: "", quantity: "1" });
  };

  const handleAddFromCatalog = (item: { product_name: string; quantity: string; product_id?: number }) => {
    setOrderItems(prev => [...prev, item]);
    toast({ title: "Item Adicionado", description: item.product_name });
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, quantity: string) => {
    setOrderItems(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  };

  const handleSubmit = async () => {
    if (!order) return;
    if (orderItems.length === 0) {
      toast({ title: "Sem Itens", description: "Adicione pelo menos um item ao pedido.", variant: "destructive" });
      return;
    }
    if (!clientInfo.client_name.trim() || !clientInfo.client_phone.trim()) {
      toast({ title: "Dados Incompletos", description: "Preencha seu nome e telefone.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const clientData: Partial<Order> = {
        client_name: clientType === "PJ" && clientInfo.client_cnpj
          ? `${clientInfo.client_name}` : clientInfo.client_name,
        client_cnpj: clientInfo.client_cnpj || undefined,
        client_email: clientInfo.client_email || undefined,
        client_phone: clientInfo.client_phone || undefined,
        notes: [
          clientInfo.city || clientInfo.state ? `Local: ${clientInfo.city} - ${clientInfo.state}` : "",
          clientInfo.notes ? `Obs: ${clientInfo.notes}` : ""
        ].filter(Boolean).join("\n") || undefined
      };

      await orderService.submitOrder(order.id, clientData, orderItems);
      setOrder({ ...order, submitted_at: new Date().toISOString(), client_name: clientData.client_name || order.client_name });
      toast({ title: "Pedido Confirmado!", description: "Sua solicitação foi enviada com sucesso." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro", description: err.message || "Não foi possível confirmar o pedido.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING ---
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  }

  // --- ERROR ---
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><Package className="text-red-500 w-8 h-8" /></div>
            <CardTitle className="text-2xl mb-2">Ops!</CardTitle>
            <p className="text-gray-500 px-6">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  const isSubmitted = !!order.submitted_at;

  // --- SUBMITTED (Read-only) ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 px-4 container mx-auto max-w-3xl animate-in fade-in duration-500">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-8">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">Pedido Confirmado!</h1>
            <p className="text-green-700">Sua solicitação foi enviada em {new Date(order.submitted_at!).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.</p>
            <p className="text-green-600 text-sm mt-2">Nossa equipe comercial entrará em contato em breve.</p>
          </div>

          <Card className="shadow-md mb-6">
            <CardHeader><CardTitle className="text-lg">Itens Solicitados ({orderItems.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4">
                    <span className="font-medium text-gray-800">{item.product_name}</span>
                    <Badge variant="secondary" className="bg-white">{item.quantity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <a href="https://wa.me/559832271116" target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2 text-green-700 border-green-200 hover:bg-green-50">
                <MessageCircle size={18} /> Falar com Consultor pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- EDITABLE FORM ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 container mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-primary" /> Monte seu Pedido
          </h1>
          <p className="text-gray-500 mt-2">Adicione os itens desejados e preencha seus dados para confirmar.</p>
        </div>

        {/* SECTION 1: ITEMS */}
        <Card className="shadow-md mb-6 border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Package size={18} className="text-gray-400" /> Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add item row */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <Input placeholder="Nome do produto ou medicamento..." value={newItem.name} onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 bg-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }} />
              <Input placeholder="Qtd" value={newItem.quantity} onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))} className="w-24 bg-white" />
              <Button onClick={handleAddItem} className="shrink-0 gap-1"><Plus size={16} /> Adicionar</Button>
              <Button variant="outline" onClick={() => setShowCatalog(true)} className="shrink-0 gap-1"><Search size={16} /> Catálogo</Button>
            </div>

            {/* Items table */}
            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Nenhum item adicionado. Use os campos acima ou busque no catálogo.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_120px_48px] bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Produto / Medicamento</span><span className="text-center">Quantidade</span><span></span>
                </div>
                {orderItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_48px] items-center px-4 py-3 border-t hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-sm text-gray-800 pr-2">{item.product_name}</span>
                    <Input value={item.quantity} onChange={(e) => handleUpdateQuantity(i, e.target.value)} className="h-8 text-sm text-center" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveItem(i)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t">Total: {orderItems.length} item(ns)</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 2: CLIENT INFO */}
        {isProfileComplete && !showEditData ? (() => {
          const hasMissing = !clientInfo.client_name || !clientInfo.client_phone;
          return (
          <Card className={`shadow-md mb-6 border-t-4 ${hasMissing ? 'border-t-amber-400' : 'border-t-green-400'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasMissing ? 'bg-amber-100' : 'bg-green-100'}`}>
                    <CheckCircle2 className={hasMissing ? 'text-amber-600' : 'text-green-600'} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{clientInfo.client_name || clientInfo.client_email || 'Conta identificada'}</p>
                    <p className="text-sm text-gray-500">
                      {clientInfo.client_phone || ''}{clientInfo.client_email && clientInfo.client_phone ? ` • ${clientInfo.client_email}` : clientInfo.client_email || ''}
                      {clientInfo.client_cnpj ? ` • ${clientInfo.client_cnpj}` : ''}
                    </p>
                    {hasMissing && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        Complete seu {!clientInfo.client_name ? 'nome' : ''}{!clientInfo.client_name && !clientInfo.client_phone ? ' e ' : ''}{!clientInfo.client_phone ? 'telefone' : ''} para enviar.
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowEditData(true)} className="text-gray-500 gap-1">
                  <ChevronDown size={14} /> {hasMissing ? 'Completar' : 'Editar'}
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })() : (
        <Card className="shadow-md mb-6 border-t-4 border-t-secondary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2"><User size={18} className="text-gray-400" /> Seus Dados</CardTitle>
              {isProfileComplete && showEditData && (
                <Button variant="ghost" size="sm" onClick={() => setShowEditData(false)} className="text-gray-500 gap-1">
                  <ChevronUp size={14} /> Recolher
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PJ/PF Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
              <button onClick={() => setClientType("PJ")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${clientType === "PJ" ? "bg-white shadow text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <Building2 size={14} className="inline mr-1" /> Pessoa Jurídica
              </button>
              <button onClick={() => setClientType("PF")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${clientType === "PF" ? "bg-white shadow text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <User size={14} className="inline mr-1" /> Pessoa Física
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder="Seu nome" value={clientInfo.client_name} onChange={(e) => setClientInfo(prev => ({ ...prev, client_name: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">{clientType === "PJ" ? "CNPJ" : "CPF"}</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder={clientType === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"} value={clientInfo.client_cnpj} onChange={(e) => setClientInfo(prev => ({ ...prev, client_cnpj: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder="(99) 99999-9999" value={clientInfo.client_phone} onChange={(e) => setClientInfo(prev => ({ ...prev, client_phone: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder="seu@email.com" value={clientInfo.client_email} onChange={(e) => setClientInfo(prev => ({ ...prev, client_email: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Estado (UF)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder="MA" value={clientInfo.state} onChange={(e) => setClientInfo(prev => ({ ...prev, state: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Cidade</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input placeholder="São Luís" value={clientInfo.city} onChange={(e) => setClientInfo(prev => ({ ...prev, city: e.target.value }))} className="pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Observações</label>
              <Textarea placeholder="Informações adicionais, urgência, referência do mês..." value={clientInfo.notes} onChange={(e) => setClientInfo(prev => ({ ...prev, notes: e.target.value }))} rows={3} />
            </div>
          </CardContent>
        </Card>
        )}

        {/* SECTION 3: SUBMIT */}
        <Button size="lg" className="w-full h-14 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all" onClick={handleSubmit} disabled={isSubmitting || orderItems.length === 0}>
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Confirmar e Enviar Pedido
        </Button>
      </div>

      {showCatalog && <CatalogSearchModal onClose={() => setShowCatalog(false)} onAddItem={handleAddFromCatalog} />}
    </div>
  );
};

export default OrderForm;
