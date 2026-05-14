import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, RefreshCw, Trash2, CheckCircle2, XCircle, FileText, FileSpreadsheet, PlusCircle, Copy, MessageCircle, Link2, Download } from "lucide-react";

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderLink, setNewOrderLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao carregar pedidos." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setIsCreating(true);
    try {
      const newOrder = await orderService.createEmpty();
      const url = `${window.location.origin}/pedido/${newOrder.token}`;
      setNewOrderLink(url);
      setShowNewOrderModal(true);
      fetchOrders();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message || "Não foi possível criar o pedido." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(newOrderLink);
    toast({ title: "Link Copiado!", description: "Cole no WhatsApp ou e-mail para enviar ao cliente." });
  };

  const handleShareWhatsApp = () => {
    const msg = `Brasil Hosp - Solicitação de Pedido\n\nOlá! Para facilitar seu atendimento, acesse o link abaixo e preencha sua solicitação:\n\n${newOrderLink}\n\nEquipe Brasil Hosp\n(98) 3227-1116`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      await orderService.updateStatus(id, status);
      toast({ title: "Status Atualizado", description: `Pedido agora está ${status}.` });
      fetchOrders();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido e todos os seus itens?")) return;
    try {
      await orderService.delete(id);
      toast({ title: "Excluído", description: "O pedido foi removido." });
      fetchOrders();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir." });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pendente': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Aguardando Cliente</Badge>;
      case 'concluido': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmado pelo Cliente</Badge>;
      case 'aprovado': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aprovado p/ Faturamento</Badge>;
      case 'rejeitado': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ["ID do Pedido", "Cliente", "CNPJ/CPF", "Status do Pedido", "Produto/Medicamento", "Quantidade", "Criado Em", "Observacoes Gerais"];
    const rows: string[][] = [];
    orders.forEach(order => {
      const createdDate = new Date(order.created_at).toLocaleDateString('pt-BR');
      if (!order.items || order.items.length === 0) {
        rows.push([order.id, order.client_name, order.client_cnpj || '', order.status, '-- Sem itens --', '', createdDate, order.notes || '']);
      } else {
        order.items.forEach(item => {
          rows.push([order.id, order.client_name, order.client_cnpj || '', order.status, item.product_name, item.quantity, createdDate, order.notes || '']);
        });
      }
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map(e => e.map(f => `"${String(f).replace(/"/g, '""')}"`).join(";"))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `pedidos_brasilhosp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSingleCSV = useCallback((order: Order) => {
    const headers = ["Produto/Medicamento", "Quantidade"];
    const rows: string[][] = [];
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        rows.push([item.product_name, item.quantity]);
      });
    }
    const clientLabel = order.client_name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map(e => e.map(f => `"${String(f).replace(/"/g, '""')}"`).join(";"))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `pedido_${clientLabel}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const filteredOrders = orders.filter(o =>
    o.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.client_cnpj && o.client_cnpj.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex-grow max-w-md">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Buscar Pedido</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input placeholder="Nome do cliente ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleCreateOrder} disabled={isCreating} className="bg-primary gap-1">
            <PlusCircle size={16} /> Criar Pedido
          </Button>
          <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
          <Button variant="secondary" onClick={exportCSV} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
            <FileSpreadsheet size={16} className="mr-1" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <Card className="border-2 border-primary/30 bg-primary/5 animate-in slide-in-from-top-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Link2 className="text-primary" size={20} /> Link do Pedido Criado</h3>
                <p className="text-sm text-gray-500 mt-1">Envie este link para o cliente preencher o pedido.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowNewOrderModal(false)}><XCircle size={18} /></Button>
            </div>
            <div className="flex gap-2 bg-white p-2 rounded-lg border">
              <Input value={newOrderLink} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0 gap-1"><Copy size={14} /> Copiar</Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={handleShareWhatsApp} className="gap-1 text-green-700 border-green-200 hover:bg-green-50">
                <MessageCircle size={16} /> Enviar via WhatsApp
              </Button>
              <a href={newOrderLink} target="_blank" rel="noreferrer">
                <Button variant="outline" className="gap-1"><ExternalLink size={14} /> Abrir Link</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p>Nenhum pedido encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className={`overflow-hidden border-l-4 ${order.status === 'pendente' ? 'border-l-yellow-400' : order.status === 'concluido' ? 'border-l-green-400' : order.status === 'aprovado' ? 'border-l-blue-400' : 'border-l-red-400'}`}>
              <CardHeader className="bg-gray-50/50 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.client_name}
                      {getStatusBadge(order.status)}
                    </CardTitle>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4 flex-wrap">
                      {order.client_cnpj && <span>CNPJ: {order.client_cnpj}</span>}
                      {order.client_phone && <span>Tel: {order.client_phone}</span>}
                      <span>Criado: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/pedido/${order.token}`} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} className="mr-1" /> Link do Cliente
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(order.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 bg-white">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Itens Solicitados ({order.items?.length || 0})</h4>
                  {(!order.items || order.items.length === 0) ? (
                    <p className="text-sm text-gray-400 italic">Aguardando preenchimento pelo cliente.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-gray-50 border border-gray-100">
                          <p className="font-medium text-sm text-gray-800">{item.product_name}</p>
                          <Badge variant="secondary" className="bg-white">{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-between gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={() => exportSingleCSV(order)}>
                    <Download size={14} className="mr-1" /> CSV
                  </Button>
                  <div className="flex gap-2 flex-wrap">
                  {order.status === 'pendente' && (
                    <Button size="sm" variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200" onClick={() => handleStatusChange(order.id, 'concluido')}>
                      <CheckCircle2 size={14} className="mr-1" /> Marcar Confirmado
                    </Button>
                  )}
                  {order.status === 'concluido' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleStatusChange(order.id, 'aprovado')}>
                      <CheckCircle2 size={14} className="mr-1" /> Aprovar p/ Faturamento
                    </Button>
                  )}
                  {(order.status === 'pendente' || order.status === 'concluido') && (
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleStatusChange(order.id, 'rejeitado')}>
                      <XCircle size={14} className="mr-1" /> Rejeitar
                    </Button>
                  )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
