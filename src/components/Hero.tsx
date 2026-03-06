import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, PlayCircle, ShieldPlus } from "lucide-react";
import heroImage from "@/assets/fachada-brasil-hosp.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hospital Brasil Hosp"
          className="w-full h-full object-cover scale-105 animate-[pulse_30s_ease-in-out_infinite] opacity-60"
        />
        {/* Complex Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-blue-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
      </div>

      {/* Floating abstract glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px] mix-blend-screen pointer-events-none animate-pulse duration-7000" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 z-10 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-100 text-xs font-medium mb-6">
            <ShieldPlus size={14} className="text-blue-400" />
            <span className="tracking-wide uppercase text-[10px] sm:text-xs">Fornecedor Homologado</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 mb-5 leading-[1.1] tracking-tighter text-balance mx-auto">
            Excelência em Soluções Hospitalares
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed font-light max-w-2xl mx-auto">
            Fornecemos infraestrutura, equipamentos de ponta e medicamentos com eficiência e rastreabilidade para o sistema de saúde brasileiro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <Button
                size="lg"
                onClick={scrollToContact}
                className="relative bg-blue-600 hover:bg-blue-500 text-white px-6 py-6 text-base rounded-full shadow-2xl transition-all active:scale-95 group border border-blue-400/50"
              >
                Solicite um Orçamento
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 time-duration-300" />
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/5 hover:bg-white/10 border-white/20 text-white px-6 py-6 text-base rounded-full backdrop-blur-md transition-all active:scale-95 group"
              asChild
            >
              <a
                href="https://wa.me/559832271116"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Phone className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform text-red-400" />
                <span>Fale com um Especialista</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 pt-8 border-t border-white/10 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500 fill-mode-both w-full max-w-4xl">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">15+</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400">Anos de Mercado</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">2k+</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400">Clientes Ativos</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">10k+</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400">Itens em Catálogo</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400">Suporte Dedicado</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
