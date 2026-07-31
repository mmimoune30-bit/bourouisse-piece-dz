
export type Translation = {
  ar: string;
  en: string;
  fr: string;
};

export type VehicleType = {
  id: string;
  label: Translation;
  brands: string[];
};

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "passenger",
    label: { ar: "سيارة سياحية", en: "Passenger Car", fr: "Véhicule de Tourisme" },
    brands: [
      "Fiat", "Renault", "Dacia", "Peugeot", "Volkswagen", "SEAT", "Skoda", "Opel", "Citroën", 
      "Audi", "BMW", "Mercedes-Benz", "Cupra", "Volvo", "Porsche", "Alfa Romeo", "Mini", 
      "Land Rover", "Jaguar", "DS Automobiles", "Hyundai", "Kia", "Toyota", "Suzuki", 
      "Nissan", "Mitsubishi", "Mazda", "Honda", "Subaru", "Lexus", "SsangYong", "Infiniti", 
      "Daihatsu", "Chery", "Geely", "DFSK", "Changan", "Jetour", "BAIC", "BYD", "MG", 
      "Omoda", "Jaecoo", "Exeed", "Hongqi", "Kaiyi", "Soueast", "Xiaomi Auto", "Chevrolet", 
      "Ford", "Jeep", "Cadillac"
    ]
  },
  {
    id: "commercial",
    label: { ar: "سيارة نفعية", en: "Light Commercial Vehicle", fr: "Véhicule Utilitaire" },
    brands: [
      "Fiat Professional", "Renault", "Peugeot", "Citroën", "Volkswagen", "Toyota", 
      "Nissan", "Hyundai", "IVECO", "Mercedes-Benz", "SAFAV-MB", "JMC", "Foton", 
      "DFSK", "JAC", "Maxus", "Victory Auto", "Forthing"
    ]
  },
  {
    id: "small_truck",
    label: { ar: "شاحنة صغيرة", en: "Small Truck", fr: "Petit Camion" },
    brands: ["JAC", "JMC", "Foton", "Dongfeng", "Changan", "Hyundai", "Kia", "Toyota", "DFSK", "Victory Auto"]
  },
  {
    id: "heavy_truck",
    label: { ar: "شاحنة كبيرة", en: "Heavy Truck", fr: "Poids Lourd" },
    brands: [
      "Renault Trucks", "Volvo", "Scania", "MAN", "Mercedes-Benz", "IVECO", 
      "Shacman", "FAW", "Howo", "SAPPL-MB", "SNVI", "XCMG", "SANY", "Liugong"
    ]
  },
  {
    id: "bus",
    label: { ar: "حافلة", en: "Bus", fr: "Bus & Autocar" },
    brands: ["Higer", "Yutong", "King Long", "Ankai", "Zhongtong", "Toyota", "Hyundai", "IVECO", "Mercedes-Benz", "SNVI"]
  },
  {
    id: "tractor",
    label: { ar: "جرار فلاحي", en: "Agricultural Tractor", fr: "Tracteur Agricole" },
    brands: ["Etrag", "PMA / Sonalika", "Massey Ferguson", "John Deere", "New Holland", "Case IH", "Kubota", "Cirta", "Deutz-Fahr"]
  },
  {
    id: "machine",
    label: { ar: "آلة أشغال", en: "Construction Machine", fr: "Engin de Chantier" },
    brands: ["Caterpillar", "Komatsu", "JCB", "Liebherr", "Case", "Volvo", "Hyundai", "Doosan", "Hidromek", "XCMG", "SANY", "Liugong"]
  },
  {
    id: "motorcycle",
    label: { ar: "دراجة نارية", en: "Motorcycle", fr: "Moto" },
    brands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "BMW", "KTM", "SYM", "VMS Industrie", "AS Motors / SYM Algeria", "Zontes"]
  }
];

