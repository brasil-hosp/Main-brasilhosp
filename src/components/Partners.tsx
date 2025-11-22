import React from "react";
import Marquee from "react-fast-marquee"; // 1. Importa o 'Marquee'
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  { name: "Partner A", logo: "/partners/cristalia.png" },
  { name: "Partner B", logo: "/partners/geolab.png" },
  { name: "Partner C", logo: "/partners/blau.png" },
  { name: "Partner D", logo: "/partners/mercur.png" },
  { name: "Partner E", logo: "/partners/texcare.png" },
  { name: "Partner F", logo: "/partners/descarbox.png" },
  { name: "Partner G", logo: "/partners/farmace.png" },
  { name: "Partner H", logo: "/partners/fesenius.png" },
  { name: "Partner I", logo: "/partners/prati.png" },
  { name: "Partner J", logo: "/partners/golgran.png" },
  { name: "Partner K", logo: "/partners/unitec.png" },
  { name: "Partner L", logo: "/partners/gtech.png" },
  { name: "Partner M", logo: "/partners/hidrolight.png" },
  { name: "Partner N", logo: "/partners/hipolabor.png" },
  { name: "Partner O", logo: "/partners/maquira.png" },
  { name: "Partner P", logo: "/partners/sr.png" },
  { name: "Partner Q", logo: "/partners/ss.png" },
  { name: "Partner R", logo: "/partners/teuto.png" },
  { name: "Partner S", logo: "/partners/tkl.png" },
  { name: "Partner T", logo: "/partners/uc.png" },
  { name: "Partner U", logo: "/partners/venosan.png" },
];

const Partners = () => {
  return (
    <section id="partners" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* O Título (continua igual) */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos Parceiros
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trabalhamos com as marcas líderes do setor para garantir a máxima qualidade.
          </p>
        </div>

        {/* 2. Substituímos o <Carousel> por <Marquee> */}
        <Marquee
          //pauseOnHover={true} // Pausa a rolagem quando o mouse está em cima
          speed={60} // Controla a velocidade (teste valores como 40, 60, 80)
          autoFill={true} // Duplica os logos automaticamente para criar o loop infinito
          gradient={true} // Adiciona um "fade" suave nas bordas
          gradientColor="#f8fafc" // Cor do fade (use a cor do seu bg-muted/30 se esta ficar ruim)
          gradientWidth={100}
        >
          {/* 3. Mapeamos os parceiros aqui dentro */}
          {partners.map((partner, index) => (
            <div key={index} className="mx-8 w-48 my-4 py-4"> {/* Adiciona margem entre os logos */}
              {/* Código Reformulado para um Brilho Melhor */}
{/* Código Reformulado para um Brilho Mais Bonito */}
<Card className="
  border border-transparent hover:border-secondary transition-all duration-300
  shadow-lg hover:shadow-xl hover:shadow-secondary/50
  bg-transparent
">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  {/* Este é o estilo original (grayscale) que você queria manter */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-32 h-32 object-contain"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </Marquee>

      </div>
    </section>
  );
};


export default Partners;
