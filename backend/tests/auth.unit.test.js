import { beforeEach, describe, expect, jest } from "@jest/globals";
import { json, response } from "express";
import { uploadFileToCloudinary } from "../config/cloudinary.config.js";


const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
const mockDietChartFindByIdAndUpdate = jest.fn();
const mockUserFindById = jest.fn();
const mockUploadFileToCloudinary = jest.fn();
const mockHashPassword = jest.fn().mockResolvedValue("hashed_password_123");
const mockComparePassword = jest.fn();
const mockJwtToken = jest.fn().mockReturnValue("mock_jwt_token");

jest.unstable_mockModule("../model/users.model.js", () => ({
  default: {
    findOne: mockUserFindOne,
    create: mockUserCreate,
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
    findById: mockUserFindById,
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

jest.unstable_mockModule("../config/Dodo_Payment.config.js", () => ({
  client: {
    products: {
      create: jest.fn(),
    },
  },
}));

jest.unstable_mockModule("../config/jwt.js", () => ({
  jwtToken: mockJwtToken,
}));

jest.unstable_mockModule("../config/cloudinary.config.js", () => ({
  uploadFileToCloudinary: mockUploadFileToCloudinary,
  cloudinary: { uploader: { destroy: jest.fn() } },
  multerMiddleWare: jest.fn((req, res, next) => next()),
}));


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

jest.unstable_mockModule("dotenv", () => ({
  populate: jest.fn(),
  config: jest.fn(),
}));

jest.unstable_mockModule("../model/report.model.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

const { register } = await import("../controller/auth.controller.js");
const {
  getDoctorBookedSlots,
  patient,
  patient_appoinment_detail,
  getReport,
  getdosha,
  patient_diet_chart,
  getDoctorReviews,
  createReport,
  DoctorUpdateProfile,
  myPatient,
  dietChart,
  getDietchartById,
  getdietchart,
  all_patient_report,
  login,
  updateDietChart,
  getDoshaStatus,
  submitDosha,
  PatientUpdateProfile,
  logout,
  alldoctor,
  getSingleDoctor,
  patientAppointment,
  updatePatientAppointment,
  delete_appointment,
  Doctor_selected_appointment,
  single_Patient,
  getprofile,
  addOrUpdateReview,
} = await import("../controller/auth.controller.js");

const { validate } = await import("../middleware/Validate.js");
const { registerValidator } = await import("../validator/auth.validator.js");
const { comparePassword } = await import("../config/password_hash.js");
const { default: Doctor } = await import("../model/doctor.model.js");
const { default: Appointment } = await import("../model/appointments.model.js");
const { default: Review } = await import("../model/rating.model.js");
const { default: Dosha } = await import("../model/dosha.model.js");
const { default: User } = await import("../model/users.model.js");
const { default: Report } = await import("../model/report.model.js");
const { default: DietChart } = await import("../model/Dietchart.model.js");
const { default: Reports } = await import("../model/report.model.js");

const { client } = await import("../config/Dodo_Payment.config.js");

const runValidators = async (req, validators) => {
  for (const validator of registerValidator) {
    await validator.run(req);
  }
};

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
    const req = { body: {}, files: [] };

    
    await runValidators(req, registerValidator);

 
    validate(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.arrayContaining([expect.any(Object)]),
      }),
    );
  });
});

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

  it("should return 400 ication is still untested.f a user with the given email already exists", async () => {
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

describe("register - patient register without profileImage", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 201 when patient is registered", async () => {
    const req = {
      body: {
        Name: "Jane Doe",
        Email: "jane@example.com",
        Password: "StrongPass@1",
        Age: 28,
        Gender: "Female",
        Height: 160,
        Weight: 55,
        isDoctor: false,
      },
      files: [],
    };

    mockUserFindOne.mockResolvedValue(null);

    mockHashPassword.mockResolvedValue("hashed-password");

    mockUserCreate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "StrongPass@1",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: false,
    });

    await register(req, res);

    expect(mockHashPassword).toHaveBeenCalledWith("StrongPass@1");

    expect(client.products.create).not.toHaveBeenCalled();

    expect(Doctor.create).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Registration successful",
        autoLogin: false,
        responseData: expect.objectContaining({
          _id: "user123",
          Name: "Jane Doe",
          Email: "jane@example.com",
          Password: "StrongPass@1",
          Age: 28,
          Gender: "Female",
          Height: 160,
          Weight: 55,
          isDoctor: false,
        }),
      }),
    );
  });
});

