import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import healthcareTeamImage from "@/assets/healthcare-team.jpg";

const WhyUs = () => {
  const reasons = [
    "Experiência comprovada no mercado hospitalar brasileiro",
    "Produtos certificados pela ANVISA e órgãos internacionais",
    "Equipe técnica altamente qualificada e treinada",
    "Logística eficiente com entregas em todo o território nacional",
    "Preços competitivos com condições de pagamento flexíveis",
    "Parcerias com os principais fabricantes mundiais",
    "Compromisso com a qualidade e segurança dos pacientes",
  ];

  return (
    <section id="why-us" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Por Que Escolher a Brasil Hosp?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Somos o parceiro ideal para o crescimento e sucesso da sua instituição de saúde
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <img
                src={healthcareTeamImage}
                alt="Equipe de Saúde"
                className="w-full h-full object-cover"
              />
            </Card>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-background/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mt-1">
                    <CheckCircle2 className="text-primary-foreground" size={20} />
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
