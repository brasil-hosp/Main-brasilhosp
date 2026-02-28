import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// 👇 O Textarea agora será usado na linha 237
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import {
  Trash2, RefreshCw, Search, Pencil, X, LogOut, LayoutDashboard,
  ListFilter, Upload, Users, CheckCircle, Building2, User, Loader2,
  Shield, UserPlus, AlertTriangle, Eye, MapPin, FileText, Phone, Mail, Download, Save, Image as ImageIcon
} from "lucide-react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

// 👇 Importação do Dashboard (Componente externo)
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

interface Profile {
  id: string;
  full_name: string;
  user_type: "PF" | "PJ" | "ADMIN";
  document: string;
  email?: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
  // Campos PJ
  legal_nature?: string;
  municipal_inscription?: string;
  company_name?: string;
  fantasy_name?: string;
  ie?: string;
  financial_contact_name?: string;
  financial_contact_phone?: string;
  financial_contact_email?: string;
  // URLs dos Documentos
  cnpj_card_url?: string;
  qsa_url?: string;
  social_contract_url?: string;
  operating_permit_url?: string;
  sanitary_medication_url?: string;
  sanitary_cosmetics_url?: string;
  sanitary_health_url?: string;
  sanitary_sanitizing_url?: string;
  // PF
  rg_url?: string;
  address_proof_url?: string;
  // Endereço
  cep?: string;
  address?: string;
  address_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "clients" | "admins">("dashboard");

  // Dados
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Filtros e Formulários
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterSubcategory, setFilterSubcategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("newest");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [promoteEmail, setPromoteEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "", category: categories[0], subcategory: "", description: "", image_url: "",
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  const [clientFormData, setClientFormData] = useState<Partial<Profile>>({});

  // --- 1. SEGURANÇA E AUTH ---
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      setCurrentUserId(session.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (profile && (profile.user_type === 'PF' || profile.user_type === 'PJ')) {
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: "Área restrita apenas para administradores."
        });
        navigate("/");
        return;
      }

