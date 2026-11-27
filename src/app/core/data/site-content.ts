import { TESTIMONIALS_CONFIG } from './testimonials';

/**
 * Conteúdo do site, centralizado e tipado.
 *
 * Regra (AGENTS.md §6): NADA de dado inventado. Tudo que ainda não foi confirmado
 * fica como `null` com um comentário `TODO(...)`. Os componentes escondem o que for `null`.
 */

export interface OpeningHours {
  /** Dias no formato schema.org, ex.: ['Monday', 'Tuesday'] */
  days: readonly string[];
  /** Texto exibido, ex.: 'Segunda a sexta' */
  label: string;
  opens: string; // '09:00'
  closes: string; // '18:00'
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Treatment {
  id: string;
  icon: 'tooth' | 'implant' | 'sparkle' | 'bridge';
  name: string;
  /** Nome usado na mensagem do WhatsApp e no formulário */
  shortName: string;
  description: string;
  featured?: boolean;
  /** Link interno opcional (ex.: seção de implantes) */
  moreHref?: string;
  moreLabel?: string;
  /** Nome do procedimento para o schema.org (MedicalProcedure) */
  schemaName: string;
}

export interface Step {
  number: string;
  title: string;
  text: string;
}

export interface Pillar {
  icon: 'chat' | 'list' | 'leaf' | 'pin';
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SITE = {
  /** TODO(domínio): URL de produção, sem barra no final. Ex.: 'https://www.suaclinica.com.br' */
  url: null as string | null,
  lang: 'pt-BR',
  themeColor: '#123f3d',
  ogImage: '/og-image.jpg',
  /** TODO(seo): incluir nome da clínica, bairro e cidade quando forem definidos. */
  title: 'Dentista | Nome da Clínica',
  description:
    'Implantes dentários, clareamento, próteses e clínica geral com atendimento humanizado. Cada etapa explicada com calma. Agende sua avaliação.',
} as const;

/** TODO(clínica): nome e registro EPAO reais. Tudo abaixo é placeholder. */
export const CLINIC = {
  name: 'Nome da Clínica',
  displayName: 'Nome da Clínica',
  epao: 'EPAO CRO-UF 0000',
} as const;

/** TODO(profissional): nome, título e CRO reais do(a) responsável técnico(a). Placeholders. */
export const DENTIST = {
  name: 'Dr(a). Nome Sobrenome',
  schemaName: 'Nome Sobrenome',
  title: 'Cirurgião(ã)-Dentista',
  cro: 'CRO-UF 00000',
  specialty: {
    /**
     * TODO(especialidade): só marque `true` com a especialidade em Implantodontia
     * registrada no CRO e preencha `rqe`. Até lá, o site diz "Atuação em implantes dentários".
     */
    registered: false,
    rqe: null as string | null,
    registeredLabel: 'Especialista em Implantodontia',
    defaultLabel: 'Atuação em implantes dentários',
  },
  /** TODO(formação): graduação, especializações e cursos, como o(a) profissional quiser exibir. */
  education: null as readonly string[] | null,
} as const;

export const specialtyLabel = (): string =>
  DENTIST.specialty.registered && DENTIST.specialty.rqe
    ? `${DENTIST.specialty.registeredLabel} — RQE ${DENTIST.specialty.rqe}`
    : DENTIST.specialty.defaultLabel;

export const CONTACT = {
  /** TODO(whatsapp): só dígitos, com DDI e DDD. Ex.: '5500900000000' */
  whatsapp: null as string | null,
  /** TODO(telefone): como deve aparecer no site. Ex.: '(00) 00000-0000' */
  phoneDisplay: null as string | null,
  /** TODO(telefone): formato E.164 para o schema e o link tel:. Ex.: '+5500900000000' */
  phoneE164: null as string | null,
  /** TODO(e-mail) */
  email: null as string | null,
  /** TODO(instagram): URL completa do perfil */
  instagram: null as string | null,
  /** TODO(google): link do perfil no Google (avaliações) */
  googleProfileUrl: null as string | null,
  /** TODO(google): nota real no Google, ex.: 5.0 — só exibida se preenchida */
  googleRating: null as number | null,
  /** TODO(google): número real de avaliações */
  googleReviewCount: null as number | null,
  whatsappDefaultMessage: 'Olá! Gostaria de agendar uma avaliação.',
} as const;

/** TODO(endereço): endereço real. Enquanto `mapsQuery` for null, o mapa e as rotas ficam ocultos. */
export const ADDRESS = {
  mall: 'Endereço pendente',
  /** TODO(endereço): número da loja/sala */
  unit: null as string | null,
  /** TODO(endereço): piso */
  floor: null as string | null,
  /** TODO(endereço): logradouro e número do shopping */
  street: null as string | null,
  /** TODO(endereço): CEP */
  postalCode: null as string | null,
  neighborhood: 'Bairro',
  city: 'Cidade',
  region: 'UF',
  country: 'BR',
  /** TODO(endereço): coordenadas do Google Business Profile */
  geo: null as { lat: number; lng: number } | null,
  /** TODO(endereço): texto de busca no Google Maps. Ex.: 'Rua Exemplo, 100, Cidade - UF' */
  mapsQuery: null as string | null,
} as const;

/** TODO(horário): preencher com o horário real. Ex.: [{ days: ['Monday', ...], label: 'Segunda a sexta', opens: '09:00', closes: '18:00' }] */
export const OPENING_HOURS: readonly OpeningHours[] | null = null;

/** TODO(convênios): lista de convênios aceitos (ou `[]` se for só particular). Fora da página até confirmar. */
export const INSURANCE: readonly string[] | null = null;

/** TODO(formulário): endpoint que recebe o formulário de contato (POST JSON). */
export const CONTACT_FORM_ENDPOINT: string | null = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const whatsappUrl = (message: string = CONTACT.whatsappDefaultMessage): string | null =>
  CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}` : null;

export const treatmentMessage = (shortName: string): string =>
  `Olá! Gostaria de agendar uma avaliação sobre ${shortName}.`;

export const addressLine = (): string => {
  const parts: string[] = [ADDRESS.mall];
  if (ADDRESS.unit) parts.push(`Loja ${ADDRESS.unit}`);
  if (ADDRESS.floor) parts.push(ADDRESS.floor);
  return parts.join(' · ');
};

export const cityLine = (): string =>
  `${ADDRESS.neighborhood}, ${ADDRESS.city} – ${ADDRESS.region}`;

export const mapsDirectionsUrl = (): string | null =>
  ADDRESS.mapsQuery
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS.mapsQuery)}`
    : null;

export const wazeUrl = (): string | null =>
  ADDRESS.mapsQuery
    ? `https://waze.com/ul?q=${encodeURIComponent(ADDRESS.mapsQuery)}&navigate=yes`
    : null;

export const mapsEmbedUrl = (): string | null =>
  ADDRESS.mapsQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS.mapsQuery)}&output=embed&hl=pt-BR`
    : null;

// ---------------------------------------------------------------------------
// Navegação
// ---------------------------------------------------------------------------

export const NAV: readonly NavItem[] = (
  [
    { id: 'sobre', label: 'Sobre' },
    { id: 'tratamentos', label: 'Tratamentos' },
    { id: 'implantes', label: 'Implantes' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'duvidas', label: 'Dúvidas' },
    { id: 'contato', label: 'Contato' },
  ] satisfies NavItem[]
).filter((item) => item.id !== 'depoimentos' || TESTIMONIALS_CONFIG.enabled);

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------

export const HERO = {
  statementStart: 'Cuidar do seu sorriso',
  statementAccent: 'começa com escuta.',
  subtitle:
    'Atendimento humanizado e especializado, com destaque para implantes dentários. Cada etapa é explicada com calma, no seu tempo.',
  primaryCta: 'Agendar avaliação',
  secondaryCta: 'Conhecer os tratamentos',
  badgeText: 'Odontologia · Atendimento humanizado · Cuidado · ',
} as const;

export const ABOUT = {
  title: 'Um consultório pensado para quem quer ser ouvido',
  paragraphs: [
    'Aqui, cada consulta começa por uma conversa: queremos entender o que você sente, o que espera do tratamento e o que te preocupa.',
    'Muita gente chega com receio de dentista — e tudo bem. Por isso, explicamos cada etapa antes de começar, respeitamos o seu ritmo e combinamos juntos os próximos passos.',
  ],
  values: [
    {
      title: 'Escuta antes de tudo',
      text: 'O tratamento começa entendendo você, não só os seus dentes.',
    },
    { title: 'Explicação clara', text: 'Você sabe o que vai acontecer em cada etapa, sem jargão.' },
    { title: 'Respeito ao seu tempo', text: 'Pausas, perguntas e dúvidas são sempre bem-vindas.' },
  ],
} as const;

export const TREATMENTS_INTRO = {
  title: 'Cuidado completo, do check-up ao implante',
  lead: 'Tratamentos planejados a partir de uma avaliação cuidadosa, sempre com explicação clara das opções para o seu caso.',
} as const;

export const TREATMENTS: readonly Treatment[] = [
  {
    id: 'clinica-geral',
    icon: 'tooth',
    name: 'Clínica geral',
    shortName: 'clínica geral',
    description:
      'Consultas, prevenção e diagnóstico para cuidar da saúde da boca como um todo, com orientações claras para o dia a dia.',
    schemaName: 'Clínica geral odontológica',
  },
  {
    id: 'implantes-dentarios',
    icon: 'implant',
    name: 'Implantes dentários',
    shortName: 'implantes dentários',
    description:
      'Reposição de dentes perdidos com implantes, planejada a partir da avaliação e dos exames do seu caso. É o foco do consultório.',
    featured: true,
    moreHref: '#implantes',
    moreLabel: 'Entender as etapas',
    schemaName: 'Implante dentário',
  },
  {
    id: 'clareamento-dental',
    icon: 'sparkle',
    name: 'Clareamento dental',
    shortName: 'clareamento dental',
    description:
      'Clareamento com acompanhamento profissional, indicado depois de avaliar a saúde dos dentes e da gengiva.',
    schemaName: 'Clareamento dental',
  },
  {
    id: 'dentaduras-e-pontes',
    icon: 'bridge',
    name: 'Dentaduras e pontes',
    shortName: 'dentaduras e pontes',
    description:
      'Próteses dentárias para devolver função e conforto ao mastigar, falar e sorrir, planejadas de acordo com o seu caso.',
    schemaName: 'Prótese dentária (dentaduras e pontes)',
  },
];

export const IMPLANTS = {
  title: 'Implante dentário, passo a passo',
  lead: 'O implante é uma pequena peça, geralmente de titânio, colocada no osso para substituir a raiz de um dente perdido. Sobre ele é instalada a prótese, que faz o papel do novo dente. Conhecer o caminho ajuda a chegar mais tranquilo a cada consulta.',
  forWhomTitle: 'Para quem é indicado?',
  forWhomText:
    'Para quem perdeu um ou mais dentes e tem condições de saúde geral e bucal adequadas, o que é confirmado na avaliação e nos exames. Cada caso é avaliado individualmente.',
  steps: [
    {
      number: '01',
      title: 'Avaliação e exames',
      text: 'Conversa, exame clínico e exames de imagem para entender a saúde da sua boca e do osso.',
    },
    {
      number: '02',
      title: 'Planejamento',
      text: 'Com os exames em mãos, o tratamento é planejado e explicado a você: etapas, cuidados e o que esperar.',
    },
    {
      number: '03',
      title: 'Instalação do implante',
      text: 'O implante é instalado com anestesia local, em um procedimento planejado para o seu conforto.',
    },
    {
      number: '04',
      title: 'Cicatrização',
      text: 'É a osseointegração: o período em que o osso se une ao implante. O tempo varia de pessoa para pessoa e é acompanhado de perto.',
    },
    {
      number: '05',
      title: 'Prótese sobre o implante',
      text: 'Com o implante integrado, é feita a coroa ou prótese que devolve forma e função ao sorriso.',
    },
    {
      number: '06',
      title: 'Acompanhamento',
      text: 'Consultas de revisão e orientações de higiene ajudam a manter o implante saudável ao longo do tempo.',
    },
  ] satisfies Step[],
  cta: 'Agendar avaliação para implante',
} as const;

export const PILLARS_INTRO = {
  title: 'Por que escolher a clínica',
  lead: 'Um jeito de cuidar que coloca você no centro, do primeiro contato ao acompanhamento.',
} as const;

export const PILLARS: readonly Pillar[] = [
  {
    icon: 'chat',
    title: 'Escuta e acolhimento',
    text: 'Tempo para conversar, entender suas queixas e acolher receios, inclusive de quem tem medo de dentista.',
  },
  {
    icon: 'list',
    title: 'Cada etapa explicada',
    text: 'Você entende o porquê de cada procedimento e participa das decisões sobre o seu tratamento.',
  },
  {
    icon: 'leaf',
    title: 'Ambiente aconchegante',
    text: 'Um consultório tranquilo e acolhedor, pensado para que você se sinta à vontade.',
  },
  {
    icon: 'pin',
    title: 'Localização prática',
    text: 'Um endereço de fácil acesso, para encaixar o cuidado com o sorriso na sua rotina.',
  },
];

export const FIRST_VISIT = {
  title: 'Como funciona, sem surpresas',
  lead: 'Nunca veio ou faz tempo que não vai ao dentista? Veja o passo a passo.',
  steps: [
    {
      number: '01',
      title: 'Agendamento',
      text: 'Você manda uma mensagem pelo WhatsApp ou pelo formulário, escolhe o melhor horário e tira dúvidas antes de vir.',
    },
    {
      number: '02',
      title: 'Avaliação',
      text: 'Conversamos sobre o seu histórico e o que te incomoda, e o exame é feito com calma.',
    },
    {
      number: '03',
      title: 'Plano explicado',
      text: 'Você conhece as opções indicadas para o seu caso, com cada etapa explicada de forma clara.',
    },
    {
      number: '04',
      title: 'Início do tratamento',
      text: 'Com tudo entendido e combinado, o tratamento começa no seu ritmo.',
    },
  ] satisfies Step[],
} as const;

export const LOCATION = {
  title: 'Onde estamos',
  lead: 'Um endereço prático para cuidar do sorriso sem complicar a rotina.',
  mapTitle: 'Mapa com a localização da clínica',
} as const;

export const FAQ_INTRO = {
  title: 'Perguntas que costumamos ouvir',
} as const;

export const FAQ: readonly FaqItem[] = [
  {
    question: 'Implante dentário dói?',
    answer:
      'O implante é instalado com anestesia local, e o procedimento é planejado para ser o mais confortável possível. Depois, é comum sentir algum desconforto ou inchaço nos primeiros dias, que costuma ser controlado com as orientações e as medicações indicadas na consulta. A sensação varia de pessoa para pessoa: cada caso é avaliado individualmente.',
  },
  {
    question: 'Quem pode fazer implante?',
    answer:
      'Em geral, adultos que perderam um ou mais dentes e têm boa saúde geral e bucal. Algumas condições, como diabetes não controlada, tabagismo ou pouca quantidade de osso, pedem cuidados extras ou etapas adicionais. A indicação só é feita depois da avaliação e dos exames: cada caso é avaliado individualmente.',
  },
  {
    question: 'Clareamento dental enfraquece os dentes?',
    answer:
      'Quando bem indicado e acompanhado por um profissional, o clareamento não enfraquece os dentes. Pode haver sensibilidade temporária durante o tratamento, que é acompanhada e orientada. Antes de clarear, é importante avaliar a saúde dos dentes e da gengiva: cada caso é avaliado individualmente.',
  },
  {
    question: 'Qual a diferença entre dentadura, ponte e implante?',
    answer:
      'A dentadura é uma prótese removível que substitui vários ou todos os dentes e pode ser retirada para a higiene. A ponte é uma prótese fixa apoiada nos dentes vizinhos. O implante substitui a raiz do dente e serve de base para uma coroa, uma ponte ou até para fixar uma dentadura. A melhor opção depende da sua saúde bucal, da quantidade de osso e das suas expectativas: cada caso é avaliado individualmente.',
  },
  {
    question: 'Com que frequência devo ir ao dentista?',
    answer:
      'De modo geral, recomenda-se uma consulta de rotina a cada seis meses, mas o intervalo ideal pode ser menor ou maior conforme a sua saúde bucal. Na avaliação, indicamos a frequência mais adequada para você: cada caso é avaliado individualmente.',
  },
  {
    question: 'Tenho medo de dentista. Como é o atendimento?',
    answer:
      'Esse receio é muito comum. Aqui, tudo é explicado antes de acontecer, você pode fazer perguntas a qualquer momento e podemos combinar pausas sempre que precisar. O atendimento se adapta a você: cada caso é avaliado individualmente.',
  },
  {
    question: 'Como agendar uma avaliação?',
    answer:
      'É só enviar uma mensagem pelo WhatsApp ou preencher o formulário de contato desta página para combinarmos o melhor dia e horário. Na primeira consulta, conversamos com você e fazemos a avaliação: cada caso é avaliado individualmente.',
  },
];

export const CONTACT_SECTION = {
  title: 'Vamos conversar sobre o seu sorriso?',
  lead: 'Mande uma mensagem pelo WhatsApp ou deixe seus dados que retornamos para combinar o melhor horário para a sua avaliação.',
  formTitle: 'Prefere que a gente entre em contato?',
  interestOptions: [
    'Clínica geral',
    'Implantes dentários',
    'Clareamento dental',
    'Dentaduras e pontes',
    'Ainda não sei',
  ],
  periodOptions: ['Manhã', 'Tarde', 'Sem preferência'],
} as const;
