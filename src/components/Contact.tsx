import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // MUDANÇA 1: Estado 'isSending' adicionado aqui
  const [isSending, setIsSending] = useState(false);

  // MUDANÇA 2: Função 'handleSubmit' substituída por esta
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true); // Desabilita o botão

    // ⚠️ URL DA API DO SHEETDB ⚠️
    const SHEETDB_API_URL = "https://sheetdb.io/api/v1/f2muo4wsb6jc2";

    // Prepara os dados para enviar
    const dataToSend = {
      ...formData,
      timestamp: new Date().toLocaleString("pt-BR"), // Adiciona data e hora
    };

    // Usa o fetch para enviar (Método POST)
    fetch(SHEETDB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Sucesso:", data);
      toast({
        title: "Mensagem enviada!",
        description: "Seus dados foram registrados. Entraremos em contato.",
      });
      // Limpa o formulário
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    })
    .catch((error) => {
      console.error("Erro:", error);
      toast({
        title: "Erro ao enviar.",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    })
    .finally(() => {
      setIsSending(false); // Reabilita o botão
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      content: "(98) 3227-1116",
      link: "tel:+559832271116",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contato@brasilhosp.com.br",
      link: "mailto:contato@brasilhosp.com.br",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "São Luís, MA - Brasil",
      // (Mantive o link que você tinha na imagem)
      link: "https://maps.app.goo.gl/yNdxshDkrvF33Ffe9", 
    },
  ];

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em Contato
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Estamos prontos para atender sua instituição de saúde. Fale conosco!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                      <a
                        href={info.link}
                        target="_blank" // Adicionado para abrir links em nova aba
                        rel="noopener noreferrer" // Adicionado por segurança
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Telefone *
                      </label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Instituição
                      </label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Hospital ou Clínica"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Como podemos ajudar sua instituição?"
                      rows={5}
                    />
                  </div>

                  {/* MUDANÇA 3: Botão 'Button' atualizado */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                    disabled={isSending}
                  >
                    {isSending ? "Enviando..." : "Enviar Mensagem"}
                    <Send className="ml-2" size={20} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
