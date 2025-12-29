import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Trash2, RefreshCw, Search, Pencil, X, LogOut, LayoutDashboard, ListFilter, Upload } from "lucide-react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

// 👇 Importação do Dashboard
import DashboardOverview from "@/components/admin/DashboardOverview";

const categories = [
  "Medicamentos", "Descartáveis", "Equipamentos", "Ortopedia", "Odontologia", "Cuidados e Bem-Estar"
];

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  image_url?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estados de Controle
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products">("dashboard"); // Controle das Abas

  // Dados
  const [products, setProducts] = useState<Product[]>([]);

  // Filtros e Edição
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterSubcategory, setFilterSubcategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("newest");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "", category: categories[0], subcategory: "", description: "", image_url: "",
  });

  // --- 1. VERIFICAÇÃO DE SEGURANÇA ---
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login"); // Se não tiver logado, manda para o login
    } else {
      setIsAuthenticated(true);
      fetchProducts(); // Só carrega os dados se tiver logado
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- 2. BUSCAR DADOS NO SUPABASE ---
  const fetchProducts = async () => {
    setIsLoadingList(true);
    try {
      const { data, error } = await supabase.from('products').select('*').range(0, 9999);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  // --- LÓGICA DE FILTROS ---
  const availableSubcategories = ["Todas", ...Array.from(new Set(
    products
      .filter(p => filterCategory === "Todas" || p.category === filterCategory)
      .map(p => p.subcategory)
      .filter(Boolean) // Remove nulos da lista de filtros
  ))].sort();

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Tratamento defensivo: garante que os campos existam antes de usar toLowerCase
    const prodName = product.name || "";
    const prodId = product.id ? product.id.toString() : "";
    const prodSub = product.subcategory || "";

    const textMatch = 
      prodName.toLowerCase().includes(searchLower) || 
      prodId.includes(searchLower) ||
      prodSub.toLowerCase().includes(searchLower);

    const catMatch = filterCategory === "Todas" || product.category === filterCategory;
    const subMatch = filterSubcategory === "Todas" || product.subcategory === filterSubcategory;
    
    return textMatch && catMatch && subMatch;
  });

  const getSortedList = () => {
    const list = [...filteredProducts];
    if (sortOrder === "newest") return list.sort((a, b) => b.id - a.id);
    if (sortOrder === "oldest") return list.sort((a, b) => a.id - b.id);
    if (sortOrder === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  const displayList = getSortedList();

  // --- 3. CRUD (CRIAR / EDITAR / EXCLUIR) ---
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      description: product.description || "",
      image_url: product.image_url || ""
    });
    // Se estiver na aba Dashboard, muda para produtos para poder editar
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", category: categories[0], subcategory: "", description: "", image_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const productData = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      // image_url: formData.image_url (Deixado para depois conforme pedido)
    };

    try {
      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Atualizado!", description: "Produto editado com sucesso." });
        handleCancelEdit();

      } else {
        // INSERT
        const newProduct = { id: Date.now(), ...productData };
        const { error } = await supabase.from('products').insert([newProduct]);

        if (error) throw error;
        toast({ title: "Sucesso!", description: "Produto adicionado." });
        setFormData({ name: "", category: categories[0], subcategory: "", description: "", image_url: "" });
      }
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha na operação.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    
    // Atualização otimista
    const originalList = [...products];
    setProducts(products.filter(p => p.id !== id));

    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        toast({ title: "Excluído", description: "Produto removido." });
    } catch (error) {
        console.error(error);
        setProducts(originalList);
        toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
    }
  };

  // --- IMPORTAÇÃO CSV (COM CORREÇÃO PARA ITENS VAZIOS) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSending(true);

    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        const formattedData = rawData.map((item, index) => ({
          id: item.id ? Number(item.id) : Date.now() + index,
          name: item.name || item.Nome || "Sem nome",
          category: item.category || item.Categoria || "Diversos",
          
          // ⚠️ CORREÇÃO CRÍTICA: Garante string vazia se for null/undefined
          subcategory: item.subcategory || item.Subgrupo || item.Classe || "",
          description: item.description || item.Descricao || "",
          
          image_url: null
        }));

        const { error } = await supabase.from('products').insert(formattedData);
        
        if (error) {
           console.error(error);
           toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
        } else {
           toast({ title: "Importado!", description: `${formattedData.length} itens importados com sucesso.` });
           fetchProducts();
        }
        setIsSending(false);
      }
    });
  };

  // Se não estiver autenticado, não renderiza nada
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow py-24 px-4 container mx-auto max-w-6xl">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
                <LogOut size={16} /> Sair do Sistema
            </Button>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "dashboard" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "products" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ListFilter size={20} /> Gerenciar Produtos
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        {activeTab === "dashboard" ? (
          // --- ABA 1: DASHBOARD ---
          <DashboardOverview products={products} />
        ) : (
          // --- ABA 2: GERENCIAMENTO (FORM + LISTA) ---
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            
            {/* 1. Formulário de Cadastro/Edição */}
            <Card className={`shadow-xl h-fit border-t-4 ${editingId ? "border-t-amber-500" : "border-t-primary"}`}>
              <CardHeader>
                <CardTitle className={`text-xl font-bold flex justify-between items-center ${editingId ? "text-amber-600" : "text-primary"}`}>
                  {editingId ? "Editar Produto" : "Novo Produto"}
                  {editingId && (
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X size={16} className="mr-1"/> Cancelar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Nome do Produto</label>
                        <Input placeholder="Ex: Luva Látex P" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="w-1/2 space-y-1">
                           <label className="text-xs font-semibold text-gray-500 uppercase">Categoria</label>
                           <select className="flex h-10 w-full rounded-md border px-3 bg-background" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                           </select>
                        </div>
                        <div className="w-1/2 space-y-1">
                           <label className="text-xs font-semibold text-gray-500 uppercase">Subgrupo</label>
                           <Input placeholder="Ex: Hospitalar" value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Descrição Detalhada</label>
                        <Textarea placeholder="Detalhes técnicos, tamanho, material..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                      
                      <Button type="submit" className={`w-full mt-2 ${editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"}`} disabled={isSending}>
                        {isSending ? <RefreshCw className="animate-spin" /> : (editingId ? "Salvar Alterações" : "Adicionar Produto")}
                      </Button>
                    </form>
                    
                    {!editingId && (
                      <div className="pt-4 border-t mt-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium">IMPORTAÇÃO EM MASSA (CSV)</p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-grow">
                             <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} disabled={isSending} className="pl-10" />
                             <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                          {isSending && <RefreshCw className="animate-spin text-primary" />}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* 2. Lista de Produtos */}
            <Card className="shadow-xl flex flex-col h-[750px]">
              <CardHeader className="flex flex-col gap-4 pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle>Catálogo ({displayList.length})</CardTitle> 
                    <Button variant="ghost" size="sm" onClick={fetchProducts}><RefreshCw size={16} className={isLoadingList ? "animate-spin" : ""}/></Button>
                </div>
                
                {/* Filtros da Lista */}
                <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input placeholder="Buscar por nome ou ID..." className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <select className="h-9 border rounded px-2 w-1/3 text-xs bg-white" value={filterCategory} onChange={e => {setFilterCategory(e.target.value); setFilterSubcategory("Todas")}}>
                        <option value="Todas">Todas Categ.</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="h-9 border rounded px-2 w-1/3 text-xs bg-white" value={filterSubcategory} onChange={e => setFilterSubcategory(e.target.value)}>
                        <option value="Todas">Todos Subs</option>
                        {availableSubcategories.filter(s => s !== "Todas").map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="h-9 border rounded px-2 w-1/3 text-xs bg-white" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="newest">Mais Novos</option>
                        <option value="oldest">Mais Antigos</option>
                        <option value="az">A-Z</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow overflow-y-auto p-0 px-6 pb-4 scrollbar-thin">
                  {displayList.length === 0 && !isLoadingList && (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                          <Search size={32} className="mb-2 opacity-20" />
                          <p>Nenhum produto encontrado.</p>
                      </div>
                  )}
                  
                  {displayList.map(p => (
                    <div key={p.id} className={`flex justify-between p-3 border-b hover:bg-gray-50 transition-colors ${editingId === p.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}>
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="font-bold text-sm truncate text-gray-800">{p.name}</p>
                            <div className="flex gap-2 text-xs mt-1">
                                <span className="text-blue-600 font-bold whitespace-nowrap bg-blue-50 px-1 rounded">{p.category}</span>
                                {p.subcategory && <span className="bg-yellow-50 text-yellow-700 px-1 rounded border border-yellow-100 truncate">{p.subcategory}</span>}
                            </div>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditClick(p)}>
                            <Pencil size={14} />
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-600" onClick={() => handleDelete(p.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;