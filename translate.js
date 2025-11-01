// Function لجلب الترجمات وتطبيقها
async function loadTranslations(lang) {
    // 1. جلب ملف الـ JSON
    const response = await fetch(`lang/${lang}.json`);
    const translations = await response.json();

    // 2. تطبيق الترجمات على كل العناصر اللي عندها data-key
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        
        if (translations[key]) {
            // حالة خاصة لعنوان الصفحة
            if (element.tagName === 'TITLE') {
                document.title = translations[key];
            } 
            // حالة خاصة للصور (لتغيير الـ alt)
            else if (element.tagName === 'IMG') {
                element.alt = translations[key];
            } 
            // حالة خاصة للـ input (لتغيير الـ placeholder)
            else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[key];
            } 
            // الحالة الافتراضية (تغيير النص الداخلي)
            else {
                element.textContent = translations[key];
            }
        }
    });
}

// Function لتبديل اللغة
function switchLanguage(lang) {
    // 1. تطبيق الترجمات
    loadTranslations(lang);

    // 2. تحديث اتجاه الصفحة
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }

    // 3. تحديث لغة الصفحة (للمتصفح ومحركات البحث)
    document.documentElement.lang = lang;

    // 4. حفظ اختيار المستخدم في الـ localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Function لتحديد اللغة عند تحميل الصفحة
function initializeLanguage() {
    // 1. شوف إذا المستخدم اختار لغة من قبل
    const savedLang = localStorage.getItem('preferredLanguage');
    
    // 2. شوف شو لغة المتصفح الافتراضية
    const browserLang = navigator.language.split('-')[0];

    // 3. حدد اللغة اللي لازم تنعرض
    const defaultLang = 'en'; // اللغة الافتراضية إذا ما لقى شي
    const supportedLangs = ['ar', 'en', 'de'];

    let langToLoad = savedLang;

    if (!langToLoad && supportedLangs.includes(browserLang)) {
        langToLoad = browserLang;
    }
    
    if (!langToLoad) {
        langToLoad = defaultLang;
    }

    // 4. حمّل اللغة
    switchLanguage(langToLoad);
}

// تشغيل الكود أول ما تفتح الصفحة
document.addEventListener('DOMContentLoaded', initializeLanguage);