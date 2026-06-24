"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function AISearchBox() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // مزامنة القيمة مع الرابط عند التحميل
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query") || "";
    setValue(q);
  }, []);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search);

    if (query.trim()) {
      params.set("query", query.trim());
    } else {
      params.delete("query");
    }

    // تحديث الرابط للانتقال لصفحة الكتالوج مع الفلترة
    if (pathname === '/catalog') {
      router.replace(`/catalog?${params.toString()}`);
    } else {
      router.push(`/catalog?${params.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto px-4">
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleSearch(e.target.value); // فلترة لحظية بمجرد الكتابة
          }}
          placeholder="ابحث بذكاء عن قطعة غيار (مثلاً: محرك كليو 4)..."
          className="w-full h-12 pr-12 pl-4 rounded-2xl border-2 border-zinc-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-right font-bold transition-all"
          dir="rtl"
        />
      </div>
    </form>
  );
}
