import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 1. NOVOS IMPORTS
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 2. HOOKS DE NAVEGAÇÃO
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. FUNÇÃO DE SCROLL INTELIGENTE
  const scrollToSection = (id: string) => {
    // Se não estiver na Home, vai para ela primeiro
    if (location.pathname !== "/") {
      navigate("/");
      // Pequeno delay para a Home carregar antes de rolar
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Se já estiver na Home, comportamento normal
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
    { id: "partners", label: "Parceiros" }, // Adicionei Parceiros caso queira no menu
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
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:opacity-80 transition-opacity p-0"
          >
            <img 
              src="/logo-brasil-hosp.png" 
              alt="Logo Brasil Hosp" 
              className="h-16" 
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("contact")}
              variant="default"
              className="bg-secondary hover:bg-secondary/90"
            >
              Solicitar Orçamento
            </Button>
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
          <div className="md:hidden py-4 border-t border-border animate-fade-in bg-background/95 backdrop-blur-md"> {/* Adicionei bg para garantir leitura no mobile */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("contact")}
                variant="default"
                className="bg-secondary hover:bg-secondary/90 w-full"
              >
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;