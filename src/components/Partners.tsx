// src/components/ui/Partners.tsx (ou onde você o salvou)

import React from "react";
import Marquee from "react-fast-marquee"; // 1. Importa o 'Marquee'
import { Card, CardContent } from "@/components/ui/card";

// (O seu array de parceiros continua o mesmo)
const partners = [
  { name: "Partner A", logo: "/partners/airela.png" },
  { name: "Partner B", logo: "/partners/geolab.png" },
  { name: "Partner C", logo: "/partners/medix.png" },
  { name: "Partner D", logo: "/partners/mercur.png" },
  { name: "Partner E", logo: "/partners/microdont.png" },
  { name: "Partner F", logo: "/partners/montserrat.png" },
  { name: "Partner G", logo: "/partners/nativita.png" },
  { name: "Partner H", logo: "/partners/pharlab.png" },
  { name: "Partner I", logo: "/partners/prati.png" },
  { name: "Partner J", logo: "/partners/texcare.png" },
  { name: "Partner K", logo: "/partners/unitec.png" },
  { name: "Partner L", logo: "/partners/vitamedic.png" },
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
            <div key={index} className="mx-8 w-48"> {/* Adiciona margem entre os logos */}
              <Card className="border-0 shadow-lg bg-transparent">
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