describe("register -patient register with profileImage", () => {
  let req;
  let res;
  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should register Patient with  profileImage", async () => {
    req = {
      body: {
        Name: "Jane Doe",
        Email: "jane@example.com",
        Password: "StrongPass@1",
        Age: 28,
        Gender: "Female",
        Height: 160,
        Weight: 55,
        isDoctor: false,
      },
      files: [
        {
          fieldname: "profileImage",
          path: "/tmp/profile.jpg",
          filename: "profile.jpg",
        },
      ],
    };

    mockUserFindOne.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed-password");
    mockUploadFileToCloudinary.mockResolvedValue({
      secure_url: "https://cloudinary.com/profile.jpg",
    });
    mockUserCreate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "hashed-password",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: false,
      Image_url: "https://cloudinary.com/profile.jpg",
    });

    await register(req, res);

    expect(mockUserFindOne).toHaveBeenCalled();
    console.log(mockUploadFileToCloudinary.mock.calls);
    expect(mockUploadFileToCloudinary).toHaveBeenCalledWith({
      fieldname: "profileImage",
      path: "/tmp/profile.jpg",
      filename: "profile.jpg",
    });
    expect(mockHashPassword).toBeCalledWith("StrongPass@1");
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Registration successful",
        autoLogin: false,
        responseData: expect.objectContaining({
          _id: "user123",
          Name: "Jane Doe",
          Email: "jane@example.com",
          Password: "hashed-password",
          Age: 28,
          Gender: "Female",
          Height: 160,
          Weight: 55,
          isDoctor: false,
          Image_url: "https://cloudinary.com/profile.jpg",
        }),
      }),
    );
  });
});

describe("register - doctor  register without profilImage", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  it("should register a doctor without ProfileImage", async () => {
    req = {
      body: {
        Name: "Jane Doe",
        Email: "jane@example.com",
        Password: "StrongPass@1",
        Age: 28,
        Gender: "Female",
        Height: 160,
        Weight: 55,
        isDoctor: true,
        Specialization: "Obstetrics and Gynaecology",
        Experience: 3,
      },
      files: [
        {
          fieldname: "certificate",
          path: "/tmp/certificate.jpg",
          filename: "certificate.jpg",
        },
      ],
    };

    mockUserFindOne.mockResolvedValue(null);

    mockHashPassword.mockResolvedValue("hashed-password");
    mockUploadFileToCloudinary.mockResolvedValue({
      secure_url: "https://cloudinary.com/certificate.jpg",
    });

    mockUserCreate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "StrongPass@1",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: true,
      Image_url: null,
    });

    client.products.create.mockResolvedValue({
      product_id: "dodo1",
    });

    mockUserFindByIdAndUpdate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "StrongPass@1",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: true,
      Doctor_id: "doctor123",
      Image_url: null,
    });

    Doctor.create.mockResolvedValue({
      _id: "doctor123",
      User_id: "user123",
      Specialization: "Obstetrics and Gynaecology",
      Certificates: "https://cloudinary.com/certificate.jpg",
      Experience: 3,
      dodo_product_id: "dodo1",
    });

    await register(req, res);

    expect(mockHashPassword).toHaveBeenCalledWith("StrongPass@1");

    expect(client.products.create).toHaveBeenCalled();

    expect(Doctor.create).toHaveBeenCalledWith({
      User_id: "user123",
      Specialization: "Obstetrics and Gynaecology",
      Certificates: "https://cloudinary.com/certificate.jpg",
      Experience: 3,
      dodo_product_id: "dodo1",
    });

    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      { Doctor_id: "doctor123" },
      { returnDocument: "after" },
    );
    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Registration successful",
        autoLogin: false,
        responseData: expect.objectContaining({
          _id: "user123",
          isDoctor: true,
          Doctor_id: "doctor123",
        }),
      }),
    );
  });
});

