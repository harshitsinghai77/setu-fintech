const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, body = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  }

  handleError(error) {
    let errorMessage = "Something went wrong!";

    if (error?.detail?.error) {
      const { code, detail } = error.detail.error;
      errorMessage = `${code}: ${detail}`;
    }
    return { errorMessage: errorMessage };
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }

  async verifyPanCard(params) {
    return this.post("/pancard/verify", params);
  }

  async createReversePennyDrop(params = {}) {
    return this.post("/bankaccount/create-rpd", params);
  }

  async mockPayment(params) {
    return this.post("/bankaccount/mock-payment", params);
  }

  async getPaymentStatusSetu(request_id) {
    return this.get(`/bankaccount/rpd-payment-status/setu/${request_id}`);
  }

  async getPaymentStatusCache(request_id) {
    return this.get(`/bankaccount/rpd-payment-status/cached/${request_id}`);
  }

  async getAnalytics() {
    return this.get(`/bankaccount/analytics`);
  }
}

export default ApiService;
