const fs = require('fs');
const filePath = 'src/app/page.tsx';

let content = fs.readFileSync(filePath, 'utf8');

const oldCode = "const categoryImage = categoryImagesMap[cat.en] || `https://picsum.photos/seed/cat-${i}/200/200`;";

const newCode = `const defaultCategoryImages: Record<string, string> = {
  'Engine': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500',
  'Gearbox': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500',
  'Body': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500',
  'Electrical': 'https://images.unsplash.com/photo-1558441719-443b34468ed9?w=500',
  'Suspension': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500',
  'Brakes': 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500',
  'Cooling': 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500',
  'Fuel': 'https://images.unsplash.com/photo-1527016016393-d72a785100cc?w=500',
  'Exhaust': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
  'Wheels & Tires': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500',
  'Interior': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500',
  'Accessories': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500',
  'Lighting': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500'
};
const categoryImage = categoryImagesMap[cat.en] || defaultCategoryImages[cat.en] || \`https://picsum.photos/seed/cat-\${i}/200/200\`;`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ تم التعديل بنجاح!');
} else {
  console.log('⚠️ لم يتم العثور على السطر المستهدف (قد يكون عُدّل مسبقاً).');
}