describe("register - doctor register with profileImage", () => {
  let res, req;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  it("should register doctor with profileImage", async () => {
    req = {
      body: {
        Name: "Jane Doe",
        Email: "jane@example.com",
        Password: "StrongPass@1",
        Age: 28,
        Gender: "Female",
        Height: 160,
        Weight: 55,
        isDoctor: true,
        Specialization: "Obstetrics and Gynaecology",
        Experience: 3,
      },
      files: [
        {
          fieldname: "certificate",
          path: "/tmp/certificate.jpg",
          filename: "certificate.jpg",
        },
        {
          fieldname: "profileImage",
          path: "/tmp/profile.jpg",
          filename: "profile.jpg",
        },
      ],
    };

    mockUserFindOne.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed-password");
    mockUploadFileToCloudinary
      .mockResolvedValueOnce({
        secure_url: "https://cloudinary.com/profile.jpg",
      })
      .mockResolvedValueOnce({
        secure_url: "https://cloudinary.com/certificate.jpg",
      });

    mockUserCreate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "hashed-password",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: true,
      Image_url: "https://cloudinary.com/profile.jpg",
    });

    client.products.create.mockResolvedValue({
      product_id: "dodo1",
    });

    Doctor.create.mockResolvedValue({
      _id: "doctor123",
      User_id: "user123",
      Specialization: "Obstetrics and Gynaecology",
      Certificates: "https://cloudinary.com/certificate.jpg",
      Experience: 3,
      dodo_product_id: "dodo1",
    });

    mockUserFindByIdAndUpdate.mockResolvedValue({
      _id: "user123",
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "hashed-password",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: true,
      Doctor_id: "doctor123",
      Image_url: "https://cloudinary.com/profile.jpg",
    });
    await register(req, res);

    expect(mockUserFindOne).toHaveBeenCalledWith({
      Email: "jane@example.com",
    });
    expect(mockHashPassword).toHaveBeenCalledWith("StrongPass@1");
    expect(mockUserCreate).toHaveBeenCalledWith({
      Name: "Jane Doe",
      Email: "jane@example.com",
      Password: "hashed-password",
      Age: 28,
      Gender: "Female",
      Height: 160,
      Weight: 55,
      isDoctor: true,
      Image_url: "https://cloudinary.com/profile.jpg",
    });
    expect(client.products.create).toHaveBeenCalled();
    expect(Doctor.create).toHaveBeenCalledWith({
      User_id: "user123",
      Specialization: "Obstetrics and Gynaecology",
      Certificates: "https://cloudinary.com/certificate.jpg",
      Experience: 3,
      dodo_product_id: "dodo1",
    });
    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      { Doctor_id: "doctor123" },
      { returnDocument: "after" },
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Registration successful",
        autoLogin: false,
        responseData: expect.objectContaining({
          _id: "user123",
          isDoctor: true,
          Doctor_id: "doctor123",
        }),
      }),
    );
  });
});

describe("login", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: { Email: "ghost@example.com", Password: "StrongPass@1" } };

    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUserFindOne.mockResolvedValue({
      _id: "user123",
      Email: "ghost@example.com",
    });
    Doctor.findOne.mockResolvedValue(null); // patient by default
    mockComparePassword.mockResolvedValue(true);
    mockJwtToken.mockReturnValue("mock-jwt-token");
  });

  it("should return 200 and role USER for a valid patient", async () => {
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        role: "USER",
        token: "mock-jwt-token",
      }),
    );
  });

  it("should return role DOCTOR when user is a doctor", async () => {
    Doctor.findOne.mockResolvedValue({ User_id: "user123" });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ role: "DOCTOR" }),
    );
  });

  it("should set the token cookie with correct options", async () => {
    await login(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "mock-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      }),
    );
  });

  it("should return 401 if user is not found", async () => {
    mockUserFindOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User not found" }),
    );
  });

  it("should return 401 if password does not match", async () => {
    mockComparePassword.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid Email or password" }),
    );
  });

  it("should return 500 on unexpected errors", async () => {
    mockUserFindOne.mockRejectedValue(new Error("DB crashed"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Server error",
        error: "DB crashed",
      }),
    );
  });
});

