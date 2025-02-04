import os
from dotenv import load_dotenv

from aws_cdk import (
    Stack,
    aws_ecs as ecs,
    aws_ec2 as ec2,
    aws_elasticloadbalancingv2 as elbv2,
    aws_iam as iam,
    aws_ecr as ecr,
    aws_logs as logs,
    CfnOutput
)
from constructs import Construct

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
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # 1. Create VPC (Virtual Private Cloud)
        vpc = ec2.Vpc(self, "FastAPI-VPC", max_azs=2)  # You can scale this later

        # 2. Create an ECS Cluster
        cluster = ecs.Cluster(self, "FastAPICluster", vpc=vpc)

        # 3. Define ECS Task Role for the ECS Task
        task_role = iam.Role(self, "ECSFargateTaskRole",
            assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonEC2ContainerRegistryReadOnly"),
                iam.ManagedPolicy.from_aws_managed_policy_name("CloudWatchLogsFullAccess")
            ]
        )

        security_group = ec2.SecurityGroup(self, "FastAPISecurityGroup",
            vpc=vpc,
            description="Allow inbound traffic on port 8000",
            allow_all_outbound=True
        )

        # Allow inbound traffic on port 8000 from anywhere
        security_group.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(8000))


        # 4. Create an ECR Repository (If you don't already have one)
        # repository = ecr.Repository(self, "FastAPIECRRepo",
        #     repository_name="python-fastapi",
        #     removal_policy=RemovalPolicy.DESTROY  # Will delete repo on stack deletion
        # )
        repository = ecr.Repository.from_repository_name(self, "FastAPIECRRepo", "python-fastapi")

        # 5. Create Fargate Task Definition with Docker Image from ECR
        task_definition = ecs.FargateTaskDefinition(self, "FastAPITaskDef",
            memory_limit_mib=1024,  # 1 GB of memory
            cpu=512,  # 0.5 vCPU
            task_role=task_role
        )

        container = task_definition.add_container("FastAPIContainer",
            image=ecs.ContainerImage.from_ecr_repository(repository, tag="latest"),  # Pull the image from ECR
            logging=ecs.LogDriver.aws_logs(stream_prefix="setu-fastapi", log_group=logs.LogGroup(self, "FastAPILogGroup")),
            environment=env
        )

        container.add_port_mappings(ecs.PortMapping(container_port=8000))  # Expose port 80

        # 6. Create an Application Load Balancer (ALB)
        lb = elbv2.ApplicationLoadBalancer(self, "FastAPIALB", vpc=vpc, internet_facing=True)

        listener = lb.add_listener("Listener", port=80, open=True) 

        # 7. Add Fargate Service to the ECS Cluster
        service = ecs.FargateService(self, "FastAPIService",
            cluster=cluster,
            task_definition=task_definition,
            desired_count=1,  # Adjust based on traffic
            assign_public_ip=True,  # Required if you want the app to be publicly accessible
            security_groups=[security_group]  # Associate the security group
        )

        # 8. Attach Load Balancer to the ECS Service
        listener.add_targets("ECS", port=8000, targets=[service])

        # 9. Output the Load Balancer URL (for accessing FastAPI)
        CfnOutput(self, "FastAPIURL", value=f"http://{lb.load_balancer_dns_name}", description="FastAPI App URL")
