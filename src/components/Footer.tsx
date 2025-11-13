import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    empresa: [
      { label: "Sobre Nós", href: "#about" },
      { label: "Serviços", href: "#services" },
      { label: "Localização", href: "#location" },
    ],
    recursos: [
      { label: "Blog", href: "#" },
      { label: "Catálogo", href: "#" },
      { label: "Certificações", href: "#" },
    ],
    legal: [
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de Uso", href: "#" },
      { label: "LGPD", href: "#" },
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
            <h3 className="text-2xl font-bold mb-4">Brasil Hosp</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Fornecendo soluções de excelência para o setor de saúde brasileiro há mais de 15 anos.
            </p>
            <div className="space-y-3">
              <a href="tel:+559832271116" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone size={18} />
                <span>(98) 3227-1116</span>
              </a>
              <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contato@brasil-hosp.com" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail size={18} />
                <span>contato@brasilhosp.com</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
              Bryan M.
            </a>
            {" "}&{" "}
            <a
              href="URL_DO_PORTFOLIO"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-foreground hover:underline"
            >
              Marcus F.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
