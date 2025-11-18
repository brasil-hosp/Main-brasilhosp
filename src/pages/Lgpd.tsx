import { useEffect } from "react";

// ⚠️ MANTENHA OS IMPORTS QUE JÁ ESTÃO FUNCIONANDO NO SEU ARQUIVO!
// (Navbar e Footer que você copiou do Index.tsx)
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

const Lgpd = () => {
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
                Política de Privacidade e LGPD
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
              <p className="mt-4 text-muted-foreground">
                Transparência, segurança e compromisso com a proteção dos seus dados.
              </p>
            </div>

            {/* Conteúdo do Texto */}
            <div className="space-y-8 text-foreground/80 leading-relaxed text-justify">
              
              {/* 1. Introdução */}
              <div className="bg-card p-8 rounded-xl shadow-sm border border-border/50">
                <h2 className="text-2xl font-bold text-secondary mb-4">1. Introdução</h2>
                <p>
                  A <strong>BRASIL HOSP PRODUTOS MÉDICOS E HOSPITALARES LTDA.</strong> (CNPJ: 15.377.501/0001-69), com sede na Avenida Ana Jansen, 1040, São Francisco, São Luís - MA, valoriza a privacidade de seus usuários, clientes, fornecedores e colaboradores. Esta política demonstra nosso compromisso com a proteção de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
                </p>
              </div>

              {/* 2. Coleta de Dados */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">2. Que dados coletamos?</h2>
                <p className="mb-3">
                  Coletamos informações fornecidas de forma consciente e voluntária para a prestação de nossos serviços. Os dados podem incluir:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li><strong>Dados de Identificação:</strong> Nome completo.</li>
                  <li><strong>Contato:</strong> E-mail e número de telefone.</li>
                  <li><strong>Corporativo:</strong> Nome da empresa em que trabalha (para clientes B2B).</li>
                </ul>
              </div>

              {/* 3. Finalidade */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">3. Como usamos seus dados?</h2>
                <p>Os dados coletados têm finalidades específicas e legítimas:</p>
                <ul className="grid gap-4 mt-4 md:grid-cols-2">
                  <li className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <strong className="text-foreground">Atendimento (SAC):</strong> Para responder a solicitações, dúvidas e fornecer suporte através de nossos canais de contato.
                  </li>
                  <li className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <strong className="text-foreground">Acesso a Serviços:</strong> Para cadastro e login em nossas plataformas e sistemas contratados.
                  </li>
                  <li className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <strong className="text-foreground">Comunicação:</strong> Envio de newsletters, promoções e notícias relevantes (mediante consentimento).
                  </li>
                  <li className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <strong className="text-foreground">Obrigação Legal:</strong> Cumprimento de legislações e regulações aplicáveis ao setor.
                  </li>
                </ul>
              </div>

              {/* 4. Armazenamento e Segurança */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">4. Segurança e Armazenamento</h2>
                <p>
                  As informações são armazenadas em servidores próprios ou em nuvem de fornecedores contratados. Adotamos medidas de segurança técnicas e administrativas, como controle de acesso restrito e compromisso de sigilo, para proteger seus dados contra acessos não autorizados.
                </p>
              </div>

              {/* 5. Compartilhamento */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">5. Compartilhamento de Dados</h2>
                <p>
                  A Brasil Hosp não comercializa seus dados. O compartilhamento ocorre apenas quando estritamente necessário, como:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li>Para propósitos administrativos e entrega de serviços contratados.</li>
                  <li>Com parceiros logísticos e tecnológicos essenciais para a operação.</li>
                  <li>Para cumprimento de obrigação legal ou ordem judicial.</li>
                </ul>
              </div>

               {/* 6. Cookies */}
               <div>
                <h2 className="text-2xl font-bold text-primary mb-3">6. Política de Cookies</h2>
                <p className="mb-2">Utilizamos cookies para melhorar sua experiência e o desempenho do site:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li><strong>Necessários:</strong> Essenciais para o funcionamento do site e áreas seguras.</li>
                  <li><strong>Funcionais:</strong> Lembram suas escolhas para personalizar a experiência.</li>
                  <li><strong>Marketing:</strong> Fornecem conteúdo relevante e medem a eficácia de campanhas.</li>
                </ul>
                <p className="text-sm mt-2 text-muted-foreground">Você pode gerenciar ou desativar os cookies nas configurações do seu navegador a qualquer momento.</p>
              </div>

              {/* 7. Direitos do Titular */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">7. Seus Direitos</h2>
                <p>Conforme a LGPD, você tem direito a:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-muted-foreground">
                  <li>Confirmar a existência de tratamento e acessar seus dados.</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                  <li>Revogar o consentimento a qualquer momento.</li>
                </ul>
              </div>

              {/* 8. Contato DPO */}
              <div className="bg-secondary/10 p-8 rounded-lg border-l-4 border-secondary mt-8">
                <h2 className="text-xl font-bold text-secondary mb-4">Encarregado de Dados (DPO)</h2>
                <p className="mb-4">
                  Para exercer seus direitos, tirar dúvidas ou fazer solicitações sobre nossa política de privacidade, entre em contato com nosso canal oficial:
                </p>
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <span className="font-bold block text-primary">E-mail:</span>
                    <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contato@brasil-hosp.com" className="text-muted-foreground hover:text-secondary transition-colors">
                      contato@brasil-hosp.com
                    </a>
                  </div>
                  <div>
                    <span className="font-bold block text-primary">Telefone:</span>
                    <a href="tel:+559832271116" className="text-muted-foreground hover:text-secondary transition-colors">
                      (98) 3227-1116
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Endereço: Av. Ana Jansen, 1040 - São Francisco, São Luís - MA.
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

export default Lgpd;