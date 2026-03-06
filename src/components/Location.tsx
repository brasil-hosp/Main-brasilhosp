import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Clock, Phone } from "lucide-react";

const Location = () => {
  return (
    <section id="location" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/5 -skew-y-3 origin-top-left -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Localização Estratégica
          </h2>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Sede e Centro de Distribuição
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-8 rounded-full" />
          <p className="text-lg text-gray-500 leading-relaxed font-light max-w-2xl mx-auto">
            Logística inteligente e infraestrutura de ponta projetada para atender as demandas do mercado hospitalar com máxima agilidade.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">

          {/* Info Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6 animate-in fade-in slide-in-from-left-10 duration-1000">
            <Card className="border-0 shadow-lg bg-white overflow-hidden flex-1 group hover:shadow-xl transition-shadow duration-300">
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Brasil Hosp</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Endereço Principal</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Av. Ana Jansen, 1040<br />
                        São Francisco<br />
                        São Luís - MA, 65076-730
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Horário de Atendimento</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Segunda a Sexta: 08:00 - 18:00<br />
                        Sábado: Plantão Comercial
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Central de Atendimento</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        (98) 3227-1116<br />
                        contato@brasil-hosp.com
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?cid=5391612174080300890&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  <Navigation size={18} />
                  Traçar Rota no Mapa
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Map Image/Iframe */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto min-h-[500px] animate-in fade-in slide-in-from-right-10 duration-1000">
            <Card className="border-0 shadow-lg h-full overflow-hidden relative group">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3343353457193!2d-44.3051416!3d-2.5085374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68d0aaaaaaaab%3A0x1a2b3c4d5e6f7a8b!2sAv.%20Ana%20Jansen%2C%201040%20-%20S%C3%A3o%20Francisco%2C%20S%C3%A3o%20Lu%C3%ADs%20-%20MA%2C%2065076-730!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                title="Mapa de Localização Brasil Hosp"
              />
              {/* Overlay styling for map to match enterprise look when not hovered */}
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-color pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;