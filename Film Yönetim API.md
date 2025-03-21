
---

## **Yapılacaklar**

### 1. **Proje Kurulumu**
- Node.js ve Express.js ile bir proje başlatın:
  ```bash
  mkdir film-api
  cd film-api
  npm init -y
  npm install express mongoose dotenv bcrypt jsonwebtoken cors
  ```
- Gerekli bağımlılıkları yükleyin:
  - **express**: API oluşturmak için.
  - **mongoose**: MongoDB ile çalışmak için.
  - **dotenv**: Ortam değişkenlerini yönetmek için.
  - **bcrypt**: Şifreleme işlemleri için.
  - **jsonwebtoken**: JWT ile kimlik doğrulama için.
  - **cors**: CORS politikalarını yönetmek için.

---

### 2. **Veritabanı Tasarımı**
MongoDB'de aşağıdaki modelleri oluşturun:
1. **Film Modeli**:
   - Film adı, açıklama, tür, çıkış tarihi, yönetmen bilgisi.
   - Yorumlar (kullanıcı ID ve yorum içeriği).
   - İzleyen kullanıcıların listesi.

2. **Kullanıcı Modeli**:
   - Kullanıcı adı, şifre (bcrypt ile hashlenmiş), rol (admin veya user).

---

### 3. **API Uç Noktaları**
Aşağıdaki uç noktaları oluşturun:

#### Admin İşlemleri:
1. Film ekleme (`POST /api/admin/films`).
2. Film güncelleme (`PUT /api/admin/films/:id`).
3. Film silme (`DELETE /api/admin/films/:id`).

#### Kullanıcı İşlemleri:
1. Filmleri listeleme (`GET /api/films`).
2. İzledim işareti koyma (`POST /api/films/:id/watched`).
3. Filmlere yorum yazma (`POST /api/films/:id/comments`).

#### Kimlik Doğrulama:
1. Kullanıcı kaydı (`POST /api/auth/register`).
2. Kullanıcı girişi (`POST /api/auth/login`).
3. JWT ile yetkilendirme.

---

### 4. **Yetkilendirme**
- JWT kullanarak kullanıcı girişini doğrulayın.
- Admin işlemleri için bir middleware oluşturun (`isAdmin`).

---

### 5. **Hata Yönetimi**
- Hataları yönetmek için bir global hata middleware'i oluşturun.

---

## **Dosya Yapısı**

Projenizi aşağıdaki gibi organize edin:

```
film-api/
├── controllers/
│   ├── authController.js       # Kullanıcı giriş/kayıt işlemleri
│   ├── filmController.js       # Film CRUD işlemleri
│   └── userController.js       # Kullanıcıyla ilgili işlemler
├── models/
│   ├── Film.js                 # Film modeli
│   └── User.js                 # Kullanıcı modeli
├── routes/
│   ├── authRoutes.js           # Kimlik doğrulama rotaları
│   ├── filmRoutes.js           # Film rotaları
│   └── userRoutes.js           # Kullanıcı rotaları
├── middleware/
│   ├── authMiddleware.js       # JWT doğrulama ve yetkilendirme
│   └── errorMiddleware.js      # Global hata yönetimi
├── config/
│   └── db.js                   # MongoDB bağlantısı
├── .env                        # Ortam değişkenleri (DB bağlantısı, JWT secret)
├── server.js                   # Express sunucusu başlangıç noktası
└── package.json                # Proje bağımlılıkları ve bilgileri
```

---

## **Adım Adım Yapılacaklar**

### Adım 1: Veritabanı Bağlantısı
- `config/db.js` dosyasını oluşturun ve MongoDB bağlantısını yapılandırın.

### Adım 2: Modelleri Oluşturun
- `models/Film.js`: Film modeli.
- `models/User.js`: Kullanıcı modeli.

### Adım 3: Controller Dosyaları
- `controllers/authController.js`: Kullanıcı kaydı ve giriş işlemleri.
- `controllers/filmController.js`: Film CRUD işlemleri.
- `controllers/userController.js`: İzleme ve yorum ekleme işlemleri.

### Adım 4: Middleware'ler
- `middleware/authMiddleware.js`: JWT doğrulama ve admin kontrolü.
- `middleware/errorMiddleware.js`: Hata yönetimi.

### Adım 5: Rotalar
- `routes/authRoutes.js`: `/api/auth` altında kimlik doğrulama rotaları.
- `routes/filmRoutes.js`: `/api/films` altında film rotaları.
- `routes/userRoutes.js`: `/api/users` altında kullanıcı işlemleri.

### Adım 6: Sunucu Başlatma
- `server.js` dosyasını oluşturun ve Express uygulamasını başlatın.

---

## **Ek Özellikler**
1. **Pagination (Sayfalama)**:
   - Filmler listelenirken sayfalama ekleyin (`GET /api/films?page=1&limit=10`).

2. **Arama ve Filtreleme**:
   - Tür veya yönetmene göre arama yapabilen bir uç nokta ekleyin (`GET /api/films?genre=action&director=Nolan`).

3. **Kullanıcı Profili**:
   - Kullanıcının izlediği filmleri listeleyen bir uç nokta ekleyin (`GET /api/users/:id/watched-films`).

4. **Yorum Yönetimi**:
   - Yorumları düzenleme veya silme özelliği ekleyin (sadece yorumu yazan kullanıcı veya admin yapabilir).

---

Bu adımları takip ederek projenizi kolayca geliştirebilirsiniz! Eğer daha fazla detay isterseniz, her adımı daha ayrıntılı şekilde açıklayabilirim. 😊


