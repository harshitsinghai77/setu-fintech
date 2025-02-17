import os
import json

import redis.asyncio as redis

redis_host = os.getenv('REDIS_CLOUD_ENDPOINT', '127.0.0.1')
redis_port = os.getenv('REDIS_CLOUD_PORT', 6379)
redis_username = os.getenv('REDIS_USERNAME', "default")
redis_password = os.getenv('REDIS_PASSWORD', "my_password")

redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,
    username=redis_username,
    password=redis_password,
    decode_responses=True,
)

async def add_key_value_redis(key, value, expire=None):
    await redis_client.set(key, value)
    if expire:
        await redis_client.expire(key, expire)

async def get_value_redis(key):
    return await redis_client.get(key)

async def get_list_from_redis(key):
    return await redis_client.lrange(key, 0, -1)

async def delete_key_redis(key):
    await redis_client.delete(key)

async def check_redis_connection():
    try:
        pong = await redis_client.ping()
        return pong
    except Exception as e:
        return False
    
async def push_log_entry_to_redis(key, log_entry):
    await redis_client.rpush(key, json.dumps(log_entry))  # Push new record
