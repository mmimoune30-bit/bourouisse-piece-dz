
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, AlertCircle, CarFront, AlertTriangle, Settings, Send, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LISTING_TYPES = [
  { id: "part", label: "Pièce détachée (قطعة غيار منفردة)" },
  { id: "vhs", label: "Véhicule hors service (مركبة خارج الخدمة)" },
  { id: "accidented", label: "Véhicule accidenté (مركبة مصدومة)" },
  { id: "for_parts", label: "Véhicule pour pièces (مركبة للقطع)" },
];

const CATEGORY_DATA = {
  "Moteur (المحرك)": [
    "Moteur complet", "Culasse", "Bloc moteur", "Piston", "Segments", "Bielles", "Vilebrequin", 
    "Arbre à cames", "Soupapes", "Joint de culasse", "Pompe à huile", "Pompe à eau", "Radiateur", 
    "Turbo", "Injecteurs", "Bougies", "Filtre à huile", "Filtre à air", "Filtre à carburant", "Courroie de distribution"
  ],
  "Électricité (الكهرباء)": [
    "Alternateur", "Démarreur", "Batterie", "Faisceau électrique", "Boîte à fusibles", "Relais", 
    "Capteur ABS", "Capteur PMH", "Calculateur moteur ECU", "Bobine d'allumage", "Commodo", 
    "Moteur essuie-glace", "Phare avant", "Feu arrière", "Clignotant", "Klaxon"
  ],
  "Suspension et Direction (التوازي والتوازن)": [
    "Amortisseur", "Ressort", "Triangle de suspension", "Rotule", "Biellette de direction", 
    "Crémaillère", "Barre stabilisatrice", "Silentbloc", "Moyeu", "Roulement de roue"
  ],
  "Pneumatiques (الإطارات)": [
    "Pneu", "Jante aluminium", "Jante tôle", "Enjoliveur", "Valve", "Capteur pression pneu", "Roue complète"
  ],
  "Carrosserie (الهيكل)": [
    "Capot", "Pare-chocs avant", "Pare-chocs arrière", "Aile avant", "Portه avant", "Porte arrière", 
    "Coffre", "Toit", "Rétroviseur", "Calandre", "Pare-brise", "Vitre latérale", "Feu stop"
  ],
  "Accessoires (الأكسيسوارات)": [
    "Autoradio", "Écran multimédia", "Caméra de recul", "Tapis de sol", "Housse siège", 
    "Chargeur USB", "Support téléphone", "Alarme", "GPS", "Barre de toit", "Attelage", "Climatisation"
  ]
};

