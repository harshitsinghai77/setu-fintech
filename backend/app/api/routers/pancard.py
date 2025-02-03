import os
import time

import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from app.utils.util import log_pancard_analytics
from app.utils.models import PANVerificationRequest

pancard_router = APIRouter()

SETU_KYC_PRODUCT_ID = os.getenv('SETU_PAN_PRODUCT_ID')
SETU_KYC_CLIENT_ID = os.getenv('SETU_CLIENT_ID')
SETU_KYC_CLIENT_SECRET = os.getenv('SETU_CLIENT_SECRET')
SETU_BASE_URL = 'https://dg-sandbox.setu.co'

@pancard_router.post("/verify")
async def verify_pan(pan_details: PANVerificationRequest):
    url = f"{SETU_BASE_URL}/api/verify/pan"
    headers = {
        "Content-Type": "application/json",
        "x-client-id": SETU_KYC_CLIENT_ID,
        "x-client-secret": SETU_KYC_CLIENT_SECRET,
        "x-product-instance-id": SETU_KYC_PRODUCT_ID
    }
    
    start_time = time.perf_counter()  

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=pan_details.model_dump(), headers=headers)
        end_time = time.perf_counter()
        response_data = response.json()
        
        log_data = {
            "status_code": response.status_code,
            "response_time": end_time - start_time,
            **response_data
        }

        # Note: Using asyncio.create_task to schedule background tasks in AWS Lambda can be problematic.
        # AWS Lambda functions are designed to be short-lived and stateless. When the Lambda function completes,
        # the execution environment is frozen, and any background tasks that are still running may be terminated abruptly.
        # This means that the background task may not complete successfully
        # asyncio.create_task(log_pan_analytics(log_data))
        
        await log_pancard_analytics(log_data)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response_data)

    return response_data
