import { useEffect } from "react";
// ⚠️ Mantenha os imports que já funcionam no seu projeto!
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            
            {/* Cabeçalho */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Termos de Uso
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
              <p className="mt-4 text-muted-foreground">
                Última atualização: Fevereiro de 2025
              </p>
            </div>

            {/* Conteúdo do Texto */}
            <div className="space-y-8 text-foreground/80 leading-relaxed text-justify">
              
              <div className="bg-card p-8 rounded-xl shadow-sm border border-border/50">
                <h2 className="text-2xl font-bold text-secondary mb-4">1. Aceitação</h2>
                <p>
                  Ao acessar e utilizar o site da <strong>BRASIL HOSP PRODUTOS MÉDICOS E HOSPITALARES LTDA.</strong> (CNPJ: 15.377.501/0001-69), você concorda integralmente com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com qualquer parte destes termos, recomendamos que não utilize nossos serviços digitais.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">2. Uso do Site</h2>
                <p className="mb-2">O objetivo deste site é apresentar nosso catálogo de produtos, oferecer canais de contato e permitir solicitações de orçamento. Você concorda em utilizar o site apenas para finalidades lícitas e de acordo com as seguintes regras:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li>Não utilizar o site para enviar spam ou conteúdo malicioso.</li>
                  <li>Não tentar acessar áreas restritas do sistema (como o painel administrativo) sem autorização.</li>
                  <li>Fornecer informações verdadeiras e atualizadas nos formulários de contato e orçamento.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">3. Catálogo e Informações</h2>
                <p>
                  Embora nos esforcemos para manter as informações do catálogo precisas e atualizadas, as imagens dos produtos são meramente ilustrativas. As especificações técnicas, disponibilidade e condições comerciais podem sofrer alterações sem aviso prévio. Recomendamos sempre confirmar os detalhes com nossos consultores através dos canais oficiais.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">4. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo deste site, incluindo textos, logotipos (Brasil Hosp), imagens, gráficos e códigos, é de propriedade exclusiva da Brasil Hosp ou de seus parceiros licenciados, sendo protegido pelas leis de direitos autorais e propriedade intelectual do Brasil. A reprodução não autorizada é proibida.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">5. Privacidade de Dados</h2>
                <p>
                  O tratamento de seus dados pessoais é regido pela nossa <strong>Política de Privacidade e LGPD</strong>. Ao utilizar nossos formulários, você consente com a coleta e uso das informações conforme descrito na política específica, disponível no rodapé deste site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">6. Limitação de Responsabilidade</h2>
                <p>
                  A Brasil Hosp não se responsabiliza por danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso deste site, incluindo falhas técnicas, vírus ou interrupções de serviço. O uso das informações contidas aqui é de inteira responsabilidade do usuário.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-secondary">
                <h2 className="text-xl font-bold text-primary mb-2">7. Contato e Foro</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato pelo e-mail <a href="mailto:contato@brasil-hosp.com" className="text-secondary hover:underline">contato@brasil-hosp.com</a> ou telefone (98) 3227-1116.
                </p>
                <p className="mt-4 text-sm">
                  Fica eleito o foro da comarca de São Luís, Maranhão, para dirimir quaisquer dúvidas oriundas deste termo.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;