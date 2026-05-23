"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import Link from "next/link";
import {
  ScrollText,
  FileSignature,
  UserCheck,
  ShieldCheck,
  Coins,
  Sparkles,
  Ban,
  AlertTriangle,
  RefreshCw,
  Scale,
  ListChecks,
  ChevronRight,
  Calendar,
  type LucideIcon,
} from "lucide-react";

type Section = {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  intro?: string;
  paragraphs: string[];
  bullets?: string[];
};

const lastUpdate = "22 de maio de 2026";

const sections: Section[] = [
  {
    id: "aceitacao",
    number: "01",
    icon: FileSignature,
    title: "Aceitação dos Termos",
    intro:
      "Ao criar uma conta ou utilizar qualquer ferramenta do Karreify, você concorda integralmente com estes Termos de Uso.",
    paragraphs: [
      "Estes Termos constituem um acordo legal entre você (\"Usuário\") e o Karreify (\"nós\", \"nossa plataforma\"), regulando o acesso e o uso de todos os serviços, ferramentas com inteligência artificial, conteúdos e funcionalidades disponibilizados no site, aplicativo e canais oficiais.",
      "Caso não concorde com qualquer cláusula descrita aqui, recomendamos que você não utilize a plataforma. O uso continuado, mesmo após eventuais atualizações destes Termos, será interpretado como aceitação tácita das novas condições.",
    ],
  },
  {
    id: "elegibilidade",
    number: "02",
    icon: UserCheck,
    title: "Elegibilidade e Conta",
    intro:
      "O Karreify destina-se a maiores de 16 anos. Você é responsável pela segurança da sua conta e pelas informações fornecidas no cadastro.",
    paragraphs: [
      "Para criar uma conta, você precisa fornecer um e-mail válido, uma senha segura e informações verdadeiras. Você é o único responsável por manter a confidencialidade das suas credenciais e por qualquer atividade realizada na sua conta.",
      "Em caso de suspeita de uso indevido, comprometimento da conta ou compartilhamento não autorizado, notifique nossa equipe de suporte imediatamente.",
    ],
    bullets: [
      "Uma conta por pessoa física — múltiplas contas para o mesmo CPF podem ser bloqueadas.",
      "Manteremos verificação por código de e-mail em ações sensíveis (login novo, alteração de senha e de e-mail).",
      "Contas inativas há mais de 24 meses podem ser arquivadas, com aviso prévio por e-mail.",
    ],
  },
  {
    id: "uso-permitido",
    number: "03",
    icon: ShieldCheck,
    title: "Uso Permitido da Plataforma",
    intro:
      "Você pode utilizar todas as ferramentas com IA do Karreify para fins legítimos relacionados à sua carreira pessoal e profissional.",
    paragraphs: [
      "O Karreify oferece análise e criação de currículos, geração de cartas, adaptação para vagas, análise de empresas, busca de oportunidades, mapeamento de mercado e demais recursos descritos no site. Todos esses recursos devem ser utilizados de forma ética, individual e em conformidade com a legislação brasileira.",
    ],
    bullets: [
      "É permitido baixar, editar e compartilhar livremente os documentos gerados na sua própria jornada profissional.",
      "É permitido utilizar os relatórios em entrevistas, candidaturas e processos seletivos.",
      "É permitido sugerir melhorias e enviar feedbacks por meio dos canais oficiais.",
    ],
  },
  {
    id: "uso-proibido",
    number: "04",
    icon: Ban,
    title: "Condutas Proibidas",
    intro:
      "Algumas práticas comprometem a integridade da plataforma e a experiência dos demais usuários. Elas resultam em suspensão ou banimento.",
    paragraphs: [
      "Você concorda em não utilizar o Karreify para nenhuma atividade que viole leis, direitos de terceiros ou os princípios destes Termos.",
    ],
    bullets: [
      "Realizar engenharia reversa, scraping, automação não autorizada ou acesso por meios não oficiais.",
      "Compartilhar a conta, vender créditos ou revender acessos a terceiros.",
      "Inserir conteúdo falso, ofensivo, discriminatório ou em violação à propriedade intelectual.",
      "Utilizar a plataforma para fraudar processos seletivos ou enganar recrutadores.",
      "Tentar comprometer a segurança, disponibilidade ou integridade dos nossos sistemas.",
    ],
  },
  {
    id: "creditos",
    number: "05",
    icon: Coins,
    title: "Créditos, Pagamentos e Reembolso",
    intro:
      "Os créditos são a unidade que dá acesso às ferramentas com IA. As regras de compra, uso e reembolso são transparentes e descritas a seguir.",
    paragraphs: [
      "O custo em créditos por ação é informado antes da utilização. Compras são processadas por gateways de pagamento autorizados e suas notas fiscais são emitidas eletronicamente para o e-mail cadastrado.",
      "Você pode solicitar reembolso integral em até 7 (sete) dias da compra, desde que os créditos adquiridos não tenham sido utilizados. Após esse prazo ou em caso de utilização parcial, eventual reembolso será proporcional ao saldo remanescente, mediante análise.",
    ],
    bullets: [
      "Pagamentos via PIX e cartão são liberados instantaneamente.",
      "Créditos comprados não expiram enquanto a conta estiver ativa.",
      "Pacotes promocionais podem ter validade própria, sempre informada na compra.",
    ],
  },
  {
    id: "ia-conteudo",
    number: "06",
    icon: Sparkles,
    title: "Conteúdo Gerado por IA",
    intro:
      "Nossas ferramentas usam modelos de inteligência artificial de última geração — entenda o que isso significa na prática.",
    paragraphs: [
      "Os resultados gerados (análises, currículos, cartas, relatórios) são produzidos por modelos estatísticos. Embora trabalhemos para entregar o melhor padrão de qualidade, recomendamos sempre revisão humana antes de envio para recrutadores ou empresas.",
      "Você é o autor e responsável final pelo conteúdo enviado a terceiros. O Karreify não garante, presume ou se responsabiliza pelo resultado de processos seletivos, contratações ou decisões profissionais tomadas com base nos materiais gerados.",
    ],
  },
  {
    id: "propriedade",
    number: "07",
    icon: Scale,
    title: "Propriedade Intelectual",
    intro:
      "A marca, identidade visual e tecnologia do Karreify são protegidas. Seus dados e seus documentos continuam sendo seus.",
    paragraphs: [
      "Todo o software, design, layout, logotipo, modelos de currículo, fluxos de IA, código-fonte e materiais da plataforma são de propriedade exclusiva do Karreify e protegidos por leis de direitos autorais, propriedade industrial e tratados internacionais.",
      "Você mantém todos os direitos sobre os dados que insere — incluindo currículos enviados, informações pessoais e textos digitados. Concede ao Karreify apenas a licença operacional necessária para processar, armazenar e exibir seus dados dentro da plataforma.",
    ],
  },
  {
    id: "responsabilidade",
    number: "08",
    icon: AlertTriangle,
    title: "Limitação de Responsabilidade",
    intro:
      "O Karreify se compromete a entregar a melhor experiência possível, mas alguns limites legais precisam ficar claros.",
    paragraphs: [
      "A plataforma é oferecida \"como está\". Apesar dos nossos esforços contínuos para garantir alta disponibilidade e qualidade, não garantimos que o serviço estará isento de erros, interrupções, indisponibilidades pontuais ou inconsistências eventuais.",
      "Em nenhuma hipótese o Karreify responderá por lucros cessantes, danos indiretos, perda de oportunidades profissionais, decisões de contratação por terceiros ou prejuízos decorrentes de uso indevido da plataforma pelo Usuário.",
    ],
  },
  {
    id: "encerramento",
    number: "09",
    icon: RefreshCw,
    title: "Suspensão e Encerramento",
    intro:
      "Você pode encerrar sua conta a qualquer momento. Nós também reservamos o direito de suspender contas em casos específicos.",
    paragraphs: [
      "Você pode solicitar a exclusão completa da sua conta diretamente em \"Configurações\". Os dados serão removidos em até 48h, em conformidade com a LGPD, exceto registros que devemos manter por obrigação legal.",
      "Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos, a legislação aplicável ou que coloquem em risco a segurança da plataforma ou de outros usuários, sem prejuízo das demais medidas legais cabíveis.",
    ],
  },
  {
    id: "alteracoes",
    number: "10",
    icon: ScrollText,
    title: "Alterações nos Termos",
    intro:
      "Estes Termos podem ser atualizados sempre que necessário. Você será sempre informado.",
    paragraphs: [
      "Sempre que houver alterações relevantes, publicaremos uma nova versão neste mesmo endereço e enviaremos comunicação por e-mail para os usuários ativos. Em caso de mudanças substanciais, podemos solicitar nova aceitação expressa antes da continuidade do uso.",
      "Recomendamos a leitura periódica desta página para acompanhar atualizações sobre funcionalidades novas, regras de créditos ou ajustes operacionais.",
    ],
  },
  {
    id: "foro",
    number: "11",
    icon: Scale,
    title: "Lei Aplicável e Foro",
    intro:
      "Estes Termos são regidos pelas leis da República Federativa do Brasil.",
    paragraphs: [
      "Eventuais controvérsias serão dirimidas no foro da Comarca de São Paulo/SP, ressalvado o direito do Usuário consumidor de optar pelo foro do seu domicílio, nos termos da legislação aplicável.",
    ],
  },
];

