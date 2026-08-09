import mongoose from "mongoose";
import User from "../model/users.model.js";
import Doctor from "../model/doctor.model.js";
import Appointment from "../model/appointments.model.js";
import DietChart from "../model/Dietchart.model.js";
import Payment from "../model/Payment.model.js";
import Dosha from "../model/dosha.model.js";
import Review from "../model/rating.model.js";
import Reports from "../model/report.model.js";

describe("Mongoose Models Schema Validation", () => {
  describe("User Model", () => {
    it("should validate a valid User object", () => {
      const validUser = new User({
        Name: "John Doe",
        Age: 30,
        Email: "john@example.com",
        Password: "password123",
        Gender: "Male",
      });

      const err = validUser.validateSync();
      expect(err).toBeUndefined();
    });

    it("should fail validation if required fields (Name, Age, Password, Gender) are missing", () => {
      const user = new User({});
      const err = user.validateSync();

      expect(err.errors.Name).toBeDefined();
      expect(err.errors.Age).toBeDefined();
      expect(err.errors.Password).toBeDefined();
      expect(err.errors.Gender).toBeDefined();
    });

    it("should fail validation if email format is invalid", () => {
      const user = new User({
        Name: "Jane",
        Age: 25,
        Email: "not-an-email",
        Password: "pass",
        Gender: "Female",
      });

      const err = user.validateSync();
      expect(err.errors.Email).toBeDefined();
      expect(err.errors.Email.message).toBe("Please enter a valid email address.");
    });

    it("should fail validation if Gender is not in enum", () => {
      const user = new User({
        Name: "Jane",
        Age: 25,
        Email: "jane@example.com",
        Password: "pass",
        Gender: "InvalidGender",
      });

      const err = user.validateSync();
      expect(err.errors.Gender).toBeDefined();
    });
  });

  describe("Doctor Model", () => {
    it("should validate a valid Doctor object", () => {
      const doctor = new Doctor({
        Certificates: "Cert 123",
        Experience: 5,
      });

      const err = doctor.validateSync();
      expect(err).toBeUndefined();
    });

    it("should default averageRating and totalReviews to 0", () => {
      const doctor = new Doctor({
        Certificates: "Cert 123",
        Experience: 5,
      });

      expect(doctor.averageRating).toBe(0);
      expect(doctor.totalReviews).toBe(0);
    });

    it("should validate Specialization enum", () => {
      const doctor = new Doctor({
        Certificates: "Cert 123",
        Experience: 5,
        Specialization: "Dermatologist",
      });

      expect(doctor.validateSync()).toBeUndefined();
    });
  });

  describe("Appointment Model", () => {
    it("should default Status to Pending", () => {
      const appt = new Appointment({
        Time_slot: "09:00-10:00",
        Condition: "Fever",
      });

      expect(appt.Status).toBe("Pending");
    });

    it("should fail if Time_slot is not in enum", () => {
      const appt = new Appointment({
        Time_slot: "08:00-09:00", // invalid
        Condition: "Fever",
      });

      const err = appt.validateSync();
      expect(err.errors.Time_slot).toBeDefined();
    });

    it("should fail if Condition is missing", () => {
      const appt = new Appointment({
        Time_slot: "09:00-10:00",
      });

      const err = appt.validateSync();
      expect(err.errors.Condition).toBeDefined();
    });
  });

  describe("DietChart Model", () => {
    it("should require Patient_id and Doctor_id", () => {
      const diet = new DietChart({});
      const err = diet.validateSync();

      expect(err.errors.Patient_id).toBeDefined();
      expect(err.errors.Doctor_id).toBeDefined();
    });

    it("should allow valid DietChart object", () => {
      const diet = new DietChart({
        Patient_id: new mongoose.Types.ObjectId(),
        Doctor_id: new mongoose.Types.ObjectId(),
        duration_days: 7,
        note: "Avoid oily food",
      });

      expect(diet.validateSync()).toBeUndefined();
    });
  });

  describe("Payment Model", () => {
    it("should default amount to 500, currency to INR, and status to pending", () => {
      const payment = new Payment({
        session_id: "sess_1",
        checkout_url: "http://chk",
        product_id: "prod_1",
        Email: "a@b.com",
        Name: "User",
      });

      expect(payment.amount).toBe(500);
      expect(payment.currency).toBe("INR");
      expect(payment.status).toBe("pending");
      expect(payment.validateSync()).toBeUndefined();
    });

    it("should fail if required fields are missing", () => {
      const payment = new Payment({});
      const err = payment.validateSync();

      expect(err.errors.session_id).toBeDefined();
      expect(err.errors.checkout_url).toBeDefined();
      expect(err.errors.product_id).toBeDefined();
      expect(err.errors.Email).toBeDefined();
      expect(err.errors.Name).toBeDefined();
    });
  });

  describe("Dosha Model", () => {
    it("should create valid Dosha document", () => {
      const dosha = new Dosha({
        Patient_id: new mongoose.Types.ObjectId(),
        doshaAssessment: {
          prakriti: { vata: 40, pitta: 30, kapha: 30 },
          dominantPrakriti: "Vata",
        },
      });

      expect(dosha.validateSync()).toBeUndefined();
    });
  });

  describe("Review Model", () => {
    it("should enforce rating between 1 and 5", () => {
      const review = new Review({
        Doctor: new mongoose.Types.ObjectId(),
        Patient: new mongoose.Types.ObjectId(),
        rating: 6, // out of range
      });

      const err = review.validateSync();
      expect(err.errors.rating).toBeDefined();
    });

    it("should pass with valid rating", () => {
      const review = new Review({
        Doctor: new mongoose.Types.ObjectId(),
        Patient: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: "Great doctor!",
      });

      expect(review.validateSync()).toBeUndefined();
    });
  });

  describe("Report Model", () => {
    it("should require Cloudinary_public_id", () => {
      const report = new Reports({
        Title: "Blood Test",
      });

      const err = report.validateSync();
      expect(err.errors.Cloudinary_public_id).toBeDefined();
    });

    it("should validate with Cloudinary_public_id and Category enum", () => {
      const report = new Reports({
        Cloudinary_public_id: "c_123",
        Category: "Lab Reports",
      });

      expect(report.validateSync()).toBeUndefined();
    });

    it("should fail if Category is not in enum", () => {
      const report = new Reports({
        Cloudinary_public_id: "c_123",
        Category: "Invalid Category",
      });

      const err = report.validateSync();
      expect(err.errors.Category).toBeDefined();
    });
  });
});
