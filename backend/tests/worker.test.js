import { jest } from "@jest/globals";

// Mock BullMQ Worker class constructor and methods
const mockWorkerListeners = {};
const MockWorker = jest.fn().mockImplementation((name, processor) => {
  return {
    name,
    processor,
    on: jest.fn((event, handler) => {
      mockWorkerListeners[event] = handler;
    }),
  };
});

const mockAppointmentModel = {
  findById: jest.fn(),
};

const mockAxios = {
  post: jest.fn(),
};

jest.unstable_mockModule("bullmq", () => ({
  Worker: MockWorker,
}));

jest.unstable_mockModule("../model/appointments.model.js", () => ({
  default: mockAppointmentModel,
}));

jest.unstable_mockModule("axios", () => ({
  default: mockAxios,
}));

jest.unstable_mockModule("../config/queue.config.js", () => ({
  default: {},
}));

const { worker } = await import("../config/Worker.config.js");

describe("Worker Configuration (config/Worker.config.js)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BREVO_VERIFIED_SENDER = "noreply@swasthya.com";
    process.env.BREVO_API_KEY = "brevo_test_key";
  });

  it("should create BullMQ worker instance", () => {
    expect(worker).toBeDefined();
    expect(worker.name).toBe("Appoinment-Booking-emails");
    expect(typeof worker.processor).toBe("function");
  });

  describe("Job Processing", () => {
    let mockJob;

    beforeEach(() => {
      mockJob = {
        name: "appointment-confirmation",
        data: { appointment: "appt_123" },
      };
    });

    it("should skip processing if appointment is not found in database", async () => {
      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      await worker.processor(mockJob);

      expect(mockAxios.post).not.toHaveBeenCalled();
    });

    it("should process appointment-confirmation job and call Brevo API", async () => {
      const mockDoc = {
        Appointment_Date: "2026-08-10",
        Time_slot: "09:00-10:00",
        Condition: "Routine Checkup",
        Patient_id: {
          Name: "John Patient",
          Email: "patient@example.com",
          PhoneNumber: 9876543210,
          Age: 30,
        },
        Doctor_id: {
          User_id: {
            Name: "Dr. Smith",
          },
        },
      };

      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDoc),
        }),
      });

      mockAxios.post.mockResolvedValue({ data: { messageId: "msg_123" } });

      await worker.processor(mockJob);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://api.brevo.com/v3/smtp/email",
        expect.objectContaining({
          sender: {
            name: "Swasthya",
            email: "noreply@swasthya.com",
          },
          to: [{ email: "patient@example.com", name: "John Patient" }],
          subject: "✅ Your Appointment is Confirmed – Swasthya",
        }),
        {
          headers: {
            "api-key": "brevo_test_key",
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should process reminder-24h job successfully", async () => {
      mockJob.name = "reminder-24h";

      const mockDoc = {
        Appointment_Date: "2026-08-10",
        Time_slot: "10:15-11:15",
        Condition: "Follow up",
        Patient_id: {
          Name: "John Patient",
          Email: "patient@example.com",
        },
        Doctor_id: {
          User_id: {
            Name: "Dr. Smith",
          },
        },
      };

      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDoc),
        }),
      });

      mockAxios.post.mockResolvedValue({ data: { messageId: "msg_456" } });

      await worker.processor(mockJob);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://api.brevo.com/v3/smtp/email",
        expect.objectContaining({
          subject: "🔔 Reminder: Your Appointment is Tomorrow – Swasthya",
        }),
        expect.anything()
      );
    });

    it("should process reminder-2h job successfully", async () => {
      mockJob.name = "reminder-2h";

      const mockDoc = {
        Appointment_Date: "2026-08-10",
        Time_slot: "14:00-15:00",
        Condition: "Back Pain",
        Patient_id: {
          Name: "John Patient",
          Email: "patient@example.com",
        },
        Doctor_id: {
          User_id: {
            Name: "Dr. Smith",
          },
        },
      };

      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDoc),
        }),
      });

      mockAxios.post.mockResolvedValue({ data: { messageId: "msg_789" } });

      await worker.processor(mockJob);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://api.brevo.com/v3/smtp/email",
        expect.objectContaining({
          subject: "⏰ Reminder: Your Appointment is in 2 Hours – Swasthya",
        }),
        expect.anything()
      );
    });

    it("should throw error when unknown job name is passed", async () => {
      mockJob.name = "unknown-job-type";

      const mockDoc = {
        Appointment_Date: "2026-08-10",
        Time_slot: "14:00-15:00",
        Condition: "General",
        Patient_id: { Name: "Alice", Email: "alice@test.com" },
        Doctor_id: { User_id: { Name: "Doc" } },
      };

      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDoc),
        }),
      });

      await expect(worker.processor(mockJob)).rejects.toThrow(
        "[Worker] Unknown job name: unknown-job-type"
      );
    });

    it("should throw Brevo API error when axios post fails", async () => {
      const mockDoc = {
        Appointment_Date: "2026-08-10",
        Time_slot: "09:00-10:00",
        Condition: "Checkup",
        Patient_id: { Name: "Bob", Email: "bob@test.com" },
        Doctor_id: { User_id: { Name: "Doc" } },
      };

      mockAppointmentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDoc),
        }),
      });

      mockAxios.post.mockRejectedValue(new Error("Network Error"));

      await expect(worker.processor(mockJob)).rejects.toThrow(
        "Failed to send email via Brevo"
      );
    });
  });
});