describe("updateDietChart", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: "chart123" },
      body: { calories: 2000, protein: 50 },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 and updated diet chart", async () => {
    const mockUpdated = { _id: "chart123", calories: 2000, protein: 50 };
    mockDietChartFindByIdAndUpdate.mockResolvedValue(mockUpdated);

    await updateDietChart(req, res);

    expect(mockDietChartFindByIdAndUpdate).toHaveBeenCalledWith(
      "chart123",
      req.body,
      { returnDocument: "after", runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dietchart: mockUpdated,
      message: "diet chart updated successfully",
    });
  });

  
  it("should return 200 with null dietchart if ID does not exist", async () => {
    mockDietChartFindByIdAndUpdate.mockResolvedValue(null);

    await updateDietChart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dietchart: null,
      message: "diet chart updated successfully",
    });
  });

  
  it("should return 500 if DB throws an error", async () => {
    mockDietChartFindByIdAndUpdate.mockRejectedValue(new Error("DB failure"));

    await updateDietChart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while updateing the dietchart.",
      error: "DB failure",
    });
  });


  it("should return 500 if validator rejects the update", async () => {
    mockDietChartFindByIdAndUpdate.mockRejectedValue(
      new Error("Validation failed: calories must be a number"),
    );

    await updateDietChart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "Validation failed: calories must be a number",
      }),
    );
  });
});

describe("validate middleware — validation failure", () => {
  it("should return 400 and the error array when validation fails", async () => {
    const { body } = await import("express-validator");
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    await new Promise((resolve) =>
      body("Name").notEmpty().withMessage("Name is required")(req, {}, resolve),
    );
    validate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Array) }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});

describe("getDoshaStatus", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return mustFill true if lastFilledAt is null", async () => {
    const req = { user: { userId: "user_123" } };

    mockUserFindById.mockResolvedValue({
      _id: "user_123",
      lastFilledAt: null,
    });

    await getDoshaStatus(req, res);

    expect(mockUserFindById).toHaveBeenCalledWith("user_123");
    expect(res.json).toHaveBeenCalledWith({ mustFill: true });
  });

  it("should return mustFill true if last filled more than 7 days ago", async () => {
    const req = { user: { userId: "user_123" } };
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    mockUserFindById.mockResolvedValue({
      _id: "user_123",
      lastFilledAt: tenDaysAgo,
    });

    await getDoshaStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ mustFill: true });
  });

  it("should return mustFill false if last filled within 7 days", async () => {
    const req = { user: { userId: "user_123" } };
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    mockUserFindById.mockResolvedValue({
      _id: "user_123",
      lastFilledAt: threeDaysAgo,
    });

    await getDoshaStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ mustFill: false });
  });

  it("should return 500 if DB throws an error", async () => {
    const req = { user: { userId: "user_123" } };

    mockUserFindById.mockRejectedValue(new Error("DB connection failed"));

    await getDoshaStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB connection failed" });
  });
});

describe("submitDosha", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create dosha and update user, return 201", async () => {
    const mockDoshaData = {
      _id: "dosha_abc",
      Patient_id: "user_123",
      doshaAssessment: {
        prakriti: { vata: 40, pitta: 35, kapha: 25 },
        vikriti: { vata: 50, pitta: 30, kapha: 20 },
        dominantPrakriti: "vata",
        dominantVikriti: "vata",
      },
    };

    const req = {
      user: { userId: "user_123" },
      body: {
        prakriti: { vata: 40, pitta: 35, kapha: 25 },
        vikriti: { vata: 50, pitta: 30, kapha: 20 },
        dominantPrakriti: "vata",
        dominantVikriti: "vata",
      },
    };

    Dosha.create.mockResolvedValue(mockDoshaData);
    User.findByIdAndUpdate.mockResolvedValue({});

    await submitDosha(req, res);

    expect(Dosha.create).toHaveBeenCalledWith({
      Patient_id: "user_123",
      doshaAssessment: { ...req.body },
    });

    // 6️⃣ Assert User was updated with correct dosha id + timestamp
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user_123",
      {
        Dosha: "dosha_abc", // ← the _id from mockDoshaData
        lastFilledAt: expect.any(Date), // ← we don't know exact time, just check it's a Date
      },
      { returnDocument: "after" },
    );

    // 7️⃣ Assert response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dosha assessment saved successfully",
      data: mockDoshaData,
    });
  });
});