function Particles({ count = 6 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = 4 + (i % 3) * 3;
    const left = (i * 17) % 100;
    const top = (i * 23) % 100;
    const delay = (i % 6) * 2;
    return { size, left, top, delay, key: i };
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.key}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function TermsPage() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const top = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (top / height) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 via-accent-violet to-accent-cyan transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ========== HERO ========== */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 noise-overlay">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="orb w-[600px] h-[600px] bg-primary-600 -top-[200px] -right-[200px] animate-pulse-glow" />
        <div className="orb w-[400px] h-[400px] bg-accent-violet -bottom-[100px] -left-[100px] animate-pulse-glow animation-delay-500" />
        <Particles count={7} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold tracking-wide animate-fade-in-up animation-delay-100">
            <ScrollText className="w-3.5 h-3.5" />
            TERMOS DE USO
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] animate-fade-in-up animation-delay-200">
            Regras claras para uma <span className="gradient-text">parceria de confiança</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            Estes Termos descrevem como funciona o uso da plataforma Karreify,
            seus direitos como usuário e nossos compromissos com você.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full glass animate-fade-in-up animation-delay-400">
            <Calendar className="w-4 h-4 text-primary-300" />
            <span className="text-xs text-gray-300">
              Última atualização: <strong className="text-white">{lastUpdate}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="relative py-16 lg:py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Sidebar — Index */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24">
                <ScrollReveal direction="up">
                  <div className="glass-card !rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary-300 uppercase tracking-wider mb-4">
                      <ListChecks className="w-4 h-4" />
                      Sumário
                    </div>
                    <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                      {sections.map((s) => {
                        const active = activeId === s.id;
                        return (
                          <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`group flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                              active
                                ? "bg-primary-500/10 text-white border-l-2 border-primary-400"
                                : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold mt-0.5 transition-colors ${
                                active ? "text-primary-300" : "text-gray-600 group-hover:text-primary-400"
                              }`}
                            >
                              {s.number}
                            </span>
                            <span className="leading-snug">{s.title}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 ml-auto mt-0.5 flex-shrink-0 transition-all ${
                                active
                                  ? "text-primary-300 translate-x-0.5"
                                  : "text-gray-700 group-hover:text-primary-300"
                              }`}
                            />
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </ScrollReveal>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-10">
              {sections.map((s, i) => (
                <ScrollReveal key={s.id} direction="up" delay={i * 40}>
                  <article
                    id={s.id}
                    ref={(el) => {
                      sectionRefs.current[s.id] = el;
                    }}
                    data-section-id={s.id}
                    className="glass-card !rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-primary-500/30 transition-colors duration-500"
                  >
                    <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-violet/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-violet/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                          <s.icon className="w-5 h-5 text-primary-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-primary-400 tracking-widest">
                            SEÇÃO {s.number}
                          </div>
                          <h2 className="mt-1 text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                            {s.title}
                          </h2>
                        </div>
                      </div>

                      {s.intro && (
                        <p className="text-base text-gray-300 leading-relaxed border-l-2 border-primary-500/40 pl-4 mb-5 italic">
                          {s.intro}
                        </p>
                      )}

                      <div className="space-y-4">
                        {s.paragraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className="text-[15px] sm:text-base text-gray-400 leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {s.bullets && (
                        <ul className="mt-5 space-y-2.5">
                          {s.bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm sm:text-[15px] text-gray-300"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-accent-violet flex-shrink-0" />
                              <span className="leading-relaxed">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}

              {/* Contact form */}
              <ScrollReveal direction="up">
                <ContactForm
                  topic="terms"
                  badge="Time jurídico"
                  title="Dúvidas sobre os Termos?"
                  description="Quer esclarecer alguma cláusula, reportar uma inconsistência ou sugerir melhorias? Fale com a gente."
                  presetSubjects={[
                    "Esclarecimento de cláusula",
                    "Reembolso e cobrança",
                    "Uso indevido",
                    "Propriedade intelectual",
                    "Outro assunto",
                  ]}
                  successMessage="Recebemos sua mensagem. Nosso time jurídico vai responder por e-mail em breve."
                />
                <div className="mt-6 text-center">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Ver Política de Privacidade
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
