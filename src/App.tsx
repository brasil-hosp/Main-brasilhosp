import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lgpd from "./pages/Lgpd"; // Importação da nova página lgpd e politica de privacidade
import Catalog from "./pages/Catalog"; // Pagina catalogo de produtos
import Admin from "./pages/Admin"; // pagina admin
import Terms from "./pages/Terms"; // Importação da nova página de termos de uso

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/lgpd" element={<Lgpd />} />

          <Route path="/catalogo" element={<Catalog />} />

          {/* Nova Rota Admin */}
          <Route path="/admin" element={<Admin />} />

          <Route path="/termos" element={<Terms />} /> 

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;