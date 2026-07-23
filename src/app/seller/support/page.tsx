
"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    HelpCircle,
    Send,
    Paperclip,
    MessageSquare,
    History,
    CheckCircle,
    Clock,
    ShieldAlert,
    ArrowRight,
    ChevronRight,
    Loader2,
    X
  } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import Image from "next/image";

export default function SupportCenter() {
  const router = useRouter();
  const { firestore } = useFirestore();
  const { user } = useUser();
  const [view, setView] = useState<"list" | "new">("list");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);

  const ticketsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "support_tickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: tickets, loading: loadingTickets } = useCollection(ticketsQuery);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast({ variant: "destructive", title: "حجم كبير جداً", description: "المرفقات يجب ألا تتجاوز 15 ميجابايت." });
        return;
      }
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setAttachment(compressed);
      } catch (err) {
        toast({ variant: "destructive", title: "خطأ", description: "فشل معالجة المرفق." });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const ticketData = {
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      attachment,
      userId: user.uid,
      userName: user.displayName || "Seller",
      status: "Pending",
      createdAt: serverTimestamp()
    };

    addDoc(collection(firestore, "support_tickets"), ticketData)
      .then(() => {
        setLoading(false);
        toast({ title: "تم إرسال التذكرة", description: "سيقوم فريق الدعم بالرد عليك قريباً." });
        setView("list");
        setAttachment(null);
      })
      .catch(async (error) => {
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: "support_tickets",
          operation: "create",
          requestResourceData: ticketData
        });
        errorEmitter.emit("permission-error", permissionError);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl text-right" dir="rtl">
          <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-primary flex items-center justify-end gap-3">
                 مركز الدعم والمساعدة <HelpCircle size={40} className="text-secondary" />
              </h1>
              <p className="text-muted-foreground font-bold">نحن هنا لمساعدتك في نجاح متجرك.</p>
            </div>
            {view === "list" ? (
              <Button className="h-12 px-8 font-black gap-2" onClick={() => setView("new")}>
                <MessageSquare size={18} /> فتح تذكرة جديدة
              </Button>
            ) : (
              <Button variant="ghost" className="font-bold gap-2" onClick={() => setView("list")}>
                الرجوع للقائمة <ArrowRight size={18} className="rotate-180" />
              </Button>
            )}
          </header>

          {view === "list" ? (
            <div className="grid grid-cols-1 gap-6">
               <h3 className="font-black text-xl border-r-4 border-secondary pr-4 mb-2 text-primary">تذاكري السابقة</h3>
               {loadingTickets ? (
                 <div className="text-center py-20 animate-pulse font-bold">جاري تحميل التذاكر...</div>
               ) : tickets.length === 0 ? (
                 <Card className="border-none shadow-sm p-20 text-center rounded-[32px]">
                    <MessageSquare size={64} className="mx-auto opacity-10 mb-4" />
                    <p className="text-muted-foreground font-bold">لا توجد تذاكر دعم سابقة.</p>
                 </Card>
               ) : (
                 tickets.map((t) => (
                   <Card key={t.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                     <CardContent className="p-6 flex flex-col md:flex-row-reverse items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 text-right">
                           <div className="flex items-center gap-3 justify-end">
                              <Badge variant="outline" className="font-mono text-[10px]">{t.id.substring(0,6)}</Badge>
                              <h4 className="font-black text-lg text-primary group-hover:text-secondary transition-colors">{t.subject}</h4>
                           </div>
                           <p className="text-sm text-muted-foreground font-bold truncate max-w-md">{t.message}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">{t.createdAt?.toDate().toLocaleDateString('ar-DZ')}</p>
                              <Badge className={cn("font-bold mt-1", t.status === 'Resolved' ? "bg-green-600" : "bg-amber-500")}>
                                {t.status === 'Resolved' ? 'تم الحل' : 'قيد الانتظار'}
                              </Badge>
                           </div>
                           <Button variant="ghost" size="icon" className="rounded-full"><ChevronRight size={20} className="rotate-180" /></Button>
                        </div>
                     </CardContent>
                   </Card>
                 ))
               )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
               <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                  <CardHeader className="bg-primary text-white p-8">
                    <CardTitle className="text-2xl font-black">تفاصيل المشكلة</CardTitle>
                    <CardDescription className="text-blue-100">اشرح مشكلتك بوضوح لسرعة المعالجة.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="space-y-2">
                        <Label className="font-black">عنوان الموضوع</Label>
                        <Input name="subject" placeholder="مثلاً: مشكلة في رفع الصور..." required className="h-12 border-2" />
                     </div>
                     <div className="space-y-2">
                        <Label className="font-black">وصف المشكلة</Label>
                        <Textarea name="message" placeholder="اكتب تفاصيل ما حدث معك..." className="min-h-[150px] border-2 text-lg" required />
                     </div>
                     
                     <div className="space-y-4">
                        <Label className="font-black">إرفاق لقطة شاشة (اختياري، بحد أقصى 15MB)</Label>
                        <div className="relative">
                           <Input type="file" className="hidden" id="support-file" accept="image/*" onChange={handleFileChange} />
                           <label 
                              htmlFor="support-file"
                              className={cn(
                                "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 cursor-pointer transition-all",
                                loading && "opacity-50 cursor-not-allowed"
                              )}
                           >
                              {loading ? <Loader2 className="animate-spin text-primary" size={32} /> : attachment ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                   <Image src={attachment} alt="Attachment" fill className="object-cover" />
                                   <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="icon" 
                                      className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                                      onClick={(e) => { e.preventDefault(); setAttachment(null); }}
                                   >
                                      <X size={14} />
                                   </Button>
                                </div>
                              ) : (
                                <>
                                  <Paperclip size={32} className="mb-2" />
                                  <span className="text-xs font-black">انقر لإرفاق صورة توضيحية</span>
                                </>
                              )}
                           </label>
                        </div>
                     </div>

                     <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-black bg-primary shadow-xl gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                        {loading ? "جاري الإرسال..." : "إرسال التذكرة الآن"}
                     </Button>
                  </CardContent>
               </Card>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
