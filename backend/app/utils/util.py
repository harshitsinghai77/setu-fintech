from datetime import datetime
from collections import defaultdict
from typing import Dict, List

from app.redis_client import push_log_entry_to_redis
from app.utils.constants import REDIS_LOG_ANALYTICS_KEY

async def log_pancard_analytics(log_entry: Dict[str, str]):
    """Logs detailed analytics in Redis."""
    if not log_entry:
        return

    log_entry['timestamp'] = datetime.now().isoformat()
    
    # Success verification log
    if log_entry.get('status_code') == 200 and log_entry.get("verification") == "success":
        log_entry["verification_status"] = "success"
        log_entry["message"] = log_entry.get("message")
    
    # Failure log entries
    elif log_entry.get('status_code') in (400, 500, 401):
        log_entry["verification_status"] = "failed"
        log_entry["message"] = log_entry.get("message")
        log_entry["failure_detail"] = log_entry.get("error", {}).get("detail")
        log_entry["error_code"] = log_entry.get("error", {}).get("code")


    await push_log_entry_to_redis(REDIS_LOG_ANALYTICS_KEY, log_entry)

def generate_rpd_analytics_report(rpd_data: List[Dict[str, str]]):
    total_kyc_attempted = len(rpd_data)
    total_kyc_successful = 0
    total_failed = 0
    total_kyc_failed_by_VERIFICATION_UPDATE = 0
    total_failed_due_to_bank_account = 0

    result = defaultdict(lambda: defaultdict(int))
    unique_fields = (
        'failureCode', 'failureReason', 'bankAccountIfsc', 'accountType', 
        'bankAccountType', 'bank_name', 'statusCode', 'statusDescription'
    )
        
    for event in rpd_data:
        # Total KYC Attempted
        if event.get("event") == "RPD_VERIFICATION_UPDATE": 
            if event.get("success"):
                total_kyc_successful += 1
            # Total KYC Failed
            else:
                total_failed += 1
                total_kyc_failed_by_VERIFICATION_UPDATE += 1

        if event.get("event") == "RPD_DEBIT_ATTEMPT_FAILED":
            if not event.get("success"):
                total_failed_due_to_bank_account += 1
                total_failed += 1

        for field in unique_fields:
            field_value = event.get(field)
            if field_value:
                result[field][field_value] += 1

    json_result = defaultdict(list)
    for event_type, counts in result.items():
        for key, value in counts.items():
            json_result[event_type].append({
                "field": key,
                "count": value
            })

    return {
        "totalKycAttempted": total_kyc_attempted,
        "totalKycSuccessful": total_kyc_successful,
        "totalFailed": total_failed,
        "totalKycFailedByVerificationUpdate": total_kyc_failed_by_VERIFICATION_UPDATE,
        "totalFailedDueToBankAccount": total_failed_due_to_bank_account,
        "groupByKey": json_result
    }

def generate_pancard_analytics_report(pancard_data: List[Dict[str, str]]):
    total_pancard_attempts = len(pancard_data)
    failed_pancard = 0
    success_pancard = 0

    for data in pancard_data:
        if data.get('verification') and data.get('verification').lower() == 'failed':
            failed_pancard += 1
        if data.get('verification') and data.get('verification').lower() == 'success':
            success_pancard += 1
    
    return {
        'totalPancardAttempts': total_pancard_attempts,
        'totalFailedAttempts': failed_pancard,
        'totalSuccessAttempts': success_pancard
    }