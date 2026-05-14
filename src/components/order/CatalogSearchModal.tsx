import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { productService } from "@/services/productService";
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

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return products.slice(0, 50);
    const term = searchTerm.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term) || p.subcategory?.toLowerCase().includes(term))
      .slice(0, 50);
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
              placeholder="Buscar por nome, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {isLoading ? "Carregando catálogo..." : `${filtered.length} resultado(s) — mostrando até 50`}
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
              {filtered.map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 px-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="max-h-8 max-w-8 object-contain" />
                    ) : (
                      <ImageIcon size={16} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      <Badge variant="outline" className="text-[10px] h-4 px-1">{product.category}</Badge>
                      {product.subcategory && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-yellow-50">{product.subcategory}</Badge>}
                    </div>
                  </div>
                  <Input
                    type="text"
                    value={quantities[product.id] || "1"}
                    onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: e.target.value }))}
                    className="w-20 h-8 text-sm text-center"
                    placeholder="Qtd"
                  />
                  <Button size="sm" variant="outline" className="shrink-0 h-8 text-green-700 border-green-200 hover:bg-green-50" onClick={() => handleAdd(product)}>
                    <Plus size={14} className="mr-1" /> Adicionar
                  </Button>
                </div>
              ))}
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
