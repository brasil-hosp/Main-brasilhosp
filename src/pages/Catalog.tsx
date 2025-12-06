import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  "Todos", "Medicamentos", "Descartáveis", "Equipamentos", "Ortopedia", "Odontologia", "Cuidados e Bem-Estar"
];

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
}

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSubcategory, setActiveSubcategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const SHEETDB_PRODUCTS_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2?sheet=catalogo";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SHEETDB_PRODUCTS_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setIsLoading(false);
    }
  };
// 1. Gera a lista de subcategorias
  // CORREÇÃO: Ordenamos apenas as subcategorias, e DEPOIS adicionamos "Todos" no início
  const uniqueSubcategories = Array.from(new Set(
    products
      .filter(p => activeCategory === "Todos" || p.category === activeCategory)
      .map(p => p.subcategory)
      .filter(Boolean)
      .map(s => s!.trim())
  )).sort(); // Ordena de A-Z

  const availableSubcategories = ["Todos", ...uniqueSubcategories];

  // 2. Filtro Principal
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSubcategory = activeSubcategory === "Todos" || product.subcategory === activeSubcategory;
    
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    return matchesCategory && matchesSubcategory && (nameMatch || descMatch);
  });

  const handleWhatsAppClick = (productName: string) => {
    const message = `Olá! Gostaria de cotar: *${productName}*.`;
    window.open(`https://wa.me/559832271116?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Catálogo de Produtos</h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-4" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input placeholder="Buscar produto..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => { setActiveCategory(cat); setActiveSubcategory("Todos"); }}
                className={`whitespace-nowrap ${activeCategory === cat ? "bg-primary" : ""}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Filtros de SUBCATEGORIA 
             (Aparece APENAS se uma categoria específica for selecionada E houver subgrupos) 
          */}
          {activeCategory !== "Todos" && availableSubcategories.length > 1 && (
             <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide items-center bg-white p-2 rounded-lg border shadow-sm animate-in fade-in slide-in-from-top-2">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap mr-2 flex items-center gap-1">
                  <Filter size={12}/> Subgrupos:
                </span>
                {availableSubcategories.map((sub) => (
                  <Badge 
                    key={sub}
                    variant={activeSubcategory === sub ? "default" : "outline"}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`cursor-pointer whitespace-nowrap px-3 py-1 ${activeSubcategory === sub ? "bg-secondary hover:bg-secondary/80" : "hover:bg-gray-100 border-gray-300 text-gray-600"}`}
                  >
                    {sub}
                  </Badge>
                ))}
             </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow border-t-4 border-t-transparent hover:border-t-secondary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between mb-2 gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-blue-50 text-primary text-[10px]">{product.category}</Badge>
                      {product.subcategory && <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">{product.subcategory}</Badge>}
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 leading-tight">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2" onClick={() => handleWhatsAppClick(product.name)}>
                      <MessageCircle size={18} /> Cotar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {filteredProducts.length === 0 && <p className="text-center col-span-full py-10 text-muted-foreground">Nenhum produto encontrado.</p>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default Catalog;
