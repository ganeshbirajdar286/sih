import { jest } from "@jest/globals";

// ─── Track middleware & controller calls ───────────────────────────────────────
let isLoginCalled = false;
let multerCalled = false;

// Controller call trackers  { called, req }
const makeTracker = () => ({ called: false, req: null });
const trackers = {
  alldoctor: makeTracker(),
  createReport: makeTracker(),
  delete_appointment: makeTracker(),
  dietChart: makeTracker(),
  Doctor_selected_appointment: makeTracker(),
  DoctorUpdateProfile: makeTracker(),
  getDoctorBookedSlots: makeTracker(),
  getReport: makeTracker(),
  getSingleDoctor: makeTracker(),
  login: makeTracker(),
  logout: makeTracker(),
  myPatient: makeTracker(),
  patient_appoinment_detail: makeTracker(),
  patientAppointment: makeTracker(),
  PatientUpdateProfile: makeTracker(),
  register: makeTracker(),
  updatePatientAppointment: makeTracker(),
  getDoshaStatus: makeTracker(),
  submitDosha: makeTracker(),
  getdosha: makeTracker(),
  patient: makeTracker(),
  patient_diet_chart: makeTracker(),
  single_Patient: makeTracker(),
  addOrUpdateReview: makeTracker(),
  getDoctorReviews: makeTracker(),
  getprofile: makeTracker(),
  updateDietChart: makeTracker(),
  getDietchartById: makeTracker(),
  getdietchart: makeTracker(),
};

// Build a mock controller that records calls
const makeController = (name) =>
  jest.fn((req, res) => {
    trackers[name].called = true;
    trackers[name].req = req;
    return res.status(200).json({ success: true, controller: name });
  });

// ─── Mock modules ──────────────────────────────────────────────────────────────
jest.unstable_mockModule("../controller/auth.controller.js", () =>
  Object.fromEntries(
    Object.keys(trackers).map((name) => [name, makeController(name)])
  )
);

jest.unstable_mockModule("../middleware/auth.middleware.js", () => ({
  isLogin: jest.fn((req, res, next) => {
    isLoginCalled = true;
    next();
  }),
}));

jest.unstable_mockModule("../config/cloudinary.config.js", () => ({
  multerMiddleWare: jest.fn((req, res, next) => {
    multerCalled = true;
    next();
  }),
}));

// Mock validators – just pass through
jest.unstable_mockModule("../validator/auth.validator.js", () => ({
  addOrUpdateReviewValidator: jest.fn((req, res, next) => next()),
  createReportValidator: jest.fn((req, res, next) => next()),
  dietChartValidator: jest.fn((req, res, next) => next()),
  DoctorUpdateProfileValidator: jest.fn((req, res, next) => next()),
  loginValidator: jest.fn((req, res, next) => next()),
  patientAppointmentValidator: jest.fn((req, res, next) => next()),
  PatientUpdateProfileValidator: jest.fn((req, res, next) => next()),
  registerValidator: jest.fn((req, res, next) => next()),
  submitDoshaValidator: jest.fn((req, res, next) => next()),
  updatePatientAppointmentValidator: jest.fn((req, res, next) => next()),
}));

jest.unstable_mockModule("../middleware/Validate.js", () => ({
  validate: jest.fn((req, res, next) => next()),
}));

// ─── Dynamic imports AFTER mocks ──────────────────────────────────────────────
const express = (await import("express")).default;
const authRoutes = (await import("../routes/auth.routes")).default;

// ─── Test app factory ──────────────────────────────────────────────────────────
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/", authRoutes);
  return app;
};

// ─── HTTP simulator ────────────────────────────────────────────────────────────
/**
 * Simulate an HTTP request through the Express app.
 * @param {object} app   - Express application
 * @param {string} method - HTTP verb (GET | POST | PUT | DELETE)
 * @param {string} url    - Path to request
 * @param {object} [body] - Optional request body
 */
const simulateRequest = (app, method, url, body = {}) =>
  new Promise((resolve) => {
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
      body,
      headers: { "content-type": "application/json" },
      get: (h) => (h === "content-type" ? "application/json" : undefined),
    };

    // Auto-extract common :id param patterns
    const idMatch = url.match(/\/([^/]+)$/);
    if (idMatch && !/\.(js|json)$/.test(idMatch[1])) {
      mockReq.params.id = idMatch[1];
    }

    app(mockReq, mockRes);
  });