const BRAND_MODELS: Record<string, string[]> = {
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "Sprinter"],
  "BMW": ["1 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7"],
  "Audi": ["A1", "A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Jetta", "Tiguan", "Touareg", "Caddy", "Transporter"],
  "Renault": ["Clio", "Megane", "Symbol", "Captur", "Kadjar", "Kangoo", "Trafic", "Master"],
  "Peugeot": ["106", "206", "207", "208", "301", "308", "3008", "Partner"],
  "Citroen": ["C1", "C3", "C4", "C5", "Berlingo", "Jumpy", "Jumper"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Prius", "RAV4", "Hilux", "Land Cruiser"],
  "Hyundai": ["i10", "i20", "i30", "Accent", "Elantra", "Tucson", "Santa Fe"],
  "Kia": ["Picanto", "Rio", "Cerato", "Optima", "Sportage", "Sorento"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Kuga", "Ranger", "Transit"],
  "Nissan": ["Micra", "Sunny", "Sentra", "Qashqai", "X-Trail", "Patrol"],
  "Honda": ["Jazz", "Civic", "Accord", "CR-V", "HR-V"],
  "Chevrolet": ["Spark", "Aveo", "Cruze", "Malibu", "Tahoe"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  "Dacia": ["Logan", "Sandero", "Duster", "Dokker", "Lodgy"],
  "Haval": [], "JAC": [], "FAW": [], "Dongfeng": [], "BAIC": [], "Jetour": [], "Exeed": [], "Hongqi": [], "NIO": [], "XPeng": [], "Li Auto": [], "Tata": [], "Mahindra": [], "Maruti Suzuki": [], "Ashok Leyland": [], "Proton": [], "Perodua": [], "VinFast": [], "SsangYong": [], "Daewoo": [], "Roewe": [], "Wuling": [], "Zotye": [], "Lifan": [], "Foton": [], "Koenigsegg": [], "Bugatti": [], "Pagani": [], "Lotus": [], "Morgan": [], "TVR": [], "Caterham": [], "Polestar": [], "Smart": [], "Maybach": [], "Abarth": [], "Iveco": [], "MAN": [], "Scania": [], "DAF": [], "Peterbilt": [], "Kenworth": [], "Freightliner": [], "Hino": [], "UD Trucks": [], "Mack": [], "Western Star": [], "Tatra": [], "UAZ": [], "GAZ": [], "Lada": [], "Moskvitch": [], "ZAZ": [], "Yugo": [], "Skoda Truck": [], "Talbot": [], "Simca": [], "Rover": [], "Triumph": [], "Austin": [], "Morris": [], "Vauxhall": [], "Holden": [], "HSV": [], "Plymouth": [], "Mercury": [], "Saturn": [], "Geo": [], "Eagle": [], "AMC": [], "SEAT Classic": [], "Autobianchi": [], "De Tomaso": [], "Borgward": [], "Wartburg": [], "Trabant": [], "Zastava": [], "FSO": [], "Aixam": [], "Ligier": []
};

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "16 - Alger", "31 - Oran"
];

const FUEL_TYPES = ["Essence", "Diesel", "GPL", "Hybride", "Électrique"];
const GEARBOX_TYPES = ["Manuelle", "Automatique"];
const VEHICLE_STATUSES = [
  "Accidenté (مصدومة)", 
  "En panne moteur (عطل محرك)", 
  "En panne boîte de vitesse (عطل علبة سرعة)", 
  "Véhicule incendié (محروقة)", 
  "Véhicule immergé (غارقة)", 
  "Pour pièces uniquement (للقطع فقط)"
];
const AVAILABLE_PARTS = [
  "Moteur", "Boîte de vitesse", "Train avant", "Train arrière", "Suspension", 
  "Direction", "Électricité", "Carrosserie", "Intérieur", "Climatisation", "Pneumatiques", "Accessoires"
];

export default function NewListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [listingType, setListingType] = useState<string>("part");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [damagePercentage, setDamagePercentage] = useState<number>(0);

  const partsList = useMemo(() => {
    return selectedCategory ? CATEGORY_DATA[selectedCategory as keyof typeof CATEGORY_DATA] : [];
  }, [selectedCategory]);

  const modelsList = useMemo(() => {
    return selectedBrand ? BRAND_MODELS[selectedBrand] : [];
  }, [selectedBrand]);

  const handlePostListing = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم نشر الإعلان بنجاح!",
        description: "إعلانك الآن متاح للمشترين في كافة ولايات الجزائر.",
      });
      router.push("/seller/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-[235px] pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-border gap-4">
            <h1 className="text-3xl font-black text-primary">إضافة إعلان جديد</h1>
            <div className="w-full md:w-64" dir="rtl">
              <Label className="mb-2 block font-bold text-xs">اختر نوع الإعلان</Label>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="border-2 border-primary/20 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Common Section for Brand/Model for all types */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                  <CarFront size={20} className="text-primary" />
                  <CardTitle className="text-lg text-right">بيانات المركبة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الماركة</Label>
                      <Select onValueChange={setSelectedBrand}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(BRAND_MODELS).sort().map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">الموديل</Label>
                      <Select disabled={!selectedBrand} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                        <SelectContent>
                          {modelsList.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {listingType === "part" ? (
                <Card className="border-none shadow-sm">
                  <CardHeader className="bg-primary text-white border-b rounded-t-lg">
                    <CardTitle className="text-lg text-right">تصنيف القطعة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold">الفئة الرئيسية</Label>
                        <Select onValueChange={setSelectedCategory}>
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(CATEGORY_DATA).map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">نوع القطعة</Label>
                        <Select disabled={!selectedCategory} value={selectedPart} onValueChange={setSelectedPart}>
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            {partsList.map((part) => (
                              <SelectItem key={part} value={part}>{part}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                      <AlertTriangle size={20} className="text-secondary" />
                      <CardTitle className="text-lg text-right">حالة المركبة والأوراق</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="font-bold">حالة المركبة</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {VEHICLE_STATUSES.map(status => (
                              <div key={status} className="flex items-center justify-end gap-3 p-3 bg-muted/50 rounded-lg">
                                <Label htmlFor={status} className="text-sm cursor-pointer">{status}</Label>
                                <Checkbox id={status} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="font-bold">حالة الأوراق</Label>
                            <Select>
                              <SelectTrigger className="h-12"><SelectValue placeholder="اختر الحالة" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="avec">Avec papiers (بالأوراق)</SelectItem>
                                <SelectItem value="sans">Sans papiers (بدون أوراق)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-4 p-4 border-2 border-dashed rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-black text-primary bg-secondary/20 px-3 py-1 rounded-full">{damagePercentage}%</span>
                              <Label className="font-bold">نسبة التحطم</Label>
                            </div>
                            <Slider value={[damagePercentage]} max={100} onValueChange={(v) => setDamagePercentage(v[0])} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                      <Settings size={20} className="text-primary" />
                      <CardTitle className="text-lg text-right">القطع المتوفرة في المركبة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-right" dir="rtl">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AVAILABLE_PARTS.map(part => (
                          <div key={part} className="flex items-center justify-end gap-2 p-2 border rounded-xl hover:bg-muted/50 transition-colors">
                            <Label htmlFor={`part-${part}`} className="text-xs cursor-pointer">{part}</Label>
                            <Checkbox id={`part-${part}`} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">المعلومات التجارية والموقع</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">السعر (دج)</Label>
                      <div className="relative">
                        <Input type="number" placeholder="0.00" className="h-12 pl-12" />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">DZD</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 p-4 bg-muted/30 rounded-2xl">
                      <Label className="font-bold">السعر قابل للتفاوض</Label>
                      <Switch />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الولاية</Label>
                      <Select>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                        <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية</Label>
                      <Input placeholder="اسم البلدية" className="h-12 border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الهاتف للتواصل</Label>
                      <Input placeholder="05/06/07..." className="h-12 border-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">الوصف والصور</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <Textarea placeholder="أضف تفاصيل إضافية عن الحالة أو الملحقات..." className="min-h-[120px] border-2" />
                  <div className="space-y-4">
                    <Label className="font-bold">صور الإعلان (حتى 10 صور)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all text-muted-foreground hover:text-secondary group">
                        <ImagePlus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase">إضافة صور</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-xl sticky top-[250px] overflow-hidden">
                <CardHeader className="bg-primary text-white text-right p-6">
                  <CardTitle className="text-xl font-black">نشر الإعلان</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-end gap-2 text-green-600">
                      <span className="text-sm font-black">نشر مجاني</span>
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-primary/70">
                      <span className="text-sm font-bold">وصول لـ 58 ولاية</span>
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                  <Button 
                    className="w-full h-14 text-lg font-black shadow-lg gap-2" 
                    onClick={handlePostListing}
                    disabled={loading}
                  >
                    {loading ? "جاري النشر..." : <>نشر الإعلان الآن <Send size={20} /></>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
