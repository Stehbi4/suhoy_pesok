export interface Partner {
  name: string;
  shortName: string;
  category: string;
  description: string;
  logo: string;
}

export const partners: Partner[] = [
  {
    name: 'ГК «Росатом»',
    shortName: 'Росатом',
    category: 'Атомная энергетика',
    description: 'Строительство и ремонт объектов ядерного комплекса: АЭС, исследовательские реакторы, хранилища.',
    logo: '/partners/rosatom.svg',
  },
  {
    name: 'Минобороны РФ',
    shortName: 'Минобороны',
    category: 'ВПК и авиация',
    description: 'Ремонт и строительство аэродромов, военных объектов и специальных сооружений.',
    logo: '/partners/minoborony.svg',
  },
  {
    name: 'ПАО «НОВАТЭК»',
    shortName: 'НОВАТЭК',
    category: 'Нефтегаз и Арктика',
    description: 'Арктические составы для экстремальных условий: Арктик СПГ 2, морозостойкость F2600+.',
    logo: '/partners/novatek.svg',
  },
  {
    name: 'ФГУП «Росморпорт»',
    shortName: 'Росморпорт',
    category: 'Порты и ГТС',
    description: 'Подводное бетонирование причальных конструкций. Порт Усть-Луга — с 2005 года.',
    logo: '/partners/rosmorport.svg',
  },
  {
    name: 'ПАО «Транснефть»',
    shortName: 'Транснефть',
    category: 'Нефтегаз',
    description: 'Антикоррозийная защита и ремонт подводных зон причальных сооружений порта Козьмино.',
    logo: '/partners/transneft.svg',
  },
  {
    name: 'ГУП «Петербургский метрополитен»',
    shortName: 'Метрополитен',
    category: 'Транспорт',
    description: 'Инъекционная гидроизоляция тоннелей. Непрерывное сотрудничество с 2000 года.',
    logo: '/partners/metro-spb.svg',
  },
  {
    name: 'ФГБУ «Канал им. Москвы»',
    shortName: 'Канал им. Москвы',
    category: 'Гидротехника',
    description: 'Ремонт исторического бетона шлюзов 1937 года. Торкретирование камер по ТК 19.',
    logo: '/partners/kanal-moskvy.svg',
  },
  {
    name: 'Росавиация',
    shortName: 'Росавиация',
    category: 'Авиация',
    description: 'Сертификация материалов ФАВТ. Реконструкция аэродрома Сочи к Олимпиаде-2014.',
    logo: '/partners/rosaviation.svg',
  },
  {
    name: 'Росморречфлот',
    shortName: 'Росморречфлот',
    category: 'Речной флот',
    description: 'Восстановление Беломорско-Балтийского и Волго-Балтийского каналов.',
    logo: '/partners/rosmorrechflot.svg',
  },
];
