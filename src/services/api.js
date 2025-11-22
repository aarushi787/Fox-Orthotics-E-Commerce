/**
 * @file Frontend API client for interacting with the Fox Orthotics backend server.
 * Handles HTTP requests, token management, and error handling.
 */

const API_URL = 'http://localhost:5000/api';

/**
 * A utility class to handle all API communications.
 */
class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
    this.token = localStorage.getItem('authToken') || null;
  }

  /**
   * Sets the authentication token for subsequent requests.
   * @param {string | null} token - The JWT token or null to clear it.
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Performs a generic API request.
   * @param {string} endpoint - The API endpoint (e.g., '/products').
   * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
   * @param {object|null} body - The request body for POST/PUT requests.
   * @returns {Promise<any>} The JSON response from the server.
   * @throws {Error} If the API request fails.
   */
  async request(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An API error occurred.');
    }

    // For methods that might not return a body (e.g., DELETE with 204)
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  }

  // --- Authentication ---

  /**
   * Registers a new user.
   * @param {string} email
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(email, password, firstName, lastName) {
    const data = await this.request('/auth/register', 'POST', { email, password, firstName, lastName });
    this.setToken(data.token);
    return data;
  }

  /**
   * Logs in a user.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    const data = await this.request('/auth/login', 'POST', { email, password });
    this.setToken(data.token);
    return data;
  }

  /**
   * Logs out the current user.
   */
  logout() {
    this.setToken(null);
  }

  /**
   * Fetches the profile of the currently authenticated user.
   * @returns {Promise<object>}
   */
  async getProfile() {
    return this.request('/auth/profile');
  }

  // --- Products ---

  /**
   * Fetches a list of products.
   * @param {string|null} category - Optional category to filter by.
   * @returns {Promise<Array<object>>}
   */
  async getProducts(category = null) {
    const endpoint = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    return this.request(endpoint);
  }

  /**
   * Fetches details for a single product.
   * @param {number|string} id - The product ID.
   * @returns {Promise<object>}
   */
  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // --- Orders (Auth Required) ---

  /**
   * Creates a new order.
   * @param {Array<{productId: number, quantity: number, price: number}>} items
   * @param {number} total
   * @param {number} tax
   * @param {number} shippingCost
   * @param {string} shippingAddress
   * @param {string|null} notes
   * @returns {Promise<object>}
   */
  async createOrder(items, total, tax, shippingCost, shippingAddress, notes = null) {
    return this.request('/orders', 'POST', { items, total, tax, shippingCost, shippingAddress, notes });
  }

  /**
   * Creates a Razorpay payment order on the backend and returns Razorpay order details.
   * @param {number} amount - Total amount in INR (decimal allowed, e.g., 123.45)
   * @returns {Promise<object>} Razorpay order object returned by server
   */
  async createRazorpayOrder(amount, currency = 'INR', receipt = null) {
    return this.request('/orders/razorpay-order', 'POST', { amount, currency, receipt });
  }

  /**
   * Fetches the order history for the current user.
   * @returns {Promise<Array<object>>}
   */
  async getOrderHistory() {
    return this.request('/orders');
  }

  // --- Reviews (Auth Required for Creation) ---

  /**
   * Creates a review for a product.
   * @param {number} productId
   * @param {number} rating - Rating from 1 to 5.
   * @param {string} title
   * @param {string} comment
   * @returns {Promise<object>}
   */
  async createReview(productId, rating, title, comment) {
    return this.request('/reviews', 'POST', { productId, rating, title, comment });
  }

  /**
   * Fetches all reviews for a given product.
   * @param {number|string} productId
   * @returns {Promise<Array<object>>}
   */
  async getReviewsForProduct(productId) {
    return this.request(`/reviews/product/${productId}`);
  }
}

// Export a singleton instance
const api = new ApiClient();
export default api;