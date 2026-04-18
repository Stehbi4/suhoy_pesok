export interface City {
  name: string;
  note: string;
  isHQ?: boolean;
}

export interface Industry {
  label: string;
  pct:   number;
  color: string;
  glow:  string;
}

export const cities: City[] = [
  { name: 'Санкт-Петербург', note: 'производство, головной офис', isHQ: true },
  { name: 'Курск',           note: 'энергетическое строительство' },
  { name: 'Краснодар',       note: 'юг России'    },
  { name: 'Батайск',         note: 'южный регион' },
  { name: 'Самара',          note: 'Поволжье'     },
  { name: 'Екатеринбург',    note: 'Урал'         },
  { name: 'Новосибирск',     note: 'Сибирь'       },
  { name: 'Барнаул',         note: 'Алтайский край' },
];

export const industries: Industry[] = [
  { label: 'Прочие',     pct: 35, color: '#94a3b8', glow: 'rgba(148,163,184,0.5)' },
  { label: 'Энергетика', pct: 15, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)'  },
  { label: 'ГТС',        pct: 15, color: '#38bdf8', glow: 'rgba(56,189,248,0.5)'  },
  { label: 'Атомная',    pct: 12, color: '#34d399', glow: 'rgba(52,211,153,0.5)'  },
  { label: 'ВПК',        pct: 12, color: '#f80000', glow: 'rgba(248,0,0,0.5)'     },
  { label: 'Транспорт',  pct: 11, color: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
];
