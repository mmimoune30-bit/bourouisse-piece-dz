import json, urllib.request, subprocess

token = subprocess.check_output(['gcloud', 'auth', 'print-access-token']).decode().strip()
with open('serviceAccountKey.json') as f:
    project_id = json.load(f).get('project_id')

cats = {
  'Engine': {'ar': 'المحرك', 'img': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500'},
  'Gearbox': {'ar': 'علبة السرعة', 'img': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'},
  'Body': {'ar': 'الهيكل والسطح', 'img': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'},
  'Electrical': {'ar': 'الكهرباء والإنارة', 'img': 'https://images.unsplash.com/photo-1558441719-443b34468ed9?w=500'},
  'Suspension': {'ar': 'نظام التعليق', 'img': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500'},
  'Brakes': {'ar': 'الفرامل', 'img': 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500'},
  'Cooling': {'ar': 'التبريد', 'img': 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500'},
  'Fuel': {'ar': 'نظام الوقود', 'img': 'https://images.unsplash.com/photo-1527016016393-d72a785100cc?w=500'},
  'Exhaust': {'ar': 'العادم', 'img': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500'},
  'Wheels & Tires': {'ar': 'العجلات والإطارات', 'img': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500'},
  'Interior': {'ar': 'الفرش الداخلي', 'img': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500'},
  'Accessories': {'ar': 'إكسسوارات', 'img': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500'},
  'Lighting': {'ar': 'الإضاءة', 'img': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500'}
}

for k, v in cats.items():
    doc_id = k.replace(' ', '_').replace('&', 'and')
    url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/category_images/{doc_id}"
    data = json.dumps({
        "fields": {
            "name_en": {"stringValue": k},
            "name_ar": {"stringValue": v['ar']},
            "imageUrl": {"stringValue": v['img']}
        }
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='PATCH')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'json')
    try:
        urllib.request.urlopen(req)
        print(f"✅ تم بنجاح: {k}")
    except Exception as e:
        print(f"❌ خطأ في {k}: {e}")

