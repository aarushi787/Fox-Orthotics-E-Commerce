# Full-Stack Setup Guide: Fox Orthotics

This guide will walk you through setting up the complete full-stack application, including the Node.js/Express backend, MySQL database, and connecting the React frontend.

## Prerequisites

1.  **Node.js and npm**: Make sure you have Node.js (version 16 or later) and npm installed.
2.  **MySQL Server**: You need a running MySQL server instance. You can install it locally or use a Docker container.

    *   **Easy Docker Setup (Recommended)**: If you have Docker, run this command to start a MySQL 8 container:
        ```bash
        docker run --name mysql-fox -e MYSQL_ROOT_PASSWORD=your_password -p 3306:3306 -d mysql:8
        ```
        Replace `your_password` with a secure password.

## Step 1: Set Up the Backend Server

The backend code is located in the `server/` directory.

1.  **Navigate to the Server Directory**:
    ```bash
    cd server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Create Environment File**:
    Copy the example environment file to create your own configuration.
    ```bash
    cp .env.example .env
    ```

4.  **Configure Environment Variables**:
    Open the newly created `.env` file and fill in your MySQL database details. If you used the Docker command above, your settings would be:

    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password  # The password you set
    DB_NAME=fox_orthotics
    DB_PORT=3306
    JWT_SECRET=your_super_secret_jwt_key # Change this to a long, random string
    PORT=5000
    ```

5.  **Run Database Migration & Seeding**:
    This is a critical step. This command will connect to your MySQL database, create all the necessary tables (`users`, `products`, etc.), and insert 6 sample products.

    ```bash
    npm run migrate
    ```
    You should see a success message indicating that the tables were created and data was seeded.

6.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    The backend server will start on `http://localhost:5000`. You'll see a message `Server running on port 5000`.

7.  **Test the Backend**:
    Open a new terminal and run a `curl` command to check the health endpoint:
    ```bash
    curl http://localhost:5000/api/health
    ```
    You should receive a response: `{"status":"Server is running"}`.

## Step 2: Set Up the Frontend

The frontend needs to know the URL of the backend API.

1.  **Navigate to the Root Directory**:
    If you are in the `server` directory, go back to the root.
    ```bash
    cd ..
    ```

2.  **Install Dependencies** (if you haven't already):
    ```bash
    npm install 
    ```
    
3.  **Create Frontend Environment File**:
    ```bash
    cp .env.example .env
    ```
    
4.  **Verify Environment Variable**:
    The `.env` file should contain the following line, which points to your running backend server:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
    
5.  **Start the Frontend Development Server**:
    ```bash
    npm run dev
    ```
    The React application will start, typically on `http://localhost:5173`.

## Step 3: Integrate API Calls into React Components

Now that both servers are running and the API client is available, you can replace the mock data fetching with real API calls.

**Example: Fetching products in `App.tsx`**

1.  **Import the API client**:
    ```javascript
    import api from './services/api'; 
    ```

2.  **Modify `useEffect` to call the API**:
    Change the `useEffect` hook that fetches `products.json` to use the new API client.

    **Before:**
    ```javascript
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/products.json');
            const data = await response.json();
            setProducts(data);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);
    ```

    **After:**
    ```javascript
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                // Optionally, show an error message to the user
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);
    ```

You can now follow this pattern for all other data interactions:
-   **Login Page**: Use `api.login(email, password)`.
-   **Registration**: Use `api.register(...)`.
-   **Cart/Checkout**: Use `api.createOrder(...)`.
-   **Product Reviews**: Use `api.createReview(...)` and `api.getReviewsForProduct(...)`.

Your full-stack application is now fully configured and running!