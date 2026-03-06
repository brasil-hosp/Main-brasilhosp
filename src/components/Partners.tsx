// src/components/ui/Partners.tsx

import React from "react";
import Marquee from "react-fast-marquee";
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
    <section id="partners" className="py-24 bg-gray-50 relative overflow-hidden border-y border-gray-100">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Alianças Comerciais
          </h2>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Nossos Parceiros
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-500 mx-auto mb-8 rounded-full" />
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            Trabalhamos em conjunto com as maiores marcas globais para garantir qualidade absoluta.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Marquee
            speed={60}
            autoFill={true}
            gradient={true}
            gradientColor="#f9fafb" // corresponds to tailwind gray-50
            gradientWidth={100}
            className="py-4"
          >
            {partners.map((partner, index) => (
              <div key={index} className="mx-6 w-48 my-4 py-4">
                <Card className="border border-transparent hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-lg bg-white group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="flex aspect-square items-center justify-center p-6 relative z-10">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-32 h-32 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100 transform group-hover:scale-110"
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Partners;