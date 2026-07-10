
"use client";

import React, { useState } from "react";
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
import { 
  ImagePlus, Save, Layout, Trash2, 
  Plus, Eye, MoveUp, MoveDown, AlertCircle, Sparkles, ArrowLeft, ChevronRight 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

const INITIAL_BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/auto-hero-1/1200/400",
    ar: {
      title: "انضم إلى منصتنا اليوم",
      description: "سجل متجرك لقطع غيار السيارات ووصل إلى آلاف العملاء في مختلف الولايات.",
      button: "اشترك معنا"
    },
    en: {
      title: "Join Our Marketplace Today",
      description: "Register your auto parts store and reach thousands of customers.",
      button: "Join Us"
    },
    active: true
  }
];

export default function BannerManagement() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [editingBanner, setEditingBanner] = useState(INITIAL_BANNERS[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = () => {
    toast({
      title: "تم الحفظ",
      description: "تم تحديث نظام الإعلانات بنجاح في الموقع.",
    });
  };

  const addBanner = () => {
    const newBanner = {
      id: Date.now(),
      image: "https://picsum.photos/seed/new/1200/400",
      ar: { title: "عنوان جديد بالعربية", description: "وصف جديد للبانر بالعربية", button: "ابدأ الآن" },
      en: { title: "New English Title", description: "New English description for the banner", button: "Start Now" },
      active: true
    };
    setBanners([...banners, newBanner]);
    setEditingBanner(newBanner);
    toast({ title: "تمت الإضافة", description: "يمكنك الآن تعديل بيانات البانر الجديد." });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center justify-end gap-3">
            <Layout size={32} className="text-secondary" /> إدارة البنرات الإعلانية
          </h1>
          <p className="text-muted-foreground mt-1">تخصيص العروض والرسائل التسويقية ثنائية اللغة في الصفحة الرئيسية.</p>
        </div>
        <Button className="font-bold gap-2 bg-secondary text-primary hover:bg-white" onClick={addBanner}>
          <Plus size={18} /> إضافة بانر جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Banner List */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="font-black text-lg border-r-4 border-secondary pr-3">قائمة البنرات الحالية</h3>
          {banners.map((banner) => (
            <Card 
              key={banner.id} 
              className={cn(
                "border-none shadow-sm overflow-hidden group cursor-pointer transition-all",
                editingBanner.id === banner.id ? "ring-2 ring-secondary" : "hover:ring-1 hover:ring-zinc-200"
              )} 
              onClick={() => setEditingBanner(banner)}
            >
              <div className="relative aspect-video">
                <Image src={banner.image} alt="Banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="sm" className="font-bold gap-2">
                     <Eye size={14} /> تعديل البيانات
                   </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center flex-row-reverse">
                  <h4 className="font-bold text-primary truncate ml-4">{banner.ar.title || "عنوان جديد"}</h4>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><MoveUp size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><MoveDown size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50"><Trash2 size={14} /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editor Area */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-none shadow-xl sticky top-24">
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-xl flex items-center justify-end gap-3">
                 محرر المحتوى ثنائي اللغة <Sparkles className="text-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="ar" dir="rtl">
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold">
                     <AlertCircle size={14} /> سيتم العرض حسب لغة المستخدم
                   </div>
                   <TabsList className="bg-zinc-100 h-12 p-1">
                     <TabsTrigger value="ar" className="font-black px-8">العربية (RTL)</TabsTrigger>
                     <TabsTrigger value="en" className="font-black px-8">English (LTR)</TabsTrigger>
                   </TabsList>
                </div>

                {/* Arabic Content */}
                <TabsContent value="ar" className="space-y-6">
                  <div className="space-y-2 text-right">
                    <Label className="font-black text-lg">العنوان (العربية)</Label>
                    <Input 
                      placeholder="أدخل العنوان الجذاب هنا..." 
                      className="h-14 text-xl font-bold border-2" 
                      value={editingBanner.ar.title}
                      onChange={(e) => setEditingBanner({...editingBanner, ar: {...editingBanner.ar, title: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="font-black">الوصف (العربية)</Label>
                    <Textarea 
                      placeholder="شرح موجز للعرض أو الخدمة..." 
                      className="min-h-[120px] text-lg leading-relaxed border-2" 
                      value={editingBanner.ar.description}
                      onChange={(e) => setEditingBanner({...editingBanner, ar: {...editingBanner.ar, description: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="font-black">نص الزر (العربية)</Label>
                    <Input 
                      placeholder="مثلاً: ابدأ الآن، اشترك معنا..." 
                      className="h-12 font-bold border-2" 
                      value={editingBanner.ar.button}
                      onChange={(e) => setEditingBanner({...editingBanner, ar: {...editingBanner.ar, button: e.target.value}})}
                    />
                  </div>
                </TabsContent>

                {/* English Content */}
                <TabsContent value="en" className="space-y-6 text-left">
                  <div className="space-y-2">
                    <Label className="font-black text-lg">Title (English)</Label>
                    <Input 
                      placeholder="Enter catchy title..." 
                      className="h-14 text-xl font-bold border-2" 
                      dir="ltr" 
                      value={editingBanner.en.title}
                      onChange={(e) => setEditingBanner({...editingBanner, en: {...editingBanner.en, title: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black">Description (English)</Label>
                    <Textarea 
                      placeholder="Brief explanation of offer..." 
                      className="min-h-[120px] text-lg leading-relaxed border-2" 
                      dir="ltr" 
                      value={editingBanner.en.description}
                      onChange={(e) => setEditingBanner({...editingBanner, en: {...editingBanner.en, description: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black">Button Text (English)</Label>
                    <Input 
                      placeholder="e.g. Join Now, Start Here..." 
                      className="h-12 font-bold border-2" 
                      dir="ltr" 
                      value={editingBanner.en.button}
                      onChange={(e) => setEditingBanner({...editingBanner, en: {...editingBanner.en, button: e.target.value}})}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-10 pt-6 border-t space-y-6">
                <div className="flex flex-col md:flex-row-reverse gap-6">
                  <div className="flex-1 space-y-2 text-right">
                    <Label className="font-black">الصورة الخلفية</Label>
                    <div className="border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center text-muted-foreground hover:bg-zinc-50 transition-all cursor-pointer group">
                      <ImagePlus size={48} className="mb-2 group-hover:scale-110 transition-transform text-secondary" />
                      <span className="font-bold">تغيير صورة البانر</span>
                      <span className="text-[10px] mt-1 uppercase tracking-widest opacity-50">1200x600 recommended</span>
                    </div>
                  </div>
                  <div className="w-full md:w-64 space-y-4">
                    <div className="p-4 bg-zinc-900 rounded-2xl text-white text-right space-y-4">
                      <h4 className="font-black text-secondary border-b border-white/10 pb-2">خيارات الحفظ</h4>
                      <Button className="w-full h-12 bg-secondary text-primary font-black hover:bg-white" onClick={handleSave}>
                        <Save size={18} /> حفظ التغييرات
                      </Button>
                      
                      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10">
                            معاينة حية للمستخدم <Eye size={18} className="mr-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl h-[80vh] overflow-y-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="text-right font-black text-2xl">معاينة البانر على الموقع</DialogTitle>
                            <DialogDescription className="text-right">هذا هو الشكل الذي سيراه المستخدم النهائي عند زيارة الصفحة الرئيسية.</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-12 py-8">
                             {/* AR Preview */}
                             <section className="space-y-4">
                               <Badge className="bg-secondary text-primary font-black">العربية (RTL)</Badge>
                               <div className="relative h-[300px] w-full rounded-[32px] overflow-hidden flex items-center justify-end px-12 text-right">
                                  <Image src={editingBanner.image} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-black/60" />
                                  <div className="relative z-10 max-w-xl space-y-4">
                                     <h2 className="text-3xl font-black text-white leading-tight">{editingBanner.ar.title}</h2>
                                     <p className="text-blue-100 font-bold">{editingBanner.ar.description}</p>
                                     <Button className="bg-secondary text-primary font-black h-12 px-8 rounded-xl gap-2">
                                       {editingBanner.ar.button} <ArrowLeft size={18} />
                                     </Button>
                                  </div>
                               </div>
                             </section>

                             {/* EN Preview */}
                             <section className="space-y-4">
                               <Badge className="bg-primary text-white font-black">English (LTR)</Badge>
                               <div className="relative h-[300px] w-full rounded-[32px] overflow-hidden flex items-center justify-start px-12 text-left" dir="ltr">
                                  <Image src={editingBanner.image} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-black/60" />
                                  <div className="relative z-10 max-w-xl space-y-4">
                                     <h2 className="text-3xl font-black text-white leading-tight">{editingBanner.en.title}</h2>
                                     <p className="text-blue-100 font-bold">{editingBanner.en.description}</p>
                                     <Button className="bg-secondary text-primary font-black h-12 px-8 rounded-xl gap-2">
                                       {editingBanner.en.button} <ChevronRight size={18} />
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
        </div>
      </div>
    </div>
  );
}
