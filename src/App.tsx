import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lgpd from "./pages/Lgpd"; // Importação da nova página lgpd e politica de privacidade
import Catalog from "./pages/Catalog"; // Pagina catalogo de produtos
import ProductDetail from "./pages/ProductDetail"; // Nova página de detalhes
import Admin from "./pages/Admin"; // pagina admin
import Terms from "./pages/Terms"; // Importação da nova página de termos de uso
import { CartProvider } from "./context/CartContext"; // Implementando o contexto do carrinho de compras
import Login from "./pages/Login"; // Página de login para admin
import SignUp from "./pages/SignUp"; // Página de cadastro para usuarios
import ClientLogin from "./pages/ClientLogin"; // Página de login para clientes
import ClientProfile from "./pages/ClientProfile";
import ForgotPassword from "./pages/ForgotPassword"; // Página de recuperação de senha
import ResetPassword from "./pages/ResetPassword"; // Página de redefinição de senha

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/lgpd" element={<Lgpd />} />

            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/produto/:id" element={<ProductDetail />} />

            {/* Nova Rota Admin */}
            <Route path="/admin" element={<Admin />} />

            <Route path="/login" element={<Login />} />

            <Route path="/entrar" element={<ClientLogin />} />

            <Route path="/minha-conta" element={<ClientProfile />} />

            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />

            <Route path="/cadastro" element={<SignUp />} />

            <Route path="/termos" element={<Terms />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;