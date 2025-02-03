from pydantic import BaseModel, field_validator

class MockPaymentRequest(BaseModel):
    requestId: str
    paymentStatus: str

    @field_validator("paymentStatus")
    def validate_payment_status(cls, value):
        if value not in {"successful", "expired"}:
            raise ValueError("Invalid payment status Hello World. Allowed values: 'successful', 'expired'")
        return value
    
class PANVerificationRequest(BaseModel):
    pan: str
    consent: str
    reason: str
    