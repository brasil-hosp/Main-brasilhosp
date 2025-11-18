import { Monitor, Pill, Wrench, Truck, Headphones, ShieldCheck, FileText } from "lucide-react";
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
      icon: Wrench,
      title: "Manutenção Técnica",
      description: "Serviços de manutenção preventiva e corretiva para todos os equipamentos fornecidos.",
    },
    {
      icon: Truck,
      title: "Logística Especializada",
      description: "Entrega rápida e segura com controle de temperatura e rastreamento em tempo real.",
    },
    {
      icon: Headphones,
      title: "Suporte 24/7",
      description: "Equipe técnica disponível a qualquer momento para suporte e emergências.",
    },
    {
      icon: ShieldCheck,
      title: "Conformidade Regulatória",
      description: "Todos os produtos atendem às normas da ANVISA e padrões internacionais de qualidade.",
    },
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos Serviços
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Soluções integradas que vão desde o fornecimento de insumos básicos até suporte técnico especializado.
          </p>
        </div>

        {/* Carrossel de Serviços */}
        <div className="max-w-6xl mx-auto mb-12 px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col">
                      <CardHeader className="pt-8">
                        {/* 👇 AQUI ESTÁ A MUDANÇA: VOLTEI O DEGRADÊ 👇 */}
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 text-white shadow-md">
                          <service.icon size={28} />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-primary text-primary hover:bg-primary hover:text-white" />
            <CarouselNext className="hidden md:flex -right-12 border-primary text-primary hover:bg-primary hover:text-white" />
          </Carousel>
        </div>

        {/* Botão Ver Catálogo */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/catalogo")}
            className="bg-secondary hover:bg-secondary/90 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-secondary/30 transition-all group"
          >
            <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Ver Catálogo Completo
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Services;