import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import healthcareTeamImage from "@/assets/healthcare-team.jpg";

const WhyUs = () => {
  const reasons = [
    "Expertise de mais de uma década no setor hospitalar",
    "Produtos homologados e certificados pela ANVISA",
    "Equipe técnica altamente qualificada para suporte",
    "Logística ultra-rápida com cobertura nacional",
    "Preços competitivos e condições maleáveis",
    "Aliança com fornecedores líderes globais",
    "Compromisso irrevogável com a segurança do paciente",
  ];

  return (
    <section id="why-us" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Qualidade Premium
          </h2>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Por Que Escolher a Brasil Hosp?
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            Estruturamos complexos processos logísticos em soluções ágeis para que sua instituição de saúde nunca pare.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Image Side - Offset Design */}
          <div className="order-2 lg:order-1 relative animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-blue-300 rounded-2xl transform -rotate-3 opacity-20 blur-lg" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl transform rotate-2 opacity-50" />

            <Card className="relative border-0 shadow-2xl overflow-hidden rounded-2xl h-[500px] group">
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={healthcareTeamImage}
                alt="Equipe de Saúde Homologada"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                <ShieldCheck className="text-green-500 w-8 h-8" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Qualidade</p>
                  <p className="text-sm font-black text-gray-900">Garantida 100%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="space-y-6">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
                    <CheckCircle2 className="text-blue-600 group-hover:text-white transition-colors duration-300" size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">{reason}</p>
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
