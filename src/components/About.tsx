import { Award, Users, TrendingUp, Heart, Target, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const stats = [
    { icon: Award, value: "15+", label: "Anos de Experiência" },
    { icon: Users, value: "2K+", label: "Clientes Atendidos" },
    { icon: TrendingUp, value: "98%", label: "Taxa de Satisfação" },
    { icon: Heart, value: "24/7", label: "Suporte Dedicado" },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-12 translate-x-32 -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="animate-in fade-in slide-in-from-left-10 duration-1000">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
              Quem Somos
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Liderança em fornecimento médico-hospitalar.
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              A Brasil Hosp é a parceira estratégica das principais instituições de saúde do país. Com processos rigorosos de homologação, logística integrada e atendimento consultivo, garantimos que equipamentos de ponta e insumos essenciais cheguem com segurança onde importam: na linha de frente do cuidado ao paciente.
            </p>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Certificação ANVISA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Logística Integrada</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-10 duration-1000">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 bg-gray-50/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <stat.icon size={24} strokeWidth={2} />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative cursor-default">
          <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <CardContent className="p-10 relative">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                Fornecer tecnologias de saúde, equipamentos médicos e medicamentos de suprema prioridade e qualidade, ancorados por um serviço de inteligência e logística excepcional, aprimorando substancialmente as métricas de saúde no ecossistema brasileiro.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:red-blue-100 transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <CardContent className="p-10 relative">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Princípios de Ouro</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                Alinhamento inegociável com a excelência clínica, integridade técnica em todas as transações, inovação infraestrutural incessante e devoção absoluta ao sucesso do corpo clínico e bem-estar dos pacientes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
