import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// 👇 Importações unificadas e COM O SHIELD
import {
  Menu,
  X,
  FileText,
  UserCircle,
  LogOut,
  UserPlus,
  User as UserIcon,
  Shield,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      // Se user_type NÃO for PF ou PJ, assumimos Admin
      if (!profile || (profile.user_type !== 'PF' && profile.user_type !== 'PJ')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/entrar");
  };

  const showBackground = isScrolled || isOpen || location.pathname !== "/";

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: "about", label: "Quem Somos" },
    { id: "services", label: "O Que Oferecemos" },
    { id: "location", label: "Localização" },
    { id: "contact", label: "Contato" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showBackground ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-80 transition-opacity p-0"
          >
            <img src="/logo-brasil-hosp.png" alt="Brasil Hosp" className="h-16" />
          </Link>

          {/* MENUS DE TEXTO */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-colors font-medium text-sm ${showBackground ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white drop-shadow-sm'}`}
              >
                {link.label}
              </button>
            ))}

            {/* GRUPO DE AÇÃO (DIREITA) */}
            <div className={`flex items-center gap-3 ml-4 pl-4 border-l ${showBackground ? 'border-gray-200' : 'border-white/20'}`}>

              {/* Botão 1: Catálogo (Ghost) */}
              <Button
                onClick={() => navigate("/catalogo")}
                variant="ghost"
                className={`font-semibold ${showBackground ? 'text-primary hover:bg-primary/5' : 'text-white hover:bg-white/10'}`}
              >
                <FileText size={18} className="mr-2" />
                Catálogo
              </Button>

              {/* Botão 2: Acessar Conta (Se não logado - Ghost) */}
              {!user && (
                <Button
                  onClick={() => navigate("/entrar")}
                  variant="ghost"
                  className={`font-semibold ${showBackground ? 'text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}
                >
                  <UserPlus size={18} className="mr-2" />
                  Acessar Conta
                </Button>
              )}

              {/* Botão 3: Orçamento (Único Destaque Principal) */}
              <Button
                onClick={() => scrollToSection("contact")}
                variant="default"
                className={`shadow-md px-6 rounded-full font-bold transition-all ${showBackground ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white text-primary hover:bg-white/90 hover:scale-105 shadow-xl'}`}
              >
                Solicitar Orçamento
              </Button>

              {/* ÁREA LOGADA (Aparece no lugar do Criar Conta quando logado) */}
              {user && (
                <div className={`flex items-center gap-2 ml-2 pl-2 border-l ${showBackground ? 'border-gray-200' : 'border-white/20'}`}>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="outline-none">
                        {/* Ícone Redondo com Inicial */}
                        <div className={`w-9 h-9 transition-colors rounded-full flex items-center justify-center font-bold text-xs cursor-pointer border ${showBackground ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200' : 'bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm'}`}>
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <div className="px-2 text-xs text-gray-500 mb-2 truncate">{user.email}</div>
                      <DropdownMenuSeparator />

                      {/* Link para Minha Conta (Cliente) */}
                      <DropdownMenuItem onClick={() => navigate("/minha-conta")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" /> Dados Cadastrais
                      </DropdownMenuItem>

                      {/* Se for Admin, Link para Painel */}
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer font-bold text-blue-600 bg-blue-50">
                          <Shield className="mr-2 h-4 w-4" /> Painel Admin
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              )}

            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 transition-colors drop-shadow-sm ${showBackground ? 'text-foreground hover:text-primary' : 'text-white hover:text-gray-200'}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in bg-white">
            <div className="flex flex-col gap-4 px-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left py-2 border-b border-gray-50"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile Actions */}
              <div className="grid grid-cols-1 gap-3 mt-2">
                <Button onClick={() => { navigate("/catalogo"); setIsOpen(false); }} variant="outline" className="w-full border-primary text-primary">
                  <FileText size={18} className="mr-2" /> Ver Catálogo
                </Button>

                {!user && (
                  <Button
                    onClick={() => { navigate("/entrar"); setIsOpen(false); }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UserPlus size={18} className="mr-2" /> Acessar Conta
                  </Button>
                )}

                <Button onClick={() => scrollToSection("contact")} variant="default" className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold w-full shadow-md">
                  Solicitar Orçamento
                </Button>

                {user && (
                  <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="destructive" className="w-full mt-2">
                    <LogOut size={16} className="mr-2" /> Sair
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;