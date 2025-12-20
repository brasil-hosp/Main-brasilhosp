import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, MessageCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const FloatingCart = () => {
  const { items, removeFromCart, cartCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (cartCount === 0 && !isOpen) return null; // Esconde se vazio e fechado

  const handleFinalize = () => {
    // Gera a mensagem para o WhatsApp
    let message = "*Olá! Gostaria de uma cotação dos seguinte itens:*\n\n";
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name}\n`;
    });
    message += "\nAguardo retorno!";
    
    // Abre WhatsApp
    window.open(`https://wa.me/559832271116?text=${encodeURIComponent(message)}`, "_blank");
    clearCart(); // Limpa carrinho após enviar (opcional)
    setIsOpen(false);
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
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart size={20} /> Seu Orçamento
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X size={20} />
              </Button>
            </div>

            {/* Lista de Itens */}
            <ScrollArea className="flex-1 p-4">
              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Seu carrinho está vazio.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white border p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold">
                          {item.quantity}x
                        </Badge>
                        <span className="text-sm font-medium line-clamp-2">{item.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Rodapé (Ação) */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg shadow-md" 
                onClick={handleFinalize}
                disabled={items.length === 0}
              >
                <MessageCircle className="mr-2" /> Enviar Cotação no Zap
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};


export default FloatingCart;
