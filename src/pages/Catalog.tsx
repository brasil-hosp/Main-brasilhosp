import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Categorias (Devem ser iguais às que você vai escrever na planilha)
const categories = [
  "Todos",
  "Medicamentos",
  "Descartáveis",
  "Equipamentos",
  "Ortopedia",
  "Mobiliário",
  "Odontologia",
  "Cuidados e Bem-Estar"
];

// Interface para definir o formato do produto que vem da planilha
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
}

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Novos estados para controlar os dados e o carregamento
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // ⚠️ URL DA SUA NOVA API DE PRODUTOS ⚠️
 const SHEETDB_PRODUCTS_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2?sheet=catalogo";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  // Função para buscar os dados da planilha
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SHEETDB_PRODUCTS_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast({
        title: "Erro ao carregar catálogo",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Filtro (igual a anterior, mas usando o estado 'products')
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    // Proteção extra: garante que name e description existem antes de dar toLowerCase
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    return matchesCategory && (nameMatch || descMatch);
  });

  const handleWhatsAppClick = (productName: string) => {
    const message = `Olá! Gostaria de um orçamento para o item: *${productName}* que vi no site.`;
    window.open(`https://wa.me/559832271116?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Catálogo de Produtos</h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-4" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira nossa linha completa. Dados atualizados em tempo real.
            </p>
          </div>

          {/* Barra de Controle */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Buscar produto..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:hidden w-full overflow-x-auto pb-2">
               <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                 <Filter size={12} /> Deslize para filtrar categorias
               </span>
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex gap-2 overflow-x-auto pb-6 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap ${activeCategory === cat ? "bg-primary" : "hover:text-primary"}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Estado de Carregamento (Spinner) */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p className="text-lg font-medium">Carregando catálogo...</p>
            </div>
          ) : (
            /* Grid de Produtos */
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-transparent hover:border-t-secondary">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="bg-blue-50 text-primary hover:bg-blue-100">
                            {product.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 gap-2"
                          onClick={() => handleWhatsAppClick(product.name)}
                        >
                          <MessageCircle size={18} />
                          Cotar no WhatsApp
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-xl">Nenhum produto encontrado na planilha.</p>
                  <Button variant="link" onClick={() => {setSearchTerm(""); setActiveCategory("Todos")}} className="mt-2">
                    Limpar filtros
                  </Button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;