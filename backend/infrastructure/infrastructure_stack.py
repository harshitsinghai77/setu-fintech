import os
from dotenv import load_dotenv

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_apigateway as _apigw,
    # aws_apigatewayv2 as _apigw,
    # aws_apigatewayv2_integrations,
    Duration
)

# Load environment variables from .env file
load_dotenv()  # This will read the .env file in the current directory

env = {
    'SETU_PAN_PRODUCT_ID': os.getenv('SETU_PAN_PRODUCT_ID'), 
    'SETU_RPD_PRODUCT_ID': os.getenv('SETU_RPD_PRODUCT_ID'), 
    'SETU_CLIENT_ID': os.getenv('SETU_CLIENT_ID'),
    'SETU_CLIENT_SECRET': os.getenv('SETU_CLIENT_SECRET'), 
    'REDIS_CLOUD_ENDPOINT': os.getenv('REDIS_CLOUD_ENDPOINT'),
    'REDIS_CLOUD_PORT': os.getenv('REDIS_CLOUD_PORT'),
    'REDIS_USERNAME': os.getenv('REDIS_USERNAME'),
    'REDIS_PASSWORD': os.getenv('REDIS_PASSWORD'),
}

class InfrastructureStack(Stack):
    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)

        # Define the Lambda function
        base_lambda = _lambda.Function(self, "FastAPILambda",
            runtime=_lambda.Runtime.PYTHON_3_13,
            handler="main.handler",  # Update this to your Lambda handler
            code=_lambda.Code.from_asset("lambda_function.zip"),
            environment=env,
            memory_size=256,
            timeout=Duration.seconds(30)
        )

        # # Create an API Gateway
        # base_api = _apigw.HttpApi(self, "SetuAppAPIGateway",
        #     api_name='setu-app-api',
        #     cors_preflight=_apigw.CorsPreflightOptions(
        #         allow_origins=["*"],
        #         allow_methods=[_apigw.CorsHttpMethod.GET, _apigw.CorsHttpMethod.POST],
        #         allow_headers=["*"]
        # ))

        # # Add API Gateway routes
        # base_api.add_routes(
        #     path="/{proxy+}",
        #     methods=[_apigw.HttpMethod.GET, _apigw.HttpMethod.POST],
        #     integration=aws_apigatewayv2_integrations.HttpLambdaIntegration("SetuAPILambdaIntegration", handler=base_lambda),
        # )

        api = _apigw.RestApi(self, "SetuAppRestApi",
            rest_api_name="SetuAppRestApi",
            description="API Gateway for Setu App",
            deploy=True,
            deploy_options=_apigw.StageOptions(
                stage_name="prod",
                throttling_rate_limit=10, 
                throttling_burst_limit=5,
                metrics_enabled=True,
                logging_level=_apigw.MethodLoggingLevel.INFO,
                data_trace_enabled=True
            ),
            default_cors_preflight_options={
                "allow_origins": ["https://setu-demo-harshit.netlify.app"],
                "allow_methods": ["GET", "POST"],
                "allow_headers": ["*"]
            }
        )

        resource = api.root.add_resource("{proxy+}")
        resource.add_method("ANY", _apigw.LambdaIntegration(base_lambda), api_key_required=False)
