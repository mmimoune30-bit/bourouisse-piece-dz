
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserPlus, ArrowLeft, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function JoinSelectionPage() {
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const t = {
    title: { AR: "انضم إلى مجتمع بورويس", EN: "Join the Bourouisse Community", FR: "Rejoignez la Communauté Bourouisse" },
    subtitle: { AR: "اختر نوع الحساب الذي يناسب احتياجاتك لبدء التجربة", EN: "Choose the account type that fits your needs to start.", FR: "Choisissez le type de compte qui vous convient." },
    sellerTitle: { AR: "أريد البيع (متجر)", EN: "I want to Sell (Store)", FR: "Je veux Vendre (Boutique)" },
    sellerDesc: { AR: "افتح متجرك الاحترافي، اعرض منتجاتك، وتواصل مع آلاف المشترين في كافة ولايات الجزائر.", EN: "Open your professional store, showcase your products, and reach thousands of buyers across Algeria.", FR: "Ouvrez votre boutique, affichez vos produits et touchez des milliers d'acheteurs en Algérie." },
    sellerF1: { AR: "لوحة تحكم متقدمة لإدارة المخزون", EN: "Advanced dashboard for inventory", FR: "Tableau de bord avancé" },
    sellerF2: { AR: "ترويج ذكي لمنتجاتك", EN: "Smart product promotion", FR: "Promotion intelligente" },
    sellerBtn: { AR: "سجل كبائع", EN: "Register as Seller", FR: "S'inscrire comme Vendeur" },
    buyerTitle: { AR: "أريد الشراء (عميل)", EN: "I want to Buy (Customer)", FR: "Je veux Acheter (Client)" },
    buyerDesc: { AR: "ابحث عن قطع الغيار، قارن الأسعار، وتواصل مباشرة مع البائعين الموثوقين.", EN: "Find parts, compare prices, and connect directly with trusted sellers.", FR: "Trouvez des pièces, comparez les prix et contactez les vendeurs." },
    buyerF1: { AR: "قائمة المفضلة لحفظ القطع", EN: "Wishlist to save items", FR: "Liste de souhaits" },
    buyerF2: { AR: "تنبيهات بجديد القطع المطلوبة", EN: "Alerts for new parts", FR: "Alertes nouveautés" },
    buyerBtn: { AR: "سجل كمشتري", EN: "Register as Buyer", FR: "S'inscrire comme Acheteur" },
    already: { AR: "لديك حساب بالفعل؟ سجل دخولك الآن", EN: "Already have an account? Login now", FR: "Déjà un compte ? Connectez-vous" }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pb-12 flex items-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
             <h1 className="text-3xl md:text-4xl font-black text-primary mb-4 uppercase">{t.title[lang]}</h1>
             <p className="text-muted-foreground text-base md:text-lg font-bold">{t.subtitle[lang]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
              <div className="h-2 bg-secondary" />
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-secondary/10 rounded-[32px] flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Store size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary mb-2 uppercase">{t.sellerTitle[lang]}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed font-bold">
                    {t.sellerDesc[lang]}
                  </p>
                </div>
                <ul className={cn("space-y-3", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <ShieldCheck size={18} className="text-green-500 shrink-0" /> {t.sellerF1[lang]}
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <Zap size={18} className="text-secondary shrink-0" /> {t.sellerF2[lang]}
                   </li>
                </ul>
                <Link href="/seller/register" className="block">
                  <Button className="w-full h-14 text-lg font-black gap-2 shadow-lg bg-primary hover:bg-secondary hover:text-primary transition-all uppercase">
                    {t.sellerBtn[lang]} <ArrowLeft size={20} className={lang !== 'AR' ? 'rotate-180' : ''} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
              <div className="h-2 bg-primary" />
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <UserPlus size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary mb-2 uppercase">{t.buyerTitle[lang]}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed font-bold">
                    {t.buyerDesc[lang]}
                  </p>
                </div>
                <ul className={cn("space-y-3", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <ShieldCheck size={18} className="text-green-500 shrink-0" /> {t.buyerF1[lang]}
                   </li>
                   <li className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                     <Zap size={18} className="text-secondary shrink-0" /> {t.buyerF2[lang]}
                   </li>
                </ul>
                <Link href="/buyer/register" className="block">
                  <Button variant="outline" className="w-full h-14 text-lg font-black gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all uppercase">
                    {t.buyerBtn[lang]} <ArrowLeft size={20} className={lang !== 'AR' ? 'rotate-180' : ''} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/login" className="text-primary font-black hover:underline flex items-center justify-center gap-2 uppercase">
              {t.already[lang]} <ArrowRight size={18} className={lang !== 'AR' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
