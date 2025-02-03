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

