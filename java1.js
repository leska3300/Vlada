// ===== НАСТРОЙКИ =====
const API_KEY = '34f523d591ef7f884bd45250c1793734';

// ===== ХРАНИЛИЩЕ =====
let savedImages = JSON.parse(localStorage.getItem('myImages') || '[]');
let currentImageUrl = '';

// ===== ПОКАЗАТЬ ГАЛЕРЕЮ =====
function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (savedImages.length === 0) {
        gallery.innerHTML = '<p style="color:#999;text-align:center;width:100%;">Пока нет картинок</p>';
        return;
    }
    gallery.innerHTML = savedImages.map((item, index) => `
        <div style="position:relative;display:inline-block;margin:8px;">
            <img src="${item.url}" style="max-width:250px;max-width:350px;border-radius:0;display:block;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <button onclick="deleteImage(${index})" style="position:absolute;top:-10px;right:-10px;background:rgba(229,177,255,0.8);color:white;border:none;border-radius:50%;width:26px;height:26px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);">×</button>
        </div>
    `).join('');
}
// ===== УДАЛИТЬ =====
function deleteImage(index) {
    if (!confirm('Удалить?')) return;
    savedImages.splice(index, 1);
    localStorage.setItem('myImages', JSON.stringify(savedImages));
    renderGallery();
}

// ===== ПОКАЗАТЬ ПРЕВЬЮ =====
function showPreview(url) {
    document.getElementById('preview').innerHTML = `<img src="${url}" style="max-width:100%;max-height:300px;border-radius:12px;">`;
    currentImageUrl = url;
    document.getElementById('saveBtn').style.display = 'inline-block';
}

// ===== СОХРАНИТЬ =====
function saveCurrent() {
    if (!currentImageUrl) return alert('Надо фотографию О-О"');
    if (savedImages.some(item => item.url === currentImageUrl)) return alert('Уже сохранено!');
    savedImages.push({ url: currentImageUrl });
    localStorage.setItem('myImages', JSON.stringify(savedImages));
    renderGallery();
    document.getElementById('preview').innerHTML = '';
    document.getElementById('saveBtn').style.display = 'none';
    currentImageUrl = '';
    alert('красота!~');
}

// ===== ЗАГРУЗКА НА IMGBB =====
function uploadToImgbb(file) {
    if (!API_KEY || API_KEY === 'ТВОЙ_КЛЮЧ_С_IMGBB') {
        return alert('⚠️ Вставь API-ключ ImgBB в код!');
    }
    const formData = new FormData();
    formData.append('key', API_KEY);
    formData.append('image', file);
    document.getElementById('preview').innerHTML = 'минутку...';
    fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) showPreview(data.data.url);
        else document.getElementById('preview').innerHTML = '❌ Ошибка';
    })
    .catch(() => document.getElementById('preview').innerHTML = '❌ Ошибка сети');
}

// ===== ОБРАБОТКА ФАЙЛА =====
function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return alert('Это не картинка! > <');
    uploadToImgbb(file);
}

// ===== СОБЫТИЯ =====
document.getElementById('fileInput').addEventListener('change', function(e) {
    if (this.files[0]) handleFile(this.files[0]);
    this.value = '';
});

// ===== СТАРТ =====
renderGallery();