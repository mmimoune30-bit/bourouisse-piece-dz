"use client";

import { use, useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Send, MapPin, Phone, User, CheckCircle2, ShieldCheck, AlertCircle, ChevronRight, ChevronLeft, X, ZoomIn, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { WILAYAS_DATA } from "@/lib/algeria-locations";
import { useLanguage, getDirection } from "@/lib/i18n";
import { useDoc } from "@/firebase";
import Image from "next/image";

const purchaseText = {
  AR: { title: "تأكيد طلب الشراء", subtitle: "أدخل بياناتك ليتمكن البائع من شحن القطعة إليك.", back: "رجوع", buyer: "بيانات المشتري", summary: "ملخص الطلب", fullName: "الاسم الكامل", namePlaceholder: "الاسم واللقب", phone: "رقم الهاتف", phonePlaceholder: "05/06/07...", email: "البريد الإلكتروني", emailPlaceholder: "example@mail.com", quantity: "الكمية المطلوبة", wilaya: "الولاية", wilayaPlaceholder: "اختر الولاية", commune: "البلدية", communePlaceholder: "اختر البلدية", address: "عنوان التوصيل بالتفصيل", addressPlaceholder: "الحي، رقم الباب...", notes: "ملاحظات إضافية للبائع", notesPlaceholder: "مثلاً: يرجى التأكد من حالة التغليف...", itemPrice: "سعر القطعة:", delivery: "التوصيل:", byWilaya: "حسب الولاية", total: "المجموع:", safety: "تسوق بأمان مع منصة بورويس. بياناتك محمية ولن يتم دفع أي مبلغ إلا عند الاستلام أو عبر وسيلة دفع آمنة.", submit: "إتمام الطلب الآن", sending: "جاري الإرسال...", afterTitle: "ماذا يحدث بعد الطلب؟", afterText: "سيصل إشعار فوري للبائع بطلبك. سيقوم البائع بمراجعة التوفر والاتصال بك هاتفياً لتأكيد الشحن. يمكنك متابعة حالة الطلب من لوحة تحكم المشتري.", thanks: "شكراً لك!", sent: "تم إرسال طلب الشراء الخاص بك للبائع. سيقوم صاحب المتجر بالتواصل معك قريباً لتأكيد التوصيل والدفع.", tracking: "رقم تتبع الطلب", home: "العودة للرئيسية", browse: "تصفح المزيد" },
  EN: { title: "Confirm purchase", subtitle: "Enter your details so the seller can ship the part to you.", back: "Back", buyer: "Buyer details", summary: "Order summary", fullName: "Full name", namePlaceholder: "Full name", phone: "Phone number", phonePlaceholder: "05/06/07...", email: "Email", emailPlaceholder: "example@mail.com", quantity: "Quantity", wilaya: "Wilaya", wilayaPlaceholder: "Choose wilaya", commune: "Commune", communePlaceholder: "Choose commune", address: "Detailed delivery address", addressPlaceholder: "District, door number...", notes: "Additional notes for seller", notesPlaceholder: "For example: please check the packaging...", itemPrice: "Item price:", delivery: "Delivery:", byWilaya: "Based on wilaya", total: "Total:", safety: "Shop safely with Bourouisse. Your data is protected and no payment is made until delivery or through a secure payment method.", submit: "Complete order", sending: "Sending...", afterTitle: "What happens next?", afterText: "The seller will receive an instant notification. They will check availability and contact you by phone to confirm shipping. You can track your order from the buyer dashboard.", thanks: "Thank you!", sent: "Your purchase request was sent to the seller. The store owner will contact you soon to confirm delivery and payment.", tracking: "Order tracking number", home: "Back to home", browse: "Browse more" },
  FR: { title: "Confirmer l'achat", subtitle: "Saisissez vos informations pour que le vendeur puisse vous expédier la pièce.", back: "Retour", buyer: "Informations de l'acheteur", summary: "Résumé de la commande", fullName: "Nom complet", namePlaceholder: "Nom et prénom", phone: "Numéro de téléphone", phonePlaceholder: "05/06/07...", email: "E-mail", emailPlaceholder: "example@mail.com", quantity: "Quantité", wilaya: "Wilaya", wilayaPlaceholder: "Choisir la wilaya", commune: "Commune", communePlaceholder: "Choisir la commune", address: "Adresse de livraison détaillée", addressPlaceholder: "Quartier, numéro de porte...", notes: "Notes supplémentaires pour le vendeur", notesPlaceholder: "Exemple : veuillez vérifier l'emballage...", itemPrice: "Prix de la pièce :", delivery: "Livraison :", byWilaya: "Selon la wilaya", total: "Total :", safety: "Achetez en toute sécurité avec Bourouisse. Vos données sont protégées et aucun paiement ne sera effectué avant la livraison ou via un moyen sécurisé.", submit: "Finaliser la commande", sending: "Envoi...", afterTitle: "Que se passe-t-il après ?", afterText: "Le vendeur recevra une notification immédiate. Il vérifiera la disponibilité et vous contactera par téléphone pour confirmer l'expédition. Vous pouvez suivre votre commande depuis le tableau de bord acheteur.", thanks: "Merci !", sent: "Votre demande d'achat a été envoyée au vendeur. Le propriétaire du magasin vous contactera bientôt pour confirmer la livraison et le paiement.", tracking: "Numéro de suivi", home: "Retour à l'accueil", browse: "Voir plus de pièces" }
} as const;

export default function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { lang } = useLanguage();
  const text = purchaseText[lang];
  const direction = getDirection(lang);
  const { firestore } = useFirestore();
  const { user } = useUser();

  const productRef = useMemo(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, "listings", productId);
  }, [firestore, productId]);
  const { data: product, loading: productLoading } = useDoc(productRef);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const productImages = Array.isArray(product?.images)
    ? product.images.filter((image: unknown): image is string => typeof image === "string" && image.trim().length > 0)
    : [];
  const firstProductImage = product?.images?.[0] || "";
  const activeImage = productImages[selectedImage] || firstProductImage;
  const productName = product?.title || product?.name || "";
  const productPrice = Number(product?.price || 0);
  const productStoreName = product?.storeName || product?.sellerName || "";

  const communesList = useMemo(() => {
    return selectedWilaya ? WILAYAS_DATA[selectedWilaya] || [] : [];
  }, [selectedWilaya]);

  const handlePostRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const data = {
      requestNumber,
      productId: product.id,
      productName,
      sellerId: product.sellerId || "",
      storeName: productStoreName,
      buyerId: user?.uid || "guest",
      buyerName: formData.get("buyerName") as string,
      buyerPhone: formData.get("buyerPhone") as string,
      buyerEmail: formData.get("buyerEmail") as string,
      wilaya: formData.get("wilaya") as string,
      commune: formData.get("commune") as string,
      quantity: Number(formData.get("quantity")),
      deliveryAddress: formData.get("address") as string,
      notes: formData.get("notes") as string,
      status: "New",
      createdAt: serverTimestamp()
    };

    addDoc(collection(firestore, "purchase_requests"), data)
      .then((docRef) => {
        setSubmitting(false);
        setSubmitted(true);
        setRequestId(docRef.id);
        toast({ title: "تم إرسال الطلب", description: "تم إرسال طلب الشراء للبائع بنجاح." });
      })
      .catch(async (error) => {
        setSubmitting(false);
        const permissionError = new FirestorePermissionError({
          path: "purchase_requests",
          operation: "create",
          requestResourceData: data
        });
        errorEmitter.emit("permission-error", permissionError);
      });
  };

  const showPreviousImage = () => {
    setSelectedImage((current) => (current - 1 + productImages.length) % productImages.length);
    setIsZoomed(false);
  };

  const showNextImage = () => {
    setSelectedImage((current) => (current + 1) % productImages.length);
    setIsZoomed(false);
  };

  if (productLoading || !product) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 font-bold text-primary" role="status">
            {productLoading ? <><Loader2 className="animate-spin" size={24} /> {lang === "AR" ? "جاري تحميل بيانات المنتج..." : lang === "EN" ? "Loading product details..." : "Chargement du produit..."}</> : (lang === "AR" ? "المنتج غير موجود" : lang === "EN" ? "Product not found" : "Produit introuvable")}
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[24px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl text-center p-8 rounded-[40px] bg-white" dir={direction}>
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-primary mb-2">{text.thanks}</h1>
            <p className="text-muted-foreground font-bold mb-8">
              {text.sent}
            </p>
            <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-dashed border-primary/10 mb-8">
               <p className="text-xs font-black text-muted-foreground mb-1 uppercase">{text.tracking}</p>
               <p className="text-xl font-black text-primary font-mono">{requestId.substring(0, 8).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-14 font-black rounded-2xl" onClick={() => router.push("/")}>{text.home}</Button>
              <Button variant="outline" className="w-full h-14 font-black rounded-2xl" onClick={() => router.push("/catalog")}>{text.browse}</Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-0 pb-6">
        <div className="container mx-auto px-4 max-w-4xl" dir={direction}>
           <div className="mb-4 flex items-center justify-between flex-row-reverse">
             <div className="text-right space-y-1">
               <h1 className="text-2xl font-black text-primary flex items-center justify-end gap-2 leading-none">
                   {text.title} <ShoppingBag size={32} className="text-secondary" />
                </h1>
                <p className="text-muted-foreground text-xs">{text.subtitle}</p>
             </div>
             <Button variant="ghost" onClick={() => router.back()} className="gap-1 font-bold mb-4 h-9 px-2">
               <ChevronRight size={18} /> {text.back}
             </Button>
          </div>

          <form onSubmit={handlePostRequest}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-none shadow-xl overflow-hidden rounded-[32px]">
                  <CardHeader className="bg-gray-900 text-white p-4 text-right">
                    <CardTitle className="text-lg flex items-center justify-end gap-2">
                       <User size={18} className="text-secondary" /> {text.buyer}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 text-right" dir={direction}>
                      <div className="space-y-1">
                        <Label className="font-black">{text.fullName}</Label>
                        <Input name="buyerName" placeholder={text.namePlaceholder} required className="h-9 border-2" />
                      </div>
                      <div className="space-y-1">
                        <Label className="font-black">{text.phone}</Label>
                        <Input name="buyerPhone" placeholder={text.phonePlaceholder} required className="h-9 border-2" />
                      </div>
                      <div className="space-y-1">
                        <Label className="font-black">{text.email}</Label>
                        <Input name="buyerEmail" type="email" placeholder={text.emailPlaceholder} className="h-9 border-2" />
                      </div>
                      <div className="space-y-1">
                        <Label className="font-black">{text.quantity}</Label>
                        <Input name="quantity" type="number" defaultValue="1" min="1" className="h-9 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">{text.wilaya}</Label>
                        <Select name="wilaya" required onValueChange={setSelectedWilaya}>
                          <SelectTrigger className="h-9 border-2"><SelectValue placeholder={text.wilayaPlaceholder} /></SelectTrigger>
                          <SelectContent>
                            {Object.keys(WILAYAS_DATA).sort().map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black">{text.commune}</Label>
                        <Select name="commune" required disabled={!selectedWilaya}>
                          <SelectTrigger className="h-9 border-2"><SelectValue placeholder={text.communePlaceholder} /></SelectTrigger>
                          <SelectContent>
                            {communesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    <div className="space-y-1">
                      <Label className="font-black">{text.address}</Label>
                      <Textarea name="address" placeholder={text.addressPlaceholder} required className="min-h-[56px] border-2" />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-black">{text.notes}</Label>
                      <Textarea name="notes" placeholder={text.notesPlaceholder} className="min-h-[56px] border-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-secondary text-primary p-4 text-right">
                    <CardTitle className="text-lg font-black">{text.summary}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-right" dir="rtl">
                    {productImages.length > 0 ? (
                      <>
                        <button type="button" className="group relative h-28 w-full overflow-hidden rounded-xl border bg-zinc-100" onClick={() => setIsGalleryOpen(true)} aria-label="Open product gallery">
                          <Image src={activeImage} alt={productName} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/65 p-1.5 text-white"><ZoomIn size={14} /></span>
                        </button>
                        <div className="flex gap-2 border-b pb-3" role="list" aria-label="Product images">
                          {productImages.map((image: string, index: number) => (
                            <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(index)} className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-secondary" : "border-transparent"}`} aria-label={`View product image ${index + 1}`}>
                              <Image src={image} alt="" fill className="object-cover" />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed bg-zinc-100 text-xs font-bold text-zinc-400">
                        {lang === "AR" ? "لا توجد صورة متاحة" : lang === "EN" ? "No image available" : "Aucune image disponible"}
                      </div>
                    )}
                    <div className="flex gap-3">
                       <div>
                         <h4 className="font-black text-sm text-primary leading-tight">{productName}</h4>
                         <p className="text-[10px] text-muted-foreground mt-1">{productStoreName}</p>
                       </div>
                    </div>
                    <div className="space-y-1 py-1">
                       <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">{text.itemPrice}</span>
                         <span className="font-black">{productPrice.toLocaleString()} دج</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">{text.delivery}</span>
                         <span className="text-green-600 font-bold">{text.byWilaya}</span>
                       </div>
                       <div className="pt-2 border-t flex justify-between items-center">
                         <span className="font-black text-lg text-primary">{text.total}</span>
                         <span className="font-black text-2xl text-orange-600">{productPrice.toLocaleString()} دج</span>
                       </div>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-2xl border flex items-start gap-2">
                       <ShieldCheck className="text-green-600 shrink-0" size={16} />
                       <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                         {text.safety}
                       </p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full h-12 bg-primary text-white text-base font-black rounded-2xl gap-2 shadow-xl hover:bg-secondary hover:text-primary transition-all mt-2"
                    >
                      {submitting ? text.sending : text.submit} <Send size={24} />
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[32px] flex flex-row-reverse gap-4">
                   <AlertCircle className="text-blue-600 shrink-0" size={24} />
                   <div className="text-right">
                      <h4 className="font-black text-sm text-blue-900">{text.afterTitle}</h4>
                      <p className="text-[11px] text-blue-800 mt-2 leading-relaxed font-bold">
                        {text.afterText}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label="Product image gallery" onClick={() => setIsGalleryOpen(false)}>
          <div className="relative flex h-full w-full max-w-5xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setIsGalleryOpen(false)} className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 text-black" aria-label="Close gallery"><X size={22} /></button>
            <button type="button" onClick={showPreviousImage} className="absolute left-2 z-10 rounded-full bg-white/90 p-2 text-black" aria-label="Previous image"><ChevronLeft size={24} /></button>
            <button type="button" onClick={showNextImage} className="absolute right-2 z-10 rounded-full bg-white/90 p-2 text-black" aria-label="Next image"><ChevronRight size={24} /></button>
            <button type="button" className="relative h-[75vh] w-full max-w-4xl" onClick={() => setIsZoomed((zoomed) => !zoomed)} aria-label="Toggle image zoom">
              <Image src={activeImage} alt={productName} fill className={`object-contain transition-transform duration-300 ${isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl bg-black/60 p-2">
              {productImages.map((image: string, index: number) => (
                <button key={`${image}-lightbox-${index}`} type="button" onClick={() => { setSelectedImage(index); setIsZoomed(false); }} className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-secondary" : "border-white/40"}`} aria-label={`Select product image ${index + 1}`}>
                  <Image src={image} alt="" fill className="object-cover" />
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
