# Mashruuca Attendance System - Qeexid iyo Tilmaamaha

## Horudhac (Introduction)

Mashruucan waa nidaam hore u socodka ardayda oo ka kooban laba qaybood:

1. **Mobile App** - loo isticmaalo macalimiinta iyo ardayda
2. **Web Dashboard** - maamulka nidaamka

## Qaybaha Mashruuca

### 1. Mobile App (React Native Expo)

**Ujeeddo:** Macalimiinta waxay ku dhejiyaan hore u socodka, ardayduna waxay eegi karaan natiijooyinkooda.

**Tiknoolajiyada la isticmaalo:**
- React Native Expo 52
- JavaScript
- React Navigation
- Expo SecureStore
- React Native StyleSheet

**Qaybaha Ugu Muhiimsan:**

**Macalimiinta:**
- Gelitaan (login)
- Eeggo qaybaha ay wax bartaan
- Eeggo maadooyinka
- Eeggo dhammaan hore u socodka
- Ku dheji hore u socodka ardayda (waqti la xaddiday)

**Ardayda:**
- Gelitaan (login)
- Eeggo natiijooyinka hore u socodka
- Eeggo tirada maalmaha hore u socodka iyo aan hore u socodin

### 2. Web Dashboard (Next.js)

**Ujeeddo:** Maamulka nidaamka oo dhan - lagu maamulo isticmaalayaasha, qaybaha, maadooyinka, iyo hore u socodka.

**Tiknoolajiyada la isticmaalo:**
- Next.js 14
- TypeScript
- MongoDB
- Prisma ORM
- NextAuth.js
- Tailwind CSS

**Guryaha Ugu Muhiimsan:**

**Maamulaha (Administrator):**
- Maamul isticmaalayaasha (dhig, bedel, tir)
- Maamul qaybaha (fields)
- Maamul maadooyinka (subjects)
- Maamul hore u socodka (attendances)
- Eeggo dhammaan ardayda

**Macalimiinta (Web):**
- Eeggo hore u socodka firfircoon
- Ku dheji hore u socodka ardayda

## Sida uu Nidaamku U Shaqeeyo

### Flow-ga Mobile App

**Macalimka:**
1. Login → Guri Macalimka (Liiska Qaybaha)
2. Dooro Qayb → Liiska Maadooyinka
3. Dooro Maado → Liiska Hore u Socodka
4. Dooro Hore u Socodka Firfircoon → Ku Dheji Hore u Socodka (Liiska Ardayda)

**Ardayga:**
1. Login → Guri Ardayga (Dulmarka Hore u Socodka)
2. Eeggo dhammaan maadooyinka iyo natiijooyinka

### Flow-ga Web Dashboard

**Maamulaha:**
- Login → Dashboard Maamulka
- Maamul isticmaalayaasha, qaybaha, maadooyinka, hore u socodka

**Macalimka (Web):**
- Login → Dashboard Macalimka
- Eeggo hore u socodka firfircoon iyo ku dheji hore u socodka

## Database iyo API

### Qaabka Database-ka
- **User**: Isiticmaalayaasha (Maamulaha, Macalim, Arday)
- **Field**: Qaybaha (Tusaale: Software Engineering)
- **Subject**: Maadooyinka (Tusaale: Database Systems)
- **Attendance**: Hore u Socodka
- **AttendanceRecord**: Diiwaanka hore u socodka arday kasta

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Web login
- `POST /api/auth/mobile-login` - Mobile login

**Maamulaha:**
- `GET/POST /api/admin/users` - Maamul isticmaalayaasha
- `GET/POST /api/admin/fields` - Maamul qaybaha
- `GET/POST /api/admin/subjects` - Maamul maadooyinka
- `GET/POST /api/admin/attendances` - Maamul hore u socodka

**Macalimiinta:**
- `GET /api/teacher/attendances` - Eeggo hore u socodka
- `POST /api/teacher/attendances/[id]/mark` - Ku dheji hore u socodka

**Ardayda:**
- `GET /api/student/attendance` - Eeggo natiijooyinka

## Sida loo Cusbooneysiiyo

### Mobile App
```bash
cd mobile
npm install
# Bedel API_BASE_URL constants/config.js
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

## Muhiimka ah ee la Ogaado

1. **Authentication**: Mobile app waxay isticmaashaa token, webka waxaa isticmaala sessions
2. **Waqtiga Hore u Socodka**: Macalimiinta waxay ku dhejiyaan hore u socodka maanta oo waqtiga uu firfircoon yahay
3. **Xaddidaadka**: Arday kasta wuxuu arkaa natiijooyinkiisa kaliya, macalimku wuxuu arkaa ardaydiisa
4. **Security**: Dhammaan xogta waa la ilaaliyaa, authentication ayaa loo baahanahay

## Tusaalooyinka Isticmaalka

**Macalimka:**
- Login mobile app-ka
- Dooro qaybta iyo maadada
- Eeggo hore u socodka firfircoon
- Ku dheji hore u socodka ardayda

**Ardayga:**
- Login mobile app-ka
- Eeggo natiijooyinka hore u socodka dhammaan maadooyinka

**Maamulaha:**
- Login web dashboard-ka
- Abuur isticmaalayaasha cusub
- Maamul qaybaha iyo maadooyinka
- Abuur hore u socodka cusub

## Xalinta Dhibaatooyinka Caadiga ah

1. **Khaladka Network**: Hubi in API_BASE_URL sax yahay
2. **Qaladka Authentication**: Nadiif xogta app-ka oo login mar kale
3. **Xogta ma muuqato**: Hubi in isticmaalaha uu leeyahay role sax ah

Mashruucan waa nidaam buuxa oo hore u socodka ardayda loo maareeyo, waxaana loo qorsheeyay in uu fududeeyo hawsha macalimiinta iyo in ardaydu si fudud ugu ogaadaan hore u socodkooda.
