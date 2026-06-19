
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
import { ImagePlus, CarFront, AlertTriangle, Settings, Send, CheckCircle2, Calendar, Layers } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { WILAYAS_DATA } from "@/lib/algeria-locations";

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
    "Créماillère", "Barre stabilisatrice", "Silentbloc", "Moyeu", "Roulement de roue"
  ],
  "Pneumatiques (الإطارات)": [
    "Pneu", "Jante aluminium", "Jante tôle", "Enjoliveور", "Valve", "Capteur pression pneu", "Roue complète"
  ],
  "Carrosserie (الهيكل)": [
    "Capot", "Pare-chocs avant", "Pare-chocs arrière", "Aile avant", "Porte avant", "Porte arrière", 
    "Coffre", "Toit", "Rétroviseur", "Calandre", "Pare-بريس", "Vitre latérale", "Feu stop"
  ],
  "Accessoires (الأكسيسوارات)": [
    "Autoradio", "Écran multimédia", "Caméra de recul", "Tapis de sol", "Housse siège", 
    "Chargeur USB", "Support téléphone", "Alarme", "GPS", "Barre de toit", "Attelage", "Climatisation"
  ]
};

const BRAND_MODELS: Record<string, string[]> = {
  "Renault": ["Clio I", "Clio II", "Clio III", "Clio IV", "Clio V", "Megane I", "Megane II", "Megane III", "Megane IV", "Megane E-Tech", "Symbol", "Kangoo", "Scenic", "Laguna", "Fluence", "Captur", "Kadjar", "Koleos"],
  "Peugeot": ["205", "206", "206+", "207", "208 I", "208 II", "306", "307", "308 I", "308 II", "308 III", "406", "407", "508 I", "508 II", "Partner", "Expert", "Boxer", "2008", "3008", "5008"],
  "Volkswagen": ["Golf I", "Golf II", "Golf III", "Golf IV", "Golf V", "Golf VI", "Golf VII", "Golf VIII", "Polo", "Passat", "Bora", "Jetta", "Tiguan", "Touareg", "T-Roc", "Caddy", "Transporter"],
  "Toyota": ["Corolla", "Yaris", "Camry", "Avensis", "Prius", "RAV4", "C-HR", "Hilux", "Prado", "Land Cruiser"],
  "Hyundai": ["i10", "i20", "i30", "Accent", "Elantra", "Tucson", "Santa Fe", "Sonata"],
  "Kia": ["Picanto", "Rio", "Cerato", "Optima", "Sportage", "Sorento"],
  "Dacia": ["Logan", "Sandero", "Duster", "Dokker", "Lodgy"],
};

const YEARS = Array.from({ length: 2026 - 1980 }, (_, i) => (2025 - i).toString());

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
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [listingType, setListingType] = useState<string>("part");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [manualPartName, setManualPartName] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [manualBrand, setManualBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [manualModel, setManualModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [damagePercentage, setDamagePercentage] = useState<number>(0);

  const partsList = useMemo(() => {
    return selectedCategory ? CATEGORY_DATA[selectedCategory as keyof typeof CATEGORY_DATA] : [];
  }, [selectedCategory]);

  const modelsList = useMemo(() => {
    return selectedBrand && selectedBrand !== "Other" ? BRAND_MODELS[selectedBrand] || [] : [];
  }, [selectedBrand]);

  const communesList = useMemo(() => {
    return selectedWilaya ? WILAYAS_DATA[selectedWilaya] || [] : [];
  }, [selectedWilaya]);

  const handlePostListing = async () => {
    setLoading(true);
    
    // Notify admin if "Other" is used for Brand, Model, or Part Type
    if (selectedBrand === "Other" || selectedModel === "Other" || selectedPart === "Other") {
      if (firestore) {
        await addDoc(collection(firestore, "complaints"), {
          subject: "طلب إضافة بيانات جديدة للقوائم",
          details: `البائع طلب إضافة: 
            الماركة: ${manualBrand || selectedBrand}, 
            الموديل: ${manualModel || selectedModel}, 
            نوع القطعة: ${manualPartName || selectedPart}`,
          userType: "seller",
          category: "Technical Problem",
          status: "New",
          priority: "High",
          createdAt: serverTimestamp()
        });
      }
    }

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم نشر الإعلان بنجاح!",
        description: "إعلانك الآن متاح للمشترين. تم إشعار الإدارة بالبيانات الجديدة إن وجدت.",
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
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-destructive/5 border-b flex flex-row-reverse items-center gap-2">
                  <CarFront size={20} className="text-primary" />
                  <CardTitle className="text-lg text-right">بيانات المركبة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-right" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">الماركة</Label>
                      <Select onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(""); }}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(BRAND_MODELS).sort().map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          <SelectItem value="Other" className="font-black text-secondary">آخر (إضافة ماركة جديدة) +</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedBrand === "Other" && (
                        <Input 
                          placeholder="أدخل اسم الماركة يدوياً..." 
                          className="mt-2 border-secondary animate-in slide-in-from-top-1" 
                          value={manualBrand}
                          onChange={(e) => setManualBrand(e.target.value)}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">الموديل</Label>
                      <Select disabled={!selectedBrand} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                        <SelectContent>
                          {modelsList.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          <SelectItem value="Other" className="font-black text-secondary">آخر (إضافة موديل جديد) +</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedModel === "Other" && (
                        <Input 
                          placeholder="أدخل اسم الموديل يدوياً..." 
                          className="mt-2 border-secondary animate-in slide-in-from-top-1" 
                          value={manualModel}
                          onChange={(e) => setManualModel(e.target.value)}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold flex items-center justify-end gap-1"><Calendar size={14} /> سنة الصنع</Label>
                      <Select onValueChange={setSelectedYear}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                        <SelectContent>
                          {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
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
                            <SelectItem value="Other" className="font-black text-secondary">آخر (إضافة نوع جديد) +</SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedPart === "Other" && (
                          <Input 
                            placeholder="أدخل اسم القطعة يدوياً..." 
                            className="mt-2 border-secondary animate-in slide-in-from-top-1" 
                            value={manualPartName}
                            onChange={(e) => setManualPartName(e.target.value)}
                          />
                        )}
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
                      <Select onValueChange={setSelectedWilaya}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                        <SelectContent>{Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">البلدية</Label>
                      <Select disabled={!selectedWilaya}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="اختر البلدية" /></SelectTrigger>
                        <SelectContent>
                          {communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
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
