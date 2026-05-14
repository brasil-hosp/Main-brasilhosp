import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Trash2, Plus, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/orderService";

const FloatingCart = () => {
  const { items, addToCart, removeFromCart, cartCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customItem, setCustomItem] = useState({ name: "", quantity: 1 });
  const { toast } = useToast();
  const navigate = useNavigate();

  if (cartCount === 0 && !isOpen) return null;

  const handleAddCustomItem = () => {
    if (!customItem.name.trim()) return;
    addToCart({ id: `avulso_${Date.now()}`, name: customItem.name.trim(), quantity: customItem.quantity });
    setCustomItem({ name: "", quantity: 1 });
  };

  const handleProceed = async () => {
    if (items.length === 0) {
      toast({ title: "Carrinho Vazio", description: "Adicione pelo menos um item.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newOrder = await orderService.create(
        { client_name: "Pedido via Catálogo", status: "pendente" },
        items.map(i => {
          const numId = Number(i.id);
          return {
            product_name: i.name,
            quantity: i.quantity.toString(),
            product_id: (!isNaN(numId) && i.id.length < 10) ? numId : undefined
          };
        })
      );
      clearCart();
      setIsOpen(false);
      navigate(`/pedido/${newOrder.token}`);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message || "Não foi possível criar o pedido.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in zoom-in">
          <Button className="h-14 w-14 rounded-full shadow-xl bg-green-600 hover:bg-green-700 relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart size={24} className="text-white" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-6 w-6 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative bg-white w-full sm:w-[420px] h-[75vh] sm:h-auto sm:max-h-[75vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:slide-in-from-right-10">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                <ShoppingCart size={20} className="text-secondary" /> Meu Orçamento ({cartCount})
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-gray-200">
                <X size={20} />
              </Button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 p-4">
              {/* Custom item input */}
              <div className="flex gap-2 mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <Input
                  placeholder="Digitar item avulso..."
                  value={customItem.name}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 bg-white"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomItem(); } }}
                />
                <Input
                  type="number"
                  min={1}
                  value={customItem.quantity}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-16 bg-white"
                />
                <Button size="icon" onClick={handleAddCustomItem} className="shrink-0">
                  <Plus size={16} />
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Nenhum item adicionado ainda.</p>
                  <p className="text-xs mt-1">Use o campo acima ou navegue o catálogo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center rounded-lg text-sm font-bold bg-white border border-gray-200 text-primary shrink-0">
                          {item.quantity}x
                        </Badge>
                        <span className="text-sm font-semibold text-gray-800 truncate">{item.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <Button
                className="w-full h-12 text-base gap-2 shadow-lg"
                onClick={handleProceed}
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                Montar Pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;