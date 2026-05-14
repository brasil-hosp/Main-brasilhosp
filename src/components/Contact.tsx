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

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const SHEETDB_API_URL = import.meta.env.VITE_SHEETDB_API_URL as string;

    const dataToSend = {
      ...formData,
      timestamp: new Date().toLocaleString("pt-BR"),
    };

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
        setIsSending(false);
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
      content: "contato@brasil-hosp.com",
      link: "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contato@brasil-hosp.com",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Ana Jansen, 1040 - São Francisco, São Luís - MA, 65076-730",
      link: "https://maps.google.com/?cid=5391612174080300890&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Atendimento Especializado
          </h2>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Entre em Contato
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-500 mx-auto mb-8 rounded-full" />
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            Nossa equipe técnica comercial está pronta para entender as necessidades da sua instituição.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000 delay-300">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                      <a
                        href={info.link}
                        target={info.link?.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors text-sm leading-relaxed"
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
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
            <Card className="border border-gray-100 shadow-xl bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-red-500" />
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome"
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        E-mail Coporativo *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(99) 99999-9999"
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                        Instituição
                      </label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Hospital ou Clínica"
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Como podemos ajudar sua operação hospitalar?"
                      rows={5}
                      className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group border-0 mt-4"
                    disabled={isSending}
                  >
                    {isSending ? "Enviando Requisição..." : "Enviar Mensagem Privada"}
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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