export const BRAND_MODELS: Record<string, string[]> = {
  // European Brands
  "Fiat": ["124", "126", "127", "128", "131", "Uno", "Punto", "Bravo/Brava", "Tempra", "Marea", "Panda", "500", "500X", "500L", "Tipo", "Linea", "Palio", "Siena", "Doblo", "Fiorino", "Ducato", "Scudo", "Titano", "Freemont", "Coupe"],
  "Renault": ["R4", "R5", "R9", "R11", "R12", "R18", "R19", "R21", "Clio 1", "Clio 2", "Clio 3", "Clio 4", "Clio 5", "Symbol", "Megane 1", "Megane 2", "Megane 3", "Megane 4", "Fluence", "Laguna", "Safrane", "Talisman", "Scenic", "Espace", "Captur", "Kadjar", "Austral", "Arkana", "Rafale", "Duster", "Kangoo", "Express", "Master", "Trafic"],
  "Dacia": ["1300", "Logan", "Sandero", "Sandero Stepway", "Duster", "Lodgy", "Dokker", "Jogger", "Spring", "Bigster"],
  "Peugeot": ["205", "206", "207", "208", "301", "306", "307", "308", "405", "406", "407", "508", "607", "2008", "3008", "5008", "Partner", "Rifter", "Expert", "Boxer", "408", "RCZ"],
  "Volkswagen": ["Beetle (Coccinelle)", "Golf 1", "Golf 2", "Golf 3", "Golf 4", "Golf 5", "Golf 6", "Golf 7", "Golf 8", "Polo", "Passat", "Jetta", "Bora", "Vento", "Scirocco", "Tiguan", "Touareg", "T-Roc", "Taigo", "T-Cross", "Caddy", "Transporter T4", "Transporter T5", "Transporter T6", "Transporter T7", "Crafter", "Amarok", "ID.3", "ID.4", "ID.6"],
  "SEAT": ["Ibiza", "Cordoba", "Leon", "Toledo", "Altea", "Arona", "Ateca", "Tarraco", "Alhambra", "Arosa", "Mii"],
  "Skoda": ["Felicia", "Fabia", "Octavia", "Superb", "Rapid", "Roomster", "Yeti", "Kamiq", "Karoq", "Kodiaq", "Enyaq IV", "Scalia"],
  "Opel": ["Corsa", "Astra", "Vectra", "Omega", "Insignia", "Meriva", "Zafira", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano", "Frontera", "Rekord"],
  "Citroën": ["2CV", "AX", "Saxo", "C3", "C-Elysée", "Xsara", "C4", "C5", "C6", "Berlingo", "Jumpy", "Jumper", "C3 Aircross", "C5 Aircross", "C4 Cactus", "Nemo", "Picasso"],
  "Audi": ["80", "100", "A1", "A3", "A4", "A5", "A6", "A7", "A8", "TT", "R8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron GT"],
  "BMW": ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5", "Series 6", "Series 7", "Series 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z3", "Z4", "i3", "i4", "iX", "i7"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "SLK", "AMG GT", "Sprinter", "Vito", "Citan", "Actros", "Atego", "Axor"],
  "Cupra": ["Formentor", "Born", "Leon", "Ateca", "Tavascan", "Terramar"],
  "Volvo": ["240", "740", "850", "S40", "S60", "S80", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90", "EX30", "EX90", "FH12", "FH16", "FM", "FMX"],
  "Porsche": ["911", "Boxster", "Cayman", "Panamera", "Cayenne", "Macan", "Taycan"],
  "Alfa Romeo": ["147", "156", "159", "Mito", "Giulietta", "Giulia", "Stelvio", "Tonale", "Junior (Milano)", "Spider", "4C"],
  "Mini": ["Cooper (3-door / 5-door)", "Convertible", "Clubman", "Countryman", "Paceman"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar"],
  "Jaguar": ["X-Type", "S-Type", "XJ", "XE", "XF", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  "DS Automobiles": ["DS3", "DS3 Crossback", "DS4", "DS5", "DS7 Crossback", "DS9"],
  "Fiat Professional": ["Fiorino", "Doblo Cargo", "Scudo", "Ducato", "Talento"],
  "Renault Trucks": ["Kerax", "Premium", "Magnum", "Midlum", "T-Range", "C-Range", "K-Range", "D-Range"],
  "IVECO": ["Daily", "Eurocargo", "Stralis", "Trakker", "S-Way", "T-Way"],
  "MAN": ["TGL", "TGM", "TGS", "TGX", "Lion's City", "Lion's Coach"],
  "Scania": ["P-Series", "G-Series", "R-Series", "S-Series", "Touring", "OmniCity"],

  // Asian Brands
  "Hyundai": ["Atos", "Accent", "Getz", "Elantra", "Sonata", "Azera", "i10", "i20", "i30", "Tucson", "Santa Fe", "Veracruz", "Palisade", "Creta", "Kona", "Venue", "Bayon", "H100", "H1/Starex", "Mighty", "Ioniq 5", "Ioniq 6"],
  "Kia": ["Pride", "Picanto", "Rio", "Cerato (Forte)", "Optima", "K5", "Cadenza", "Stinger", "Soul", "Sportage", "Sorento", "Telluride", "Carnival", "Carens", "K2500/K2700", "EV6", "EV9"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Avalon", "Crown", "RAV4", "Prado", "Land Cruiser 70", "Land Cruiser 80", "Land Cruiser 100", "Land Cruiser 200", "Land Cruiser 300", "Hilux", "Fortuner", "Highlander", "Rush", "Hiace", "Coaster", "Supra", "C-HR"],
  "Suzuki": ["Alto", "Maruti", "Swift", "Baleno", "Dzire", "Ciaz", "Celerio", "Ignis", "SX4", "Vitara", "Grand Vitara", "Jimny", "Ertiga", "APV", "S-Cross"],
  "Nissan": ["Micra (March)", "Sunny", "Sentra", "Maxima", "Tiida", "Altima", "Qashqai", "X-Trail", "Murano", "Pathfinder", "Patrol", "Navara", "Urvan", "GT-R", "Juke", "Kicks"],
  "Mitsubishi": ["Lancer", "Galant", "Pajero", "Pajero Sport", "Outlander", "ASX", "Eclipse Cross", "Mirage", "Attrage", "L200", "Canter", "Rosa"],
  "Isuzu": ["D-Max", "MU-X", "Trooper", "NPR", "NQR", "N-Series", "F-Series", "Forward", "Gigamax"],
  "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-7", "CX-9", "CX-60", "CX-90", "MX-5 Miata", "BT-50"],
  "Honda": ["Civic", "Accord", "City", "Jazz (Fit)", "CR-V", "HR-V", "Pilot", "Odyssey", "Prelude"],
  "Subaru": ["Impreza", "Legacy", "Outback", "Forester", "XV", "Crosstrek", "WRX", "BRZ"],
  "Lexus": ["IS", "ES", "GS", "LS", "NX", "RX", "GX", "LX 470", "LX 570", "LX 600", "LFA", "UX"],
  "SsangYong": ["Musso", "Korando", "Rexton", "Actyon", "Kyron", "Tivoli", "Torres", "Chairman"],
  "Infiniti": ["G35/G37", "Q50", "Q60", "Q70", "QX50", "QX60", "QX70 (FX35)", "QX80"],
  "Daihatsu": ["Cuore", "Sirion", "Terios", "YRV", "Applause", "Rocky", "Hijet"],
  "Hino": ["300 Series", "500 Series", "700 Series", "Dutro", "Ranger", "Profia"],

  // Chinese Brands
  "Chery": ["A1", "A3", "A5", "QQ", "Cowin", "Tiggo 2 Pro", "Tiggo 3", "Tiggo 4 Pro", "Tiggo 7 Pro", "Tiggo 8 Pro", "Tiggo 9", "Arrizo 3", "Arrizo 5", "Arrizo 8", "Omoda 5"],
  "Geely": ["CK", "MK", "LC Panda", "Emgrand (EC7, EC8)", "Emgrand 7", "Coolray", "Azkarra (Boyue)", "Tugella", "Monjaro", "Okavango", "Geometry C", "GX3 Pro", "Starray"],
  "JAC": ["J3", "J5", "J7", "JS2", "JS3", "JS4", "JS6", "JS8", "T6", "T8", "T9", "Sunray", "X200", "K7", "Gallop"],
  "DFSK": ["K01", "K01S", "K02", "K07", "C31", "C32", "C35", "Glory 330", "Glory 580", "Glory 500", "Fengon 600", "Seres 3", "Seres 5"],
  "Changan": ["Alsvin", "Eado", "CS15", "CS35", "CS35 Plus", "CS55 Plus", "CS75 Plus", "CS85", "CS95", "Uni-K", "Uni-T", "Uni-V", "Hunter (Pick-up)"],
  "Jetour": ["X70", "X70S", "X70 Plus", "X90 Plus", "Dashing", "T2 (Traveler)", "X95"],
  "BAIC": ["A115", "Senova (X25, X35, X55, X65)", "BJ20", "BJ40", "BJ60", "BJ80", "EU5", "U5 Plus"],
  "Dongfeng": ["S50", "AX7", "Shine", "Rich 6", "DF6", "Captain", "Tianjin", "Tianlong", "GX"],
  "BYD": ["F3", "F0", "Qin", "Han", "Tang", "Song Plus", "Yuan Plus (Atto 3)", "Dolphin", "Seagull", "Seal", "Yangwang U8"],
  "GWM": ["Peri", "Florid", "C30", "Hover", "Haval H3", "Haval H5", "Wingle 3", "Wingle 5", "Wingle 7", "Poer", "KingKong Cannon"],
  "Haval": ["H2", "H6", "H6 GT", "H9", "Jolion", "Dargo", "Menglong"],
  "Tank": ["Tank 300", "Tank 400", "Tank 500", "Tank 700"],
  "Omoda": ["C5", "E5", "Omoda 7"],
  "Jaecoo": ["J7", "J8", "J9"],
  "MG": ["MG3", "MG5", "MG6", "MG7", "MG GT", "MG ZS", "MG HS", "MG RX5", "MG RX8", "Cyberster", "MG4 EV"],
  "JMC": ["Boarding", "Carrying", "Vexus", "Grand Avenue", "Yuhu 7", "Yuhu 9"],
  "Foton": ["Tunland", "Aumark", "Ollin", "Auman", "View", "Toano", "Auv Bus"],
  "Shacman": ["F2000", "F3000", "X3000", "X5000", "L3000", "M3000"],
  "FAW": ["Vita", "Besturn (B50, B70, T77, T99)", "Tiger V", "J6", "J7", "V2"],
  "Howo": ["Howo 7", "Howo A7", "Howo TX", "Howo MAX", "Sitrak C7H"],
  "Victory Auto": ["Victory V1", "Victory V2", "Victory V5"],
  "Forthing": ["X5", "SX6", "T5 EVO", "U-Tour", "Friday EV"],
  "GAC Motor": ["GA3", "GA4", "GA8", "GS3", "GS4", "GS5", "GS8", "M8"],
  "Exeed": ["LX", "TXL", "VX", "RX", "Sterra ES"],
  "Hongqi": ["H5", "H7", "H9", "HS5", "HS7", "E-HS9"],
  "Kaiyi": ["X3", "X3 Pro", "X6 Pro", "E5", "Kunlun"],
  "Soueast": ["V3 Lingyue", "V5", "V6", "DX3", "DX7", "DX9"],
  "Zotye": ["Z100", "Z300", "T200", "T600", "SR9"],
  "Lifan": ["320", "520", "620", "X50", "X60", "X70", "Foison"],
  "Hafei": ["Lobo", "Simbo", "Ruiyi", "Minyi"],
  "Changhe": ["Ideal", "Freedom", "Q25", "Q35", "M50", "M70"],
  "King Long": ["XMQ6127", "XMQ6119", "Kingo", "Joyo"],
  "Higer": ["KLQ6119", "KLQ6129", "Higer Bus series", "Paradise"],
  "Yutong": ["ZK6129H", "ZK6858H", "ZK6122", "City Buses"],
  "Zhongtong": ["Elegant", "LCK6127", "Navigator", "Sunray"],
  "Ankai": ["A8", "A9", "HFF6120", "City Buses"],
  "XCMG": ["Hanvan G7", "G9", "Mobile Cranes", "Concrete Mixers"],
  "SANY": ["SY5310", "Dump Trucks", "Mixer Trucks", "Pump Trucks"],
  "Liugong": ["Dump Trucks", "Loaders", "Excavators", "Mining Trucks"],
  "SWM": ["G01", "G01F", "G03", "G05 Pro", "X7"],
  "Maxus": ["T60", "T70", "T90", "V80", "V90", "G10", "D90", "MIFA 9"],
  "Skywell": ["ET5", "D11", "B10"],
  "Xiaomi Auto": ["SU7", "YU7 (SUV)"],

  // American & Others
  "Chevrolet": ["Spark", "Aveo", "Optra", "Cruze", "Malibu", "Camaro", "Corvette", "Tracker", "Captiva", "Trailblazer", "Tahoe", "Suburban", "Colorado", "Silverado"],
  "Ford": ["Ka", "Fiesta", "Focus", "Mondeo", "Mustang", "EcoSport", "Escape", "Kuga", "Edge", "Explorer", "Expedition", "Ranger", "F-150", "Transit"],
  "Jeep": ["Willys", "CJ", "Wrangler", "Renegade", "Compass", "Cherokee", "Grand Cherokee", "Gladiator", "Commander"],
  "GMC": ["Sierra", "Yukon", "Canyon", "Acadia", "Terrain", "Savana"],
  "Dodge": ["Neon", "Caliber", "Dart", "Charger", "Challenger", "Durango", "Ramcharger"],
  "RAM": ["RAM 1500", "RAM 2500", "RAM 3500", "RAM ProMaster"],
  "Cadillac": ["CTS", "ATS", "Escalade", "SRX", "XT4", "XT5", "XT6", "Lyriq"],
  "Tata": ["Indica", "Indigo", "Nano", "Safari", "Xenon", "Prima", "Ultra"],
  "Mahindra": ["Scorpio", "Bolero", "Pik-Up", "Thar", "XUV500", "XUV700", "KUV100"],

  // Algerian Manufactured
  "SNVI": ["K66", "K120", "C260", "B260", "B450", "100L6", "49L8", "Safir", "Numidie"],
  "SAFAV-MB": ["Sprinter", "Vito", "Class G"],
  "SAPPL-MB": ["Actros", "Atego", "Axor", "Zetros", "Unimog"],
  "Etrag": ["Ciris", "El-Djazair 55", "El-Djazair 65", "El-Djazair 70", "El-Djazair 80"],
  "PMA / Sonalika": ["Sonalika Solis 50", "Sonalika Solis 60", "Sonalika Solis 75", "Sonalika Solis 90"],
  "VMS Industrie": ["Driver", "Cuca", "Victoria", "Triporteur VMS"],
  "AS Motors / SYM Algeria": ["A20", "Matrix", "Roma", "Symphony", "Triporteur AS"],
  "Yamaha": ["T-Max", "R1", "R6", "MT-07", "MT-09"],
  "Massey Ferguson": ["MF 285", "MF 399", "MF 385", "MF 440"],
  "Caterpillar": ["320D", "950H", "428F", "D8R"]
};

export const PART_CATEGORIES: Translation[] = [
  { ar: "المحرك", en: "Engine", fr: "Moteur" },
  { ar: "علبة السرعة", en: "Gearbox", fr: "Boîte de Vitesse" },
  { ar: "الهيكل", en: "Body", fr: "Carrosserie" },
  { ar: "الكهرباء", en: "Electrical", fr: "Électricité" },
  { ar: "التعليق", en: "Suspension", fr: "Suspension" },
  { ar: "المكابح", en: "Brakes", fr: "Freinage" },
  { ar: "التبريد", en: "Cooling", fr: "Refroidissement" },
  { ar: "نظام الوقود", en: "Fuel System", fr: "Système de Carburant" },
  { ar: "العادم", en: "Exhaust", fr: "Échappement" },
  { ar: "العجلات والإطارات", en: "Wheels & Tires", fr: "Roues & Pneus" },
  { ar: "الداخلية", en: "Interior", fr: "Intérieur" },
  { ar: "الأكسيسوارات", en: "Accessories", fr: "Accessoires" },
  { ar: "الإضاءة", en: "Lighting", fr: "Éclairage" }
];

export const FUEL_TYPES: Translation[] = [
  { ar: "بنزين", en: "Gasoline", fr: "Essence" },
  { ar: "ديزل / مازوت", en: "Diesel", fr: "Diesel / Gazole" },
  { ar: "غاز (GPL/GNC)", en: "LPG/CNG", fr: "GPL/GNC" },
  { ar: "كهرباء", en: "Electric", fr: "Électrique" },
  { ar: "هجين (Hybrid)", en: "Hybrid", fr: "Hybride" }
];

export const YEARS = Array.from({ length: 2027 - 1980 }, (_, i) => (2026 - i).toString());
