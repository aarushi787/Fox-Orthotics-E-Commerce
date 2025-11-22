# Fox Orthotics - Backend API Server

This directory contains the Node.js/Express backend for the Fox Orthotics e-commerce application.

## Features

-   **RESTful API**: A complete API for managing products, users, orders, and reviews.
-   **Authentication**: JWT-based authentication for secure access to user data and actions.
-   **MySQL Integration**: Uses `mysql2` with connection pooling for efficient database communication.
-   **Migrations & Seeding**: Scripts to initialize the database schema and populate it with sample data.
-   **Environment-based Configuration**: Uses `.env` files for easy configuration.
-   **CORS Enabled**: Ready to be connected to the frontend application.

## Prerequisites

-   Node.js (v16+)
-   A running MySQL server

Or, optionally, a Firebase project with a service account for Firestore.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Setup Environment Variables**:
    Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, edit the `.env` file with your MySQL credentials and a secret for JWT.

3.  **Run Database Migration**:
    This command creates all the required tables and seeds the `products` table with initial data.
    ```bash
    npm run migrate
    ```

### Using Firestore (optional migration)

If you prefer Firestore instead of MySQL, follow these steps:

- Place your Firebase service account JSON file somewhere safe and set one of the environment variables:
    - `FIREBASE_SERVICE_ACCOUNT_PATH` — path to the JSON file from the server folder (e.g. `./service-account.json`), or
    - `FIREBASE_SERVICE_ACCOUNT_JSON` — the literal JSON string of the service account (useful in CI).
- Optionally set `FIREBASE_ADMIN_EMAILS` to a comma-separated list of emails to treat as admin users.
- Install dependencies and run the seeder:
    ```bash
    npm install
    npm run migrate:firestore
    ```

This will populate a `products` collection in Firestore using the project's `products.json`.

4.  **Start the Server**:
    To run the server in development mode with auto-reloading (thanks to `nodemon`):
    ```bash
    npm run dev
    ```
    For production:
    ```bash
    npm start
    ```
    The server will be available at `http://localhost:5000`.

## API Documentation (Swagger)

Once the server is running, open the API docs in your browser:

```
http://localhost:5000/api/docs
```

The Swagger UI shows available endpoints and allows you to test them (add your JWT for protected routes).

## Postman Collection

A Postman collection is included at `server/postman_collection.json` with sample requests for health, admin login, and creating a product.

## Admin Seed User

The migration script will create a default admin if none exists. Default credentials (override via `.env`):

- Email: `admin@foxorthotics.local`
- Password: `admin123`

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` to change them before running `npm run migrate`.

## API Endpoints

All endpoints are prefixed with `/api`.

### Health Check

-   `GET /health`: Check if the server is running.

### Authentication (`/auth`)

-   `POST /register`: Register a new user.
    -   Body: `{ "email", "password", "firstName", "lastName" }`
-   `POST /login`: Log in and receive a JWT.
    -   Body: `{ "email", "password" }`
-   `GET /profile`: Get the authenticated user's profile. (Auth required)

### Products (`/products`)

-   `GET /`: Get a list of all products.
-   `GET /?category=<name>`: Filter products by category.
-   `GET /:id`: Get details for a single product.
-   `POST /`: Create a new product. (Admin only)
-   `PUT /:id`: Update a product. (Admin only)
-   `DELETE /:id`: Delete a product. (Admin only)

### Orders (`/orders`)

-   `POST /`: Create a new order. (Auth required)
-   `GET /`: Get the current user's order history. (Auth required)
-   `GET /:id`: Get details for a specific order. (Auth required)
-   `PUT /:id/status`: Update order status. (Admin only)

### Reviews (`/reviews`)

-   `POST /`: Create a new review. (Auth required)
-   `GET /product/:productId`: Get all reviews for a product.
-   `DELETE /:id`: Delete a review. (Owner or Admin)

## Project Structure

-   `src/config`: Database configuration and connection pooling.
-   `src/controllers`: Business logic for handling requests.
-   `src/middleware`: Custom middleware, like JWT authentication.
-   `src/models`: Database query logic.
-   `src/routes`: API route definitions.
-   `src/migrations`: Database schema and seeding scripts.
-   `src/server.js`: The main Express application file.
