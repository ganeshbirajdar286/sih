import { jest } from "@jest/globals";

// Track calls to single_Patient
let singlePatientCalled = false;
let singlePatientReq = null;

// Mock all controller functions
const mockSinglePatient = jest.fn((req, res) => {
  singlePatientCalled = true;
  singlePatientReq = req;
  return res.status(200).json({ success: true });
});

// Track isLogin middleware calls
let isLoginCalled = false;

jest.unstable_mockModule("../controller/auth.controller.js", () => ({
  alldoctor: jest.fn(),
  createReport: jest.fn(),
  delete_appointment: jest.fn(),
  dietChart: jest.fn(),
  Doctor_selected_appointment: jest.fn(),
  DoctorUpdateProfile: jest.fn(),
  getDoctorBookedSlots: jest.fn(),
  getReport: jest.fn(),
  getSingleDoctor: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  myPatient: jest.fn(),
  patient_appoinment_detail: jest.fn(),
  patientAppointment: jest.fn(),
  PatientUpdateProfile: jest.fn(),
  register: jest.fn(),
  updatePatientAppointment: jest.fn(),
  getDoshaStatus: jest.fn(),
  submitDosha: jest.fn(),
  getdosha: jest.fn(),
  patient: jest.fn(),
  patient_diet_chart: jest.fn(),
  single_Patient: mockSinglePatient,
}));

// Mock middleware
jest.unstable_mockModule("../middleware/auth.middleware.js", () => ({
  isLogin: jest.fn((req, res, next) => {
    isLoginCalled = true;
    next();
  }),
}));

jest.unstable_mockModule("../config/cloudinary.config.js", () => ({
  multerMiddleWare: jest.fn((req, res, next) => next()),
}));

// Dynamic import of express after mocks
const express = (await import("express")).default;
const authRoutes = (await import("./auth.routes.js")).default;

// Create a simple test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/", authRoutes);
  return app;
};

// Helper to simulate HTTP request
const simulateRequest = (app, method, url) => {
  return new Promise((resolve) => {
    const mockRes = {
      statusCode: 200,
      _headers: {},
      _data: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this._data = data;
        resolve({ status: this.statusCode, data });
        return this;
      },
      setHeader(key, value) {
        this._headers[key] = value;
        return this;
      },
      end() {
        resolve({ status: this.statusCode });
      },
    };

    const mockReq = {
      method,
      url,
      path: url,
      params: {},
      query: {},
      headers: {},
      get: () => undefined,
    };

    // Extract params from URL for /doctor/patient/:id
    const match = url.match(/\/doctor\/patient\/([^/]+)/);
    if (match) {
      mockReq.params.id = match[1];
    }

    app(mockReq, mockRes);
  });
};

describe("/doctor/patient/:id route", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    singlePatientCalled = false;
    singlePatientReq = null;
    isLoginCalled = false;
    app = createTestApp();
  });

  it("should correctly call the single_Patient controller with route params", async () => {
    const testId = "507f1f77bcf86cd799439011";

    const response = await simulateRequest(app, "GET", `/doctor/patient/${testId}`);

    expect(singlePatientCalled).toBe(true);
    expect(singlePatientReq.params.id).toBe(testId);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it("should have GET method configured for /doctor/patient/:id", async () => {
    const testId = "507f1f77bcf86cd799439011";

    // GET request should work
    const response = await simulateRequest(app, "GET", `/doctor/patient/${testId}`);

    expect(response.status).toBe(200);
    expect(mockSinglePatient).toHaveBeenCalled();
  });

  it("should apply isLogin middleware to /doctor/patient/:id route", async () => {
    const testId = "507f1f77bcf86cd799439011";

    await simulateRequest(app, "GET", `/doctor/patient/${testId}`);

    // Verify isLogin middleware was called before the controller
    expect(isLoginCalled).toBe(true);
    expect(singlePatientCalled).toBe(true);
  });
});
