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
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossas Soluções
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Soluções integradas que vão desde o fornecimento de insumos básicos até equipamentos de alta complexidade.
          </p>
        </div>

        {/* Carrossel de Serviços */}
        <div className="max-w-6xl mx-auto mb-12 px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true, // O Loop agora vai funcionar perfeito
            }}
            plugins={[
              Autoplay({
                delay: 3000, // Ajustei para 3s para ficar mais dinâmico
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {/* 3. Usamos a lista 'displayServices' (a triplicada) aqui */}
              {displayServices.map((service, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col">
                      <CardHeader className="pt-8">
                        {/* Ícone com degradê */}
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