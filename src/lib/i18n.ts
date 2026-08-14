import { useEffect, useState } from "react";

export type AppLanguage = "AR" | "EN" | "FR";

export const DEFAULT_LANGUAGE: AppLanguage = "AR";

export const supportedLanguages = ["AR", "EN", "FR"] as const;

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const value = localStorage.getItem("app_lang") as AppLanguage | null;
  return value && supportedLanguages.includes(value) ? value : DEFAULT_LANGUAGE;
}

export function setStoredLanguage(language: AppLanguage) {
  if (typeof window === "undefined") return;

  localStorage.setItem("app_lang", language);
  window.dispatchEvent(new Event("languageChange"));
}

export function getDirection(language: AppLanguage): "rtl" | "ltr" {
  return language === "AR" ? "rtl" : "ltr";
}

export function useLanguage() {
  const [lang, setLang] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const syncLanguage = () => setLang(getStoredLanguage());
    syncLanguage();

    window.addEventListener("languageChange", syncLanguage);
    return () => window.removeEventListener("languageChange", syncLanguage);
  }, []);

  const updateLanguage = (nextLanguage: AppLanguage) => {
    setStoredLanguage(nextLanguage);
    setLang(nextLanguage);
  };

  return { lang, setLang: updateLanguage };
}

export const sellerRegisterDictionary = {
  AR: {
    headingStart: "حول عملك إلى",
    headingAccent: "احترافي",
    subtitle: "افتح متجرك الآن واحصل على معرف رقمي فوري يسهل عليك إدارة مبيعاتك.",
    featureTitle: "مميزات متجر بورويس",
    featureItems: [
      "تأكيد فوري للقطع",
      "إحصائيات حية لمبيعاتك",
      "دعم فني خاص بالبائعين",
    ],
    cardHeader: "فتح متجر جديد",
    cardDescription: "يرجى ملء كافة البيانات بدقة لتوثيق المتجر",
    storeName: "اسم المتجر",
    ownerName: "اسم صاحب المتجر",
    phone: "رقم الهاتف",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    wilaya: "الولاية",
    commune: "البلدية",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    logoLabel: "شعار المتجر (Logo)",
    logoPlaceholder: "انقر لرفع شعار متجرك",
    legalText: "أوافق على الشروط والأحكام وسياسة الخصوصية.",
    registerButton: "تسجيل وتفعيل المتجر",
    storeId: "معرفك الرقمي الجديد",
    toast: {
      fileSizeErrorTitle: "خطأ في الحجم",
      fileSizeErrorDescription: "يجب أن يكون حجم الصورة أقل من 10 ميجابايت.",
      fileProcessErrorTitle: "خطأ",
      fileProcessErrorDescription: "فشل معالجة الشعار.",
      termsTitle: "تنبيه",
      termsDescription: "يجب الموافقة على الشروط والأحكام أولاً.",
      formMissingTitle: "بيانات ناقصة",
      formMissingDescription: "يرجى إدخال رقم الهاتف أو البريد الإلكتروني على الأقل.",
      passwordMismatchTitle: "خطأ",
      passwordMismatchDescription: "كلمات المرور غير متطابقة.",
      successTitle: "تم إنشاء المتجر",
      successDescription: "معرف متجرك هو",
      failureTitle: "فشل التسجيل",
    },
    placeholders: {
      storeName: "مثلاً: بوزيد لقطع الغيار",
      ownerName: "الاسم واللقب",
      phone: "05/06/07...",
      whatsapp: "05/06/07...",
      email: "email@example.com",
      password: "••••••••",
    },
    buttonLoading: "جاري المعالجة...",
  },
  EN: {
    headingStart: "Turn your business into",
    headingAccent: "professional",
    subtitle: "Open your store now and get a digital ID that makes sales management easier.",
    featureTitle: "Bourouisse Store Features",
    featureItems: [
      "Instant parts confirmation",
      "Live sales statistics",
      "Dedicated seller support",
    ],
    cardHeader: "Open a new store",
    cardDescription: "Please fill in all details accurately to verify the store",
    storeName: "Store name",
    ownerName: "Owner name",
    phone: "Phone number",
    whatsapp: "WhatsApp",
    email: "Email",
    wilaya: "Wilaya",
    commune: "Commune",
    password: "Password",
    confirmPassword: "Confirm password",
    logoLabel: "Store logo (Logo)",
    logoPlaceholder: "Click to upload your store logo",
    legalText: "I agree to the terms and conditions and privacy policy.",
    registerButton: "Register and activate store",
    storeId: "Your digital ID",
    toast: {
      fileSizeErrorTitle: "File size error",
      fileSizeErrorDescription: "The image must be smaller than 10 MB.",
      fileProcessErrorTitle: "Error",
      fileProcessErrorDescription: "Failed to process the logo.",
      termsTitle: "Alert",
      termsDescription: "You must accept the terms and conditions first.",
      formMissingTitle: "Incomplete data",
      formMissingDescription: "Please enter at least a phone number or email address.",
      passwordMismatchTitle: "Error",
      passwordMismatchDescription: "Passwords do not match.",
      successTitle: "Store created",
      successDescription: "Your store ID is",
      failureTitle: "Registration failed",
    },
    placeholders: {
      storeName: "Example: Boudiaf Spare Parts",
      ownerName: "Full name",
      phone: "05/06/07...",
      whatsapp: "05/06/07...",
      email: "name@example.com",
      password: "••••••••",
    },
    buttonLoading: "Processing...",
  },
  FR: {
    headingStart: "Transformez votre activité en",
    headingAccent: "professionnel",
    subtitle: "Ouvrez votre boutique maintenant et obtenez un identifiant numérique pour gérer vos ventes plus simplement.",
    featureTitle: "Avantages du magasin Bourouisse",
    featureItems: [
      "Confirmation instantanée des pièces",
      "Statistiques en direct des ventes",
      "Support technique dédié aux vendeurs",
    ],
    cardHeader: "Ouvrir un nouveau magasin",
    cardDescription: "Veuillez remplir tous les détails avec précision pour vérifier le magasin",
    storeName: "Nom du magasin",
    ownerName: "Nom du propriétaire",
    phone: "Numéro de téléphone",
    whatsapp: "WhatsApp",
    email: "E-mail",
    wilaya: "Wilaya",
    commune: "Commune",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    logoLabel: "Logo du magasin (Logo)",
    logoPlaceholder: "Cliquez pour télécharger le logo de votre magasin",
    legalText: "J'accepte les conditions générales et la politique de confidentialité.",
    registerButton: "Enregistrer et activer le magasin",
    storeId: "Votre identifiant numérique",
    toast: {
      fileSizeErrorTitle: "Erreur de taille",
      fileSizeErrorDescription: "L'image doit être inférieure à 10 Mo.",
      fileProcessErrorTitle: "Erreur",
      fileProcessErrorDescription: "Le traitement du logo a échoué.",
      termsTitle: "Alerte",
      termsDescription: "Vous devez accepter les conditions avant de continuer.",
      formMissingTitle: "Données incomplètes",
      formMissingDescription: "Veuillez saisir au moins un numéro de téléphone ou une adresse e-mail.",
      passwordMismatchTitle: "Erreur",
      passwordMismatchDescription: "Les mots de passe ne correspondent pas.",
      successTitle: "Magasin créé",
      successDescription: "Votre identifiant de magasin est",
      failureTitle: "Échec de l'inscription",
    },
    placeholders: {
      storeName: "Exemple : Pièces détachées Boudiaf",
      ownerName: "Nom complet",
      phone: "05/06/07...",
      whatsapp: "05/06/07...",
      email: "nom@example.com",
      password: "••••••••",
    },
    buttonLoading: "Traitement...",
  },
} as const;
