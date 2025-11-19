import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react"; // Adicionei FileText para o ícone do catálogo
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: "about", label: "Quem Somos" },
    { id: "services", label: "O Que Oferecemos" },
    { id: "why-us", label: "Por Que Nós" },
    // REMOVIDO: { id: "partners", label: "Parceiros" },
    { id: "location", label: "Localização" },
    { id: "contact", label: "Contato" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (com Link para voltar ao topo) */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-80 transition-opacity p-0"
          >
            <img 
              src="/logo-brasil-hosp.png" 
              alt="Logo Brasil Hosp" 
              className="h-16" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </button>
            ))}

            {/* Grupo de Botões de Ação */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              
              {/* 1. Botão Catálogo (Novo) */}
              <Button
                onClick={() => navigate("/catalogo")}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <FileText size={18} className="mr-2" />
                Catálogo
              </Button>

              {/* 2. Botão Orçamento (Existente) */}
              <Button
                onClick={() => scrollToSection("contact")}
                variant="default"
                className="bg-secondary hover:bg-secondary/90 shadow-md"
              >
                Solicitar Orçamento
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4 px-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left py-2 border-b border-gray-100"
                >
                  {link.label}
                </button>
              ))}
              
              {/* Botões Mobile */}
              <div className="grid grid-cols-1 gap-3 mt-2">
                <Button
                  onClick={() => {
                    navigate("/catalogo");
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  <FileText size={18} className="mr-2" />
                  Ver Catálogo
                </Button>
                
                <Button
                  onClick={() => scrollToSection("contact")}
                  variant="default"
                  className="bg-secondary hover:bg-secondary/90 w-full"
                >
                  Solicitar Orçamento
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
