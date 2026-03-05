# JOYMEE — To'liq Ko'chmas Mulk Platformasi

## Tarkib
- **frontend/** — Next.js 14 (oq dizayn, Joymee.uz kabi)
- **backend/** — FastAPI + PostgreSQL
- **docker-compose.yml** — lokal ishga tushirish

## Lokal ishga tushirish

### 1. Docker bilan (eng oson)
```bash
docker-compose up -d
cd backend && python seed.py  # Demo ma'lumotlar
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### 2. Qo'lda

#### Backend:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# .env da DATABASE_URL ni to'g'rilang
uvicorn app.main:app --reload
python seed.py  # Demo ma'lumotlar
```

#### Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local da NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## Railway Deploy

### Backend:
1. Railway → New Project → Deploy from GitHub (backend papkasi)
2. Add PostgreSQL service (Railway da)
3. Environment Variables:
   ```
   DATABASE_URL=railway-postgres-url
   SECRET_KEY=your-random-secret
   ```
4. Port: 8000

### Frontend:
1. Railway → New Project → Deploy from GitHub (frontend papkasi)
2. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```
3. Port: 3000

## Asosiy imkoniyatlar
- ✅ OTP auth (telefon raqam + SMS)
- ✅ E'lon qo'shish (10 ta rasm, barcha kategoriyalar)
- ✅ Galereya va Xarita ko'rinishi
- ✅ Sotuv / Ijara / Kunlik filtri
- ✅ "Menga yaqin" (geolokatsiya)
- ✅ VIP / TOP e'lonlar
- ✅ Profil sahifasi
- ✅ Qidiruv (narx, xonalar, viloyat)
- ✅ E'lon detail (Qo'ng'iroq, Sotuvchiga yoz)

## Demo kirish
SMS yuborilmagan bo'lsa, /api/auth/send-otp response da `demo_code` qaytariladi.
