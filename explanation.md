# Nidaamka Iskaashiga (Attendance System) - Dastuurka Mashruuca

## Hordhac

Mashruucan Nidaamka Iskaashiga waa nidaam loogu talagalay maamulida iskaashiga ardayda jaamacadeed. Waxa uu ka kooban yahay laba qaybood:

1. **App-ka Mobile** (React Native Expo) - loogu talagalay macalimiinta iyo ardayda
2. **Dashboard-ka Web** (Next.js) - loogu talagalay maamulayaasha

## Qaybta Mobile (App-ka Taleefanka)

### Farsamada (Tech Stack) La Isticmaalo

- **Qaab-dhismeedka**: React Native with Expo 52
- **Luuqada**: JavaScript
- **Habi-bixinta**: React Navigation
- **Kaydinta**: Expo SecureStore
- **Qurxinta**: React Native StyleSheet

### Habka Shaqada App-ka

#### Macallimiinta:
1. **Soo gal** → Guri-ga Macallinka (Liiska Fields-ka)
2. **Dooro Field** → Liiska Subjects-ka
3. **Dooro Subject** → Liiska Iskaashiga
4. **Dooro Iskaashiga Firfircoon** → Calaamadee Iskaashiga (Liiska Ardayda)

#### Ardayda:
1. **Soo gal** → Guri-ga Ardayga (Dulmarka Iskaashiga)
2. **Eeg dhammaan subjects-ka** iyo tirakoobka iskaashiga

### Astaamaha Muhiimka ah

- Macallimiinta waxay calaamadeeyaan iskaashiga waqtiyada firfircoon ee maanta
- Ardaydu waxay aragtaan natiijooyinka iskaashiga iyo heerarka guulaynta
- App-ku wuxuu xasuusinayaa tokenka isticmaaleha si aan mar walba loogu baahnayn in lagu soo galo

## Qaybta Web (Dashboard-ka Maamulka)

### Farsamada (Tech Stack) La Isticmaalo

- **Qaab-dhismeedka**: Next.js 14 (App Router)
- **Luuqada**: TypeScript
- **Macluumaadka**: MongoDB
- **Maareeynta Database**: Prisma
- **Xaqiijinta**: NextAuth.js
- **Qurxinta**: Tailwind CSS

### Waaxyaha API-ga (Endpoints)

#### Maamulayaasha (Administrators):

- **Maareeynta Isticmaalayaasha**: Abuur, eeg, cusbooneysii isticmaalayaasha
- **Maareeynta Fields-ka**: Abuur fields cusub (tusaale: Software Engineering)
- **Maareeynta Subjects-ka**: Abuur subjects-ka fields kasta
- **Maareeynta Iskaashiga**: Deji maalmo, waqtiyo, iyo ardayda iskaashiga

#### Macallimiinta:

- **Eeg Iskaashiga Firfircoon**: Arag iskaashiga maanta
- **Calaamadee Ardayda**: Beddel xaaladda iskaashiga ardayda

#### Ardayda:

- **Eeg Natiijooyinka**: Arag tirada maalmaha huzirtay iyo maalmaha aanad huzirin

## Habka Shaqada Nidaamka

### 1. Diyaarinta Iskaashiga (Maamulaha)
```
Maamulaha → Abuur Field → Abuur Subject → U qoondee Macallin → Deji Iskaashiga
```

### 2. Calaamadeynta Iskaashiga (Macallinka)
```
Macallinka → Dooro Field → Dooro Subject → Dooro Iskaashig → Calaamadee Ardayda
```

### 3. Eegista Natiijooyinka (Ardayga)
```
Ardayga → Eeg dhammaan subjects-ka → Arag heerarka iskaashiga
```

## Qaab-dhismeedka Database-ka

### Models-ka Muhiimka ah:

- **User**: Isiticmaalayaasha (Maamulaha, Macallin, Arday)
- **Field**: Qaybaha jaamacadda (tusaale: Software Engineering)
- **Subject**: Koorsada fields kasta (tusaale: Database Systems)
- **Attendance**: Iskaashiga subjects kasta
- **AttendanceRecord**: Diiwaanka iskaashiga arday kasta

## Habka Rakibaadda

### App-ka Mobile:
```bash
cd mobile
npm install
# Beddel API_BASE_URL constants/config.js
npm start
```

### Dashboard-ka Web:
```bash
cd web
npm install
# Samee .env file
npm run prisma:migrate
npm run dev
```

## Astaamaha Ugu Muhiimsan

1. **Kala saarista Doorka**: Maamulaha, Macallinka, iyo Ardayga waxay leeyihiin gacmo furasho kala duwan
2. **Xaqiijinta**: Isticmaalayaashu waa inay yihiin kuwo la xaqiijiyay
3. **Waqtiga Iskaashiga**: Iskaashigu wuxuu firfircoon yahay waqti gaar ah oo maalinta ah
4. **Kaydinta Ammaan ah**: Tokenka waa la kaydiyaa si ammaan ah SecureStore-ka
5. **Isdhexgalka API-ga**: App-ka mobile iyo dashboard-ka web waxay isticmaalaan API isku mid ah

## Tusaalooyinka Isticmaalka

### Macallin:
"Waxaan dooranayaa qaybta Software Engineering, ka dib waxaan dooranayaa koorsada Database Systems, waxaana ardayda u calaamadeynayaa iskaashiga maanta 9:00 ilaa 12:00."

### Arday:
"Waxaan arki karaa inaan huzirtay 8 maalmood oo 10 ka mid ah koorsada Database Systems, taasoo 80% u dhiganta."

### Maamulaha:
"Waxaan abuuri karaa field cusub, ugu darsan karaa macallimiin iyo arday, dejin karaa waqtiyada iskaashiga."

## Dhibaatooyinka Caadiga ah iyo Qaabaha Laga Xaliyo

1. **Khaladka Shabakada**: Hubi in API_BASE_URL sax yahay
2. **Dhibaatooyinka Xaqiijinta**: Casri data-da app-ka oo isku day inaad mar kale soo gasho
3. **Macluumaadka aan muuqan**: Hubi in isticmaalehu uu leeyahay doorka saxda ah

Mashruucan waa mid loogu talagalay in uu fududeeyo maareeynta iskaashiga jaamacadeed, isagoo adeegsanaya farsamada casriga ah oo mobile iyo web isku xira.
