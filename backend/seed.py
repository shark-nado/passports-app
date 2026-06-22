from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from .models import Location, FormQuestion
from .auth import hash_password

DEFAULT_PASSWORDS = {
    "csc": "csc1960",
    "bookstore": "book1960",
}


async def seed_database(db: AsyncSession):
    """Ensure locations and default form questions exist."""
    # Seed locations
    for loc_id in ("csc", "bookstore"):
        result = await db.execute(select(Location).where(Location.id == loc_id))
        existing = result.scalar_one_or_none()
        if existing is None:
            name = "CSC" if loc_id == "csc" else "Bookstore"
            db.add(Location(
                id=loc_id,
                name=name,
                password_hash=hash_password(DEFAULT_PASSWORDS[loc_id]),
            ))

    # Seed default form questions
    defaults = {
        "photo": {
            "title": "Passport Photo",
            "description": "Do you have a 2x2 inch color photo taken within the last 6 months?",
        },
        "citizenship": {
            "title": "Proof of Citizenship",
            "description": "Do you have a certified birth certificate or naturalization certificate?",
        },
        "id": {
            "title": "Photo Identification",
            "description": "Do you have a valid driver's license or government-issued ID?",
        },
        "payment": {
            "title": "Form of Payment",
            "description": "Do you have a credit card, check, or money order for processing fees?",
        },
    }

    for key, val in defaults.items():
        result = await db.execute(select(FormQuestion).where(FormQuestion.key == key))
        existing = result.scalar_one_or_none()
        if existing is None:
            db.add(FormQuestion(key=key, title=val["title"], description=val["description"]))

    await db.commit()
