import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Package, FolderTree, AlertCircle } from "lucide-react";

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
    </div>
  );
};

export default DashboardOverview;