describe("patient update profile", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 404 if user not found ", async () => {
    const req = {
      user: { userId: "user_123" },
      body: {
        Name: "john",
      },
      files: [],
    };

    mockUserFindOne.mockResolvedValue(null);
    await PatientUpdateProfile(req, res);

    expect(mockUserFindOne).toHaveBeenCalledWith({
      _id: "user_123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Patient  not found" });
  });
  it("should update  patient profile without image and return 200", async () => {
    const req = {
      user: { userId: "user_123" },
      body: {
        Name: "John Updated",
        PhoneNumber: "9999999999",
        Age: 25,
        Height: 175,
        Weight: 70,
      },
      files: [],
    };

    const mockUser = {
      _id: "user_123",
      Name: "John Old",
      PhoneNumber: "0000000000",
      Age: 20,
      Height: 170,
      Weight: 65,
      Image_url: null,
      save: jest.fn().mockResolvedValue(true),
    };

    mockUserFindOne.mockResolvedValue(mockUser);
    await PatientUpdateProfile(req, res);

    expect(mockUserFindOne).toHaveBeenCalledWith({
      _id: "user_123",
    });

    expect(mockUser.Name).toBe("John Updated");
    expect(mockUser.PhoneNumber).toBe("9999999999");
    expect(mockUser.Age).toBe(25);
    expect(mockUser.Height).toBe(175);
    expect(mockUser.Weight).toBe(70);
    expect(mockUser.save).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({ user: mockUser });
  });

  it("should update image url when profile image is uploaded", async () => {
    const req = {
      user: { userId: "user_123" },
      body: { Name: "John" },
      files: [
        { fieldname: "profileImage", originalname: "photo.jpg" }, // ← image file
      ],
    };

    const mockUser = {
      _id: "user_123",
      Name: "John",
      Image_url: null,
      save: jest.fn().mockResolvedValue(true),
    };

    mockUserFindOne.mockResolvedValue(mockUser);

    mockUploadFileToCloudinary.mockResolvedValue({
      secure_url: "https://cloudinary.com/photo.jpg",
    });

    await PatientUpdateProfile(req, res);

    expect(mockUploadFileToCloudinary).toHaveBeenCalledWith({
      fieldname: "profileImage",
      originalname: "photo.jpg",
    });

    expect(mockUser.Image_url).toBe("https://cloudinary.com/photo.jpg");

    expect(mockUser.save).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({ user: mockUser });
  });

  it("should return 500 if DB throws an error", async () => {
    const req = {
      user: { userId: "user_123" },
      body: { Name: "John" },
      files: [],
    };

    mockUserFindOne.mockRejectedValue(new Error("DB connection failed"));

    await PatientUpdateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB connection failed" });
  });
});

describe("logout", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  });

  it("should clear cookie and return 200", async () => {
    const req = {};

    await logout(req, res);

    // verify cookie was cleared
    expect(res.clearCookie).toHaveBeenCalledWith("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logout successfully",
      token: null,
    });
  });
});


describe("alldoctor", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 with all doctors", async () => {
    const req = {};

    const mockDoctors = [
      { _id: "doc_1", User_id: { Name: "Dr. John", Image_url: "url1" } },
      { _id: "doc_2", User_id: { Name: "Dr. Jane", Image_url: "url2" } },
    ];
    Doctor.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockDoctors),
    });

    await alldoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: mockDoctors,
    });
  });

  it("should return 500 if DB throws error", async () => {
    const req = {};

    Doctor.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB failed")),
    });

    await alldoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failed to fetch doctors",
      error: "DB failed",
    });
  });
});


describe("getSingleDoctor", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 with doctor data", async () => {
    const req = { params: { id: "doc_123" } };

    const mockDoctor = {
      _id: "doc_123",
      Specialization: "Ayurveda",
      User_id: { Name: "Dr. John" },
    };

    Doctor.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockDoctor),
    });

    await getSingleDoctor(req, res);

    expect(Doctor.findById).toHaveBeenCalledWith("doc_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDoctor);
  });

  it("should return 404 if doctor not found", async () => {
    const req = { params: { id: "doc_999" } };

    Doctor.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getSingleDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Doctor not found" });
  });

  it("should return 500 if DB throws error", async () => {
    const req = { params: { id: "doc_123" } };

    Doctor.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB failed")),
    });

    await getSingleDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});


