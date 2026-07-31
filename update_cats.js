const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// صور حقيقية ومخصصة لكل تصنيف سيارات بدقة
const cats = {
  'Engine': { ar: 'المحرك', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500' },
  'Gearbox': { ar: 'علبة السرعة', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500' },
  'Body': { ar: 'الهيكل والسطح', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500' },
  'Electrical': { ar: 'الكهرباء والإنارة', img: 'https://images.unsplash.com/photo-1558441719-443b34468ed9?w=500' },
  'Suspension': { ar: 'نظام التعليق', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500' },
  'Brakes': { ar: 'الفرامل', img: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500' },
  'Cooling': { ar: 'التبريد', img: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500' },
  'Fuel': { ar: 'نظام الوقود', img: 'https://images.unsplash.com/photo-1527016016393-d72a785100cc?w=500' },
  'Exhaust': { ar: 'العادم', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500' },
  'Wheels & Tires': { ar: 'العجلات والإطارات', img: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500' },
  'Interior': { ar: 'الفرش الداخلي', img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500' },
  'Accessories': { ar: 'إكسسوارات', img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500' },
  'Lighting': { ar: 'الإضاءة', img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500' }
};

async function updateCategories() {
  try {
    const collectionRef = db.collection('category_images');
    
    for (const [key, val] of Object.entries(cats)) {
      await collectionRef.doc(key).set({
        name_en: key,
        name_ar: val.ar,
        imageUrl: val.img
      }, { merge: true });
      console.log('✅ تم تحديث صورة:', key);
    }
    console.log('✨ تم تحديث جميع الصور بنجاح في Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('❌ خطأ:', err);
    process.exit(1);
  }
}
updateCategories();