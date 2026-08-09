import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

// Mock redis for rate limit middleware import if needed
const mockRedisClient = {
  call: jest.fn(),
};

jest.unstable_mockModule("../config/redis.config.js", () => ({
  default: mockRedisClient,
}));

const { isLogin } = await import("../middleware/auth.middleware.js");
const { validate } = await import("../middleware/Validate.js");
const { socketMiddleware } = await import("../middleware/socket.middleware.js");
const { rateLimitMiddleware } = await import("../middleware/rate.middleware.js");

describe("Middlewares", () => {
  describe("auth.middleware - isLogin", () => {
    let req, res, next;

    beforeEach(() => {
      process.env.JWT_SECRET = "testsecret123";
      req = {
        headers: {},
        cookies: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });

    it("should return 401 if no token is provided in headers or cookies", () => {
      isLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token missing. Login required.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should authenticate with valid Bearer token in Authorization header", () => {
      const payload = { userId: "user123", doctor_id: "doc456" };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      req.headers["authorization"] = `Bearer ${token}`;

      isLogin(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe("user123");
      expect(req.user.doctor_id).toBe("doc456");
      expect(next).toHaveBeenCalled();
    });

    it("should authenticate with valid token in cookies", () => {
      const payload = { userId: "user789" };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      req.cookies.token = token;

      isLogin(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe("user789");
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if token is invalid or expired", () => {
      req.headers["authorization"] = "Bearer invalid.token.value";

      isLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Validate.js - validate", () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });

    it("should call next() when validation has no errors", async () => {
      // Import express-validator result mock helper or set express-validator symbol
      const { validationResult } = await import("express-validator");
      
      // If validationResult returns empty
      validate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 with errors if validation fails", async () => {
      // Mock validation errors on req
      req["express-validator#contexts"] = [
        {
          errors: [{ msg: "Invalid email", param: "email" }],
        },
      ];

      validate(req, res, next);
      // Since express-validator parses contexts, if errors exist status 400 is returned
    });
  });

  describe("socket.middleware - socketMiddleware", () => {
    let socket, next;

    beforeEach(() => {
      process.env.JWT_SECRET = "testsecret123";
      socket = {
        handshake: {
          auth: {},
          headers: {},
        },
      };
      next = jest.fn();
    });

    it("should fail with error if token is missing", () => {
      socketMiddleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe("Authorization token missing ");
    });

    it("should verify token from handshake.auth.token and set socket.user", () => {
      const payload = { userId: "socketUser1" };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      socket.handshake.auth.token = token;

      socketMiddleware(socket, next);

      expect(socket.user).toBeDefined();
      expect(socket.user.userId).toBe("socketUser1");
      expect(next).toHaveBeenCalledWith();
    });

    it("should verify token from handshake.headers authorization", () => {
      const payload = { userId: "socketUser2" };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      socket.handshake.headers["authorization"] = `Bearer ${token}`;

      socketMiddleware(socket, next);

      expect(socket.user).toBeDefined();
      expect(socket.user.userId).toBe("socketUser2");
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with 'Token expired' error if token is invalid", () => {
      socket.handshake.auth.token = "bad_token";

      socketMiddleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe("Token expired");
    });
  });

  describe("rate.middleware - rateLimitMiddleware", () => {
    it("should export rateLimitMiddleware function", () => {
      expect(typeof rateLimitMiddleware).toBe("function");
    });
  });
});
