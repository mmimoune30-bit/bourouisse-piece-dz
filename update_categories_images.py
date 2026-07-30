import firebase_admin
from firebase_admin import credentials, firestore

# 1. تهيئة الاتصال بـ Firebase
# تأكد من وجود ملف serviceAccountKey.json في نفس المجلد
# يمكنك الحصول على هذا الملف من: Project Settings -> Service Accounts في لوحة تحكم Firebase
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"❌ خطأ في التهيئة: يرجى التأكد من وجود ملف serviceAccountKey.json\nالتفاصيل: {e}")
    exit()

# 2. خريطة التصنيفات وروابط الصور المناسبة لكل عنوان (روابط Unsplash عالية الجودة)
category_images = {
    "المحرك": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300",
    "علبة السرعة": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=300",
    "الهيكل": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300",
    "الكهرباء": "https://images.unsplash.com/photo-1558441719-23451e281e5f?q=80&w=300",
    "التعليق": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300",
    "المكابح": "https://images.unsplash.com/photo-1600706432520-724dcb627b03?q=80&w=300",
    "التبريد": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=300",
    "نظام الوقود": "https://images.unsplash.com/photo-1558441719-23451e281e5f?q=80&w=300",
    "العادم": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300",
    "العجلات والإطارات": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=300",
    "الداخلية": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300",
    "الإكسسوارات": "https://images.unsplash.com/photo-1558441719-23451e281e5f?q=80&w=300",
    "الإضاءة": "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=300"
}

def update_images():
    # التطبيق يستخدم مجموعة "categories_metadata" لتخزين روابط الصور
    # سنقوم بتحديث كل من "categories" و "categories_metadata" لضمان شمولية التحديث
    target_collections = ["categories", "categories_metadata"]
    updated_count = 0

    for coll_name in target_collections:
        print(f"🔎 جاري فحص مجموعة: {coll_name}...")
        categories_ref = db.collection(coll_name)
        docs = categories_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            # المطابقة تتم بناءً على حقل name أو title أو ar
            cat_name = data.get("ar") or data.get("name") or data.get("title")

            if cat_name in category_images:
                new_image_url = category_images[cat_name]
                # تحديث حقل الصورة (سواء كان باسم imageUrl أو image)
                doc.ref.update({
                    "imageUrl": new_image_url,
                    "image": new_image_url,
                    "updatedAt": firestore.SERVER_TIMESTAMP
                })
                print(f"✅ تم تحديث صورة: {cat_name}")
                updated_count += 1

    print(f"\n🎉 اكتمل التحديث! تم تعديل {updated_count} تصنيف بنجاح.")

if __name__ == "__main__":
    update_images()
