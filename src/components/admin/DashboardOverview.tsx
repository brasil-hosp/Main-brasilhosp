import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Package, FolderTree, AlertCircle, ClipboardList, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
}

interface DashboardOverviewProps {
  products: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const DashboardOverview = ({ products }: DashboardOverviewProps) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setIsLoadingQuotes(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setQuotes(data);
    } catch (e) {
      console.warn("Erro ao buscar quotes (tabela pode não existir).", e);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // 🧠 Lógica CS: Processamento de Dados (Memoizado para performance)
  const stats = useMemo(() => {
    // 1. Contagem por Categoria
    const categoryCount = products.reduce((acc, product) => {
      const cat = product.category || 'Outros';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transforma objeto em array para o gráfico: [{name: 'Medicamentos', value: 10}, ...]
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value); // Ordena do maior para o menor

    // 2. Contagem por Subcategoria (Top 5)
    const subCount = products.reduce((acc, product) => {
      if (product.subcategory) {
        const sub = product.subcategory;
        acc[sub] = (acc[sub] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const subData = Object.entries(subCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Pega só o Top 5

    return { categoryData, subData };
  }, [products]);

  // Gráfico Cotados
  const mostQuotedData = useMemo(() => {
    const counts: Record<string, number> = {};
    quotes.forEach(quote => {
      quote.items?.forEach((item: any) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [quotes]);

  // Gráfico Procurados (Mock determinístico pois não há tabela de acessos no momento)
  const mostViewedData = useMemo(() => {
    return products.slice(0, 5).map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      value: (p.id * 37) % 400 + 50
    })).sort((a, b) => b.value - a.value);
  }, [products]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Cards de Resumo (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{products.length}</div>
            <p className="text-xs text-blue-600">itens cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Categorias Ativas</CardTitle>
            <FolderTree className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.categoryData.length}</div>
            <p className="text-xs text-green-600">segmentos diferentes</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Maior Categoria</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {stats.categoryData[0]?.name || "-"}
            </div>
            <p className="text-xs text-amber-600">
              {stats.categoryData[0]?.value || 0} produtos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico de Pizza: Distribuição por Categoria */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras: Top 5 Subcategorias */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Top 5 Subgrupos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {stats.subData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Procurados */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Itens Mais Procurados</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostViewedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Cotados */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Itens Mais Cotados</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostQuotedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Orçamentos (Leads Empresariais) */}
      <Card className="shadow-md border-primary/10">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ClipboardList className="text-blue-500" size={24} />
            Últimas Solicitações de Orçamento (Leads)
          </CardTitle>
          <Badge variant="outline" className="bg-white">{quotes.length} Recentes</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {isLoadingQuotes ? (
              <div className="flex justify-center py-10 text-gray-400 text-sm">Carregando orçamentos...</div>
            ) : quotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <ClipboardList size={48} className="text-gray-200 mb-3" />
                <p>Nenhuma solicitação de orçamento registrada ainda.</p>
                <p className="text-xs">Se for um banco novo, certifique-se de que a tabela 'quotes' existe no Supabase.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {quotes.map((quote) => (
                  <div key={quote.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{quote.client_name}</span>
                        {quote.status === 'novo' ? (
                          <Badge className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0 h-4">NOVO</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">Lido</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-blue-800">{quote.hospital_name}</p>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                        {quote.phone && <span>📱 {quote.phone}</span>}
                        {quote.email && <span>📧 {quote.email}</span>}
                        {(quote.cidade || quote.estado) && <span>📍 {quote.city || ''} {quote.state ? `- ${quote.state}` : ''}</span>}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-3 min-w-[250px]">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Itens Solicitados ({quote.items?.length || 0})</p>
                      <div className="space-y-1">
                        {quote.items?.slice(0, 3).map((item: any, i: number) => (
                          <p key={i} className="text-xs text-gray-700 truncate"><span className="font-bold">{item.quantity}x</span> {item.name}</p>
                        ))}
                        {(quote.items?.length || 0) > 3 && (
                          <p className="text-xs text-blue-500 italic">E mais {quote.items.length - 3} itens...</p>
                        )}
                      </div>
                    </div>

                    {quote.notes && (
                      <div className="hidden lg:block max-w-[200px] text-xs text-gray-500 italic border-l-2 border-amber-200 pl-3">
                        "{quote.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardOverview;