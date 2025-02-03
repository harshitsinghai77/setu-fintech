# Micro KYC Module

This is a backend application that connects with Redis, calls SETU sandbox APIs, and includes webhooks for reverse penny drop notifications.

## docker-compose.yml Overview

This `docker-compose.yml` file defines the services for the application, including the backend, frontend, and Redis.

### Services

- **backend:**
  - Builds the FastAPI backend from the `./backend` directory.
  - Exposes port 8000.
  - Depends on the Redis service.

- **frontend:**
  - Builds the React frontend from the `./frontend` directory.
  - Exposes port 5173.
  - Depends on the backend service.

- **redis:**
  - Uses the `redis:alpine` image.
  - Exposes port 6379.

### Running the Services

1. **Start the services:**

    ```sh
    docker-compose up --build
    ```

2. **Stop the services:**

    ```sh
    docker-compose down
    ```

## Backend 

## Prerequisites

- Docker
- AWS CLI
- An AWS account

## Getting Started

### Building and Running the Docker Container

1. **Build the Docker image:**

    ```sh
    docker build -t python-fastapi .
    ```

2. **Run the Docker container:**

    ```sh
    docker run -p 8000:8000 python-fastapi
    ```

### Pushing the Docker Image to AWS ECR

1. **Authenticate Docker to your Amazon ECR registry:**

    ```sh
    aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<your-region>.amazonaws.com
    ```

2. **Create a repository in ECR (if not already created):**

    ```sh
    aws ecr create-repository --repository-name python-fastapi --region <your-region>
    ```

3. **Tag your Docker image:**

    ```sh
    docker tag python-fastapi:latest <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/python-fastapi:latest
    ```

4. **Push the Docker image to ECR:**

    ```sh
    docker push <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/python-fastapi:latest
    ```

## Deploying to AWS ECS Fargate

This project includes an `infrastructure_stack.py` file that defines the infrastructure for deploying the FastAPI application to AWS ECS Fargate.

### Prerequisites

- CDK (Cloud Development Kit) installed

### Deploying the Infrastructure

**Deploy the stack:**

    ```sh
    cdk deploy
    ```

This will create the necessary AWS resources, including a VPC, ECS cluster, Fargate service, and an Application Load Balancer, and deploy your FastAPI application to AWS ECS Fargate.

## Application Details

### Features

- **Redis Integration:** The application connects to a Redis instance for caching and data storage.
- **SETU Sandbox API Calls:** The application makes API calls to the SETU sandbox environment.
- **Webhooks:** The application includes webhooks for handling reverse penny drop notifications. When a webhook call is received from SETU, the updated information is saved to the Redis store.
- **Analytics:** For PAN card and RPD (Reverse Penny Drop), the application also saves analytics data to Redis. This data powers the `/analytics` endpoint and provides information on the total number of successful requests, failed requests, total attempts, and other metrics. 

## Dockerfile Overview

This Dockerfile is used to containerize a FastAPI application. It sets up the environment, installs dependencies, and runs the application using Uvicorn.

### Running the Docker Container Locally

1. **Build the Docker Image:**

    ```sh
    docker build -t python-fastapi .
    ```

2. **Run the Docker Container:**

    ```sh
    docker run -p 8000:8000 python-fastapi
    ```

3. **Access the Application:**

    Open your browser and navigate to `http://localhost:8000` to access the FastAPI application.

### Example Usage

1. **Start the application:**

    ```sh
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

2. **Access the application:**

    Open your browser and navigate to `http://localhost:8000`.


## Frontend 

## Frontend Features

### Requirements

- The module first accepts the PAN as input and perform verification.
- After successful PAN verification, we verify the Bank Account and display the information

## Dockerfile Overview

This Dockerfile is used to containerize a React application. It sets up the environment, installs dependencies, builds the application, and serves the static files using `serve`.

### Running the Docker Container Locally

1. **Build the Docker Image:**

    ```sh
    docker build -t react-frontend .
    ```

2. **Run the Docker Container:**

    ```sh
    docker run -p 5173:5173 react-frontend
    ```

3. **Access the Application:**

    Open your browser and navigate to `http://localhost:5173` to access the application.

## Features

- **KYC:**
  - It handles PAN card verification and bank account information fetching.

- **Mock Payment:**
  - It is used to mock the payment completion for testing and sandbox purposes.

- **Analytics:**
  - It displays various analytics, including pie charts, tables, and other information related to KYC and payment processes.

