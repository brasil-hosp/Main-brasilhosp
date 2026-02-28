import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import heroImage from "@/assets/hero-hospital.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hospital Brasil Hosp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Excelência em Soluções Hospitalares
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Fornecemos equipamentos, medicamentos e serviços de alta qualidade para clínicas e hospitais em todo o Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg group"
            >
              Solicite um Orçamento
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
           {/* ESTE É O NOVO CÓDIGO COM O LINK */}
<Button
  size="lg"
  variant="outline"
  className="border-0 border-primary-foreground text-primary px-8 py-6 text-lg"
  asChild  /* 1. Adiciona a prop asChild */
>
  {/* 2. Adiciona a tag <a> como filha */}
  <a 
    href="https://wa.me/559832271116"  /* 3. Coloque seu número aqui (com 55 + DDD) */
    target="_blank" /* 4. Para abrir em uma nova aba */
    rel="noopener noreferrer"
  >
    <Phone className="mr-2" />
    Entre em Contato
  </a>
</Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