describe("patientAppointment", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if required fields are missing", async () => {
    const req = {
      params: { id: "doc_123" },
      user: { userId: "user_123" },
      body: {}, // missing all fields
    };

    await patientAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  it("should create appointment and return 201", async () => {
    const req = {
      params: { id: "doc_123" },
      user: { userId: "user_123" },
      body: {
        Appointment_Date: "2025-10-10",
        Time_slot: "10:00 AM",
        Condition: "Fever",
      },
    };

    const mockAppointment = {
      _id: "appt_123",
      Doctor_id: "doc_123",
      Patient_id: "user_123",
      Appointment_Date: "2025-10-10",
      Time_slot: "10:00 AM",
      Condition: "Fever",
    };

    Appointment.create.mockResolvedValue(mockAppointment);

    await patientAppointment(req, res);

    expect(Appointment.create).toHaveBeenCalledWith({
      Appointment_Date: "2025-10-10",
      Time_slot: "10:00 AM",
      Doctor_id: "doc_123",
      Patient_id: "user_123",
      Condition: "Fever",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Appointment booked successfully",
      appointment: mockAppointment,
    });
  });

  it("should return 500 if DB throws error", async () => {
    const req = {
      params: { id: "doc_123" },
      user: { userId: "user_123" },
      body: {
        Appointment_Date: "2025-10-10",
        Time_slot: "10:00 AM",
        Condition: "Fever",
      },
    };

    Appointment.create.mockRejectedValue(new Error("DB failed"));

    await patientAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});

describe("updatePatientAppointment", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if fields are missing", async () => {
    const req = {
      params: { id: "appt_123" },
      user: { userId: "user_123" },
      body: {}, // missing fields
    };

    await updatePatientAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields required" });
  });

  it("should update appointment and return 201", async () => {
    const req = {
      params: { id: "appt_123" },
      user: { userId: "user_123" },
      body: {
        Appointment_Date: "2025-11-11",
        Time_slot: "2:00 PM",
      },
    };

    const mockUpdated = {
      _id: "appt_123",
      Appointment_Date: "2025-11-11",
      Time_slot: "2:00 PM",
    };

    Appointment.findByIdAndUpdate.mockResolvedValue(mockUpdated);

    await updatePatientAppointment(req, res);

    expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith(
      "appt_123",
      { Appointment_Date: "2025-11-11", Time_slot: "2:00 PM" },
      { returnDocument: "after" },
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Appointment Updated successfully",
      UpdatedAppointment: mockUpdated,
    });
  });
});

describe("delete_appointment", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should delete appointment and return 200", async () => {
    const req = { params: { id: "appt_123" } };

    const mockDeleted = { _id: "appt_123", Doctor_id: "doc_123" };

    Appointment.findByIdAndDelete.mockResolvedValue(mockDeleted);

    await delete_appointment(req, res);

    expect(Appointment.findByIdAndDelete).toHaveBeenCalledWith("appt_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Appointment deleted successfully.",
      data: mockDeleted,
    });
  });

  it("should return 404 if appointment not found", async () => {
    const req = { params: { id: "appt_999" } };

    Appointment.findByIdAndDelete.mockResolvedValue(null);

    await delete_appointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Appointment not found.",
    });
  });

  it("should return 500 if DB throws error", async () => {
    const req = { params: { id: "appt_123" } };

    Appointment.findByIdAndDelete.mockRejectedValue(new Error("DB failed"));

    await delete_appointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while deleting the appointment.",
      error: "DB failed",
    });
  });
});


describe("Doctor_selected_appointment", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should update appointment status and return 200", async () => {
    const req = {
      params: { id: "appt_123" },
      body: { Status: "Confirmed" },
    };

    const mockAppointment = {
      _id: "appt_123",
      Status: "Confirmed",
    };

    Appointment.findByIdAndUpdate.mockResolvedValue(mockAppointment);

    await Doctor_selected_appointment(req, res);

    expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith(
      "appt_123",
      { Status: "Confirmed" },
      { returnDocument: "after" },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "appointment status  updated successfully",
      appointment: mockAppointment,
    });
  });

  it("should return 404 if appointment not found", async () => {
    const req = {
      params: { id: "appt_999" },
      body: { Status: "Confirmed" },
    };

    Appointment.findByIdAndUpdate.mockResolvedValue(null);

    await Doctor_selected_appointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Appointment not found",
    });
  });
});


