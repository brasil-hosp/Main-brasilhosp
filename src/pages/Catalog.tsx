import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

// Categorias baseadas no PDF
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

// Lista de Produtos (Amostra baseada no Catálogo 2025)
const products = [
  // Medicamentos
  { id: 1, name: "Antibióticos e Anti-inflamatórios", category: "Medicamentos", description: "Linha completa de antibióticos e anti-inflamatórios hospitalares e ambulatoriais." },
  { id: 2, name: "Analgésicos e Antitérmicos", category: "Medicamentos", description: "Medicamentos para controle da dor e febre de diversas classes terapêuticas." },
  
  // Descartáveis
  { id: 3, name: "Luvas de Procedimento", category: "Descartáveis", description: "Látex, Nitrilo (sem pó) e Vinil. Tamanhos P, M e G." },
  { id: 4, name: "Seringas Descartáveis", category: "Descartáveis", description: "Tamanhos 3ml, 5ml, 10ml, 20ml e 60ml. Bicos Luer Slip e Luer Lock." },
  { id: 5, name: "Toucas e Propés", category: "Descartáveis", description: "Toucas sanfonadas e sapatilhas descartáveis para proteção hospitalar." },

  // Equipamentos
  { id: 6, name: "Aparelho de Pressão Digital", category: "Equipamentos", description: "Modelos de braço e pulso automáticos (G-Tech e outros). Memória e precisão." },
  { id: 7, name: "Estetoscópio Littmann Classic III", category: "Equipamentos", description: "Alta sensibilidade acústica para avaliação clínica de adultos e crianças." },
  { id: 8, name: "Nebulizador G-Tech", category: "Equipamentos", description: "Inaladores e nebulizadores ultrassônicos e de rede vibratória." },

  // Ortopedia
  { id: 9, name: "Cadeira de Rodas Aço/Alumínio", category: "Ortopedia", description: "Diversos modelos: Pneu maciço ou inflável, dobráveis e reforçadas." },
  { id: 10, name: "Bota Imobilizadora", category: "Ortopedia", description: "Bota anatômica curta e longa para reabilitação de fraturas." },
  { id: 11, name: "Muletas e Bengalas", category: "Ortopedia", description: "Muletas canadenses, axilares e bengalas de 4 pontas em alumínio." },

  // Mobiliário
  { id: 12, name: "Cama Hospitalar Fawler", category: "Mobiliário", description: "Cama com elevação e movimentos por manivela ou motorizada." },
  { id: 13, name: "Armário Vitrine", category: "Mobiliário", description: "Armário com porta de vidro e prateleiras para medicamentos." },
  
  // Odontologia
  { id: 14, name: "Kit de Instrumentais", category: "Odontologia", description: "Pinças, cabos de bisturi e exploradores para procedimentos." },
  { id: 15, name: "Resinas e Cimentos", category: "Odontologia", description: "Resinas compostas, ionômero de vidro e cimento cirúrgico." },

  // Cuidados
  { id: 16, name: "Linha Byildcare (Pele)", category: "Cuidados e Bem-Estar", description: "Cremes de barreira, hidratantes e removedores de adesivos." },
  { id: 17, name: "Meias de Compressão", category: "Cuidados e Bem-Estar", description: "Meias Venosan medicinais e esportivas (3/4, 7/8 e Meia Calça)." },
];

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lógica de Filtro
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
              Confira nossa linha completa de soluções hospitalares, medicamentos e equipamentos.
            </p>
          </div>

          {/* Barra de Controle (Busca e Filtro Mobile) */}
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
               {/* Mobile Filter Hint */}
               <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                 <Filter size={12} /> Deslize para filtrar categorias
               </span>
            </div>
          </div>

          {/* Filtros de Categoria (Desktop & Scrollable Mobile) */}
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

          {/* Grid de Produtos */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-transparent hover:border-t-secondary">
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
              <p className="text-xl">Nenhum produto encontrado com esse termo.</p>
              <Button variant="link" onClick={() => {setSearchTerm(""); setActiveCategory("Todos")}} className="mt-2">
                Limpar filtros
              </Button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;