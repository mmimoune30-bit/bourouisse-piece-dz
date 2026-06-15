
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
import { ImagePlus, AlertCircle, Sparkles, CarFront, AlertTriangle, Settings, FileText, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";

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
    "Alternateur", "Déمارreur", "Batterie", "Faisceau électrique", "Boîte à fusibles", "Relais", 
    "Capteur ABS", "Capteur PMH", "Calculateur moteur ECU", "Bobine d'allumage", "Commodo", 
    "Moteur essuie-glace", "Phare avant", "Feu arrière", "Clignotant", "Klaxon"
  ],
  "Suspension et Direction (التوازي والتوازن)": [
    "Amortisseur", "Ressort", "Triangle de suspension", "Rotule", "Biellette de direction", 
    "Crémaillère", "Barre stabilisatrice", "Silentbloc", "Moyeu", "Roulement de roue"
  ],
  "Pneumatiques (الإطارات)": [
    "Pneu", "Jante aluminium", "Jante tôle", "Enjoliveور", "Valve", "Capteur pression pneu", "Roue complète"
  ],
  "Carrosserie (الهيكل)": [
    "Capot", "Pare-chocs avant", "Pare-chocs arrière", "Aile avant", "Porte avant", "Portه arrière", 
    "Coffre", "Toit", "Rétroviseur", "Calandre", "Pare-brise", "Vitre latérale", "Feu stop"
  ],
  "Accessoires (الأكسسوارات)": [
    "Autoradio", "Écran multimédia", "Caméra de recul", "Tapis de sol", "Housse siège", 
    "Chargeur USB", "Support téléphone", "Alarme", "GPS", "Barre de toit", "Attelage", "Climatisation"
  ]
};

const BRAND_MODELS = {
  "Renault": ["Clio", "Symbol", "Megane", "Scenic", "Kangoo", "Express", "Laguna", "Fluence"],
  "Peugeot": ["206", "207", "208", "301", "307", "308", "406", "407", "Partner"],
  "Citroën": ["C3", "C4", "C5", "Berlingo", "Xsara"],
  "Volkswagen": ["Golf 4", "Golf 5", "Golf 6", "Golf 7", "Polo", "Passat", "Tiguan", "Touran"],
  "Seat": ["Ibiza", "Leon", "Cordoba", "Toledo"],
  "Skoda": ["Fabia", "Octavia", "Superb", "Rapid"],
  "Audi": ["A3", "A4", "A5", "A6", "Q3", "Q5"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5"],
  "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "Sprinter", "Vito"],
  "Opel": ["Corsa", "Astra", "Vectra", "Zafira"],
  "Fiat": ["Punto", "Doblo", "Panda", "Tipo"],
  "Ford": ["Fiesta", "Focus", "Transit", "Mondeo"],
  "Toyota": ["Yaris", "Corolla", "Hilux", "Rav4"],
  "Nissan": ["Micra", "Sunny", "Qashqai", "Navara"],
  "Hyundai": ["Accent", "i10", "i20", "Tucson", "Santa Fe"],
  "Kia": ["Picanto", "Rio", "Cerato", "Sportage"],
  "Dacia": ["Logan", "Sandero", "Duster", "Dokker"],
  "Suzuki": ["Swift", "Alto", "Vitara"],
  "Mitsubishi": ["L200", "Pajero", "Outlander"],
  "Chevrolet": ["Aveo", "Spark", "Cruze", "Captiva"]
};

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

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerدès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt",
  "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

export default function NewListing() {
  const [listingType, setListingType] = useState<string>("part");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [damagePercentage, setDamagePercentage] = useState<number>(0);

  const isVehicleListing = listingType !== "part";

  const partsList = useMemo(() => {
    return selectedCategory ? CATEGORY_DATA[selectedCategory as keyof typeof CATEGORY_DATA] : [];
  }, [selectedCategory]);

  const modelsList = useMemo(() => {
    return selectedBrand ? BRAND_MODELS[selectedBrand as keyof typeof BRAND_MODELS] : [];
  }, [selectedBrand]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-row-reverse items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-border">
            <h1 className="text-3xl font-black text-primary">إضافة إعلان جديد</h1>
            <div className="w-64" dir="rtl">
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
              {/* Conditional Form: Part vs Vehicle */}
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
                  {/* Vehicle Information Section */}
                  <Card className="border-none shadow-sm">
                    <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                      <CarFront size={20} className="text-primary" />
                      <CardTitle className="text-lg text-right">معلومات المركبة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-bold">الماركة</Label>
                          <Select onValueChange={setSelectedBrand}>
                            <SelectTrigger className="h-12"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                            <SelectContent>
                              {Object.keys(BRAND_MODELS).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold">الموديل</Label>
                          <Select disabled={!selectedBrand} onValueChange={setSelectedModel}>
                            <SelectTrigger className="h-12"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                            <SelectContent>
                              {modelsList.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="font-bold">الوقود</Label>
                          <Select><SelectTrigger className="h-12"><SelectValue placeholder="نوع الوقود" /></SelectTrigger>
                          <SelectContent>{FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold">علبة السرعة</Label>
                          <Select><SelectTrigger className="h-12"><SelectValue placeholder="يدوي/آلي" /></SelectTrigger>
                          <SelectContent>{GEARBOX_TYPES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold">الكيلومترات</Label>
                          <Input type="number" placeholder="0" className="h-12" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Status Section */}
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

                  {/* Available Parts Section */}
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

              {/* Price and Commercial Info */}
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
                        <SelectTrigger className="h-12"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                        <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية</Label>
                      <Input placeholder="اسم البلدية" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">رقم الهاتف للتواصل</Label>
                      <Input placeholder="05/06/07..." className="h-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description & Images */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">الوصف والصور</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <Textarea placeholder="أضف تفاصيل إضافية عن الحالة أو الملحقات..." className="min-h-[120px]" />
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
              <Card className="border-none shadow-xl sticky top-32 overflow-hidden">
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
                  <Button className="w-full h-14 text-lg font-black shadow-lg">نشر الإعلان الآن</Button>
                </CardContent>
              </Card>

              <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20 flex flex-row-reverse gap-4">
                <AlertCircle className="text-secondary shrink-0" size={24} />
                <div className="text-right">
                  <h4 className="font-black text-sm text-primary">لماذا "نوع الإعلان"؟</h4>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    تحديد نوع الإعلان يساعد المشترين في العثور على ما يحتاجونه بدقة، سواء كانت قطعة غيار واحدة أو سيارة كاملة للتشليح.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
