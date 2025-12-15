// Site Configuration
export const SITE_CONFIG = {
  name: "Parroquia del Inmaculado Corazón de María",
  shortName: "ParroquiaICM",
  description: "Administrada por los Misioneros Claretianos. Miraflores - Arequipa",
  phone: "(054) 253-280",
  whatsapp: "932408576",
  email: "icmpamiraflores@gmail.com",
  address: "Calle Tacna 540 - A, Miraflores - Arequipa - Perú",
  postalBox: "550",
};

// Social Links
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=100064383386052",
  youtube: "https://www.youtube.com/channel/UCKgN4YP_cOQd4LQYV1Ey5nw",
  instagram: "https://www.instagram.com/picmaqp2023",
  facebookLive: "https://web.facebook.com/parroquia.miraflores.arequipa/live/",
};

// Navigation Items
export const NAV_ITEMS = [
  { name: "Inicio", href: "/" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Horarios", href: "/horarios" },
  { name: "Servicios", href: "/servicios" },
  { name: "Galería", href: "/galeria" },
  { name: "Contáctanos", href: "/contacto" },
];

// Mass Schedule
export const MASS_SCHEDULE = {
  weekdays: {
    morning: ["6:00 a.m.", "7:00 a.m.", "9:00 a.m."],
    afternoon: ["7:00 p.m."],
  },
  saturdays: {
    morning: ["6:00 a.m.", "7:00 a.m.", "9:00 a.m."],
    afternoon: ["6:00 p.m."],
  },
  sundays: {
    morning: ["7:00 a.m.", "9:00 a.m.", "11:00 a.m."],
    afternoon: ["6:00 p.m."],
  },
  chapels: {
    santaRosa: { 
      name: "Capilla Sta. Rosa de Lima",
      address: "Jr. José Sabogal 1111 - Umacollo",
      weekdays: ["7:00 a.m.", "6:30 p.m."],
      sundays: ["7:00 a.m.", "6:30 p.m."],
    },
  },
};

// Office Hours
export const OFFICE_HOURS = {
  weekdays: {
    morning: { start: "8:00 a.m.", end: "12:30 p.m." },
    afternoon: { start: "4:00 p.m.", end: "6:30 p.m." },
  },
  saturday: {
    morning: { start: "9:00 a.m.", end: "12:00 m." },
  },
};

// Mass Pricing (for reservation system)
export const MASS_PRICING = {
  simple: 30,
  novenario: 270,
  caboAno: 30,
  communal: 10,
  regular: 40,
  withGuitar: 60,
  withOrgan: 80,
  withOrganDuo: 90,
};

// Payment Information
export const PAYMENT_INFO = {
  banco: "BCP",
  cuenta: "21598690368035",
  cci: "00221519869036803522",
  titular: "Parroquia Inmaculado Corazón de María",
  bcp: {
    accountNumber: "21598690368035",
    cci: "00221519869036803522",
    holder: "Parroquia Inmaculado Corazón de María",
  },
  paypal: "picmpaypal@gmail.com",
  yape: "964486230",
};

// Parish Groups Categories
export const GROUP_CATEGORIES = [
  { id: "parroquiales", name: "Grupos Parroquiales" },
  { id: "eclesiales", name: "Grupos Eclesiales" },
  { id: "congregacionales", name: "Grupos Congregacionales" },
];

// Hero Slides Data
export const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2000",
    title: "Parroquia:",
    subtitle: "Del Inmaculado Corazón de María",
    description: "Misioneros Claretianos - Miraflores, Arequipa",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2000",
    title: "Bienvenidos",
    subtitle: "A Nuestra Comunidad",
    description: "Un lugar de fe, esperanza y amor",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2000",
    title: "Celebremos",
    subtitle: "Nuestra Fe Juntos",
    description: "Misas diarias y dominicales",
  },
];

// External Links
export const EXTERNAL_LINKS = {
  pastoral: {
    facebook: "https://www.facebook.com/304617059718037/",
    tiktok: "https://vm.tiktok.com/ZMeH3WUYy/",
    instagram: "https://instagram.com/pjvc.aqp",
  },
  peruBolivia: {
    website: "http://www.claretianosperubolivia.org",
    parroquias: "https://www.facebook.com/Red-de-Parroquias-Claretianas-PeruBolivia",
    juvenil: "https://www.facebook.com/cmfpjperubolivia/",
    familiar: "https://www.facebook.com/Pastoral-Familiar-Provincial-Claretiana",
    claretWay: "http://www.claret.org/es/claret_way-red-mundial-de-jovenes-claretianos",
  },
  interest: {
    vatican: "http://www.vatican.va/content/vatican/es.html",
    claretianos: "http://www.claret.org/es/",
    arzobispado: "http://www.arzobispadoarequipa.org.pe",
  },
};
