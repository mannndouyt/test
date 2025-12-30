// عناصر DOM
const imageInput = document.getElementById('image-input');
const uploadLocal = document.getElementById('upload-local');
const uploadUrl = document.getElementById('upload-url');
const urlInputContainer = document.getElementById('url-input-container');
const imageUrlInput = document.getElementById('image-url');
const loadUrlBtn = document.getElementById('load-url');
const previewArea = document.getElementById('preview-area');
const colorsContainer = document.getElementById('colors-container');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturationSlider = document.getElementById('saturation');
const hueSlider = document.getElementById('hue');
const blurSlider = document.getElementById('blur');
const brightnessValue = document.getElementById('brightness-value');
const contrastValue = document.getElementById('contrast-value');
const saturationValue = document.getElementById('saturation-value');
const hueValue = document.getElementById('hue-value');
const blurValue = document.getElementById('blur-value');
const presetButtons = document.querySelectorAll('.preset-btn');
const resetFiltersBtn = document.getElementById('reset-filters');
const downloadImageBtn = document.getElementById('download-image');
const downloadColorsBtn = document.getElementById('download-colors');
const colorModal = document.getElementById('color-modal');
const closeModal = document.querySelector('.close-modal');
const hexCode = document.getElementById('hex-code');
const rgbCode = document.getElementById('rgb-code');
const hslCode = document.getElementById('hsl-code');
const copyButtons = document.querySelectorAll('.copy-btn');

// متغيرات
let originalImage = null;
let currentImage = null;
let extractedColors = [];

// أحداث تحميل الصورة
uploadLocal.addEventListener('click', () => {
    imageInput.click();
});

uploadUrl.addEventListener('click', () => {
    urlInputContainer.style.display = 'block';
});

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

loadUrlBtn.addEventListener('click', () => {
    const url = imageUrlInput.value.trim();
    if (url) {
        loadImage(url);
    } else {
        alert('يرجى إدخال رابط صورة صالح');
    }
});

// تحميل الصورة
function loadImage(src) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = function() {
        previewArea.innerHTML = '';
        previewArea.appendChild(img);
        img.style.display = 'block';
        originalImage = img;
        currentImage = img;
        applyFilters();
        extractColors();
        urlInputContainer.style.display = 'none';
        imageUrlInput.value = '';
    };
    
    img.onerror = function() {
        alert('فشل تحميل الصورة. يرجى التحقق من الرابط أو اختيار صورة أخرى.');
    };
    
    img.src = src;
}

// استخراج الألوان من الصورة
function extractColors() {
    if (!originalImage) return;
    
    // إنشاء عنصر رسم مؤقت
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // ضبط أبعاد الكانفاس
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // رسم الصورة على الكانفاس
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // الحصول على بيانات البكسل
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // خوارزمية مبسطة لاستخراج الألوان الشائعة
    const colorMap = {};
    const sampleStep = 20; // أخذ عينات لتسريع العملية
    
    for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // تجميع الألوان المتشابهة
        const colorKey = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
        
        if (colorMap[colorKey]) {
            colorMap[colorKey].count++;
        } else {
            colorMap[colorKey] = {
                r, g, b,
                count: 1
            };
        }
    }
    
    // تحويل الخريطة إلى مصفوفة وفرزها حسب التكرار
    const colorArray = Object.values(colorMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 12); // أخذ 12 لون فقط
    
    // تحويل الألوان إلى تنسيقات مختلفة
    extractedColors = colorArray.map((color, index) => {
        const hex = rgbToHex(color.r, color.g, color.b);
        const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
        const hsl = rgbToHsl(color.r, color.g, color.b);
        
        return {
            hex,
            rgb,
            hsl,
            r: color.r,
            g: color.g,
            b: color.b,
            name: `اللون ${index + 1}`
        };
    });
    
    // عرض الألوان
    displayColors();
}

// عرض الألوان المستخرجة
function displayColors() {
    colorsContainer.innerHTML = '';
    
    extractedColors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.innerHTML = `
            <div class="color-preview" style="background-color: ${color.hex};"></div>
            <div class="color-info">
                <div class="color-name">${color.name}</div>
                <div class="color-code">${color.hex}</div>
                <button class="copy-color-btn" data-hex="${color.hex}" data-rgb="${color.rgb}" data-hsl="${color.hsl}">
                    <i class="fas fa-copy"></i> نسخ الكود
                </button>
            </div>
        `;
        
        colorsContainer.appendChild(colorItem);
    });
    
    // إضافة أحداث لأزرار النسخ
    document.querySelectorAll('.copy-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const hex = this.getAttribute('data-hex');
            const rgb = this.getAttribute('data-rgb');
            const hsl = this.getAttribute('data-hsl');
            
            // عرض النافذة المنبثقة
            hexCode.value = hex;
            rgbCode.value = rgb;
            hslCode.value = hsl;
            colorModal.style.display = 'flex';
            
            // تغيير خلفية النافذة للون المحدد
            colorModal.querySelector('.modal-content').style.borderTop = `10px solid ${hex}`;
        });
    });
}

