// 1. O 'MapPin' foi removido daqui, pois não é mais usado
import { Card, CardContent } from "@/components/ui/card";

const Location = () => {
  // 2. O array 'const regions = [...]' foi REMOVIDO daqui

  return (
    <section id="location" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* O TÍTULO (Mantido) */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Onde Nos Localizamos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Atendemos hospitais e clínicas em todo o território nacional com entregas rápidas e seguras
          </p>
        </div>

        {/* O MAPA PNG COM OS PINOS (Mantido) */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-16">
                <div className="relative aspect-[4/3] bg-background/50 rounded-xl p-8 backdrop-blur-sm">
                  
                  {/* 1. A IMAGEM PNG (no fundo) */}
                  <img 
                    src="/mapa-maranhao.png" 
                    alt="Mapa do Maranhão" 
                    className="absolute inset-0 w-full h-full object-contain rounded-md" 
                  />

                  {/* 2. O SVG COM OS PONTOS (por cima) */}
                 {/* 2. O SVG COM OS PONTOS (por cima) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-md">
              {/* Location Markers - FORAM REMOVIDOS */}
            </svg>
          </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* 3. O 'Regions Grid' (com Sul, Sudeste...) foi REMOVIDO daqui */}


        {/* O TEXTO FINAL (Mantido) */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-primary">Sede Nacional:</span> São Luís, MA
          </p>
          <p className="text-muted-foreground mt-2">
            Com centros de distribuição estratégicos para atendimento ágil em diversas regiões
          </p>
        </div>
      </div>
    </section>
  );
};

export default Location;