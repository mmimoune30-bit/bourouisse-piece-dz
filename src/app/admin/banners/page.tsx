
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ImagePlus, Save, Layout, Trash2, 
  Plus, Eye, AlertCircle, Sparkles, ArrowLeft, ChevronRight, Loader2 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

export default function BannerManagement() {
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // جلب البنرات من Firestore
  const bannersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "banners"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: banners = [], loading: loadingBanners } = useCollection(bannersQuery);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  useEffect(() => {
    if (banners.length > 0 && !editingBanner) {
      setEditingBanner(banners[0]);
    }
  }, [banners, editingBanner]);

  const handleSave = async () => {
    if (!firestore || !editingBanner) return;
    setLoading(true);
    try {
      if (editingBanner.id) {
        await updateDoc(doc(firestore, "banners", editingBanner.id), {
          ...editingBanner,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(firestore, "banners"), {
          ...editingBanner,
          createdAt: serverTimestamp()
        });
      }
      toast({ title: "تم الحفظ بنجاح ✅", description: "تم تحديث البنرات في الصفحة الرئيسية." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر حفظ البيانات." });
    } finally {
      setLoading(false);
    }
  };

  const addBanner = () => {
    const newBanner = {
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200",
      ar: { title: "عنوان جديد بالعربية", description: "وصف جديد للبانر بالعربية", button: "ابدأ الآن" },
      en: { title: "New English Title", description: "New English description for the banner", button: "Start Now" },
      active: true
    };
    setEditingBanner(newBanner);
    toast({ title: "وضع الإضافة", description: "يرجى إدخال بيانات البانر الجديد ثم الضغط على حفظ." });
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل تريد حذف هذا البانر نهائياً؟")) return;
    try {
      await deleteDoc(doc(firestore, "banners", id));
      toast({ title: "تم الحذف", description: "تمت إزالة البانر بنجاح." });
      if (editingBanner?.id === id) setEditingBanner(null);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر الحذف." });
    }
  };

  if (loadingBanners) return <div className="p-20 text-center animate-pulse font-black text-2xl">جاري تحميل نظام الإعلانات...</div>;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <Layout size={32} className="text-secondary" /> إدارة البنرات الإعلانية
          </h1>
          <p className="text-muted-foreground mt-1">تخصيص العروض والرسائل التسويقية ثنائية اللغة في الصفحة الرئيسية.</p>
        </div>
        <Button className="font-black gap-2 bg-secondary text-primary hover:bg-white h-12 px-8 rounded-xl shadow-lg" onClick={addBanner}>
          <Plus size={18} /> إضافة بنر جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Banner List */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="font-black text-lg border-r-4 border-secondary pr-3">قائمة البنرات الحالية ({banners.length})</h3>
          {banners.length === 0 ? (
            <Card className="p-10 text-center border-dashed border-2">
               <p className="text-muted-foreground font-bold">لا توجد بنرات مضافة بعد.</p>
            </Card>
          ) : banners.map((banner) => (
            <Card 
              key={banner.id} 
              className={cn(
                "border-none shadow-sm overflow-hidden group cursor-pointer transition-all",
                editingBanner?.id === banner.id ? "ring-2 ring-secondary" : "hover:ring-1 hover:ring-zinc-200"
              )} 
              onClick={() => setEditingBanner(banner)}
            >
              <div className="relative aspect-video">
                <Image src={banner.image} alt="Banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="sm" className="font-black gap-2 rounded-lg">
                     <Eye size={14} /> تعديل البيانات
                   </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center flex-row-reverse">
                  <h4 className="font-black text-primary truncate ml-4 text-sm">{banner.ar?.title || "بدون عنوان"}</h4>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(banner.id); }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editor Area */}
        <div className="xl:col-span-2 space-y-6">
          {editingBanner ? (
            <Card className="border-none shadow-xl sticky top-24 rounded-[32px] overflow-hidden">
              <CardHeader className="bg-primary text-white p-6">
                <CardTitle className="text-xl flex items-center justify-end gap-3 font-black">
                   محرر المحتوى ثنائي اللغة <Sparkles className="text-secondary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="ar" dir="rtl">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold">
                       <AlertCircle size={14} /> سيتم العرض حسب لغة المستخدم
                     </div>
                     <TabsList className="bg-zinc-100 h-12 p-1 rounded-xl">
                       <TabsTrigger value="ar" className="font-black px-8 rounded-lg">العربية (RTL)</TabsTrigger>
                       <TabsTrigger value="en" className="font-black px-8 rounded-lg">English (LTR)</TabsTrigger>
                     </TabsList>
                  </div>

                  {/* Arabic Content */}
                  <TabsContent value="ar" className="space-y-6">
                    <div className="space-y-2 text-right">
                      <Label className="font-black text-lg">العنوان (العربية)</Label>
                      <Input 
                        placeholder="أدخل العنوان الجذاب هنا..." 
                        className="h-14 text-xl font-black border-2 rounded-xl" 
                        value={editingBanner.ar?.title || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, ar: {...(editingBanner.ar || {}), title: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="font-black">الوصف (العربية)</Label>
                      <Textarea 
                        placeholder="شرح موجز للعرض أو الخدمة..." 
                        className="min-h-[120px] text-lg leading-relaxed border-2 rounded-xl font-bold" 
                        value={editingBanner.ar?.description || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, ar: {...(editingBanner.ar || {}), description: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="font-black">نص الزر (العربية)</Label>
                      <Input 
                        placeholder="مثلاً: ابدأ الآن، اشترك معنا..." 
                        className="h-12 font-black border-2 rounded-xl" 
                        value={editingBanner.ar?.button || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, ar: {...(editingBanner.ar || {}), button: e.target.value}})}
                      />
                    </div>
                  </TabsContent>

                  {/* English Content */}
                  <TabsContent value="en" className="space-y-6 text-left">
                    <div className="space-y-2">
                      <Label className="font-black text-lg">Title (English)</Label>
                      <Input 
                        placeholder="Enter catchy title..." 
                        className="h-14 text-xl font-black border-2 rounded-xl" 
                        dir="ltr" 
                        value={editingBanner.en?.title || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, en: {...(editingBanner.en || {}), title: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black">Description (English)</Label>
                      <Textarea 
                        placeholder="Brief explanation of offer..." 
                        className="min-h-[120px] text-lg leading-relaxed border-2 rounded-xl font-bold" 
                        dir="ltr" 
                        value={editingBanner.en?.description || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, en: {...(editingBanner.en || {}), description: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black">Button Text (English)</Label>
                      <Input 
                        placeholder="e.g. Join Now, Start Here..." 
                        className="h-12 font-black border-2 rounded-xl" 
                        dir="ltr" 
                        value={editingBanner.en?.button || ""}
                        onChange={(e) => setEditingBanner({...editingBanner, en: {...(editingBanner.en || {}), button: e.target.value}})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-10 pt-6 border-t space-y-6">
                  <div className="flex flex-col md:flex-row-reverse gap-6">
                    <div className="flex-1 space-y-2 text-right">
                      <Label className="font-black">الصورة الخلفية (URL)</Label>
                      <Input 
                        value={editingBanner.image || ""} 
                        onChange={(e) => setEditingBanner({...editingBanner, image: e.target.value})}
                        className="h-12 border-2 rounded-xl"
                        placeholder="رابط الصورة (Unsplash أو Picsum)..."
                      />
                      <div className="relative aspect-video rounded-2xl overflow-hidden mt-2 border">
                         <Image src={editingBanner.image || "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200"} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="w-full md:w-64 space-y-4">
                      <div className="p-6 bg-zinc-900 rounded-[24px] text-white text-right space-y-4 shadow-2xl">
                        <h4 className="font-black text-secondary border-b border-white/10 pb-2 uppercase tracking-widest text-xs">خيارات الحفظ</h4>
                        <Button className="w-full h-14 bg-secondary text-primary font-black hover:bg-white rounded-xl gap-2 text-lg" onClick={handleSave} disabled={loading}>
                          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} حفظ وتحديث
                        </Button>
                        
                        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl font-black">
                              معاينة حية للمستخدم <Eye size={18} className="mr-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl h-[80vh] overflow-y-auto" dir="rtl">
                            <DialogHeader>
                              <DialogTitle className="text-right font-black text-2xl">معاينة البانر على الموقع</DialogTitle>
                              <DialogDescription className="text-right">هذا هو الشكل الذي سيراه المستخدم النهائي عند زيارة الصفحة الرئيسية.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-12 py-8">
                               <section className="space-y-4">
                                 <Badge className="bg-secondary text-primary font-black">العربية (RTL)</Badge>
                                 <div className="relative h-[350px] w-full rounded-[40px] overflow-hidden flex items-center justify-end px-16 text-right">
                                    <Image src={editingBanner.image || "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200"} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/60" />
                                    <div className="relative z-10 max-w-2xl space-y-6">
                                       <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{editingBanner.ar?.title}</h2>
                                       <p className="text-zinc-200 text-xl font-bold">{editingBanner.ar?.description}</p>
                                       <Button className="bg-secondary text-primary font-black h-14 px-10 rounded-2xl gap-3 text-lg shadow-2xl">
                                         {editingBanner.ar?.button} <ArrowLeft size={22} />
                                       </Button>
                                    </div>
                                 </div>
                               </section>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-[32px] bg-white">
               <Layout size={64} className="opacity-10 mb-4" />
               <p className="font-black text-xl">اختر بانر من القائمة أو أضف جديداً للبدء</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
