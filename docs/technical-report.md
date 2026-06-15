
# التقرير التقني لمشروع Bourouisse Piece-Dz

## 1. نظرة عامة على المشروع
منصة إلكترونية متخصصة في سوق قطع غيار السيارات في الجزائر، تربط بين البائعين (أصحاب المتاجر) والمشترين، مع نظام بحث ذكي مدعوم بالذكاء الاصطناعي.

## 2. الهيكل البرمجي (Tech Stack)
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI / Radix UI
- **Backend Services**: Firebase (Firestore, Auth)
- **AI Engine**: Google Genkit (Gemini 2.5 Flash)

## 3. هيكلية الصفحات (Pages)
- `/`: الصفحة الرئيسية (Hero, Featured Products, AI Search).
- `/catalog`: صفحة الكتالوج مع فلاتر (فئة، حالة، بحث).
- `/products/[id]`: صفحة تفاصيل المنتج مع معلومات البائع والتواصل.
- `/buyer/register`: صفحة تسجيل حساب مشتري.
- `/seller/register`: صفحة فتح متجر بائع جديد.
- `/seller/dashboard`: لوحة تحكم البائع (إحصائيات، إدارة الإعلانات).
- `/seller/listings/new`: إضافة إعلان جديد بنظام القوائم المنسدلة المترابطة.

## 4. المكونات البرمجية (Core Components)
- `Navbar`: شريط التنقل العلوي مع بوابات المشتري والبائع والبحث السريع.
- `Footer`: تذييل الموقع مع روابط الفئات والاتصال.
- `AISearchBox`: محرك البحث المدعوم بـ AI لتقديم اقتراحات ذكية.
- `ProductCard`: بطاقة عرض المنتج الموحدة.
- `Dynamic Dropdowns`: نظام اختيار (Marque/Modèle/Part) المترابط لمنع أخطاء الإدخال.

## 5. قاعدة البيانات (Firestore Schema)
### الكيانات (Entities):
1. **Listings (الإعلانات)**:
   - الحقول: `category`, `partType`, `brand`, `model`, `year`, `price`, `wilaya`, `images`, `sellerId`.
2. **Sellers (البائعين)**:
   - الحقول: `shopName`, `phone`, `wilaya`, `email`, `userId`.
3. **Buyers (المشترين)**:
   - الحقول: `fullName`, `email`, `phone`, `userId`.

## 6. قواعد الأمان والخصوصية (Security Rules Concept)
- **القراءة**: متاحة للجميع لجميع الإعلانات (`/listings`).
- **الكتابة/التعديل**:
  - لا يمكن إضافة إعلان إلا للمستخدمين المسجلين كبائعين.
  - لا يمكن تعديل أو حذف الإعلان إلا من قبل صاحبه (البائع الأصلي).
  - بيانات المشترين والبائعين الشخصية محمية ومتاحة فقط لأصحاب الحسابات.

## 7. وظائف الذكاء الاصطناعي (AI Capabilities)
- **Flow**: `generateSearchSuggestions`
- **الوظيفة**: تحليل استعلام المستخدم وتقديم قائمة من 3-5 اقتراحات دقيقة لقطع الغيار بناءً على سياق السوق الجزائري.

## 8. خطة العمل لإعادة البناء
1. إعداد مشروع Firebase جديد وتفعيل Auth و Firestore.
2. تطبيق المخطط الموجود في `backend.json`.
3. تثبيت المكتبات البرمجية المذكورة في `package.json`.
4. نسخ المكونات من مجلد `src/components`.
5. إعداد مفتاح Gemini API لتشغيل وظائف البحث الذكي.
