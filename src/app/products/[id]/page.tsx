
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
  ChevronRight,
  PackageSearch,
  X,
  ZoomIn,
  ZoomOut,
  ImageOff
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const productRef = useMemo(() => {
    if (!firestore || !resolvedParams.id) return null;
    return doc(firestore, "listings", resolvedParams.id);
  }, [firestore, resolvedParams.id]);

  const { data: product, loading } = useDoc(productRef);
  const productImages = Array.isArray(product?.images)
    ? product.images.filter((image: unknown): image is string => typeof image === "string" && image.trim().length > 0)
    : [];
  const galleryImages = productImages.filter((image: string) => !failedImages.includes(image));

  useEffect(() => {
    if (!isLightboxOpen || galleryImages.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") setSelectedImage((current) => (current + 1) % galleryImages.length);
      if (event.key === "ArrowRight") setSelectedImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);

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
  const selectImage = (index: number) => {
    setSelectedImage(index);
    setIsZoomed(false);
  };
  const showPreviousImage = () => selectImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
  const showNextImage = () => selectImage((selectedImage + 1) % galleryImages.length);
  const handleImageError = (image: string) => {
    setFailedImages((current) => current.includes(image) ? current : [...current, image]);
    setSelectedImage(0);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 items-start", lang === 'AR' ? "text-right" : "text-left")} dir={lang === 'AR' ? "rtl" : "ltr"}>
            <div className="order-1 md:order-2 space-y-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="space-y-3">
                  <div className={cn("flex items-center gap-2 flex-wrap text-xs text-zinc-500", lang === 'AR' ? "justify-end" : "justify-start")}>
                    <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100 uppercase">
                      {product.condition === 'new' ? t.new[lang] : t.used[lang]}
                    </Badge>
                    <span className="uppercase">{product.category || "Product"}</span>
                  </div>

                  <h1 className={cn("text-2xl md:text-3xl text-zinc-800 leading-snug uppercase", titleFont)}>
                    {product.name}
                  </h1>

                  <div className={cn("flex items-end gap-2", lang === 'AR' ? "justify-end" : "justify-start")}>
                    <span className={cn("text-3xl md:text-4xl text-orange-600", lang === 'AR' ? 'font-black' : 'font-bold')}>{formattedPrice}</span>
                    <span className={cn("text-lg md:text-xl text-orange-500", lang === 'AR' ? 'font-black' : 'font-semibold')}>دج</span>
                  </div>

                  <div className={cn("flex items-center gap-2 text-sm text-zinc-600", normalFont, lang === 'AR' ? "justify-end" : "justify-start")}>
                    <Truck size={18} className="text-orange-500" /> {t.delivery[lang]}
                  </div>
                </div>
              </div>

              <Card className="border border-orange-200 shadow-sm rounded-2xl bg-gradient-to-br from-orange-50 to-white overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className={cn("flex items-center gap-3", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-lg font-black shrink-0">
                      {product.sellerName?.charAt(0) || 'B'}
                    </div>
                    <div className={lang === 'AR' ? "text-right" : "text-left"}>
                      <span className={cn("text-base block uppercase", titleFont)}>{product.sellerName}</span>
                      <span className={cn("text-xs text-orange-600 flex items-center gap-1", normalFont)}>
                        <MapPin size={12} /> {product.wilaya || t.trusted[lang]}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button variant="outline" className={cn("h-10 rounded-xl bg-[#7360f2] text-white hover:bg-[#6250d1] border-none text-[11px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-bold')} onClick={() => handleContact('viber')}>
                      <ViberIcon /> {t.viber[lang]}
                    </Button>
                    <Button variant="outline" className={cn("h-10 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebd57] border-none text-[11px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-bold')} onClick={() => handleContact('whatsapp')}>
                      <MessageCircle size={16} /> {t.whatsapp[lang]}
                    </Button>
                    <Button variant="outline" className={cn("h-10 rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] border-none text-[11px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-bold')} onClick={() => handleContact('telegram')}>
                      <TelegramIcon /> {t.telegram[lang]}
                    </Button>
                    <Button variant="outline" className={cn("h-10 rounded-xl bg-zinc-900 text-white hover:bg-black border-none text-[11px] shadow-sm uppercase", lang === 'AR' ? 'font-black' : 'font-bold')} onClick={() => handleContact('phone')}>
                      <Phone size={16} /> {t.callNow[lang]}
                    </Button>
                  </div>

                  <div className={cn("flex gap-3 items-start p-3 bg-white/80 rounded-xl border border-orange-100", lang === 'AR' ? "flex-row" : "flex-row-reverse")}>
                    <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                    <p className={cn("text-[11px] text-zinc-600 leading-relaxed", normalFont, lang === 'AR' ? "text-right" : "text-left")}>
                      {t.disclaimer[lang]}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className={cn("flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 text-sm shadow-md uppercase", lang === 'AR' ? 'font-black' : 'font-bold')}
                  onClick={() => toast({ title: t.cart[lang], description: t.addedToCart[lang] })}
                >
                  <ShoppingCart size={18} /> {t.cart[lang]}
                </Button>
                <Link href={`/products/${product.id}/purchase`} className="flex-1">
                  <Button
                    className={cn("w-full h-12 bg-zinc-900 hover:bg-black text-white rounded-xl gap-2 text-sm shadow-md uppercase", lang === 'AR' ? 'font-black' : 'font-bold')}
                  >
                    <Zap size={18} className="text-secondary" /> {t.buyNow[lang]}
                  </Button>
                </Link>
              </div>

              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <h2 className={cn("text-base md:text-lg text-primary border-orange-500 uppercase", titleFont, lang === 'AR' ? "border-r-4 pr-3" : "border-l-4 pl-3")}>
                    {t.specs[lang]}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.condition[lang]}</span>
                        <Badge className={cn("h-6 px-2 text-[10px] uppercase", titleFont)}>{product.condition === 'new' ? t.new[lang] : t.used[lang]}</Badge>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.quantity[lang]}</span>
                        <span className={cn("text-orange-600 text-xs", titleFont)}>{product.quantity || 1} {t.piece[lang]}</span>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.store[lang]}</span>
                        <span className={cn("text-primary text-xs uppercase", titleFont)}>{product.sellerName}</span>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.fuel[lang]}</span>
                        <span className={cn("text-primary text-xs uppercase", titleFont)}>{product.fuelType || "-"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.brand[lang]}</span>
                        <span className={cn("text-primary text-xs uppercase", titleFont)}>{product.brand}</span>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.model[lang]}</span>
                        <span className={cn("text-primary text-xs uppercase", titleFont)}>{product.model}</span>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.year[lang]}</span>
                        <span className={cn("text-primary text-xs uppercase", titleFont)}>{product.year}</span>
                      </div>
                      <div className={cn("flex justify-between border-b pb-1.5 items-center gap-3", lang === 'AR' ? "flex-row-reverse" : "flex-row")}>
                        <span className={cn("text-zinc-500 uppercase text-xs", normalFont)}>{t.posted[lang]}</span>
                        <span className={cn("text-zinc-400 text-[10px] md:text-xs", titleFont)}>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className={cn("text-primary mb-1.5 text-sm uppercase", titleFont)}>{t.description[lang]}</h4>
                    <p className={cn("text-zinc-600 leading-relaxed whitespace-pre-line text-xs", normalFont)}>
                      {product.description || t.noDescription[lang]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="order-2 md:order-1">
              <div className="rounded-2xl border border-zinc-200 bg-gray-50 p-2 shadow-sm">
                {galleryImages.length > 0 ? (
                  <>
                    <button type="button" className="group relative block aspect-square h-[320px] w-full overflow-hidden rounded-2xl bg-white" onClick={() => setIsLightboxOpen(true)} aria-label={lang === 'AR' ? "فتح معرض الصور" : lang === 'EN' ? "Open image gallery" : "Ouvrir la galerie d'images"}>
                      <Image src={galleryImages[selectedImage]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" priority unoptimized={galleryImages[selectedImage].includes("api.dicebear.com")} onError={() => handleImageError(galleryImages[selectedImage])} />
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/65 p-2 text-white"><ZoomIn size={16} /></span>
                    </button>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product thumbnails">
                      {galleryImages.map((image: string, index: number) => (
                        <button key={`${image}-${index}`} type="button" onClick={() => selectImage(index)} className={cn("relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white", selectedImage === index ? "border-secondary" : "border-zinc-200")} aria-label={`${lang === 'AR' ? "الصورة" : "Image"} ${index + 1}`}>
                          <Image src={image} alt="" fill sizes="64px" className="object-cover" unoptimized={image.includes("api.dicebear.com")} onError={() => handleImageError(image)} />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white text-zinc-400">
                    <ImageOff size={40} />
                    <span className="text-sm font-bold">{lang === 'AR' ? "لا توجد صورة متاحة" : lang === 'EN' ? "No image available" : "Aucune image disponible"}</span>
                  </div>
                )}
              </div>
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
                      image={Array.isArray(item.images) ? item.images[0] || "" : ""}
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

      {isLightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative flex h-full w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setIsLightboxOpen(false)} className="absolute right-2 top-2 z-20 rounded-full bg-white p-2 text-black shadow-lg" aria-label="Close gallery"><X size={22} /></button>
            <button type="button" onClick={showPreviousImage} className="absolute left-2 z-20 rounded-full bg-white p-2 text-black shadow-lg" aria-label="Previous image"><ChevronLeft size={24} /></button>
            <button type="button" onClick={showNextImage} className="absolute right-2 z-20 rounded-full bg-white p-2 text-black shadow-lg" aria-label="Next image"><ChevronRight size={24} /></button>
            <button type="button" onClick={() => setIsZoomed((current) => !current)} className="absolute bottom-24 right-2 z-20 rounded-full bg-white p-2 text-black shadow-lg" aria-label="Toggle zoom">{isZoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}</button>
            <div className="relative h-[78vh] w-full overflow-auto rounded-xl">
              <Image src={galleryImages[selectedImage]} alt={product.name} fill sizes="100vw" className={cn("object-contain transition-transform duration-300", isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in")} unoptimized={galleryImages[selectedImage].includes("api.dicebear.com")} onError={() => handleImageError(galleryImages[selectedImage])} />
            </div>
            <div className="absolute bottom-3 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/60 p-2">
              {galleryImages.map((image: string, index: number) => (
                <button key={`${image}-lightbox-${index}`} type="button" onClick={() => selectImage(index)} className={cn("relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2", selectedImage === index ? "border-secondary" : "border-white/40")} aria-label={`Select image ${index + 1}`}>
                  <Image src={image} alt="" fill sizes="56px" className="object-cover" unoptimized={image.includes("api.dicebear.com")} onError={() => handleImageError(image)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
