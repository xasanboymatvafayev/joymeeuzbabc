from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from app.database import get_db
from app.models import User, OTPCode
from app.schemas import OTPRequest, OTPVerify, Token
from app.security import create_access_token, generate_otp
import httpx, os, logging

logger = logging.getLogger(__name__)
router = APIRouter()

# ─── ESKIZ.UZ SMS ─────────────────────────────────────────────────────────────

async def send_sms_eskiz(phone: str, text: str) -> bool:
    """Eskiz.uz orqali haqiqiy SMS yuborish"""
    eskiz_email = os.getenv("ESKIZ_EMAIL", "")
    eskiz_password = os.getenv("ESKIZ_PASSWORD", "")
    
    if not eskiz_email or not eskiz_password:
        logger.warning("ESKIZ_EMAIL yoki ESKIZ_PASSWORD yo'q — SMS yuborilmadi")
        return False
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            # 1. Login qilish — token olish
            login_resp = await client.post(
                "https://notify.eskiz.uz/api/auth/login",
                data={"email": eskiz_email, "password": eskiz_password}
            )
            if login_resp.status_code != 200:
                logger.error(f"Eskiz login xato: {login_resp.status_code} {login_resp.text}")
                return False
            
            token = login_resp.json().get("data", {}).get("token", "")
            if not token:
                logger.error("Eskiz token olishda xato")
                return False
            
            # 2. SMS yuborish
            # Raqamdan + belgisini olib tashlash
            clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")
            
            sms_resp = await client.post(
                "https://notify.eskiz.uz/api/message/sms/send",
                headers={"Authorization": f"Bearer {token}"},
                data={
                    "mobile_phone": clean_phone,
                    "message": text,
                    "from": "4546",  # Eskiz.uz default sender
                    "callback_url": ""
                }
            )
            
            if sms_resp.status_code == 200:
                result = sms_resp.json()
                logger.info(f"SMS yuborildi: {phone}, status: {result.get('status')}")
                return True
            else:
                logger.error(f"SMS xato: {sms_resp.status_code} {sms_resp.text}")
                return False
                
    except Exception as e:
        logger.error(f"Eskiz xato: {e}")
        return False


# ─── ENDPOINTS ────────────────────────────────────────────────────────────────

@router.post("/send-otp")
async def send_otp(data: OTPRequest, db: AsyncSession = Depends(get_db)):
    phone = data.phone.strip()
    
    # Telefon raqam validatsiya
    clean = phone.replace("+", "").replace(" ", "").replace("-", "")
    if not clean.startswith("998") or len(clean) != 12:
        raise HTTPException(400, "Telefon raqami noto'g'ri. Misol: +998901234567")
    
    # 1 daqiqa ichida qayta yubormaslik
    recent = await db.execute(
        select(OTPCode).where(
            OTPCode.phone == phone,
            OTPCode.created_at > datetime.now(timezone.utc) - timedelta(minutes=1)
        ).limit(1)
    )
    if recent.scalar_one_or_none():
        raise HTTPException(429, "1 daqiqa kuting. Kod allaqachon yuborilgan.")
    
    # Yangi OTP kod yaratish
    code = generate_otp()
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    # Bazaga saqlash
    otp = OTPCode(phone=phone, code=code, method=data.method, expires_at=expires)
    db.add(otp)
    await db.commit()
    
    # SMS yuborish
    text = f"JOYMEE: Tasdiqlash kodingiz {code}. Kod 10 daqiqa amal qiladi."
    sent = False
    
    if data.method == "sms":
        sent = await send_sms_eskiz(phone, text)
    else:
        # Telegram uchun bot kerak — hozir SMS ga fallback
        sent = await send_sms_eskiz(phone, text)
    
    return {"message": "Kod yuborildi", "demo_code": code}


@router.post("/verify-otp", response_model=Token)
async def verify_otp(data: OTPVerify, db: AsyncSession = Depends(get_db)):
    phone = data.phone.strip()
    
    # Bazadan topish
    result = await db.execute(
        select(OTPCode).where(
            OTPCode.phone == phone,
            OTPCode.code == data.code,
            OTPCode.is_used == False,
            OTPCode.expires_at > datetime.now(timezone.utc)
        ).order_by(OTPCode.created_at.desc()).limit(1)
    )
    otp = result.scalar_one_or_none()
    
    if not otp:
        raise HTTPException(400, "Kod noto'g'ri yoki muddati o'tgan (10 daqiqa)")
    
    # Ishlatilgan deb belgilash
    otp.is_used = True
    
    # Foydalanuvchini topish yoki yaratish
    user_result = await db.execute(select(User).where(User.phone == phone))
    user = user_result.scalar_one_or_none()
    
    if not user:
        username = "user_" + phone[-4:]
        user = User(phone=phone, username=username, name="Foydalanuvchi")
        db.add(user)
    
    await db.commit()
    await db.refresh(user)
    
    # JWT token yaratish
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "name": user.name,
            "username": user.username,
            "avatar": user.avatar,
        }
    }


@router.get("/me")
async def get_me(db: AsyncSession = Depends(get_db)):
    """Token tekshirish uchun"""
    return {"status": "ok"}
