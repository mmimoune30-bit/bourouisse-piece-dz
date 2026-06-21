
# Bourouisse Piece-Dz | مشروع منصة قطع الغيار

هذا المشروع تم تطويره وتجهيزه للانتقال من **Firebase Studio** إلى بيئة التطوير المحلية.

## 📥 كيفية الحصول على نسخة ZIP من المشروع
لتحميل المشروع كاملاً على جهازك:
1. توجه إلى **الزاوية العلوية اليمنى** من واجهة Firebase Studio.
2. ستجد زر مكتوب عليه **"Export"** (بجانب أزرار الحفظ أو النشر).
3. اضغط عليه، وسيتم تحميل ملف ZIP يحتوي على كافة الأكواد والإعدادات.

## 🚀 خطوات التشغيل بعد التصدير

1. **فك الضغط**: قم بفك ضغط الملف في مجلد على جهازك.
2. **تثبيت المكتبات**: افتح المجلد في Terminal وقم بتشغيل:
   ```bash
   npm install
   ```
3. **إعداد البيئة**: قم بإنشاء ملف `.env.local` وأضف مفاتيح Firebase و Gemini API:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bourouisse-piecedz.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=bourouisse-piecedz
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bourouisse-piecedz.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **التشغيل المحلي**:
   ```bash
   npm run dev
   ```
   افتح المتصفح على [http://localhost:3000](http://localhost:3000).

---
© 2024 Bourouisse Piece-Dz. جميع الحقوق محفوظة.
