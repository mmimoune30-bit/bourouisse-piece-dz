"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Store, Loader2, ExternalLink, Search } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function StoresPage() {
  const { firestore } = useFirestore();
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");
  const [search, setSearch] = useState("");

  const sellersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "==", "Seller"), where("status", "==", "Active"), limit(100));
  }, [firestore]);

  const { data: stores = [], loading } = useCollection(sellersQuery);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((store) => {
      const values = [
        store.name,
        store.email,
        store.wilaya,
        store.commune,
        store.ownerName,
      ].filter(Boolean).join(" ").toLowerCase();
      return values.includes(q);
    });
  }, [stores, search]);

  const t = {
    title: { AR: "قائمة المتاجر المعتمدة", EN: "Approved Stores", FR: "Boutiques approuvées" },
    subtitle: {
      AR: "استعرض المتاجر المسجلة مع بيانات أساسية سريعة ومعاينة مباشرة.",
      EN: "Browse registered stores with their core information and quick preview.",
      FR: "Consultez les boutiques enregistrées avec leurs informations essentielles et une prévisualisation rapide.",
    },
    search: { AR: "بحث عن متجر", EN: "Search for a store", FR: "Rechercher une boutique" },
    owner: { AR: "المالك", EN: "Owner", FR: "Propriétaire" },
    location: { AR: "الموقع", EN: "Location", FR: "Localisation" },
    preview: { AR: "معاينة", EN: "Preview", FR: "Aperçu" },
    noStores: { AR: "لا توجد متاجر مسجلة حالياً.", EN: "No stores are currently registered.", FR: "Aucune boutique n'est actuellement enregistrée." },
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4" dir={lang === "AR" ? "rtl" : "ltr"}>
            <div className={cn("space-y-1", lang === "AR" ? "text-right" : "text-left")}>
              <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tight">{t.title[lang]}</h1>
              <p className="text-sm text-zinc-600 font-medium">{t.subtitle[lang]}</p>
            </div>

            <div className="w-full md:max-w-sm">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.search[lang]}
                  className="h-12 border-2 rounded-xl pr-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-500">
              <Loader2 className="animate-spin mr-2" size={28} />
              <span className="font-bold">Loading...</span>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center text-zinc-500 font-bold">
              {t.noStores[lang]}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" dir={lang === "AR" ? "rtl" : "ltr"}>
              {filteredStores.map((store) => (
                <Card key={store.id} className="overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary to-zinc-900 p-4 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                            <Store size={22} className="text-secondary" />
                          </div>
                          <div>
                            <h2 className="text-lg font-black line-clamp-1">{store.name || "Unnamed Store"}</h2>
                            <Badge className="bg-secondary text-primary text-[10px] font-black mt-1 rounded-full px-2 py-0.5">Approved</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-zinc-700">
                        <User size={16} className="text-secondary" />
                        <span className="text-sm font-bold">{t.owner[lang]}:</span>
                        <span className="text-sm">{store.ownerName || store.name || "Unknown"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-700">
                        <MapPin size={16} className="text-secondary" />
                        <span className="text-sm font-bold">{t.location[lang]}:</span>
                        <span className="text-sm">{store.wilaya || "غير محدد"}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                        <div className="text-xs text-zinc-500">
                          {store.email ? store.email : store.phone || "No contact"}
                        </div>
                        <Button asChild size="sm" className="bg-primary text-white hover:bg-black rounded-xl h-9 px-3">
                          <Link href={`/catalog?query=${encodeURIComponent(store.name || "")}`} className="inline-flex items-center gap-2 font-bold">
                            <ExternalLink size={14} /> {t.preview[lang]}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