// تطبيق الفلاتر
function applyFilters() {
    if (!currentImage) return;
    
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const saturation = saturationSlider.value;
    const hue = hueSlider.value;
    const blur = blurSlider.value;
    
    const filterString = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        hue-rotate(${hue}deg)
        blur(${blur}px)
    `;
    
    currentImage.style.filter = filterString;
    
    // تحديث القيم المعروضة
    brightnessValue.textContent = `${brightness}%`;
    contrastValue.textContent = `${contrast}%`;
    saturationValue.textContent = `${saturation}%`;
    hueValue.textContent = `${hue}°`;
    blurValue.textContent = `${blur}px`;
}

// أحداث المنزلقات
brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);
saturationSlider.addEventListener('input', applyFilters);
hueSlider.addEventListener('input', applyFilters);
blurSlider.addEventListener('input', applyFilters);

// أحداث الفلاتر الجاهزة
presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter');
        
        // إزالة التحديد من جميع الأزرار
        presetButtons.forEach(b => b.classList.remove('active'));
        // إضافة التحديد للزر الحالي
        this.classList.add('active');
        
        // تطبيق الفلتر المحدد
        switch(filterType) {
            case 'normal':
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                saturationSlider.value = 100;
                hueSlider.value = 0;
                blurSlider.value = 0;
                break;
            case 'grayscale':
                brightnessSlider.value = 100;
                contrastSlider.value = 120;
                saturationSlider.value = 0;
                hueSlider.value = 0;
                blurSlider.value = 0;
                break;
            case 'sepia':
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                saturationSlider.value = 50;
                hueSlider.value = 40;
                blurSlider.value = 0;
                break;
            case 'invert':
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                saturationSlider.value = 100;
                hueSlider.value = 180;
                blurSlider.value = 0;
                break;
            case 'hue-rotate':
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                saturationSlider.value = 150;
                hueSlider.value = 90;
                blurSlider.value = 0;
                break;
            case 'vibrant':
                brightnessSlider.value = 110;
                contrastSlider.value = 120;
                saturationSlider.value = 180;
                hueSlider.value = 0;
                blurSlider.value = 0;
                break;
            case 'cool':
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                saturationSlider.value = 80;
                hueSlider.value = 200;
                blurSlider.value = 0.5;
                break;
            case 'warm':
                brightnessSlider.value = 110;
                contrastSlider.value = 110;
                saturationSlider.value = 120;
                hueSlider.value = 30;
                blurSlider.value = 0;
                break;
        }
        
        applyFilters();
    });
});

// إعادة تعيين الفلاتر
resetFiltersBtn.addEventListener('click', () => {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    blurSlider.value = 0;
    
    // إعادة تعيين الفلاتر الجاهزة
    presetButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.preset-btn[data-filter="normal"]').classList.add('active');
    
    applyFilters();
});

// تحميل الصورة المعدلة
downloadImageBtn.addEventListener('click', () => {
    if (!currentImage) {
        alert('يرجى تحميل صورة أولاً');
        return;
    }
    
    // إنشاء عنصر رسم مؤقت
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // ضبط أبعاد الكانفاس
    canvas.width = currentImage.naturalWidth || currentImage.width;
    canvas.height = currentImage.naturalHeight || currentImage.height;
    
    // تطبيق الفلاتر على الكانفاس
    ctx.filter = currentImage.style.filter;
    
    // رسم الصورة على الكانفاس
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    // تحويل الكانفاس إلى رابط تحميل
    const link = document.createElement('a');
    link.download = 'صورة-معدلة-' + new Date().getTime() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// تحميل لوحة الألوان
downloadColorsBtn.addEventListener('click', () => {
    if (extractedColors.length === 0) {
        alert('لا توجد ألوان لتحميلها');
        return;
    }
    
    // إنشاء محتوى النص
    let content = 'لوحة الألوان المستخرجة من الصورة:\n\n';
    extractedColors.forEach((color, index) => {
        content += `${color.name}:\n`;
        content += `HEX: ${color.hex}\n`;
        content += `RGB: ${color.rgb}\n`;
        content += `HSL: ${color.hsl}\n\n`;
    });
    
    // إنشاء رابط تحميل
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'ألوان-الصورة-' + new Date().getTime() + '.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
});

// إغلاق نافذة الألوان
closeModal.addEventListener('click', () => {
    colorModal.style.display = 'none';
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === colorModal) {
        colorModal.style.display = 'none';
    }
});

// نسخ الأكواد
copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-clipboard-target');
        const target = document.querySelector(targetId);
        
        // نسخ النص
        target.select();
        document.execCommand('copy');
        
        // تغيير نص الزر مؤقتاً
        const originalText = this.textContent;
        this.textContent = 'تم النسخ!';
        this.classList.add('copied');
        
        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('copied');
        }, 2000);
    });
});

// دوال تحويل الألوان المساعدة
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // لون رمادي
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// تهيئة أولية
document.querySelector('.preset-btn[data-filter="normal"]').classList.add('active');
