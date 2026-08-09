import { jest } from "@jest/globals";

// Mock dependencies before dynamic imports
const mockPaymentModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
};

const mockDodoClient = {
  checkoutSessions: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
};

jest.unstable_mockModule("../model/Payment.model.js", () => ({
  default: mockPaymentModel,
}));

jest.unstable_mockModule("../config/Dodo_Payment.config.js", () => ({
  client: mockDodoClient,
}));

const { One_Time_Payment, Payment_Success, Payment_Cancel } = await import(
  "../controller/payment.controller.js"
);

describe("Payment Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("One_Time_Payment", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { Email: "test@example.com", Name: "Test User" };

      await One_Time_Payment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required fields",
      });
    });

    it("should create checkout session and upsert payment model successfully", async () => {
      req.body = {
        product_id: "prod_123",
        Email: "test@example.com",
        Name: "Test User",
        frontend_url: "http://localhost:3000",
      };

      const mockCheckout = {
        session_id: "sess_123",
        checkout_url: "http://checkout.url/sess_123",
      };
      mockDodoClient.checkoutSessions.create.mockResolvedValue(mockCheckout);
      mockPaymentModel.findOneAndUpdate.mockResolvedValue({});

      await One_Time_Payment(req, res);

      expect(mockDodoClient.checkoutSessions.create).toHaveBeenCalledWith({
        customer: { email: "test@example.com", name: "Test User" },
        product_cart: [{ product_id: "prod_123", quantity: 1 }],
        billing_currency: "INR",
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { session_id: "sess_123" },
        {
          checkout_url: "http://checkout.url/sess_123",
          product_id: "prod_123",
          Email: "test@example.com",
          Name: "Test User",
        },
        { upsert: true, returnDocument: true }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        checkout_url: "http://checkout.url/sess_123",
        session_id: "sess_123",
      });
    });

    it("should handle invalid response from payment provider", async () => {
      req.body = {
        product_id: "prod_123",
        Email: "test@example.com",
        Name: "Test User",
        frontend_url: "http://localhost:3000",
      };

      mockDodoClient.checkoutSessions.create.mockResolvedValue({});

      await One_Time_Payment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid response from payment provider",
      });
    });

    it("should handle error during payment creation", async () => {
      req.body = {
        product_id: "prod_123",
        Email: "test@example.com",
        Name: "Test User",
        frontend_url: "http://localhost:3000",
      };

      mockDodoClient.checkoutSessions.create.mockRejectedValue(
        new Error("Dodo API Error")
      );

      await One_Time_Payment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Dodo API Error",
      });
    });
  });

  describe("Payment_Success", () => {
    it("should return 400 if session_id is missing", async () => {
      req.body = {};

      await Payment_Success(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Session ID required",
      });
    });

    it("should return 404 if payment is not found in database", async () => {
      req.body = { session_id: "sess_999" };
      mockPaymentModel.findOne.mockResolvedValue(null);

      await Payment_Success(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Payment not found",
      });
    });

    it("should return 200 if payment is already paid", async () => {
      req.body = { session_id: "sess_123" };
      const mockPayment = { session_id: "sess_123", status: "paid" };
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      await Payment_Success(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Payment already verified",
        payment: mockPayment,
      });
    });

    it("should return 400 if payment verification with Dodo does not equal succeeded", async () => {
      req.body = { session_id: "sess_123" };
      const mockPayment = { session_id: "sess_123", status: "pending", save: jest.fn() };
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);
      mockDodoClient.checkoutSessions.retrieve.mockResolvedValue({
        payment_status: "failed",
      });

      await Payment_Success(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Payment not completed",
      });
    });

    it("should mark payment as paid and return 200 when Dodo verifies success", async () => {
      req.body = { session_id: "sess_123" };
      const mockPayment = {
        session_id: "sess_123",
        status: "pending",
        save: jest.fn().mockResolvedValue(true),
      };
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);
      mockDodoClient.checkoutSessions.retrieve.mockResolvedValue({
        payment_status: "succeeded",
      });

      await Payment_Success(req, res);

      expect(mockPayment.status).toBe("paid");
      expect(mockPayment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        payment: mockPayment,
      });
    });

    it("should return 500 on unexpected error", async () => {
      req.body = { session_id: "sess_123" };
      mockPaymentModel.findOne.mockRejectedValue(new Error("Database error"));

      await Payment_Success(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });

  describe("Payment_Cancel", () => {
    it("should return 400 if session_id is missing", async () => {
      req.body = {};

      await Payment_Cancel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Session ID is required",
      });
    });

    it("should return 404 if payment record is not found", async () => {
      req.body = { session_id: "sess_999" };
      mockPaymentModel.findOneAndUpdate.mockResolvedValue(null);

      await Payment_Cancel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Payment not found",
      });
    });

    it("should return 200 and updated payment when cancelled successfully", async () => {
      req.body = { session_id: "sess_123" };
      const updatedPayment = { session_id: "sess_123", status: "cancelled" };
      mockPaymentModel.findOneAndUpdate.mockResolvedValue(updatedPayment);

      await Payment_Cancel(req, res);

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { session_id: "sess_123" },
        { status: "cancelled" },
        { new: true }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Payment cancelled",
        payment: updatedPayment,
      });
    });

    it("should return 500 on error", async () => {
      req.body = { session_id: "sess_123" };
      mockPaymentModel.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

      await Payment_Cancel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "DB error",
      });
    });
  });
});
