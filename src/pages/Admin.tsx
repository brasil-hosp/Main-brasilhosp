import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Trash2, RefreshCw, Search, Filter, ArrowUpDown } from "lucide-react"; // Adicionei ArrowUpDown

const categories = [
  "Medicamentos",
  "Descartáveis",
  "Equipamentos",
  "Ortopedia",
  "Mobiliário",
  "Odontologia",
  "Cuidados e Bem-Estar"
];

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  // Estados de Filtro, Busca e Ordenação
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("newest"); // <--- NOVO ESTADO
  
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0],
    description: "",
    secret: "",
  });

  const SHEETDB_BASE_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2";
  const ADMIN_PASSWORD = "bh2025"; 

  useEffect(() => {
    if (formData.secret === ADMIN_PASSWORD) {
      fetchProducts();
    }
  }, [formData.secret]);

  const fetchProducts = async () => {
    setIsLoadingList(true);
    try {
      const response = await fetch(`${SHEETDB_BASE_URL}?sheet=catalogo`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar lista", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.secret !== ADMIN_PASSWORD) {
      toast({ title: "Acesso Negado", description: "Senha incorreta.", variant: "destructive" });
      return;
    }

    setIsSending(true);

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
    };

    fetch(`${SHEETDB_BASE_URL}?sheet=catalogo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
    .then((response) => response.json())
    .then(() => {
      toast({ title: "Sucesso!", description: "Produto adicionado." });
      setFormData({ ...formData, name: "", description: "" });
      fetchProducts();
    })
    .catch(() => {
      toast({ title: "Erro", description: "Falha ao adicionar.", variant: "destructive" });
    })
    .finally(() => {
      setIsSending(false);
    });
  };

  const handleDelete = async (idToDelete: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    const originalList = [...products];
    setProducts(products.filter(p => p.id != idToDelete));

    try {
      await fetch(`${SHEETDB_BASE_URL}/id/${idToDelete}?sheet=catalogo`, {
        method: "DELETE",
      });
      toast({ title: "Excluído", description: "Produto removido da planilha." });
    } catch (error) {
      console.error("Erro ao excluir", error);
      setProducts(originalList);
      toast({ title: "Erro", description: "Não foi possível excluir.", variant: "destructive" });
    }
  };

  // 1. FILTRA OS PRODUTOS
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const idMatch = product.id?.toString().includes(searchLower);
    const matchesSearch = nameMatch || idMatch;
    const matchesCategory = filterCategory === "Todas" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. ORDENA OS PRODUTOS FILTRADOS
  const getSortedList = () => {
    const list = [...filteredProducts];
    
    if (sortOrder === "newest") {
      // Ordena por ID decrescente (o ID é o timestamp, então maior = mais novo)
      return list.sort((a, b) => Number(b.id) - Number(a.id));
    }
    if (sortOrder === "oldest") {
      // Ordena por ID crescente
      return list.sort((a, b) => Number(a.id) - Number(b.id));
    }
    if (sortOrder === "az") {
      // Ordena por Nome (A-Z)
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return list;
  };

  const displayList = getSortedList();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-24 px-4 container mx-auto max-w-6xl">
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* COLUNA 1: Formulário */}
          <Card className="shadow-xl h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Novo Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Senha Admin</label>
                  <Input 
                    type="password" 
                    placeholder="Digite a senha..." 
                    value={formData.secret}
                    onChange={(e) => setFormData({...formData, secret: e.target.value})}
                    className={formData.secret === ADMIN_PASSWORD ? "border-green-500 bg-green-50" : ""}
                  />
                </div>
                
                {formData.secret === ADMIN_PASSWORD && (
                  <>
                    <hr className="border-gray-200" />
                    <Input 
                      placeholder="Nome do Produto" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Textarea 
                      placeholder="Descrição..." 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSending}>
                      {isSending ? "Salvando..." : "Adicionar"}
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>

          {/* COLUNA 2: Lista de Produtos */}
          <Card className="shadow-xl flex flex-col h-[750px]">
            <CardHeader className="flex flex-col gap-4 pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-700">
                  Gerenciar Catálogo ({displayList.length})
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchProducts} disabled={formData.secret !== ADMIN_PASSWORD}>
                  <RefreshCw size={16} className={isLoadingList ? "animate-spin" : ""} />
                </Button>
              </div>
              
              {/* BARRA DE FERRAMENTAS (Busca e Filtros) */}
              <div className="space-y-3">
                {/* Linha 1: Filtros de Categoria e Ordem */}
                <div className="flex gap-2">
                  {/* Categoria */}
                  <div className="relative w-1/2">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      disabled={formData.secret !== ADMIN_PASSWORD}
                    >
                      <option value="Todas">Todas as Categorias</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ordenação (NOVO) */}
                  <div className="relative w-1/2">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      disabled={formData.secret !== ADMIN_PASSWORD}
                    >
                      <option value="newest">Mais Recentes</option>
                      <option value="oldest">Mais Antigos</option>
                      <option value="az">A - Z (Alfabética)</option>
                    </select>
                  </div>
                </div>

                {/* Linha 2: Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Buscar por nome ou ID..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={formData.secret !== ADMIN_PASSWORD}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-hidden p-0">
              {formData.secret !== ADMIN_PASSWORD ? (
                <p className="text-muted-foreground text-center py-10">Digite a senha para ver a lista.</p>
              ) : (
                <div className="space-y-0 h-full overflow-y-auto px-6 pb-4 scrollbar-thin">
                  {displayList.length === 0 && !isLoadingList && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum produto encontrado.</p>
                      {(searchTerm || filterCategory !== "Todas") && (
                        <Button variant="link" onClick={() => {setSearchTerm(""); setFilterCategory("Todas")}} className="mt-2 h-auto p-0">
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {displayList.map((product) => (
                    <div key={product.id} className="flex items-start justify-between p-3 border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm text-gray-800">{product.name}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded border">ID: {product.id}</span>
                        </div>
                        <p className="text-xs text-blue-600 font-medium">{product.category}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8 flex-shrink-0 ml-2"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Admin;