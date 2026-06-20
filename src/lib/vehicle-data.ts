
export type Translation = {
  ar: string;
  en: string;
};

export type VehicleType = {
  id: string;
  label: Translation;
  brands: string[];
};

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "passenger",
    label: { ar: "سيارة سياحية", en: "Passenger Car" },
    brands: ["Renault", "Peugeot", "Volkswagen", "Toyota", "Hyundai", "Kia", "Dacia", "Mercedes-Benz", "BMW", "Audi", "Fiat", "Citroen", "Ford", "Opel", "Nissan", "Suzuki", "Seat", "Skoda"]
  },
  {
    id: "commercial",
    label: { ar: "سيارة نفعية", en: "Light Commercial Vehicle" },
    brands: ["Renault", "Peugeot", "Citroen", "Fiat", "Volkswagen", "Toyota", "Nissan", "Hyundai", "Iveco", "Mercedes-Benz"]
  },
  {
    id: "small_truck",
    label: { ar: "شاحنة صغيرة", en: "Small Truck" },
    brands: ["JAC", "JMC", "Foton", "Dongfeng", "Changan", "Hyundai", "Kia", "Toyota", "DFSK"]
  },
  {
    id: "heavy_truck",
    label: { ar: "شاحنة كبيرة", en: "Heavy Truck" },
    brands: ["Renault Trucks", "Volvo Trucks", "Scania", "MAN", "Mercedes-Benz", "DAF", "Iveco", "Shacman", "FAW", "Sinotruk"]
  },
  {
    id: "bus",
    label: { ar: "حافلة", en: "Bus" },
    brands: ["Higer", "Yutong", "Toyota", "Hyundai", "Iveco", "Mercedes-Benz", "King Long", "Ankai"]
  },
  {
    id: "tractor",
    label: { ar: "جرار فلاحي", en: "Agricultural Tractor" },
    brands: ["Massey Ferguson", "John Deere", "New Holland", "Case IH", "Class", "Kubota", "Cirta", "Deutz-Fahr"]
  },
  {
    id: "machine",
    label: { ar: "آلة أشغال", en: "Construction Machine" },
    brands: ["Caterpillar", "Komatsu", "JCB", "Liebherr", "Case", "Volvo", "Hyundai", "Doosan", "Hidromek"]
  },
  {
    id: "motorcycle",
    label: { ar: "دراجة نارية", en: "Motorcycle" },
    brands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "BMW", "KTM", "SYM", "VMS", "Zontes"]
  }
];

export const BRAND_MODELS: Record<string, string[]> = {
  "Renault": ["Clio I", "Clio II", "Clio III", "Clio IV", "Clio V", "Symbol", "Megane", "Kangoo", "Master", "Captur", "Kadjar", "Koleos"],
  "Peugeot": ["206", "207", "208", "301", "307", "308", "407", "508", "2008", "3008", "5008", "Partner", "Boxer", "Expert"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Caddy", "Transporter", "Amarok", "Jetta", "Bora"],
  "Toyota": ["Corolla", "Yaris", "Camry", "Hilux", "Prado", "Land Cruiser", "Rav4", "Hiace", "Coaster"],
  "Hyundai": ["i10", "i20", "i30", "Accent", "Elantra", "Tucson", "Santa Fe", "Sonata", "H1", "HD65", "HD120"],
  "Kia": ["Picanto", "Rio", "Cerato", "Sportage", "Sorento", "K2700", "K2500"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "Vito", "Sprinter", "Actros", "Atego"],
  "Massey Ferguson": ["MF 285", "MF 399", "MF 385", "MF 440"],
  "Caterpillar": ["320D", "950H", "428F", "D8R"],
  "Yamaha": ["T-Max", "R1", "R6", "MT-07", "MT-09"],
  // More brands added dynamically or mapped to defaults if missing
};

export const PART_CATEGORIES: Translation[] = [
  { ar: "المحرك", en: "Engine" },
  { ar: "علبة السرعة", en: "Gearbox" },
  { ar: "الهيكل", en: "Body" },
  { ar: "الكهرباء", en: "Electrical" },
  { ar: "التعليق", en: "Suspension" },
  { ar: "المكابح", en: "Brakes" },
  { ar: "التبريد", en: "Cooling" },
  { ar: "نظام الوقود", en: "Fuel System" },
  { ar: "العادم", en: "Exhaust" },
  { ar: "العجلات والإطارات", en: "Wheels & Tires" },
  { ar: "الداخلية", en: "Interior" },
  { ar: "الأكسيسوارات", en: "Accessories" },
  { ar: "الإضاءة", en: "Lighting" }
];

export const YEARS = Array.from({ length: 2027 - 1990 }, (_, i) => (2026 - i).toString());
