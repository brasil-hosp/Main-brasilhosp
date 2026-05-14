import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { CartProvider } from "./context/CartContext";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Lgpd = lazy(() => import("./pages/Lgpd")); // Importação da nova página lgpd e politica de privacidade
const Catalog = lazy(() => import("./pages/Catalog")); // Pagina catalogo de produtos
const ProductDetail = lazy(() => import("./pages/ProductDetail")); // Nova página de detalhes
const Admin = lazy(() => import("./pages/Admin")); // pagina admin
const Terms = lazy(() => import("./pages/Terms")); // Importação da nova página de termos de uso
const Login = lazy(() => import("./pages/Login")); // Página de login para admin
const SignUp = lazy(() => import("./pages/SignUp")); // Página de cadastro para usuarios
const ClientLogin = lazy(() => import("./pages/ClientLogin")); // Página de login para clientes
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword")); // Página de recuperação de senha
const ResetPassword = lazy(() => import("./pages/ResetPassword")); // Página de redefinição de senha
const OrderForm = lazy(() => import("./pages/OrderForm")); // Nova página de pedido via link

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={48} /></div>}>
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

              <Route path="/pedido/:token" element={<OrderForm />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;