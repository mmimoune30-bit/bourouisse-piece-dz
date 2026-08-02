
"use client";

import { use, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MapPin, 
  Truck, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertCircle, 
  MessageCircle,
  ShoppingCart,
  Zap,
  Loader2,
  Cpu,
  Calendar,
  Hash,
  ChevronLeft,
  PackageSearch
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, where, limit, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.514 10.603a1.5 1.5 0 1 1-2.923-.66 5.864 5.864 0 0 0-4.534-4.534 1.5 1.5 0 1 1-.66-2.923 8.864 8.864 0 0 1 8.117 8.117zm-4.321 0a1.5 1.5 0 1 1-2.923-.66c.21-.926.862-1.683 1.734-2.1l1.189 2.76zm8.807 1.397c0 8.837-7.163 16-16 16S0 20.837 0 12 7.163-4 16-4s16 7.163 16 16zm-7.608 2.015s-.764-1.254-1.04-1.854l-1.012.357s-.348.125-.563-.122l-1.554-1.802s-.216-.247-.091-.462l.357-1.012c-.6-.276-1.854-1.04-1.854-1.04-.333-.146-.68.126-.68.126l-1.002 1.488s-.361.542-.11 1.25c.346.974 1.63 2.94 2.808 4.043 1.178 1.103 3.327 2.128 4.293 2.3 1.05.187 1.517-.23 1.517-.23l1.411-1.127s.245-.333.02-.562l-2.5-2.247s-.233-.208-.51 0z"/></svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 7.007l-2.003 9.444c-.151.67-.93.945-1.464.514l-3.21-2.584-1.543 1.485c-.176.17-.46.185-.651.034l-.066-.062-.03-.028-2.618-2.02c-.538-.414-.492-1.233.088-1.583l9.043-5.467c.54-.327 1.171.168 1.03 1.267z"/></svg>
);

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { firestore } = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN" | "FR">("AR");

  const productRef = useMemo(() => {
    if (!firestore || !resolvedParams.id) return null;
    return doc(firestore, "listings", resolvedParams.id);
  }, [firestore, resolvedParams.id]);

  const { data: product, loading } = useDoc(productRef);

  const sellerListingsQuery = useMemo(() => {
    if (!firestore || !product?.sellerId) return null;
    return query(
      collection(firestore, "listings"),
      where("sellerId", "==", product.sellerId),
      where("status", "==", "Active"),
      limit(6)
    );
  }, [firestore, product?.sellerId]);

  const { data: otherListings, loading: loadingOthers } = useCollection(sellerListingsQuery);

  const filteredOthers = useMemo(() => {
    return otherListings?.filter(l => l.id !== resolvedParams.id) || [];
  }, [otherListings, resolvedParams.id]);

  useEffect(() => {
    setMounted(true);
    const checkLang = () => {
      const savedLang = localStorage.getItem("app_lang") as "AR" | "EN" | "FR";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("languageChange", checkLang);
    return () => window.removeEventListener("languageChange", checkLang);
  }, []);

  const t = {
    delivery: { AR: "التوصيل متوفر لـ 58 ولاية", EN: "Delivery available to 58 wilayas", FR: "Livraison disponible dans 58 wilayas" },
    cart: { AR: "سلة المشتريات", EN: "Shopping Cart", FR: "Panier" },
    buyNow: { AR: "شراء الآن", EN: "Buy Now", FR: "Acheter" },
    trusted: { AR: "بائع موثوق", EN: "Verified Seller", FR: "Vendeur Vérifié" },
    viber: { AR: "فايبر", EN: "Viber", FR: "Viber" },
    whatsapp: { AR: "واتساب", EN: "WhatsApp", FR: "WhatsApp" },
    telegram: { AR: "تليجرام", EN: "Telegram", FR: "Telegram" },
    callNow: { AR: "اتصل الآن", EN: "Call Now", FR: "Appeler" },
    disclaimer: { AR: "هذا الإعلان مقدم عبر منصة بورويس. أي خدمة هي مسؤولية صاحب الإعلان.", EN: "This ad is provided via Bourouisse. Services are the responsibility of the advertiser.", FR: "Cette annonce est fournie via Bourouisse. Les services incombent à l'annonceur." },
    specs: { AR: "المواصفات التقنية", EN: "Technical Specifications", FR: "Spécifications Techniques" },
    condition: { AR: "الحالة", EN: "Condition", FR: "État" },
    new: { AR: "جديد", EN: "New", FR: "Neuf" },
    used: { AR: "مستعمل", EN: "Used", FR: "Occasion" },
    quantity: { AR: "الكمية", EN: "Quantity", FR: "Quantité" },
    piece: { AR: "قطعة", EN: "piece", FR: "pièce" },
    store: { AR: "المتجر", EN: "Store", FR: "Boutique" },
    fuel: { AR: "نوع الطاقة", EN: "Fuel Type", FR: "Énergie" },
    brand: { AR: "الماركة", EN: "Brand", FR: "Marque" },
    model: { AR: "الموديل", EN: "Model", FR: "Modèle" },
    year: { AR: "السنة", EN: "Year", FR: "Année" },
    posted: { AR: "تاريخ النشر", EN: "Posted Date", FR: "Publié le" },
    description: { AR: "وصف المنتج", EN: "Product Description", FR: "Description" },
    noDescription: { AR: "لا يوجد وصف إضافي لهذه القطعة.", EN: "No additional description for this part.", FR: "Aucune description supplémentaire." },
    notFound: { AR: "عذراً، الإعلان غير موجود.", EN: "Sorry, the ad was not found.", FR: "Désolé, l'annonce est introuvable." },
    loading: { AR: "جاري التحميل...", EN: "Loading...", FR: "Chargement..." },
    addedToCart: { AR: "تم إضافة القطعة إلى سلتك بنجاح.", EN: "Item added to your cart successfully.", FR: "Article ajouté au panier avec succès." },
    noPhone: { AR: "رقم الهاتف غير متوفر لهذا الإعلان.", EN: "Phone number not available for this ad.", FR: "Numéro non disponible pour cette annonce." },
    moreFromSeller: { AR: "إعلانات أخرى من نفس البائع", EN: "More ads from this seller", FR: "Autres annonces du vendeur" }
  };

  const handleContact = (platform: 'whatsapp' | 'viber' | 'telegram' | 'phone') => {
    if (!product?.phone && !product?.sellerPhone) {
      toast({ variant: "destructive", title: lang === 'AR' ? "تنبيه" : "Alert", description: t.noPhone[lang] });
      return;
    }
    const phone = (product.phone || product.sellerPhone).replace(/\s/g, '');
    const message = `مرحباً، أنا مهتم بقطعة: ${product.name}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/${phone.startsWith('0') ? '213' + phone.substring(1) : phone}?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'viber':
        window.open(`viber://chat?number=${phone.startsWith('0') ? '213' + phone.substring(1) : phone}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/+${phone.startsWith('0') ? '213' + phone.substring(1) : phone}`, '_blank');
        break;
      case 'phone':
        window.location.href = `tel:${phone}`;
        break;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black text-2xl animate-pulse"><Loader2 className="animate-spin mr-2" /> {t.loading[lang]}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-black text-2xl">{t.notFound[lang]}</div>;
  }

  const formattedPrice = mounted ? Number(product.price).toLocaleString() : product.price;
  const getLocale = () => lang === 'AR' ? 'ar-DZ' : lang === 'EN' ? 'en-US' : 'fr-FR';
  const formattedDate = product.createdAt ? (
    typeof product.createdAt.toDate === 'function' 
      ? product.createdAt.toDate().toLocaleDateString(getLocale()) 
      : new Date(product.createdAt).toLocaleDateString(getLocale())
  ) : "-";

  const titleFont = lang === 'AR' ? 'font-black' : 'font-semibold';
  const normalFont = lang === 'AR' ? 'font-bold' : 'font-medium';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[190px] md:pt-[210px] pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-3 text-center space-y-1">
            <h1 className={cn("text-xl md:text-3xl text-zinc-800 tracking-tight leading-relaxed uppercase px-4", titleFont)}>
              {product.name}
            </h1>
            <div className={cn("flex items-center justify-center gap-2", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
               <span className={cn("text-orange-500 text-2xl md:text-3xl", lang === 'AR' ? 'font-black' : 'font-semibold')}>{formattedPrice} {lang === 'AR' ? 'دج' : 'DZD'}</span>
            </div>
          </div>

          <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-4", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
            
            <div className="lg:col-span-1 space-y-4">
              <Card className="border-orange-500 border-2 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">
                   <div className={cn("text-3xl md:text-4xl text-orange-600", lang === 'AR' ? 'font-black' : 'font-semibold')}>{formattedPrice} <span className="text-sm">دج</span></div>
                   <div className={cn("text-zinc-600 text-sm flex items-center gap-2", normalFont)}>
                     <Truck size={18} className="text-orange-500" /> {t.delivery[lang]}
                   </div>
                   <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full mt-1">
                     <Button 
                      className={cn("flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full gap-2 text-sm shadow-lg uppercase", lang === 'AR' ? 'font-black' : 'font-medium')}
                      onClick={() => toast({ title: t.cart[lang], description: t.addedToCart[lang] })}
                     >
                        <ShoppingCart size={18} /> {t.cart[lang]}
                     </Button>
                     <Link href={`/products/${product.id}/purchase`} className="flex-1">
                        <Button 
                          className={cn("w-full bg-zinc-900 hover:bg-black text-white h-12 px-8 rounded-full text-sm shadow-lg gap-2 uppercase", lang === 'AR' ? 'font-black' : 'font-medium')}
                        >
                          <Zap size={18} className="text-secondary" /> {t.buyNow[lang]}
                        </Button>
                     </Link>
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardContent className="p-4 space-y-4">
                   <div className={cn("flex items-center gap-4 text-zinc-700 border-b pb-3", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
                      <div className={lang === 'AR' ? "text-right" : "text-left"}>
                         <span className={cn("text-base block uppercase", titleFont)}>{product.sellerName}</span>
                         <span className={cn("text-xs text-muted-foreground", normalFont)}>{product.wilaya || t.trusted[lang]}</span>
                      </div>
                      <MapPin size={22} className="text-orange-500 shrink-0" />
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className={cn("h-10 rounded-xl bg-[#7360f2] text-white hover:bg-[#6250d1] border-none text-[10px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-medium')} onClick={() => handleContact('viber')}>
                         <ViberIcon /> {t.viber[lang]}
                      </Button>
                      <Button variant="outline" className={cn("h-10 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebd57] border-none text-[10px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-medium')} onClick={() => handleContact('whatsapp')}>
                         <MessageCircle size={16} /> {t.whatsapp[lang]}
                      </Button>
                      <Button variant="outline" className={cn("h-10 rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] border-none text-[10px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-medium')} onClick={() => handleContact('telegram')}>
                         <TelegramIcon /> {t.telegram[lang]}
                      </Button>
                   </div>

                   <Button className={cn("w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-3 text-lg shadow-xl", lang === 'AR' ? 'font-black' : 'font-semibold')} onClick={() => handleContact('phone')}>
                      <Phone size={20} /> {product.phone || t.callNow[lang]}
                   </Button>

                   <div className={cn("flex gap-2 items-start p-3 bg-zinc-50 rounded-2xl", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
                      <AlertCircle className="text-zinc-400 shrink-0 mt-0.5" size={14} />
                      <p className={cn("text-[10px] text-zinc-500 leading-relaxed", normalFont, lang === 'AR' ? "text-right" : "text-left")}>
                         {t.disclaimer[lang]}
                      </p>
                   </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {product.images?.map((img: string, i: number) => (
                   <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-md border-2 border-white group">
                      <Image src={img} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority={i === 0} />
                   </div>
                 ))}
              </div>

              <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6 md:p-8 space-y-4">
                   <h2 className={cn("text-xl md:text-2xl text-primary border-orange-500 uppercase", titleFont, lang === 'AR' ? "border-r-8 pr-4" : "border-l-8 pl-4")}>
                      {t.specs[lang]}
                   </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 text-sm">
                      <div className="space-y-2">
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.condition[lang]}</span>
                            <Badge className={cn("h-7 px-4 uppercase", titleFont)}>{product.condition === 'new' ? t.new[lang] : t.used[lang]}</Badge>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.quantity[lang]}</span>
                            <span className={cn("text-orange-600", titleFont)}>{product.quantity || 1} {t.piece[lang]}</span>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.store[lang]}</span>
                            <span className={cn("text-primary uppercase", titleFont)}>{product.sellerName}</span>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.fuel[lang]}</span>
                            <span className={cn("text-primary uppercase", titleFont)}>{product.fuelType || "-"}</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.brand[lang]}</span>
                            <span className={cn("text-primary uppercase", titleFont)}>{product.brand}</span>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.model[lang]}</span>
                            <span className={cn("text-primary uppercase", titleFont)}>{product.model}</span>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.year[lang]}</span>
                            <span className={cn("text-primary uppercase", titleFont)}>{product.year}</span>
                         </div>
                         <div className={cn("flex justify-between border-b pb-2 items-center", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                            <span className={cn("text-zinc-500 uppercase", normalFont)}>{t.posted[lang]}</span>
                            <span className={cn("text-zinc-400 text-xs md:text-sm", titleFont)}>{formattedDate}</span>
                         </div>
                      </div>
                   </div>
                   <div className="pt-4 border-t">
                      <h4 className={cn("text-primary mb-2 text-base uppercase", titleFont)}>{t.description[lang]}</h4>
                      <p className={cn("text-zinc-600 leading-relaxed whitespace-pre-line text-sm", normalFont)}>
                        {product.description || t.noDescription[lang]}
                      </p>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* More Ads Section */}
          {filteredOthers.length > 0 && (
            <div className="mt-12 space-y-4">
              <div 
                dir={lang === 'AR' ? "rtl" : "ltr"}
                className={cn("bg-zinc-100 px-6 py-3 flex items-center justify-between border-b-2 border-black/10 rounded-lg shadow-sm", lang === 'AR' ? "flex-row" : "flex-row-reverse")}
              >
                <h2 className={cn("text-lg md:text-xl text-black flex items-center gap-3 uppercase", titleFont)}>
                  {t.moreFromSeller[lang]} <PackageSearch size={24} className="text-secondary" />
                </h2>
                <Link href={`/catalog?query=${encodeURIComponent(product.sellerName)}`} className={cn("text-sm text-black hover:underline uppercase", titleFont)}>
                  عرض الكل
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" dir={lang === 'AR' ? "rtl" : "ltr"}>
                 {filteredOthers.map((item) => (
                   <ProductCard 
                      key={item.id} 
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      image={item.images?.[0] || "https://picsum.photos/seed/placeholder/400/400"}
                      category={item.category}
                      seller={item.sellerName}
                      condition={item.condition === 'new' ? 'New' : 'Used'}
                      createdAt={item.createdAt}
                   />
                 ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
