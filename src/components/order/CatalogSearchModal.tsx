import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Plus, Loader2, Image as ImageIcon, ChevronDown } from "lucide-react";
import { productService } from "@/services/productService";
import { searchProducts } from "@/lib/productSearch";
import type { Product } from "@/types/product";

interface CatalogSearchModalProps {
  onClose: () => void;
  onAddItem: (item: { product_name: string; quantity: string; product_id?: number }) => void;
}

export default function CatalogSearchModal({ onClose, onAddItem }: CatalogSearchModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (e) {
        console.error("Erro ao carregar produtos:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Busca compartilhada com o catálogo: tokens em nome + descrição (specs) + categoria
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return products.slice(0, 50);
    return searchProducts(products, searchTerm).slice(0, 50);
  }, [products, searchTerm]);

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] || "1";
    onAddItem({ product_name: product.name, quantity: qty, product_id: product.id });
    setQuantities(prev => ({ ...prev, [product.id]: "1" }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Search size={20} className="text-primary" /> Buscar no Catálogo
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por nome ou especificação técnica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {isLoading ? "Carregando catálogo..." : `${filtered.length} resultado(s) — mostrando até 50 · clique pra ver as especificações`}
          </p>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-20" />
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(product => {
                const isExpanded = expandedId === product.id;
                return (
                  <div key={product.id}>
                    <div
                      className="flex items-center gap-3 p-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : product.id)}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="max-h-8 max-w-8 object-contain" />
                        ) : (
                          <ImageIcon size={16} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                        <div className="flex gap-1 mt-0.5 items-center">
                          <Badge variant="outline" className="text-[10px] h-4 px-1">{product.category}</Badge>
                          {product.subcategory && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-yellow-50">{product.subcategory}</Badge>}
                        </div>
                        {/* snippet das specs: ajuda o cliente a confirmar que é o produto certo */}
                        {product.description && (
                          <p className={`text-xs text-gray-500 mt-0.5 ${isExpanded ? "" : "truncate"}`}>
                            {product.description}
                          </p>
                        )}
                      </div>
                      <ChevronDown size={16} className={`text-gray-300 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      <Input
                        type="text"
                        value={quantities[product.id] || "1"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: e.target.value }))}
                        className="w-16 h-8 text-sm text-center"
                        placeholder="Qtd"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 h-8 text-green-700 border-green-200 hover:bg-green-50"
                        onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                      >
                        <Plus size={14} className="mr-1" /> Adicionar
                      </Button>
                    </div>

                    {/* Painel expandido: foto maior + specs completas, sem sair do fluxo do pedido */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-gray-50/60 flex gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="w-24 h-24 bg-white rounded border flex items-center justify-center shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="max-h-20 max-w-20 object-contain" />
                          ) : (
                            <ImageIcon size={28} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-sm">
                          <p className="font-semibold text-gray-800 mb-1">{product.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Especificações Técnicas</p>
                          <p className="text-gray-600 whitespace-pre-line">
                            {product.description || "Especificações técnicas sob consulta."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 rounded-b-2xl">
          <Button variant="outline" className="w-full" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
