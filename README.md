
# Bourouisse Piece-Dz | مشروع منصة قطع الغيار

هذا المشروع تم تطويره وتجهيزه للانتقال من **Firebase Studio** إلى بيئة التطوير المحلية.

## 🚀 خطوات التشغيل بعد التصدير

1. **تحميل الكود**: قم بتحميل ملفات المشروع (Export) من واجهة Firebase Studio.
2. **تثبيت المكتبات**: افتح المجلد في Terminal وقم بتشغيل:
   ```bash
   npm install
   ```
3. **إعداد البيئة**: قم بإنشاء ملف `.env.local` وأضف مفاتيح Firebase و Gemini API:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   GEMINI_API_KEY=your_gemini_key
   ```
4. **التشغيل المحلي**:
   ```bash
   npm run dev
   ```
5. **النشر (Deployment)**: استخدم Firebase CLI للنشر:
   ```bash
   firebase deploy
   ```

## 🛠 التقنيات المستخدمة
- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **UI**: Shadcn UI + Tailwind CSS

---
© 2024 Bourouisse Piece-Dz. جميع الحقوق محفوظة.
