
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, AlertCircle, Sparkles, CarFront } from "lucide-react";
import { useState, useMemo } from "react";

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
    "Capot", "Pare-chocs avant", "Pare-chocs arrière", "Aile avant", "Porte avant", "Porte arrière", 
    "Coffre", "Toit", "Rétroviseur", "Calandre", "Pare-برise", "Vitre latérale", "Feu stop"
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

const MOTORISATIONS = ["Essence", "Diesel", "GPL", "Hybride", "Électrique"];
const YEARS = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => (2025 - i).toString());
const WILAYAS = ["01 - Adrar", "02 - Chlef", "06 - Béjaïa", "09 - Blida", "13 - Tlemcen", "16 - Alger", "19 - Sétif", "23 - Annaba", "25 - Constantine", "31 - Oran", "35 - Boumerdès"];

export default function NewListing() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const partsList = useMemo(() => {
    return selectedCategory ? CATEGORY_DATA[selectedCategory as keyof typeof CATEGORY_DATA] : [];
  }, [selectedCategory]);

  const modelsList = useMemo(() => {
    return selectedBrand ? BRAND_MODELS[selectedBrand as keyof typeof BRAND_MODELS] : [];
  }, [selectedBrand]);

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setSelectedPart("");
  };

  const handleBrandChange = (val: string) => {
    setSelectedBrand(val);
    setSelectedModel("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-row-reverse items-center justify-between">
            <h1 className="text-3xl font-black text-primary">إضافة إعلان جديد</h1>
            <Button variant="outline" className="text-muted-foreground">حفظ كمسودة</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Main Classification */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary text-white border-b rounded-t-lg">
                  <CardTitle className="text-lg text-right">تصنيف القطعة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الفئة الرئيسية</Label>
                      <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="h-12 border-2 focus:ring-secondary">
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
                      <Label className="font-bold">نوع القطعة (من القائمة)</Label>
                      <Select 
                        disabled={!selectedCategory} 
                        value={selectedPart} 
                        onValueChange={setSelectedPart}
                      >
                        <SelectTrigger className="h-12 border-2 focus:ring-secondary">
                          <SelectValue placeholder={selectedCategory ? "اختر القطعة" : "اختر الفئة أولاً"} />
                        </SelectTrigger>
                        <SelectContent>
                          {partsList.map((part) => (
                            <SelectItem key={part} value={part}>{part}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Manual Entry Field */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={16} className="text-secondary" />
                      <Label className="font-bold">اسم القطعة يدوياً (في حال عدم وجودها في القائمة)</Label>
                    </div>
                    <Input 
                      placeholder="أدخل اسم القطعة بدقة هنا..." 
                      className="h-12 border-2 focus:ring-secondary"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      * استخدم هذا الحقل فقط إذا لم تجد اسم القطعة المناسب في القائمة المنسدلة أعلاه.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                  <CarFront size={20} className="text-primary" />
                  <CardTitle className="text-lg text-right">معلومات المركبة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">العلامة التجارية (Marque)</Label>
                      <Select onValueChange={handleBrandChange}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر العلامة (Renault, BMW...)" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(BRAND_MODELS).map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">الموديل (Modèle)</Label>
                      <Select 
                        disabled={!selectedBrand} 
                        value={selectedModel} 
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder={selectedBrand ? "اختر الموديل" : "اختر العلامة أولاً"} />
                        </SelectTrigger>
                        <SelectContent>
                          {modelsList.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">السنة (Année)</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر السنة" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">المحرك (Motorisation)</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="نوع الوقود" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOTORISATIONS.map(mot => <SelectItem key={mot} value={mot}>{mot}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">الجيل (Génération - اختياري)</Label>
                      <Input placeholder="مثال: Phase 2, LCI..." className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="font-bold">حالة القطعة (État)</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="جديد أم مستعمل؟" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Neuf (جديد)</SelectItem>
                          <SelectItem value="used">Occasion (مستعمل)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">السعر (دج)</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full h-12 pr-4 pl-12" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">DZD</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">الموقع الجغرافي</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الولاية (Wilaya)</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الولاية" />
                        </SelectTrigger>
                        <SelectContent>
                          {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية (Commune)</Label>
                      <Input placeholder="أدخل اسم البلدية" className="h-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description & Photos */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b">
                  <CardTitle className="text-lg text-right">الوصف والصور</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="space-y-2">
                    <Label className="font-bold">وصف تفصيلي (اختياري)</Label>
                    <Textarea 
                      placeholder="أضف تفاصيل أخرى مثل: الضمان، سبب البيع، التوافق..." 
                      className="min-h-[120px] focus:ring-secondary" 
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold">صور القطعة (حتى 8 صور)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group">
                        <ImagePlus size={32} className="text-muted-foreground group-hover:text-secondary mb-2" />
                        <span className="text-[10px] font-bold text-muted-foreground">إضافة صور</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Publish Box */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl sticky top-32 overflow-hidden">
                <CardHeader className="bg-primary text-white text-right p-6">
                  <CardTitle className="text-xl font-black">نشر الإعلان</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3 text-right">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-black">مجاني 100%</span>
                      <span className="text-muted-foreground">تكلفة النشر</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary font-bold">30 يوم</span>
                      <span className="text-muted-foreground">مدة العرض</span>
                    </div>
                    <div className="pt-3 border-t">
                       <p className="text-[11px] text-muted-foreground leading-relaxed text-right">
                         بمجرد النشر، سيخضع إعلانك للمراجعة للتأكد من مطابقة الصور والبيانات المختارة.
                       </p>
                    </div>
                  </div>
                  <Button className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20">
                    نشر الإعلان الآن
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20 flex flex-row-reverse gap-4">
                <AlertCircle className="text-secondary shrink-0" size={24} />
                <div className="text-right">
                  <h4 className="font-black text-sm text-primary">نظام الإعلانات الموحد</h4>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    استخدام القوائم المنسدلة المترابطة يساعد المشترين في العثور على قطعتك بسرعة ودقة بناءً على العلامة التجارية والموديل.
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
