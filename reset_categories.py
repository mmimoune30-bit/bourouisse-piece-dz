import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('serviceAccountKey.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

cats = {
    'Engine': {'ar': 'المحرك', 'image': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500'},
    'Gearbox': {'ar': 'علبة السرعة', 'image': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'},
    'Body': {'ar': 'الهيكل والسطح', 'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'},
    'Electrical': {'ar': 'الكهرباء والإنارة', 'image': 'https://images.unsplash.com/photo-1558441719-443b34468ed9?w=500'},
    'Suspension': {'ar': 'نظام التعليق', 'image': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500'},
    'Brakes': {'ar': 'الفرامل', 'image': 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500'},
    'Cooling': {'ar': 'التبريد', 'image': 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500'},
    'Fuel': {'ar': 'نظام الوقود', 'image': 'https://images.unsplash.com/photo-1527016016393-d72a785100cc?w=500'},
    'Exhaust': {'ar': 'العادم', 'image': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500'},
    'Wheels & Tires': {'ar': 'العجلات والإطارات', 'image': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500'},
    'Interior': {'ar': 'الفرش الداخلي', 'image': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500'},
    'Accessories': {'ar': 'إكسسوارات', 'image': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'},
    'Lighting': {'ar': 'الإضاءة', 'image': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500'}
}

coll = db.collection('category_images')

# حذف البيانات القديمة
for doc in coll.stream():
    doc.reference.delete()
print('🗑️ تم تنظيف البيانات القديمة من Firestore.')

# إضافة البيانات الجديدة
for k, v in cats.items():
    coll.document(k).set({
        'name_en': k,
        'name_ar': v['ar'],
        'imageUrl': v['image']
    })

print('✨ تم رفع بيانات الصور الجديدة الصحيحة بنجاح إلى Firestore!')