describe("single_Patient", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 with patient data", async () => {
    const req = { params: { id: "user_123" } };

    const mockPatient = {
      _id: "user_123",
      Name: "John",
      Age: 25,
    };

   
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPatient),
      }),
    });

    await single_Patient(req, res);

    expect(mockUserFindById).toHaveBeenCalledWith("user_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      patient: mockPatient,
    });
  });

  it("should return 404 if patient not found", async () => {
    const req = { params: { id: "user_999" } };

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    await single_Patient(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Patient not found",
    });
  });
});


describe("getprofile", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if doctor_id is missing", async () => {
    const req = { user: {} }; // no doctor_id

    await getprofile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });

  it("should return 200 with doctor profile", async () => {
    const req = { user: { doctor_id: "doc_123" } };

    const mockDoctor = {
      _id: "doc_123",
      Specialization: "Ayurveda",
      User_id: { Name: "Dr. John" },
    };

   
    Doctor.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDoctor),
      }),
    });

    await getprofile(req, res);

    expect(Doctor.findById).toHaveBeenCalledWith("doc_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      doctor: mockDoctor,
    });
  });

  it("should return 404 if doctor not found", async () => {
    const req = { user: { doctor_id: "doc_999" } };

    Doctor.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });

    await getprofile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Doctor not found",
    });
  });
});


describe("addOrUpdateReview", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 404 if doctor not found", async () => {
    const req = {
      params: { id: "doc_999" },
      user: { userId: "user_123" },
      body: { rating: 5, comment: "Great" },
    };

    Doctor.findById.mockResolvedValue(null);

    await addOrUpdateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Doctor not found" });
  });

  it("should create new review and return 200", async () => {
    const req = {
      params: { id: "doc_123" },
      user: { userId: "user_123" },
      body: { rating: 5, comment: "Excellent doctor" },
    };

    const mockReview = {
      _id: "review_123",
      Doctor: "doc_123",
      Patient: "user_123",
      rating: 5,
      comment: "Excellent doctor",
    };

    Doctor.findById.mockResolvedValue({ _id: "doc_123" });

    
    Review.findOne.mockResolvedValue(null);

    
    Review.create.mockResolvedValue(mockReview);

    
    Review.aggregate.mockResolvedValue([
      { _id: "doc_123", avgRating: 5, count: 1 },
    ]);

    Doctor.findByIdAndUpdate.mockResolvedValue({});

    await addOrUpdateReview(req, res);

    expect(Review.create).toHaveBeenCalledWith({
      Doctor: "doc_123",
      Patient: "user_123",
      rating: 5,
      comment: "Excellent doctor",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Review saved successfully",
      review: mockReview,
    });
  });

  it("should update existing review and return 200", async () => {
    const req = {
      params: { id: "doc_123" },
      user: { userId: "user_123" },
      body: { rating: 4, comment: "Updated comment" },
    };

    // existing review with save()
    const mockExistingReview = {
      _id: "review_123",
      Doctor: "doc_123",
      Patient: "user_123",
      rating: 3,
      comment: "Old comment",
      save: jest.fn().mockResolvedValue(true),
    };

    Doctor.findById.mockResolvedValue({ _id: "doc_123" });

    // review already exists
    Review.findOne.mockResolvedValue(mockExistingReview);

    Review.aggregate.mockResolvedValue([
      { _id: "doc_123", avgRating: 4, count: 2 },
    ]);

    Doctor.findByIdAndUpdate.mockResolvedValue({});

    await addOrUpdateReview(req, res);

    expect(mockExistingReview.rating).toBe(4);
    expect(mockExistingReview.comment).toBe("Updated comment");
    expect(mockExistingReview.save).toHaveBeenCalled();
    expect(Review.create).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Review saved successfully",
      review: mockExistingReview,
    });
  });
});