// ─── Shared reset ──────────────────────────────────────────────────────────────
const MONGO_ID = "507f1f77bcf86cd799439011";

beforeEach(() => {
  jest.clearAllMocks();
  isLoginCalled = false;
  multerCalled = false;
  Object.values(trackers).forEach((t) => {
    t.called = false;
    t.req = null;
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════
describe("Auth routes", () => {
  let app;
  beforeEach(() => {
    app = createTestApp();
  });

  describe("POST /register", () => {
    it("calls register controller with 200", async () => {
      const res = await simulateRequest(app, "POST", "/register");
      expect(res.status).toBe(200);
      expect(trackers.register.called).toBe(true);
    });

    it("runs multer middleware", async () => {
      await simulateRequest(app, "POST", "/register");
      expect(multerCalled).toBe(true);
    });

    it("does NOT require isLogin", async () => {
      await simulateRequest(app, "POST", "/register");
      expect(isLoginCalled).toBe(false);
    });
  });

  describe("POST /login", () => {
    it("calls login controller with 200", async () => {
      const res = await simulateRequest(app, "POST", "/login");
      expect(res.status).toBe(200);
      expect(trackers.login.called).toBe(true);
    });

    it("does NOT require isLogin", async () => {
      await simulateRequest(app, "POST", "/login");
      expect(isLoginCalled).toBe(false);
    });
  });

  describe("POST /logout", () => {
    it("calls logout controller with 200", async () => {
      const res = await simulateRequest(app, "POST", "/logout");
      expect(res.status).toBe(200);
      expect(trackers.logout.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", "/logout");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /status", () => {
    it("calls getDoshaStatus controller with 200", async () => {
      const res = await simulateRequest(app, "GET", "/status");
      expect(res.status).toBe(200);
      expect(trackers.getDoshaStatus.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/status");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /submit", () => {
    it("calls submitDosha controller with 200", async () => {
      const res = await simulateRequest(app, "POST", "/submit");
      expect(res.status).toBe(200);
      expect(trackers.submitDosha.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", "/submit");
      expect(isLoginCalled).toBe(true);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PATIENT ROUTES
// ══════════════════════════════════════════════════════════════════════════════
describe("Patient routes", () => {
  let app;
  beforeEach(() => {
    app = createTestApp();
  });

  describe("POST /update/patientprofile", () => {
    it("calls PatientUpdateProfile controller", async () => {
      const res = await simulateRequest(app, "POST", "/update/patientprofile");
      expect(res.status).toBe(200);
      expect(trackers.PatientUpdateProfile.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", "/update/patientprofile");
      expect(isLoginCalled).toBe(true);
    });

    it("runs multer middleware", async () => {
      await simulateRequest(app, "POST", "/update/patientprofile");
      expect(multerCalled).toBe(true);
    });
  });

  describe("GET /patient/doctor", () => {
    it("calls alldoctor controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient/doctor");
      expect(res.status).toBe(200);
      expect(trackers.alldoctor.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient/doctor");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/singledoctor/:id", () => {
    it("calls getSingleDoctor and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/patient/singledoctor/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.getSingleDoctor.called).toBe(true);
      expect(trackers.getSingleDoctor.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", `/patient/singledoctor/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/appointments/:id", () => {
    it("calls getDoctorBookedSlots and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/patient/appointments/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.getDoctorBookedSlots.called).toBe(true);
      expect(trackers.getDoctorBookedSlots.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", `/patient/appointments/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient", () => {
    it("calls patient controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient");
      expect(res.status).toBe(200);
      expect(trackers.patient.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/schedule", () => {
    it("calls patient_appoinment_detail controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient/schedule");
      expect(res.status).toBe(200);
      expect(trackers.patient_appoinment_detail.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient/schedule");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/getreport", () => {
    it("calls getReport controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient/getreport");
      expect(res.status).toBe(200);
      expect(trackers.getReport.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient/getreport");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/getdosha", () => {
    it("calls getdosha controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient/getdosha");
      expect(res.status).toBe(200);
      expect(trackers.getdosha.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient/getdosha");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/dietchart", () => {
    it("calls patient_diet_chart controller", async () => {
      const res = await simulateRequest(app, "GET", "/patient/dietchart");
      expect(res.status).toBe(200);
      expect(trackers.patient_diet_chart.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/patient/dietchart");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /appointment/patient/:id", () => {
    it("calls patientAppointment and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "POST",
        `/appointment/patient/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.patientAppointment.called).toBe(true);
      expect(trackers.patientAppointment.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", `/appointment/patient/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /updatedappointment/patient/:id", () => {
    it("calls updatePatientAppointment and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "POST",
        `/updatedappointment/patient/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.updatePatientAppointment.called).toBe(true);
      expect(trackers.updatePatientAppointment.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(
        app,
        "POST",
        `/updatedappointment/patient/${MONGO_ID}`
      );
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("DELETE /patient/deleteappointment/:id", () => {
    it("calls delete_appointment and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "DELETE",
        `/patient/deleteappointment/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.delete_appointment.called).toBe(true);
      expect(trackers.delete_appointment.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(
        app,
        "DELETE",
        `/patient/deleteappointment/${MONGO_ID}`
      );
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /patient/review/:id", () => {
    it("calls addOrUpdateReview and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "POST",
        `/patient/review/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.addOrUpdateReview.called).toBe(true);
      expect(trackers.addOrUpdateReview.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", `/patient/review/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /patient/doctor/reviews/:id", () => {
    it("calls getDoctorReviews and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/patient/doctor/reviews/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.getDoctorReviews.called).toBe(true);
      expect(trackers.getDoctorReviews.req.params.id).toBe(MONGO_ID);
    });

    it("does NOT require isLogin middleware (public endpoint)", async () => {
      await simulateRequest(
        app,
        "GET",
        `/patient/doctor/reviews/${MONGO_ID}`
      );
      expect(isLoginCalled).toBe(false);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// DOCTOR ROUTES
// ══════════════════════════════════════════════════════════════════════════════
describe("Doctor routes", () => {
  let app;
  beforeEach(() => {
    app = createTestApp();
  });

  describe("POST /update/doctorprofile", () => {
    it("calls DoctorUpdateProfile controller", async () => {
      const res = await simulateRequest(app, "POST", "/update/doctorprofile");
      expect(res.status).toBe(200);
      expect(trackers.DoctorUpdateProfile.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", "/update/doctorprofile");
      expect(isLoginCalled).toBe(true);
    });

    it("runs multer middleware", async () => {
      await simulateRequest(app, "POST", "/update/doctorprofile");
      expect(multerCalled).toBe(true);
    });
  });

  describe("GET /doctor/mypatient", () => {
    it("calls myPatient controller", async () => {
      const res = await simulateRequest(app, "GET", "/doctor/mypatient");
      expect(res.status).toBe(200);
      expect(trackers.myPatient.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/doctor/mypatient");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /doctor/appointment/:id", () => {
    it("calls Doctor_selected_appointment and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "POST",
        `/doctor/appointment/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.Doctor_selected_appointment.called).toBe(true);
      expect(trackers.Doctor_selected_appointment.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", `/doctor/appointment/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /doctor/dietchart", () => {
    it("calls dietChart controller", async () => {
      const res = await simulateRequest(app, "POST", "/doctor/dietchart");
      expect(res.status).toBe(200);
      expect(trackers.dietChart.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", "/doctor/dietchart");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("POST /doctor/createreport/:id", () => {
    it("calls createReport and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "POST",
        `/doctor/createreport/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.createReport.called).toBe(true);
      expect(trackers.createReport.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "POST", `/doctor/createreport/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });

    it("runs multer middleware", async () => {
      await simulateRequest(app, "POST", `/doctor/createreport/${MONGO_ID}`);
      expect(multerCalled).toBe(true);
    });
  });

  describe("DELETE /doctor/deleteappointment/:id", () => {
    it("calls delete_appointment and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "DELETE",
        `/doctor/deleteappointment/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.delete_appointment.called).toBe(true);
      expect(trackers.delete_appointment.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(
        app,
        "DELETE",
        `/doctor/deleteappointment/${MONGO_ID}`
      );
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /doctor/patient/:id", () => {
    it("calls single_Patient and passes :id param correctly", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/doctor/patient/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.single_Patient.called).toBe(true);
      expect(trackers.single_Patient.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", `/doctor/patient/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });

    it("returns success response body", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/doctor/patient/${MONGO_ID}`
      );
      expect(res.data).toEqual({ success: true, controller: "single_Patient" });
    });
  });

  describe("GET /doctor/getdietcharts", () => {
    it("calls getdietchart controller", async () => {
      const res = await simulateRequest(app, "GET", "/doctor/getdietcharts");
      expect(res.status).toBe(200);
      expect(trackers.getdietchart.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/doctor/getdietcharts");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /doctor/getdietchart/:id", () => {
    it("calls getDietchartById and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "GET",
        `/doctor/getdietchart/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.getDietchartById.called).toBe(true);
      expect(trackers.getDietchartById.req.params.id).toBe(MONGO_ID);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", `/doctor/getdietchart/${MONGO_ID}`);
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("GET /doctor/profile", () => {
    it("calls getprofile controller", async () => {
      const res = await simulateRequest(app, "GET", "/doctor/profile");
      expect(res.status).toBe(200);
      expect(trackers.getprofile.called).toBe(true);
    });

    it("requires isLogin middleware", async () => {
      await simulateRequest(app, "GET", "/doctor/profile");
      expect(isLoginCalled).toBe(true);
    });
  });

  describe("PUT /doctor/updatedietchart/:id", () => {
    it("calls updateDietChart and passes :id param", async () => {
      const res = await simulateRequest(
        app,
        "PUT",
        `/doctor/updatedietchart/${MONGO_ID}`
      );
      expect(res.status).toBe(200);
      expect(trackers.updateDietChart.called).toBe(true);
      expect(trackers.updateDietChart.req.params.id).toBe(MONGO_ID);
    });

    it("does NOT require isLogin middleware (public endpoint)", async () => {
      await simulateRequest(
        app,
        "PUT",
        `/doctor/updatedietchart/${MONGO_ID}`
      );
      expect(isLoginCalled).toBe(false);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// RESPONSE SHAPE TESTS
// ══════════════════════════════════════════════════════════════════════════════
describe("Response shape", () => {
  let app;
  beforeEach(() => {
    app = createTestApp();
  });

  it.each([
    ["GET", "/status"],
    ["POST", "/logout"],
    ["GET", "/patient/doctor"],
    ["GET", "/patient"],
    ["GET", "/patient/schedule"],
    ["GET", "/patient/getreport"],
    ["GET", "/patient/getdosha"],
    ["GET", "/patient/dietchart"],
    ["GET", "/doctor/mypatient"],
    ["GET", "/doctor/getdietcharts"],
    ["GET", "/doctor/profile"],
  ])("%s %s returns { success: true }", async (method, url) => {
    const res = await simulateRequest(app, method, url);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE ORDERING
// ══════════════════════════════════════════════════════════════════════════════
describe("Middleware ordering", () => {
  let app;
  const callOrder = [];

  beforeEach(async () => {
    callOrder.length = 0;

    // Re-import fresh mocks that track call order
    jest.clearAllMocks();
    isLoginCalled = false;

    const { isLogin } = await import("../middleware/auth.middleware.js");
    isLogin.mockImplementation((req, res, next) => {
      callOrder.push("isLogin");
      next();
    });

    const { multerMiddleWare } = await import("../config/cloudinary.config.js");
    multerMiddleWare.mockImplementation((req, res, next) => {
      callOrder.push("multer");
      next();
    });

    const { register } = await import("../controller/auth.controller.js");
    register.mockImplementation((req, res) => {
      callOrder.push("register");
      res.status(200).json({ success: true });
    });

    const { PatientUpdateProfile } = await import(
      "../controller/auth.controller.js"
    );
    PatientUpdateProfile.mockImplementation((req, res) => {
      callOrder.push("PatientUpdateProfile");
      res.status(200).json({ success: true });
    });

    app = createTestApp();
  });

  it("register: multer runs before register controller (no isLogin)", async () => {
    await simulateRequest(app, "POST", "/register");
    const multerIdx = callOrder.indexOf("multer");
    const registerIdx = callOrder.indexOf("register");
    expect(multerIdx).toBeLessThan(registerIdx);
    expect(callOrder).not.toContain("isLogin");
  });

  it("update/patientprofile: isLogin runs before multer and controller", async () => {
    await simulateRequest(app, "POST", "/update/patientprofile");
    const loginIdx = callOrder.indexOf("isLogin");
    const multerIdx = callOrder.indexOf("multer");
    expect(loginIdx).toBeLessThan(multerIdx);
  });
});