      setIsAuthenticated(true);
      fetchAllProducts();
      fetchProfiles();

    } catch (error) {
      console.error("Erro na verificação:", error);
      navigate("/login");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- 2. BUSCAR DADOS ---
  const fetchAllProducts = async () => {
    setIsLoadingList(true);
    try {
      const { data, error } = await supabase.from('products').select('*').range(0, 9999);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) { console.error(error); } finally { setIsLoadingList(false); }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const allProfiles = data || [];
      setProfiles(allProfiles);
      setAdmins(allProfiles.filter(p => p.user_type === 'ADMIN'));
    } catch (error) { console.error("Erro ao buscar clientes", error); }
  };

  // --- 3. PRODUTOS (CRUD COMPLETO COM TEXTAREA) ---
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      description: product.description || "",
      image_url: product.image_url || ""
    });
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", category: categories[0], subcategory: "", description: "", image_url: "" });
    setProductImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const productData: any = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
    };

    try {
      // Faz o upload da imagem se o usuário selecionou algo
      if (productImageFile) {
        const fileExt = productImageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(`products/${fileName}`, productImageFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(`products/${fileName}`);
          productData.image_url = publicUrl;
        } else {
          toast({ title: "Erro no Upload", description: uploadError.message, variant: "destructive" });
        }
      }

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        toast({ title: "Atualizado!", description: "Produto editado com sucesso." });
        handleCancelEdit();
      } else {
        const newProduct = { id: Date.now(), ...productData };
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
        toast({ title: "Sucesso!", description: "Produto adicionado." });
        setFormData({ name: "", category: categories[0], subcategory: "", description: "", image_url: "" });
        setProductImageFile(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
      fetchAllProducts();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha na operação.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Excluído", description: "Produto removido." });
      fetchAllProducts();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
    }
  };

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
          subcategory: item.subcategory || item.Subgrupo || item.Classe || "",
          description: item.description || item.Descricao || "",
          image_url: null
        }));

        const { error } = await supabase.from('products').insert(formattedData);
        if (error) {
          toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Importado!", description: `${formattedData.length} itens importados.` });
          fetchAllProducts();
        }
        setIsSending(false);
      }
    });
  };

  // Lógica de Filtro de Produtos
  const availableSubcategories = ["Todas", ...Array.from(new Set(
    products.filter(p => filterCategory === "Todas" || p.category === filterCategory).map(p => p.subcategory).filter(Boolean)
  ))].sort();

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const prodName = product.name || "";
    const prodId = product.id ? product.id.toString() : "";
    const prodSub = product.subcategory || "";
    const textMatch = prodName.toLowerCase().includes(searchLower) || prodId.includes(searchLower) || prodSub.toLowerCase().includes(searchLower);
    const catMatch = filterCategory === "Todas" || product.category === filterCategory;
    const subMatch = filterSubcategory === "Todas" || product.subcategory === filterSubcategory;
    return textMatch && catMatch && subMatch;
  });

  const displayList = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "newest") return b.id - a.id;
    if (sortOrder === "oldest") return a.id - b.id;
    return a.name.localeCompare(b.name);
  });

  // --- 4. CLIENTES & ADMIN ACTIONS ---
  const toggleVerification = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_verified: !currentStatus }).eq('id', profileId);
      if (error) throw error;
      toast({ title: !currentStatus ? "Aprovado! ✅" : "Suspenso ⛔", description: "Status de acesso atualizado." });
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, is_verified: !currentStatus } : p));
      if (selectedProfile?.id === profileId) setSelectedProfile(prev => prev ? { ...prev, is_verified: !currentStatus } : null);
    } catch (error) { toast({ title: "Erro", variant: "destructive" }); }
  };

  const handleEditProfileClick = (profile: Profile) => {
    setEditingProfile(profile);
    setClientFormData({
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      document: profile.document,
      // Endereço
      cep: profile.cep,
      address: profile.address,
      address_number: profile.address_number,
      neighborhood: profile.neighborhood,
      city: profile.city,
      state: profile.state,
      complement: profile.complement,
      // PJ
      company_name: profile.company_name,
      fantasy_name: profile.fantasy_name,
      ie: profile.ie,
      // (Nota: Os documentos não são editáveis pelo admin por aqui, apenas via reenvio do usuário)
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setIsSending(true);
    try {
      const { error } = await supabase.from('profiles').update(clientFormData).eq('id', editingProfile.id);
      if (error) throw error;

      toast({ title: "Perfil Atualizado!", description: "Dados do cliente alterados com sucesso." });
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handlePromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail) return;
    try {
      const { data: userToPromote, error: searchError } = await supabase.from('profiles').select('*').eq('email', promoteEmail).single();
      if (searchError || !userToPromote) { toast({ variant: "destructive", title: "Não encontrado" }); return; }
      if (userToPromote.user_type === 'ADMIN') { toast({ title: "Já é Admin" }); return; }
      await supabase.from('profiles').update({ user_type: 'ADMIN', is_verified: true }).eq('id', userToPromote.id);
      toast({ title: "Sucesso!", description: "Novo admin adicionado." });
      setPromoteEmail("");
      fetchProfiles();
    } catch (error) { toast({ variant: "destructive", title: "Erro" }); }
  };

  const handleDemoteAdmin = async (adminId: string) => {
    if (adminId === currentUserId) return;
    if (!window.confirm("Remover acesso de admin?")) return;
    try {
      await supabase.from('profiles').update({ user_type: 'PF' }).eq('id', adminId);
      toast({ title: "Removido" });
      fetchProfiles();
    } catch (error) { toast({ variant: "destructive", title: "Erro" }); }
  };

  const filteredClients = profiles
    .filter(p => p.user_type !== 'ADMIN')
    .filter(p =>
      p.full_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      p.document?.includes(clientSearch) ||
      p.company_name?.toLowerCase().includes(clientSearch.toLowerCase())
    );

  // --- RENDERIZAÇÃO ---
  if (isCheckingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow py-24 px-4 container mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut size={16} /> Sair do Sistema
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 ${activeTab === "dashboard" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}><LayoutDashboard size={20} /> Visão Geral</button>
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 ${activeTab === "products" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}><ListFilter size={20} /> Produtos</button>
          <button onClick={() => setActiveTab("clients")} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 ${activeTab === "clients" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}><Users size={20} /> Clientes</button>
          <button onClick={() => setActiveTab("admins")} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 ${activeTab === "admins" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}><Shield size={20} /> Admins</button>
        </div>

        {/* --- CONTEÚDO --- */}

        {activeTab === "dashboard" && <DashboardOverview products={products} />}

        {activeTab === "products" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Formulário de Produtos */}
            <Card className={`shadow-xl h-fit border-t-4 ${editingId ? "border-t-amber-500" : "border-t-primary"}`}>
              <CardHeader>
                <CardTitle className={`text-xl font-bold flex justify-between items-center ${editingId ? "text-amber-600" : "text-primary"}`}>
                  {editingId ? "Editar Produto" : "Novo Produto"}
                  {editingId && (
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X size={16} className="mr-1" /> Cancelar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <form onSubmit={handleSubmitProduct} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Nome do Produto</label>
                      <Input placeholder="Ex: Luva Látex P" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Categoria</label>
                        <select className="flex h-10 w-full rounded-md border px-3 bg-background" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="w-1/2 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Subgrupo</label>
                        <Input placeholder="Ex: Hospitalar" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Descrição Detalhada</label>
                      {/* 👇 AQUI ESTÁ O USO DO TEXTAREA */}
                      <Textarea
                        placeholder="Detalhes técnicos, composição, marca..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1 border p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                      <div className="bg-white p-2 border rounded-md shadow-sm h-12 w-12 flex items-center justify-center flex-shrink-0">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Produto" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex justify-between">Imagem do Produto (Opcional)</label>
                        <Input ref={imageInputRef} type="file" accept="image/*" className="text-xs mt-1 cursor-pointer h-8" onChange={(e) => setProductImageFile(e.target.files?.[0] || null)} />
                      </div>
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

            {/* Lista de Produtos */}
            <Card className="shadow-xl flex flex-col h-[750px]">
              <CardHeader className="flex flex-col gap-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Catálogo ({displayList.length})</CardTitle>
                  <Button variant="ghost" size="sm" onClick={fetchAllProducts}><RefreshCw size={16} className={isLoadingList ? "animate-spin" : ""} /></Button>
                </div>
                <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input placeholder="Buscar por nome ou ID..." className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <select className="h-9 border rounded px-2 w-1/3 text-xs bg-white" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setFilterSubcategory("Todas") }}>
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
                  <div key={p.id} className={`flex items-center gap-3 p-3 border-b hover:bg-gray-50 transition-colors ${editingId === p.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}>
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center flex-shrink-0">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="max-h-10 max-w-10 object-contain" /> : <ImageIcon size={20} className="text-gray-300" />}
                    </div>
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
                      <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-600" onClick={() => handleDeleteProduct(p.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "clients" && (
          <Card className="shadow-xl animate-in fade-in duration-300">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Central de Clientes</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Analise a documentação antes de aprovar.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Buscar por nome, CNPJ..."
                    className="pl-9"
                    value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchProfiles}><RefreshCw size={16} /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                  <Users size={40} className="mx-auto mb-2 opacity-20" />
                  Nenhum cliente encontrado.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClients.map((profile) => (
                    <div key={profile.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white gap-4">

                      <div className="flex items-start gap-4 flex-grow">
                        <div className={`p-3 rounded-full flex-shrink-0 ${profile.user_type === 'PJ' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {profile.user_type === 'PJ' ? <Building2 size={24} /> : <User size={24} />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-lg">{profile.full_name}</h3>
                            <Badge variant={profile.user_type === 'PJ' ? 'default' : 'secondary'} className={profile.user_type === 'PJ' ? 'bg-blue-700' : ''}>
                              {profile.user_type}
                            </Badge>
                            {profile.is_verified ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100"><CheckCircle size={12} className="mr-1" /> Aprovado</Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><AlertTriangle size={12} className="mr-1" /> Pendente</Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            {profile.company_name && <p className="font-medium text-blue-900">{profile.company_name}</p>}
                            <p><span className="text-gray-400">Doc:</span> {profile.document} <span className="text-gray-300 mx-2">|</span> <span className="text-gray-400">Tel:</span> {profile.phone}</p>
                            <p className="text-xs text-gray-400">Cadastrado em: {new Date(profile.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full lg:w-auto">
                        <Button variant="outline" size="icon" onClick={() => handleEditProfileClick(profile)} title="Editar Dados">
                          <Pencil size={16} className="text-blue-600" />
                        </Button>

                        <Button variant="outline" className="flex-1 lg:flex-none border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setSelectedProfile(profile)}>
                          <Eye size={16} className="mr-2" /> Ver Detalhes
                        </Button>

                        <Button
                          className={`flex-1 lg:flex-none w-32 ${profile.is_verified ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                          variant="ghost"
                          onClick={() => toggleVerification(profile.id, profile.is_verified)}
                        >
                          {profile.is_verified ? "Bloquear" : "Aprovar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "admins" && (
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 shadow-xl h-fit border-t-4 border-t-blue-800">
              <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus size={20} /> Novo Admin</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handlePromoteAdmin} className="space-y-4">
                  <Input placeholder="E-mail do usuário" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} required />
                  <Button type="submit" className="w-full bg-blue-800">Promover</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 shadow-xl"><CardHeader><CardTitle>Equipe</CardTitle></CardHeader><CardContent>{admins.map(a => <div key={a.id} className="p-4 border-b flex justify-between items-center"><span>{a.full_name} <br /><small className="text-gray-500">{a.email}</small></span> {a.id !== currentUserId && <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDemoteAdmin(a.id)}>Remover</Button>}</div>)}</CardContent></Card>
          </div>
        )}

      </div>

      {/* --- MODAL DE DETALHES COMPLETO --- */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Ficha Técnica de Compliance</h2>
                <p className="text-sm text-gray-500">ID: {selectedProfile.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProfile(null)}><X size={24} /></Button>
            </div>

            <div className="p-6 space-y-6">
              {/* DADOS CADASTRAIS */}
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500">Nome / Razão</label><div className="font-medium">{selectedProfile.full_name}</div></div>
                <div><label className="text-xs font-bold text-gray-500">Documento</label><div className="font-mono bg-gray-100 p-1 rounded w-fit">{selectedProfile.document}</div></div>
                <div><label className="text-xs font-bold text-gray-500">Email</label><div>{selectedProfile.email}</div></div>
                <div><label className="text-xs font-bold text-gray-500">Telefone</label><div>{selectedProfile.phone}</div></div>
              </div>

              {/* DADOS ESPECÍFICOS PJ */}
              {selectedProfile.user_type === 'PJ' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><Building2 size={18} /> Dados Fiscais & Financeiros</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-blue-700">Razão Social</label><p className="text-sm">{selectedProfile.company_name}</p></div>
                    <div><label className="text-xs font-bold text-blue-700">Natureza Jurídica</label><p className="text-sm">{selectedProfile.legal_nature || "-"}</p></div>
                    <div><label className="text-xs font-bold text-blue-700">Inscrição Estadual</label><p className="text-sm">{selectedProfile.ie || "Isento"}</p></div>
                    <div><label className="text-xs font-bold text-blue-700">Inscrição Municipal</label><p className="text-sm">{selectedProfile.municipal_inscription || "-"}</p></div>
                  </div>
                  <div className="border-t border-blue-200 pt-2">
                    <label className="text-xs font-bold text-blue-700">Contato Financeiro</label>
                    <p className="text-sm">{selectedProfile.financial_contact_name} | {selectedProfile.financial_contact_phone} | {selectedProfile.financial_contact_email}</p>
                  </div>
                </div>
              )}

              {/* CENTRAL DE DOWNLOAD DE DOCUMENTOS */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={18} /> Documentação Anexada</h3>

                {selectedProfile.user_type === 'PJ' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Corporativo</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.cnpj_card_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.cnpj_card_url)}><Download size={14} className="mr-2" /> Cartão CNPJ</Button> : <Badge variant="destructive">Sem CNPJ</Badge>}
                        {selectedProfile.qsa_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.qsa_url)}><Download size={14} className="mr-2" /> QSA</Button> : <Badge variant="outline">Sem QSA</Badge>}
                        {selectedProfile.social_contract_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.social_contract_url)}><Download size={14} className="mr-2" /> Contrato Social</Button> : <Badge variant="destructive">Sem Contrato</Badge>}
                        {selectedProfile.operating_permit_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.operating_permit_url)}><Download size={14} className="mr-2" /> Alvará Func.</Button> : <Badge variant="destructive">Sem Alvará</Badge>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Sanitário / Regulatório</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* NOVO: Alvará Medicamentos */}
                        {selectedProfile.sanitary_medication_url ? <Button variant="outline" size="sm" className="border-green-500 text-green-700 bg-green-50" onClick={() => window.open(selectedProfile.sanitary_medication_url)}><Download size={14} className="mr-2" /> AFE Medicamentos</Button> : <Badge variant="outline">Sem AFE Med</Badge>}

                        {selectedProfile.sanitary_cosmetics_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.sanitary_cosmetics_url)}><Download size={14} className="mr-2" /> AFE Cosméticos</Button> : null}
                        {selectedProfile.sanitary_health_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.sanitary_health_url)}><Download size={14} className="mr-2" /> AFE Prod. Saúde</Button> : null}
                        {selectedProfile.sanitary_sanitizing_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.sanitary_sanitizing_url)}><Download size={14} className="mr-2" /> AFE Saneantes</Button> : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {selectedProfile.rg_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.rg_url)}><Download size={14} className="mr-2" /> Documento RG/CNH</Button> : <Badge variant="destructive">Sem RG</Badge>}
                    {selectedProfile.address_proof_url ? <Button variant="outline" size="sm" onClick={() => window.open(selectedProfile.address_proof_url)}><Download size={14} className="mr-2" /> Comp. Residência</Button> : <Badge variant="destructive">Sem Comp. Endereço</Badge>}
                  </div>
                )}
              </div>

              {/* ENDEREÇO */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><MapPin size={18} /> Endereço de Entrega</h3>
                <p className="text-sm text-gray-600">{selectedProfile.address}, {selectedProfile.address_number} {selectedProfile.complement} - {selectedProfile.neighborhood} - {selectedProfile.city}/{selectedProfile.state} (CEP: {selectedProfile.cep})</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
              <Button variant="outline" onClick={() => setSelectedProfile(null)}>Fechar</Button>
              <Button className={selectedProfile.is_verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} onClick={() => { toggleVerification(selectedProfile.id, selectedProfile.is_verified); }}>{selectedProfile.is_verified ? "Revogar Acesso" : "Aprovar Cadastro"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE EDIÇÃO DE PERFIL --- */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-blue-50 sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><Pencil size={20} /> Editar Cliente</h2>
                <p className="text-sm text-blue-700">Alterando dados de: {editingProfile.full_name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingProfile(null)}><X size={24} /></Button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-6">

                {/* 1. Dados Pessoais / Contato */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">Dados Básicos</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Nome / Responsável</label>
                      <Input value={clientFormData.full_name || ""} onChange={e => setClientFormData({ ...clientFormData, full_name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Documento (CPF/CNPJ)</label>
                      <Input value={clientFormData.document || ""} onChange={e => setClientFormData({ ...clientFormData, document: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Telefone</label>
                      <Input value={clientFormData.phone || ""} onChange={e => setClientFormData({ ...clientFormData, phone: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">E-mail (Apenas Visualização)</label>
                      <Input value={clientFormData.email || ""} disabled className="bg-gray-100" />
                    </div>
                  </div>
                </div>

                {/* 2. Endereço */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">Endereço</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">CEP</label><Input value={clientFormData.cep || ""} onChange={e => setClientFormData({ ...clientFormData, cep: e.target.value })} /></div>
                    <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500">Rua</label><Input value={clientFormData.address || ""} onChange={e => setClientFormData({ ...clientFormData, address: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Número</label><Input value={clientFormData.address_number || ""} onChange={e => setClientFormData({ ...clientFormData, address_number: e.target.value })} /></div>
                    <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500">Bairro</label><Input value={clientFormData.neighborhood || ""} onChange={e => setClientFormData({ ...clientFormData, neighborhood: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Cidade</label><Input value={clientFormData.city || ""} onChange={e => setClientFormData({ ...clientFormData, city: e.target.value })} /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Estado</label><Input value={clientFormData.state || ""} onChange={e => setClientFormData({ ...clientFormData, state: e.target.value })} /></div>
                  </div>
                </div>

                {/* 3. Dados PJ (Apenas se for PJ) */}
                {editingProfile.user_type === 'PJ' && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded border border-blue-100">
                    <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-2">Dados Empresariais & Compliance</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs font-bold text-blue-700">Razão Social</label><Input value={clientFormData.company_name || ""} onChange={e => setClientFormData({ ...clientFormData, company_name: e.target.value })} /></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-blue-700">Nome Fantasia</label><Input value={clientFormData.fantasy_name || ""} onChange={e => setClientFormData({ ...clientFormData, fantasy_name: e.target.value })} /></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-blue-700">Inscrição Estadual</label><Input value={clientFormData.ie || ""} onChange={e => setClientFormData({ ...clientFormData, ie: e.target.value })} /></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                  <Button type="button" variant="outline" onClick={() => setEditingProfile(null)}>Cancelar</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSending}>
                    {isSending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={16} />}
                    Salvar Alterações
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;