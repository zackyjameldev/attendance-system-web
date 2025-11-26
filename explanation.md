

# Mashruuca Attendance System - Qeexid iyo Tilmaamo

## Horudhac

Mashruucan waa nidaam loogu talagalay maamulka xaadiriska ardayda, wuxuuna ka kooban yahay laba qaybood:

1. **Mobile App** – loo isticmaalo macalimiinta iyo ardayda
2. **Web Dashboard** – maamulka guud ee nidaamka

## Qaybaha Mashruuca

### 1. Mobile App (React Native Expo)

**Ujeeddo:** Macalimiinta waxay ku diiwaan gelinkaraan xaadiriska ardayda, halka ardaydu ay ka eegi karaan natiijooyinkooda.

**Tiknoolajiyada la isticmaalayo:**

* React Native Expo 52
* JavaScript
* React Navigation
* Expo SecureStore
* React Native StyleSheet

**Shaqaalaha Ugu Muhiimsan:**

**Macalimiinta:**

* Galitaanka (login)
* Eegista qaybaha ay wax bartaan
* Eegista maadooyinka
* Eegista dhammaan xaadiriska
* Ku diiwaangelinta xaadiriska ardayda (waqti go’an)

**Ardayda:**

* Galitaanka (login)
* Eegista natiijooyinka xaadiriska
* Eegista tirada maalmaha xaadirka iyo maqnaanshaha

### 2. Web Dashboard (Next.js)

**Ujeeddo:** Maamulka nidaamka oo dhan – maamul isticmaalayaasha, qaybaha, maadooyinka, iyo xaadiriska.

**Tiknoolajiyada la isticmaalayo:**

* Next.js 14
* TypeScript
* MongoDB
* Prisma ORM
* NextAuth.js
* Tailwind CSS

**Shaqaalaha Ugu Muhiimsan:**

**Maamulaha (Administrator):**

* Maamul isticmaalayaasha (ku dar, beddel, tirtir)
* Maamul qaybaha (fields)
* Maamul maadooyinka (subjects)
* Maamul xaadiriska (attendances)
* Eegista dhammaan ardayda

**Macalimiinta (Web):**

* Eegista xaadiriska firfircoon
* Ku diiwaangelinta xaadiriska ardayda

## Sida Nidaamku U Shaqeeyo

### Flow-ga Mobile App

**Macalinka:**

1. Login → Guri Macalinka (Liiska Qaybaha)
2. Dooro Qayb → Liiska Maadooyinka
3. Dooro Maado → Liiska Xaadiriska
4. Dooro Xaadiriska Firfircoon → Ku Diiwaangelinta Xaadiriska Ardayda

**Ardayga:**

1. Login → Guri Ardayga (Dulmarka Xaadiriska)
2. Eeg dhammaan maadooyinka iyo natiijooyinka

### Flow-ga Web Dashboard

**Maamulaha:**

* Login → Dashboard Maamulka
* Maamul isticmaalayaasha, qaybaha, maadooyinka, iyo xaadiriska

**Macalinka (Web):**

* Login → Dashboard Macalinka
* Eegista xaadiriska firfircoon iyo ku diiwaangelinta ardayda

## Database iyo API

### Qaabka Database-ka

* **User**: Isticmaalayaasha (Maamulaha, Macalin, Arday)
* **Field**: Qaybaha (Tusaale: Software Engineering)
* **Subject**: Maadooyinka (Tusaale: Database Systems)
* **Attendance**: Xaadiriska
* **AttendanceRecord**: Diiwaanka xaadiriska arday kasta

### API Endpoints

**Authentication:**

* `POST /api/auth/login` - Login Web
* `POST /api/auth/mobile-login` - Login Mobile

**Maamulaha:**

* `GET/POST /api/admin/users` - Maamul isticmaalayaasha
* `GET/POST /api/admin/fields` - Maamul qaybaha
* `GET/POST /api/admin/subjects` - Maamul maadooyinka
* `GET/POST /api/admin/attendances` - Maamul xaadiriska

**Macalimiinta:**

* `GET /api/teacher/attendances` - Eegista xaadiriska
* `POST /api/teacher/attendances/[id]/mark` - Ku diiwaangelinta xaadiriska

**Ardayda:**

* `GET /api/student/attendance` - Eegista natiijooyinka

## Sida loo Cusbooneysiiyo

### Mobile App

```bash
cd mobile
npm install
# Bedel API_BASE_URL ee constants/config.js
npm start
```

### Web Dashboard

```bash
cd web
npm install
# Samee .env file
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Xog Muhiim ah

1. **Authentication**: Mobile app waxay isticmaashaa token, web app-na waxay isticmaashaa sessions
2. **Xaadiriska**: Macalimiinta waxay ku diiwaangelin karaan xaadiriska maanta oo waqtigiisu firfircoon yahay
3. **Xaddidaad**: Ardaygu wuxuu arki karaa kaliya natiijooyinkiisa, macalinku wuxuu arki karaa ardaydiisa
4. **Security**: Dhammaan xogta waa la ilaaliyaa, authentication ayaa loo baahan yahay

## Tusaalooyinka Isticmaalka

**Macalinka:**

* Login Mobile App-ka
* Dooro Qaybta iyo Maadada
* Eegista xaadiriska firfircoon
* Ku diiwaangelinta xaadiriska ardayda

**Ardayga:**

* Login Mobile App-ka
* Eegista natiijooyinka dhammaan maadooyinka

**Maamulaha:**

* Login Web Dashboard-ka
* Abuur isticmaalayaal cusub
* Maamul qaybaha iyo maadooyinka
* Abuur xaadiriska cusub

## Xalinta Dhibaatooyinka Caadiga ah

1. **Khaladka Network**: Hubi in API_BASE_URL sax yahay
2. **Khaladka Authentication**: Nadiifi xogta app-ka oo login mar kale samee
3. **Xogta ma muuqato**: Hubi in isticmaaluhu leeyahay role sax ah

---

Haddii aad rabto, waxaan ku sameyn karaa **version-ka markdown oo kooban oo aad si toos ah ugu isticmaali karto README GitHub**, oo leh **headings iyo bullets habeysan** oo fudud in la akhriyo.

Ma jeclaan lahayd inaan sidaas u sameeyo?
