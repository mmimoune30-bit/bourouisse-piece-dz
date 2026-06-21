
# Bourouisse Piece-Dz | مشروع منصة قطع الغيار

هذا المشروع تم تطويره وتجهيزه للانتقال من **Firebase Studio** إلى بيئة التطوير المحلية.

## 📥 كيفية تصدير المشروع من Firebase Studio
لتصدير المشروع كاملاً كملف ZIP:
1. توجه إلى **الزاوية العلوية اليمنى** من واجهة Firebase Studio.
2. ستجد زر مكتوب عليه **"Export"** (بجانب أزرار الحفظ أو النشر).
3. اضغط عليه، وسيتم تحميل ملف ZIP يحتوي على كافة الأكواد والإعدادات التي قمنا ببنائها.

## 🚀 خطوات التشغيل بعد التصدير

1. **تحميل الكود**: قم بالضغط على زر **Export** في الزاوية العلوية اليمنى من واجهة Firebase Studio لتحميل ملف المشروع كملف ZIP.
2. **فك الضغط**: قم بفك ضغط الملف في مجلد على جهازك.
3. **تثبيت المكتبات**: افتح المجلد في Terminal (أو Command Prompt) وقم بتشغيل:
   ```bash
   npm install
   ```
4. **إعداد البيئة**: قم بإنشاء ملف `.env.local` في المجلد الرئيسي وأضف مفاتيح Firebase و Gemini API (يمكنك العثور على قيم Firebase في ملف `src/firebase/config.ts`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bourouisse-piecedz.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=bourouisse-piecedz
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bourouisse-piecedz.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. **التشغيل المحلي**:
   ```bash
   npm run dev
   ```
   افتح المتصفح على الرابط [http://localhost:3000](http://localhost:3000).

6. **النشر (Deployment)**: لاستخدام خدمات Firebase بشكل كامل، ستحتاج لتثبيت Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

## 🛠 التقنيات المستخدمة
- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **AI**: Google Genkit (Gemini 1.5 Flash)
- **UI**: Shadcn UI + Tailwind CSS

---
© 2024 Bourouisse Piece-Dz. جميع الحقوق محفوظة.
