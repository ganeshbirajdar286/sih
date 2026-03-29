import { jest } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mock function declarations (must be in scope before jest.unstable_mockModule)
// ---------------------------------------------------------------------------
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
const mockDietChartFindByIdAndUpdate = jest.fn();
const mockHashPassword = jest.fn().mockResolvedValue("hashed_password_123");
const mockComparePassword = jest.fn();
const mockJwtToken = jest.fn().mockReturnValue("mock_jwt_token");

// ---------------------------------------------------------------------------
// Module mocks — must be declared before any `await import(...)` of the code
// under test so that Jest can intercept them.
// ---------------------------------------------------------------------------

jest.unstable_mockModule("../model/users.model.js", () => ({
  default: {
    findOne: mockUserFindOne,
    create: mockUserCreate,
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/doctor.model.js", () => ({
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Dietchart.model.js", () => ({
  default: {
    findByIdAndUpdate: mockDietChartFindByIdAndUpdate,
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/appointments.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/report.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/dosha.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/rating.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.unstable_mockModule("../config/password_hash.js", () => ({
  hash_Password: mockHashPassword,
  comparePassword: mockComparePassword,
}));

jest.unstable_mockModule("../config/jwt.js", () => ({
  jwtToken: mockJwtToken,
}));

jest.unstable_mockModule("../config/cloudinary.config.js", () => ({
  uploadFileToCloudinary: jest.fn(),
  cloudinary: { uploader: { destroy: jest.fn() } },
  multerMiddleWare: jest.fn((req, res, next) => next()),
}));

// Stub the LangChain packages to prevent any real API calls and allow the
// module-level workflow initialisation in auth.controller.js to run safely.
jest.unstable_mockModule("@langchain/core/messages", () => ({
  HumanMessage: jest.fn().mockImplementation((content) => ({ content })),
}));

jest.unstable_mockModule("@langchain/langgraph", () => ({
  MemorySaver: jest.fn(),
  MessagesAnnotation: {},
  StateGraph: jest.fn().mockReturnValue({
    addNode: jest.fn().mockReturnThis(),
    addEdge: jest.fn().mockReturnThis(),
    compile: jest.fn().mockReturnValue({ invoke: jest.fn() }),
  }),
}));

jest.unstable_mockModule("@langchain/groq", () => ({
  ChatGroq: jest.fn().mockImplementation(() => ({ invoke: jest.fn() })),
}));

// `populate` is imported from dotenv in the controller (unused, but must resolve)
jest.unstable_mockModule("dotenv", () => ({
  populate: jest.fn(),
  config: jest.fn(),
}));

// ---------------------------------------------------------------------------
// Import modules under test — must come AFTER all jest.unstable_mockModule calls
// ---------------------------------------------------------------------------
const { register, login, updateDietChart } = await import(
  "../controller/auth.controller.js"
);
const { validate } = await import("../middleware/Validate.js");
const { registerValidator } = await import("../validator/auth.validator.js");

// ---------------------------------------------------------------------------
// Helper: run an array of express-validator ValidationChain middlewares against
// a mock request so that validationResult() can read the errors afterwards.
// ---------------------------------------------------------------------------
const runValidators = async (req, validators) => {
  for (const validator of validators) {
    await new Promise((resolve) => validator(req, {}, resolve));
  }
};

// ===========================================================================
// Test 1 — register: 400 when required fields are missing
// ===========================================================================
describe("register — required fields validation", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
    };
  });

  it("should return 400 if required fields are missing", async () => {
    // An empty body triggers all registerValidator rules to fail.
    const req = { body: {}, files: [] };

    // Run the same validators that are applied on the register route so that
    // express-validator populates the request with validation errors.
    await runValidators(req, registerValidator);

    // The validate middleware reads those errors and short-circuits with 400.
    validate(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.arrayContaining([expect.any(Object)]),
      })
    );
  });
});

// ===========================================================================
// Test 2 — register: 400 when a user with the same email already exists
// ===========================================================================
describe("register — duplicate email", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
    };
  });

  it("should return 400 if a user with the given email already exists", async () => {
    const req = {
      body: {
        Name: "Jane Doe",
        Email: "jane@example.com",
        Password: "StrongPass@1",
        Age: 28,
        Gender: "Female",
        Height: 160,
        Weight: 55,
      },
      files: [],
    };

    // Simulate an existing user being found in the database.
    mockUserFindOne.mockResolvedValue({
      _id: "existing_user_id",
      Email: "jane@example.com",
    });

    await register(req, res);

    expect(mockUserFindOne).toHaveBeenCalledWith({ Email: "jane@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });
});

// ===========================================================================
// Test 3 — login: 401 when the user does not exist
// ===========================================================================
describe("login — user not found", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
    };
  });

  it("should return 401 if the user is not found", async () => {
    const req = {
      body: { Email: "ghost@example.com", Password: "StrongPass@1" },
    };

    // No user found in the database.
    mockUserFindOne.mockResolvedValue(null);

    await login(req, res);

    expect(mockUserFindOne).toHaveBeenCalledWith({
      Email: "ghost@example.com",
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});

// ===========================================================================
// Test 4 — updateDietChart: successfully updates an existing diet chart
// ===========================================================================
describe("updateDietChart — successful update", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should update an existing diet chart and return 200 with the updated document", async () => {
    const mockUpdatedChart = {
      _id: "chart_id_123",
      Patient_id: "patient_id_456",
      Doctor_id: "doctor_id_789",
      note: "Updated dietary note",
      duration_days: 90,
    };

    const req = {
      params: { id: "chart_id_123" },
      body: { note: "Updated dietary note" },
    };

    mockDietChartFindByIdAndUpdate.mockResolvedValue(mockUpdatedChart);

    await updateDietChart(req, res);

    expect(mockDietChartFindByIdAndUpdate).toHaveBeenCalledWith(
      "chart_id_123",
      { note: "Updated dietary note" },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dietchart: mockUpdatedChart,
      message: "diet chart updated successfully",
    });
  });
});

// ===========================================================================
// Test 5 — validate middleware: 400 when express-validator reports errors
// ===========================================================================
describe("validate middleware — validation failure", () => {
  it("should return 400 and the error array when validation fails", async () => {
    const { body } = await import("express-validator");

    // Create a minimal mock request with an empty body.
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    // Run a validator that will definitely fail (Name is required but absent).
    await new Promise((resolve) =>
      body("Name").notEmpty().withMessage("Name is required")(req, {}, resolve)
    );

    // The validate middleware should now detect the error and respond with 400.
    validate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Array) })
    );
    // next() must NOT be called when validation fails.
    expect(next).not.toHaveBeenCalled();
  });
});
