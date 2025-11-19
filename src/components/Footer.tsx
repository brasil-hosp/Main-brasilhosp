import { useLocation, useNavigate } from "react-router-dom"; // 1. Importamos os hooks
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate(); // 2. Iniciamos a função de navegação
  const location = useLocation();

  // Função Inteligente de Navegação (Igual à do Navbar/Services)
  const handleNavigation = (href: string) => {
    // Se for link para página interna (ex: /catalogo ou /lgpd)
    if (href.startsWith("/") && !href.includes("#")) {
      navigate(href);
      window.scrollTo(0, 0); // Sobe para o topo
      return;
    }

    // Se for âncora (ex: /#about)
    if (href.includes("#")) {
      const id = href.replace("/#", "");
      
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
    }
  };

  const footerLinks = {
    empresa: [
      { label: "Sobre Nós", href: "/#about" },
      { label: "Serviços", href: "/#services" },
      { label: "Localização", href: "/#location" },
    ],
    recursos: [
      { label: "Blog", href: "#" },
      { label: "Catálogo", href: "/catalogo" }, // Link correto
      { label: "Certificações", href: "#" },
    ],
    legal: [
      { label: "Política de Privacidade & LGPD", href: "/lgpd" }, // Link correto
      { label: "Termos de Uso", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/brasilhosp/", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo como Botão */}
            <button 
              onClick={() => handleNavigation("/")}
              className="inline-block group text-left"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:opacity-80 transition-opacity">
                Brasil Hosp
              </h3>
            </button>

            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Fornecendo soluções de excelência para o setor de saúde brasileiro há mais de 15 anos.
            </p>
            <div className="space-y-3">
              <a href="tel:+559832271116" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone size={18} />
                <span>(98) 3227-1116</span>
              </a>
              <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contato@brasil-hosp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail size={18} />
                <span>contato@brasil-hosp.com</span>
              </a>
            </div>
          </div>

          {/* Colunas de Links */}
          {[
            { title: "Empresa", items: footerLinks.empresa },
            { title: "Recursos", items: footerLinks.recursos },
            { title: "Legal", items: footerLinks.legal }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map((link, index) => (
                  <li key={index}>
                    {/* AQUI ESTÁ A MUDANÇA PRINCIPAL:
                       Usamos um <button> que chama handleNavigation, igual ao Services 
                    */}
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} Brasil Hosp. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Assinatura dos Desenvolvedores */}
          <p className="text-center text-xs text-primary-foreground/80 mt-6">
            Desenvolvido por{" "}
            <a
              href="https://bryanmdev-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-foreground hover:underline"
            >
              Bryan M
            </a>
            {" "}&{" "}
            <a
              href="URL_DO_PORTFOLIO_DO_SEU_COLEGA"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-foreground hover:underline"
            >
              Marcus F
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
