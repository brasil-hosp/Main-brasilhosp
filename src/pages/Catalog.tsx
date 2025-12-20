import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MessageCircle, Loader2, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import { ShoppingCart } from "lucide-react";

const categories = [
  "Todos", "Medicamentos", "Descartáveis", "Equipamentos", "Ortopedia", "Mobiliário", "Odontologia", "Cuidados e Bem-Estar"
];

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
}

// --- DEFINIÇÃO DO COMPONENTE SIDEBAR (AGORA FORA DO CATALOG) ---
// Isso evita que o campo de busca perca o foco ao digitar
interface SidebarFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  activeSubcategory: string;
  setActiveSubcategory: (val: string) => void;
  availableSubcategories: string[];
  setShowMobileFilters: (val: boolean) => void;
  enableHoverEffects?: boolean;
}

const SidebarFilters = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  setActiveSubcategory,
  availableSubcategories,
  setShowMobileFilters,
  enableHoverEffects = false
}: SidebarFiltersProps) => {
  
  // O estado de hover fica aqui dentro agora, pois pertence a este componente visual
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    if (activeCategory === cat && cat !== "Todos") {
        setActiveCategory("Todos");
        setActiveSubcategory("Todos");
    } else {
        setActiveCategory(cat);
        setActiveSubcategory("Todos");
        setShowMobileFilters(false);
    }
  };

  const toggleSubcategory = (sub: string) => {
    if (activeSubcategory === sub && sub !== "Todos") {
        setActiveSubcategory("Todos");
    } else {
        setActiveSubcategory(sub);
        setShowMobileFilters(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Search size={18} /> Buscar
        </h3>
        <Input 
          placeholder="Nome, marca ou tipo..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
          autoFocus={false} // Garante que o foco não pule
        />
      </div>

      <hr className="border-gray-200" />

      {/* CATEGORIAS */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Filter size={18} /> Categorias
        </h3>
        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const isHovered = hoveredItem === cat;
            
            // Lógica do X: Só se estiver Ativo + Hover + Efeito Habilitado
            const showX = isActive && cat !== "Todos" && isHovered && enableHoverEffects;

            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                onMouseEnter={() => enableHoverEffects && setHoveredItem(cat)}
                onMouseLeave={() => enableHoverEffects && setHoveredItem(null)}
                
                className={`text-left px-3 py-2 rounded-md text-sm transition-all flex justify-between items-center w-full ${
                  isActive 
                    ? "bg-primary text-white font-medium shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                {cat}
                
                {showX ? (
                    <X size={16} className="animate-in zoom-in duration-200" />
                ) : (
                    isActive && cat !== "Todos" ? (
                       <ChevronRight size={14} className="opacity-50" /> 
                    ) : (
                       <ChevronRight size={14} className="text-gray-300" />
                    )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBCATEGORIAS */}
      {activeCategory !== "Todos" && availableSubcategories.length > 1 && (
        <div className="animate-in fade-in slide-in-from-left-2">
          <hr className="border-gray-200 mb-4" />
          <h3 className="font-bold text-gray-700 mb-3 text-sm">
            Filtrar {activeCategory}
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSubcategories.map((sub) => {
                const isActive = activeSubcategory === sub;
                const isHovered = hoveredItem === sub;
                const isTodos = sub === "Todos";
                
                const showX = isActive && !isTodos && isHovered && enableHoverEffects;

                return (
                  <Badge 
                    key={sub}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => toggleSubcategory(sub)}
                    onMouseEnter={() => enableHoverEffects && setHoveredItem(sub)}
                    onMouseLeave={() => enableHoverEffects && setHoveredItem(null)}

                    className={`
                      cursor-pointer px-3 py-1 text-xs transition-all border flex items-center gap-1
                      ${isActive 
                        ? "bg-secondary text-white border-secondary hover:bg-red-500 hover:border-red-500" 
                        : "hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-gray-400"
                      }
                    `}
                  >
                    {sub}
                    {showX && (
                        <X size={12} className="ml-1 animate-in zoom-in duration-200" />
                    )}
                  </Badge>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSubcategory, setActiveSubcategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart(); // Pegar a função de adicionar ao carrinho

  const SHEETDB_PRODUCTS_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2?sheet=catalogo";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMobileFilters]);

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

  const uniqueSubcategories = Array.from(new Set(
    products
      .filter(p => activeCategory === "Todos" || p.category === activeCategory)
      .map(p => p.subcategory)
      .filter(Boolean)
      .map(s => s!.trim())
  )).sort();

  const availableSubcategories = ["Todos", ...uniqueSubcategories];

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

  // Funções de toggle para os badges do topo mobile (que ainda estão aqui no Pai)
  const toggleCategoryParent = (cat: string) => {
    if (activeCategory === cat && cat !== "Todos") {
        setActiveCategory("Todos");
        setActiveSubcategory("Todos");
    } else {
        setActiveCategory(cat);
        setActiveSubcategory("Todos");
    }
  };

  const toggleSubcategoryParent = (sub: string) => {
    if (activeSubcategory === sub && sub !== "Todos") {
        setActiveSubcategory("Todos");
    } else {
        setActiveSubcategory(sub);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 bg-white p-5 rounded-xl shadow-sm border border-gray-100 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <SidebarFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeSubcategory={activeSubcategory}
                setActiveSubcategory={setActiveSubcategory}
                availableSubcategories={availableSubcategories}
                setShowMobileFilters={setShowMobileFilters}
                enableHoverEffects={false} // Desativado no Desktop
              />
            </aside>

            {/* --- ÁREA MOBILE (Topo) --- */}
            <div className="lg:hidden w-full mb-4 sticky top-20 z-40 bg-gray-50 py-2 shadow-sm lg:shadow-none">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <Input 
                      placeholder="Buscar produto..." 
                      className="pl-9 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <Button 
                  onClick={() => setShowMobileFilters(true)} 
                  className="bg-white text-primary border border-primary hover:bg-primary hover:text-white"
                >
                  <Filter size={18} />
                </Button>
              </div>
              
              {/* Badges de Resumo Mobile (Fora do Drawer) */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                 {activeCategory !== "Todos" && (
                    <Badge 
                        onClick={() => toggleCategoryParent(activeCategory)}
                        className="bg-primary whitespace-nowrap cursor-pointer flex items-center gap-1"
                    >
                        {activeCategory} <X size={12} />
                    </Badge>
                 )}
                 {activeSubcategory !== "Todos" && (
                    <Badge 
                        variant="secondary" 
                        onClick={() => toggleSubcategoryParent(activeSubcategory)}
                        className="whitespace-nowrap cursor-pointer flex items-center gap-1"
                    >
                        {activeSubcategory} <X size={12} />
                    </Badge>
                 )}
              </div>
            </div>

            {/* --- DRAWER MOBILE (Overlay) --- */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-[100] lg:hidden flex">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                <div className="relative bg-white w-[85%] max-w-sm h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                      <Filter size={20}/> Filtros
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)} className="rounded-full hover:bg-gray-100">
                      <X size={24} />
                    </Button>
                  </div>
                  
                  {/* SidebarFilters usada no Mobile (com Hover ativado) */}
                  <SidebarFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activeSubcategory={activeSubcategory}
                    setActiveSubcategory={setActiveSubcategory}
                    availableSubcategories={availableSubcategories}
                    setShowMobileFilters={setShowMobileFilters}
                    enableHoverEffects={true} // Ativado no Mobile
                  />
                  
                  <div className="mt-8 pb-8">
                    <Button className="w-full bg-primary" onClick={() => setShowMobileFilters(false)}>
                        Ver Resultados
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* --- LISTA DE PRODUTOS --- */}
            <div className="flex-1 w-full">
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Catálogo</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Exibindo {filteredProducts.length} produtos
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-primary">
                  <Loader2 size={48} className="animate-spin mb-4" />
                  <p>Carregando estoque...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-t-transparent hover:border-t-secondary hover:-translate-y-1 bg-white">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px]">
                            {product.category}
                          </Badge>
                          {product.subcategory && (
                            <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">
                              {product.subcategory}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 mt-2">
                        <Button 
  className="w-full bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm"
  onClick={() => {
    addToCart({ id: product.id, name: product.name, quantity: 1 });
    // Opcional: Mostrar um toast de confirmação
    // toast({ title: "Adicionado!", description: `${product.name} no carrinho.` });
  }}
>
  <ShoppingCart size={18} /> Adicionar
</Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                      <p className="text-lg text-gray-500">Nenhum produto encontrado com esses filtros.</p>
                      <Button variant="link" onClick={() => {setSearchTerm(""); setActiveCategory("Todos");}} className="mt-2">
                        Limpar Filtros
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      <FloatingCart />
      <Footer />
    </div>
  );
};

export default Catalog;