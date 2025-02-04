import os
import logging
from datetime import datetime
import json

import asyncio
from fastapi import APIRouter, Request, HTTPException
from typing import Dict
import httpx

from app.utils.util import generate_rpd_analytics_report, generate_pancard_analytics_report
from app.redis_client import push_log_entry_to_redis, add_key_value_redis, get_value_redis, get_list_from_redis
from app.utils.models import MockPaymentRequest
from app.utils.constants import REDIS_RPD_ANALYTICS_KEY, REDIS_RPD_STATUS_KEY, REDIS_LOG_ANALYTICS_KEY

logger = logging.getLogger(__name__)
bank_account_router = APIRouter()

SETU_KYC_PRODUCT_ID = os.getenv('SETU_RPD_PRODUCT_ID')
SETU_KYC_CLIENT_ID = os.getenv('SETU_CLIENT_ID')
SETU_KYC_CLIENT_SECRET = os.getenv('SETU_CLIENT_SECRET')
SETU_BASE_URL = 'https://dg-sandbox.setu.co'
REDIRECT_URL = 'http://localhost:5173/'
TIMEOUT_SECONDS = 60

@bank_account_router.post("/create-rpd")
async def create_reverse_penny_drop(bank_details: Dict[str, str]):
    url = f"{SETU_BASE_URL}/api/verify/ban/reverse"
    headers = {
        "Content-Type": "application/json",
        "x-client-id": SETU_KYC_CLIENT_ID,
        "x-client-secret": SETU_KYC_CLIENT_SECRET,
        "x-product-instance-id": SETU_KYC_PRODUCT_ID
    }
    
    request_payload = {
        "additionalData": {
            "source": "web_portal",
            "request_time": datetime.now().isoformat(),
            **bank_details,
        },
        "redirectionConfig": {
            "redirectUrl": REDIRECT_URL,
            "timeout": TIMEOUT_SECONDS
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=request_payload, headers=headers)
        response_data = response.json()
    return response_data


@bank_account_router.post("/mock-payment")
async def mock_payment(payment_details: MockPaymentRequest):
    url = f"{SETU_BASE_URL}/api/verify/ban/reverse/mock_payment/{payment_details.requestId}"
    headers = {
        "Content-Type": "application/json",
        "x-client-id": SETU_KYC_CLIENT_ID,
        "x-client-secret": SETU_KYC_CLIENT_SECRET,
        "x-product-instance-id": SETU_KYC_PRODUCT_ID
    }
    
    payload = {"paymentStatus": payment_details.paymentStatus}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        response_data = response.json()
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response_data)
    
    return response_data

@bank_account_router.post("/setu-webhook")
async def setu_webhook(request: Request):
    try:

        webhook_payload = await request.json()
        event = webhook_payload.get("event")
        timestamp = webhook_payload.get("timeStamp")
        rpd = webhook_payload.get("data", {}).get("rpd", {})
        _id = rpd.get("id")

        if not _id:
            raise HTTPException(status_code=400, detail="Invalid webhook payload")  

        success = rpd.get("success", False)
        error_info = rpd.get("error", {})
        failure_code = error_info.get("code")
        failure_reason = error_info.get("detail")

        status = "SUCCESS" if success else "FAILED"

        bank_details = None
        if success:
            bank_info = rpd.get("data", {})
            bank_details = {
                "bankAccountName": bank_info.get("bankAccountName"),
                "bankAccountIfsc": bank_info.get("bankAccountIfsc"),
                "bankAccountNumber": bank_info.get("bankAccountNumber"),
                "payerVpa": bank_info.get("payerVpa"),
                "accountType": bank_info.get("accountType"),
                "bankAccountType": bank_info.get("bankAccountType"),
                "ifscCrossCheck": bank_info.get("ifscCrossCheck"),
                "ifscDetails": bank_info.get("ifscDetails")
            }

        # Status tracking for frontend polling
        status_key = f"{REDIS_RPD_STATUS_KEY}{_id}"
        status_value = {
            "status": status,
            "event": event,
            "failure_reason": failure_reason if not success else None,
            "failure_code": failure_code if not success else None,
            "bankDetails": bank_details if success else None
        }

        # Analytics
        analytics_value = {
            "event": event,
            "success": success,
            "timestamp": timestamp,
            "status": status,
            "failureCode": failure_code,
            "failureReason": failure_reason,
            "bankAccountIfsc": bank_details.get("bankAccountIfsc") if success else None,
            "accountType": bank_details.get("accountType") if success else None,
            "bankAccountType": bank_details.get("bankAccountType") if success else None,
            "bank_name": bank_details.get("ifscDetails").get("name") if success else None,
            "statusCode": rpd.get('statusCode') if event == 'RPD_DEBIT_ATTEMPT_FAILED' else None,
            "statusDescription": rpd.get('statusDescription') if event == 'RPD_DEBIT_ATTEMPT_FAILED' else None
        }

        # Set expiration time to 6 hours
        expire_time = 21600

        await asyncio.gather(
            add_key_value_redis(status_key, json.dumps(status_value), expire=expire_time),
            push_log_entry_to_redis(REDIS_RPD_ANALYTICS_KEY, analytics_value)
        )

        logger.info(f"Stored RPD {_id} data successfully in Redis")

        return {"message": "Webhook received"} 
    except Exception as e:
        logger.error("Error processing webhook:", str(e))
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

@bank_account_router.get("/rpd-payment-status/setu/{request_id}")
async def fetch_status_from_setu(request_id: str):
    """Fetches the status of a Reverse Penny Drop request."""
    url = f"{SETU_BASE_URL}/api/verify/ban/reverse/{request_id}"
    headers = {
        "Content-Type": "application/json",
        "x-client-id": SETU_KYC_CLIENT_ID,
        "x-client-secret": SETU_KYC_CLIENT_SECRET,
        "x-product-instance-id": SETU_KYC_PRODUCT_ID
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response_data = response.json()
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response_data)

    return response_data

@bank_account_router.get("/rpd-payment-status/cached/{request_id}")
async def fetch_status_from_cache(request_id: str):
    """Fetches the status of a Reverse Penny Drop request."""
    redis_key = f"rpd_status:{request_id}"
    
    cached_value = await get_value_redis(redis_key)
    if cached_value:
        return json.loads(cached_value)
    return {}

@bank_account_router.get('/analytics')
async def get_analytics():

    pancard_data, rpd_data = await asyncio.gather(
        get_list_from_redis(REDIS_LOG_ANALYTICS_KEY),
        get_list_from_redis(REDIS_RPD_ANALYTICS_KEY)
    )

    rpd_data_json = list(map(json.loads, rpd_data))
    pancard_lst_json = list(map(json.loads, pancard_data))

    return {
        'rpdAnalytics': generate_rpd_analytics_report(rpd_data_json),
        'pancardAnalytics': generate_pancard_analytics_report(pancard_lst_json),
        'pancardRawData': pancard_lst_json
    }

