import { jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// Mock Cloudinary v2, mongoose, and process.exit before dynamic imports
const mockCloudinary = {
  uploader: {
    upload: jest.fn(),
  },
  config: jest.fn(),
};

const mockMongoose = {
  connect: jest.fn(),
};

jest.unstable_mockModule("cloudinary", () => ({
  v2: mockCloudinary,
}));

jest.unstable_mockModule("mongoose", () => ({
  default: mockMongoose,
}));

const { hash_Password, comparePassword } = await import("../config/password_hash.js");
const { jwtToken } = await import("../config/jwt.js");
const { uploadFileToCloudinary, multerMiddleWare } = await import(
  "../config/cloudinary.config.js"
);
const connect_db = (await import("../config/db.connted.js")).default;
const { client } = await import("../config/Dodo_Payment.config.js");

describe("Config Helpers & Modules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("password_hash.js", () => {
    it("should hash password successfully", async () => {
      const plain = "mySecretPassword123";
      const hash = await hash_Password(plain);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(plain);
      expect(typeof hash).toBe("string");
    });

    it("should compare correct password and return true", async () => {
      const plain = "mySecretPassword123";
      const hash = await hash_Password(plain);
      const isMatch = await comparePassword(plain, hash);

      expect(isMatch).toBe(true);
    });

    it("should compare wrong password and return false", async () => {
      const plain = "mySecretPassword123";
      const hash = await hash_Password(plain);
      const isMatch = await comparePassword("wrongPassword", hash);

      expect(isMatch).toBe(false);
    });
  });

  describe("jwt.js", () => {
    it("should sign a JWT token with userId and doctor_id", () => {
      process.env.JWT_SECRET = "jwtsecretkey";
      const userId = "user_123";
      const doctorId = "doc_456";

      const token = jwtToken(userId, doctorId);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
      expect(decoded.doctor_id).toBe(doctorId);
    });
  });

  describe("db.connted.js", () => {
    it("should connect to mongodb when connection is successful", async () => {
      process.env.MONGODB_URL = "mongodb://localhost:27017/testdb";
      mockMongoose.connect.mockResolvedValue(true);

      await connect_db();

      expect(mockMongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
    });

    it("should call process.exit(1) if mongodb connection fails", async () => {
      process.env.MONGODB_URL = "mongodb://invalid:27017/testdb";
      mockMongoose.connect.mockRejectedValue(new Error("Connection refused"));

      const exitSpy = jest
        .spyOn(process, "exit")
        .mockImplementation((code) => {
          throw new Error(`Process exited with code ${code}`);
        });

      await expect(connect_db()).rejects.toThrow("Process exited with code 1");

      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });
  });

  describe("cloudinary.config.js", () => {
    it("should export multerMiddleWare as a function", () => {
      expect(multerMiddleWare).toBeDefined();
    });

    it("uploadFileToCloudinary should throw error if no file is provided", async () => {
      await expect(uploadFileToCloudinary(null)).rejects.toThrow("No file provided");
    });

    it("uploadFileToCloudinary should upload file and remove local temp file", async () => {
      const tempPath = path.join(process.cwd(), "upload", "test_file_temp.txt");
      fs.writeFileSync(tempPath, "dummy content");

      const mockFile = { path: tempPath };
      const uploadResult = { secure_url: "https://cloudinary.com/img.jpg" };
      mockCloudinary.uploader.upload.mockResolvedValue(uploadResult);

      const result = await uploadFileToCloudinary(mockFile);

      expect(mockCloudinary.uploader.upload).toHaveBeenCalledWith(tempPath);
      expect(result).toEqual(uploadResult);
      expect(fs.existsSync(tempPath)).toBe(false);
    });

    it("uploadFileToCloudinary should handle upload error and clean temp file", async () => {
      const tempPath = path.join(process.cwd(), "upload", "test_file_err.txt");
      fs.writeFileSync(tempPath, "dummy content");

      const mockFile = { path: tempPath };
      mockCloudinary.uploader.upload.mockRejectedValue(new Error("Upload failed"));

      const result = await uploadFileToCloudinary(mockFile);

      expect(result).toBeNull();
      expect(fs.existsSync(tempPath)).toBe(false);
    });
  });

  describe("Dodo_Payment.config.js", () => {
    it("should export client object", () => {
      expect(client).toBeDefined();
    });
  });
});
