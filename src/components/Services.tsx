import { Monitor, Pill, Truck, ShieldCheck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Services = () => {
  const navigate = useNavigate();

  // 1. Sua lista original de 4 serviços
  const services = [
    {
      icon: Monitor,
      title: "Equipamentos Médicos",
      description: "Linha completa de equipamentos hospitalares de última geração, desde monitores até aparelhos de diagnóstico.",
    },
    {
      icon: Pill,
      title: "Medicamentos",
      description: "Fornecimento de medicamentos hospitalares com certificação e rastreabilidade garantidas.",
    },
    {
      icon: Truck,
      title: "Logística Especializada",
      description: "Entrega rápida e segura com controle de temperatura e rastreamento em tempo real.",
    },
    {
      icon: ShieldCheck,
      title: "Conformidade Regulatória",
      description: "Todos os produtos atendem às normas da ANVISA e padrões internacionais de qualidade.",
    },
  ];

  // 2. O TRUQUE: Triplicamos a lista para garantir que o loop seja suave
  // Isso cria uma lista com 12 itens, suficiente para rodar infinitamente sem "pular"
  const displayServices = [...services, ...services, ...services];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">

        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Portfólio Estratégico
          </h2>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Nossas Soluções
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-500 mx-auto mb-8 rounded-full" />
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            Soluções integradas que vão desde o fornecimento de insumos básicos até equipamentos de alta complexidade.
          </p>
        </div>

        {/* Carrossel de Serviços */}
        <div className="max-w-6xl mx-auto mb-16 px-4 md:px-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {displayServices.map((service, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 duration-300 flex flex-col bg-white overflow-hidden group">
                      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      <CardHeader className="pt-8">
                        {/* Ícone com degradê azul e vermelho */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center mb-6 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                          <service.icon size={26} strokeWidth={2} />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-500 leading-relaxed font-light">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-gray-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 bg-white" />
            <CarouselNext className="hidden md:flex -right-12 border-gray-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 bg-white" />
          </Carousel>
        </div>

        {/* Botão Ver Catálogo */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500">
          <Button
            size="lg"
            onClick={() => navigate("/catalogo")}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 group border-0"
          >
            <FileText className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
            Explorar Catálogo Interativo
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Services;