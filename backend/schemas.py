from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CheckinRequest(BaseModel):
    location_id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: str
    visit_type: str
    service_type: Optional[str] = None
    photo_format: Optional[str] = None
    app_complete: Optional[bool] = None
    checklist: Optional[str] = None
    subscribe: bool = False


class CheckinResponse(BaseModel):
    id: str
    message: str


class VisitorResponse(BaseModel):
    id: str
    location_id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: str
    visit_type: str
    service_type: Optional[str] = None
    photo_format: Optional[str] = None
    app_complete: Optional[bool] = None
    checklist: Optional[str] = None
    subscribe: bool
    notes: str
    status: str
    check_in_at: datetime
    sign_out_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class StatusUpdate(BaseModel):
    status: str


class NotesUpdate(BaseModel):
    notes: str


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str
    location_id: str


class QuestionUpdate(BaseModel):
    title: str
    description: str


class QuestionConfig(BaseModel):
    photo: QuestionUpdate
    citizenship: QuestionUpdate
    id: QuestionUpdate
    payment: QuestionUpdate


class StatsResponse(BaseModel):
    total: int
    passports_count: int
    notary_count: int
    photo_only_count: int
    returning_count: int
    prep_rate: float
    walk_in_percent: float
    incomplete_app_count: int
    missing_photo_count: int
    missing_citizenship_count: int
    missing_id_count: int
    missing_payment_count: int
