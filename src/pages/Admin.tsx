import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Trash2, RefreshCw, Search, Filter, ArrowUpDown, Pencil, X } from "lucide-react";
import Papa from "papaparse";

const categories = [
  "Medicamentos", "Descartáveis", "Equipamentos", "Ortopedia", "Odontologia", "Cuidados e Bem-Estar"
];

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterSubcategory, setFilterSubcategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("newest");

  // Estado de Edição
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "", category: categories[0], subcategory: "", description: "", secret: "",
  });

  const SHEETDB_BASE_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2";
  const ADMIN_PASSWORD = "bh2025"; 

  useEffect(() => {
    if (formData.secret === ADMIN_PASSWORD) fetchProducts();
  }, [formData.secret]);

  const fetchProducts = async () => {
    setIsLoadingList(true);
    try {
      const response = await fetch(`${SHEETDB_BASE_URL}?sheet=catalogo`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const availableSubcategories = ["Todas", ...Array.from(new Set(
    products
      .filter(p => filterCategory === "Todas" || p.category === filterCategory)
      .map(p => p.subcategory)
      .filter(Boolean)
  ))].sort();

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      ...formData,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      description: product.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ ...formData, name: "", subcategory: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.secret !== ADMIN_PASSWORD) return;
    setIsSending(true);

    const productData = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
    };

    if (editingId) {
      // MODO EDIÇÃO (PATCH)
      fetch(`${SHEETDB_BASE_URL}/id/${editingId}?sheet=catalogo`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ data: productData }), 
      }).then((response) => {
        if (!response.ok) throw new Error("Erro na atualização");
        return response.json();
      }).then(() => {
        toast({ title: "Atualizado!", description: "Produto editado com sucesso." });
        handleCancelEdit();
        fetchProducts();
      }).catch(() => {
        toast({ title: "Erro", description: "Falha ao editar.", variant: "destructive" });
      }).finally(() => setIsSending(false));

    } else {
      // MODO CRIAÇÃO (POST)
      const newProduct = { id: Date.now(), ...productData };
      
      fetch(`${SHEETDB_BASE_URL}?sheet=catalogo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }).then(() => {
        toast({ title: "Sucesso!", description: "Produto adicionado." });
        setFormData({ ...formData, name: "", subcategory: "", description: "" });
        fetchProducts();
      }).catch(() => {
        toast({ title: "Erro", description: "Falha ao adicionar.", variant: "destructive" });
      }).finally(() => setIsSending(false));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || formData.secret !== ADMIN_PASSWORD) return;
    setIsSending(true);

    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        const formattedData = rawData.map((item, index) => ({
          id: item.id || Date.now() + index,
          name: item.name || item.Nome || "Sem nome",
          category: item.category || item.Categoria || "Diversos",
          subcategory: item.subcategory || item.Subgrupo || item.Classe || "",
          description: item.description || item.Descricao || ""
        }));

        await fetch(`${SHEETDB_BASE_URL}?sheet=catalogo`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formattedData),
        });
        toast({ title: "Importado!", description: `${formattedData.length} itens.` });
        fetchProducts();
        setIsSending(false);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Excluir item?")) return;
    
    const originalList = [...products];
    setProducts(products.filter(p => p.id != id));

    try {
        await fetch(`${SHEETDB_BASE_URL}/id/${id}?sheet=catalogo`, { method: "DELETE" });
        toast({ title: "Excluído", description: "Produto removido." });
    } catch (error) {
        console.error(error);
        setProducts(originalList);
        toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const textMatch = 
      product.name?.toLowerCase().includes(searchLower) || 
      product.id?.toString().includes(searchLower) ||
      product.subcategory?.toLowerCase().includes(searchLower);

    const catMatch = filterCategory === "Todas" || product.category === filterCategory;
    const subMatch = filterSubcategory === "Todas" || product.subcategory === filterSubcategory;

    return textMatch && catMatch && subMatch;
  });

  const getSortedList = () => {
    const list = [...filteredProducts];
    if (sortOrder === "newest") return list.sort((a, b) => Number(b.id) - Number(a.id));
    if (sortOrder === "oldest") return list.sort((a, b) => Number(a.id) - Number(b.id));
    if (sortOrder === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  // 👇 AQUI ESTAVA FALTANDO: Criar a variável antes de usar
  const displayList = getSortedList(); 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow py-24 px-4 container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Formulário */}
          <Card className={`shadow-xl h-fit border-t-4 ${editingId ? "border-t-amber-500" : "border-t-primary"}`}>
            <CardHeader>
              <CardTitle className={`text-xl font-bold flex justify-between items-center ${editingId ? "text-amber-600" : "text-primary"}`}>
                {editingId ? "Editar Produto ✏️" : "Novo Produto ✨"}
                {editingId && (
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <X size={16} className="mr-1"/> Cancelar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input type="password" placeholder="Senha Admin" value={formData.secret} onChange={(e) => setFormData({...formData, secret: e.target.value})} className={formData.secret === ADMIN_PASSWORD ? "bg-green-50 border-green-300" : ""} />
                
                {formData.secret === ADMIN_PASSWORD && (
                  <>
                    <hr />
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <Input placeholder="Nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                      <div className="flex gap-2">
                        <select className="flex h-10 w-1/2 rounded-md border px-3 bg-background" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <Input className="w-1/2" placeholder="Subgrupo" value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} />
                      </div>
                      <Textarea placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                      
                      <Button type="submit" className={`w-full ${editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"}`} disabled={isSending}>
                        {isSending ? "Salvando..." : (editingId ? "Salvar Alterações" : "Adicionar Produto")}
                      </Button>
                    </form>
                    
                    {!editingId && (
                      <>
                        <hr />
                        <div className="flex items-center gap-2">
                          <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} disabled={isSending} />
                          {isSending && <RefreshCw className="animate-spin" />}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista */}
          <Card className="shadow-xl flex flex-col h-[750px]">
            <CardHeader className="flex flex-col gap-4 pb-2">
              <div className="flex justify-between"><CardTitle>Lista ({displayList.length})</CardTitle> <Button variant="ghost" onClick={fetchProducts}><RefreshCw size={16}/></Button></div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <select className="h-10 border rounded px-2 w-1/3 text-sm" value={filterCategory} onChange={e => {setFilterCategory(e.target.value); setFilterSubcategory("Todas")}}>
                      <option value="Todas">Categ: Todas</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="h-10 border rounded px-2 w-1/3 text-sm" value={filterSubcategory} onChange={e => setFilterSubcategory(e.target.value)}>
                      <option value="Todas">Sub: Todos</option>
                      {availableSubcategories.filter(s => s !== "Todas").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="h-10 border rounded px-2 w-1/3 text-sm" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                      <option value="newest">Novos</option>
                      <option value="oldest">Antigos</option>
                      <option value="az">A-Z</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Buscar..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={formData.secret !== ADMIN_PASSWORD}/>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-y-auto p-0 px-6 pb-4 scrollbar-thin">
              {formData.secret !== ADMIN_PASSWORD ? (
                <p className="text-muted-foreground text-center py-10">Digite a senha para ver a lista.</p>
              ) : (
                <>
                  {displayList.length === 0 && !isLoadingList && <p className="text-center py-4">Nada encontrado.</p>}
                  {displayList.map(p => (
                    <div key={p.id} className={`flex justify-between p-3 border-b hover:bg-gray-50 ${editingId === p.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}>
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="font-bold text-sm truncate">{p.name}</p>
                            <div className="flex gap-2 text-xs mt-1">
                                <span className="text-blue-600 font-bold whitespace-nowrap">{p.category}</span>
                                {p.subcategory && <span className="bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200 truncate">{p.subcategory}</span>}
                            </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditClick(p)}>
                            <Pencil size={14} />
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(p.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
