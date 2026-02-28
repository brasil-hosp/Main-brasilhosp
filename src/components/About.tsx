import { Award, Users, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const stats = [
    { icon: Award, value: "15+", label: "Anos de Experiência" },
    { icon: Users, value: "1000+", label: "Clientes Satisfeitos" },
    { icon: TrendingUp, value: "98%", label: "Taxa de Satisfação" },
    { icon: Heart, value: "24/6", label: "Dedicação" },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Quem Somos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            A Brasil Hosp é uma empresa líder no fornecimento de equipamentos médicos, medicamentos e serviços especializados para o setor de saúde. Com mais de uma década de experiência, nos dedicamos a fornecer soluções de alta qualidade que fazem a diferença no cuidado com os pacientes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-primary-foreground" size={28} />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fornecer equipamentos médicos e medicamentos de qualidade superior, apoiados por um serviço excepcional, para melhorar os resultados de saúde em todo o Brasil.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-secondary mb-4">Nossos Valores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprometimento com a excelência, integridade em todas as relações, inovação contínua e dedicação absoluta ao bem-estar dos pacientes e profissionais de saúde.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
