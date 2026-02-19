import { jest } from "@jest/globals";

// Mock the User model
const mockFindById = jest.fn();
const mockSelect = jest.fn();
const mockPopulate = jest.fn();

jest.unstable_mockModule("../model/users.model.js", () => ({
  default: {
    findById: mockFindById,
  },
}));

// Import the controller after mocking
const { single_Patient } = await import("./auth.controller.js");

describe("single_Patient controller", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    mockReq = {
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup default mock chain
    mockFindById.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      populate: mockPopulate,
    });
  });

  describe("successful retrieval", () => {
    it("should return a patient when a valid ID is provided", async () => {
      const mockPatient = {
        _id: "507f1f77bcf86cd799439011",
        Name: "John Doe",
        Age: 30,
        Email: "john@example.com",
        Gender: "Male",
        Height: 175,
        Weight: 70,
        Medical_records: [],
        Image_url: "http://example.com/image.jpg",
        Dosha: null,
      };

      mockReq.params.id = "507f1f77bcf86cd799439011";
      mockPopulate.mockResolvedValue(mockPatient);

      await single_Patient(mockReq, mockRes);

      expect(mockFindById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(mockSelect).toHaveBeenCalledWith(
        "Name Age Email Gender Height Weight Medical_records Image_url  Dosha "
      );
      expect(mockPopulate).toHaveBeenCalledWith("Medical_records  Dosha");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        patient: mockPatient,
      });
    });
  });

  describe("validation errors", () => {
    it("should return 400 error if no patient ID is provided", async () => {
      mockReq.params.id = undefined;

      await single_Patient(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Patient ID is required",
      });
      expect(mockFindById).not.toHaveBeenCalled();
    });

    it("should return 400 error if patient ID is empty string", async () => {
      mockReq.params.id = "";

      await single_Patient(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Patient ID is required",
      });
    });
  });

  describe("not found", () => {
    it("should return 404 error if no patient is found with the given ID", async () => {
      mockReq.params.id = "507f1f77bcf86cd799439099";
      mockPopulate.mockResolvedValue(null);

      await single_Patient(mockReq, mockRes);

      expect(mockFindById).toHaveBeenCalledWith("507f1f77bcf86cd799439099");
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Patient not found",
      });
    });
  });

  describe("server errors", () => {
    it("should return 500 error when database throws an error", async () => {
      mockReq.params.id = "507f1f77bcf86cd799439011";
      mockPopulate.mockRejectedValue(new Error("Database connection failed"));

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await single_Patient(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Server Error",
      });

      consoleSpy.mockRestore();
    });

    it("should handle unexpected errors gracefully", async () => {
      mockReq.params.id = "507f1f77bcf86cd799439011";
      mockFindById.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await single_Patient(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Server Error",
      });

      consoleSpy.mockRestore();
    });
  });
});
