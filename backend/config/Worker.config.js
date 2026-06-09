import { Worker } from "bullmq";
import Appointment from "../model/appointments.model.js";
import axios from "axios";
import connection from "./queue.config.js";
import { populate } from "dotenv";


const callBrevoApi = async ({ to, subject, htmlContent }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Swasthya",
          email: process.env.BREVO_VERIFIED_SENDER,
        },
        to,
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Brevo API Error:", err.response?.data || err.message);
    throw new Error("Failed to send email via Brevo");
  }
};

const baseLayout = (content) => `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f9f6;
    padding: 32px 16px;
    min-height: 100vh;
  ">
    <div style="
      max-width: 560px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <!-- Header -->
      <div style="background-color: #1a7a5e; padding: 24px 32px;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 0.5px;">
          🌿 Swasthya
        </h1>
        <p style="margin: 4px 0 0; color: #a8d5c2; font-size: 13px;">
          Your Ayurvedic Health Partner
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 28px 32px; color: #333333; line-height: 1.7;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="
        background-color: #f0faf5;
        padding: 16px 32px;
        border-top: 1px solid #d4ede3;
        text-align: center;
      ">
        <p style="margin: 0; font-size: 12px; color: #888;">
          This is an automated message from Swasthya. Please do not reply.
        </p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Swasthya Health Platform
        </p>
      </div>
    </div>
  </div>
`;

const appointmentTable = ({ appointment, timeSlot, condition, phone, age, doctorName }) => `
  <table style="width:100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
    <tr style="background:#f0faf5;">
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e; width:40%; border-bottom:1px solid #d4ede3;">Doctor</td>
      <td style="padding:10px 14px; border-bottom:1px solid #d4ede3;">Dr. ${doctorName}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e; border-bottom:1px solid #d4ede3;">Date</td>
      <td style="padding:10px 14px; border-bottom:1px solid #d4ede3;">${appointment}</td>
    </tr>
    <tr style="background:#f0faf5;">
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e; border-bottom:1px solid #d4ede3;">Time</td>
      <td style="padding:10px 14px; border-bottom:1px solid #d4ede3;">${timeSlot}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e; border-bottom:1px solid #d4ede3;">Condition</td>
      <td style="padding:10px 14px; border-bottom:1px solid #d4ede3;">${condition}</td>
    </tr>
    ${phone ? `
    <tr style="background:#f0faf5;">
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e; border-bottom:1px solid #d4ede3;">Phone</td>
      <td style="padding:10px 14px; border-bottom:1px solid #d4ede3;">${phone}</td>
    </tr>` : ""}
    ${age ? `
    <tr>
      <td style="padding:10px 14px; font-weight:bold; color:#1a7a5e;">Age</td>
      <td style="padding:10px 14px;">${age}</td>
    </tr>` : ""}
  </table>
`;

const confirmationHTML = (data) => baseLayout(`
  <div style="
    background: #e8f5f0;
    border-left: 4px solid #1a7a5e;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 20px;
  ">
    <h2 style="margin: 0; color: #1a7a5e; font-size: 18px;">
      ✅ Appointment Confirmed
    </h2>
  </div>

  <p style="margin-top: 0;">Hi <strong>${data.patientName}</strong>,</p>
  <p>
    Your appointment has been successfully booked with
    <strong>Dr. ${data.doctorName}</strong>.
    Here are your details:
  </p>

  ${appointmentTable(data)}

  <div style="
    background: #f0faf5;
    border-radius: 8px;
    padding: 14px 18px;
    margin-top: 8px;
    font-size: 14px;
    color: #2d6a4f;
  ">
    📅 You will receive a reminder <strong>24 hours</strong> and
    <strong>2 hours</strong> before your appointment.
  </div>

  <p style="margin-top: 20px;">
    Thanks & Regards,<br/>
    <strong style="color: #1a7a5e;">Swasthya Team</strong>
  </p>
`);

const reminder24hHTML = (data) => baseLayout(`
  <div style="
    background: #e8f5f0;
    border-left: 4px solid #1a7a5e;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 20px;
  ">
    <h2 style="margin: 0; color: #1a7a5e; font-size: 18px;">
      🔔 Appointment Tomorrow
    </h2>
  </div>

  <p style="margin-top: 0;">Hi <strong>${data.patientName}</strong>,</p>
  <p>
    This is a friendly reminder that your appointment with
    <strong>Dr. ${data.doctorName}</strong> is <strong>tomorrow</strong>.
  </p>

  ${appointmentTable(data)}

  <div style="
    background: #fff8e1;
    border-left: 4px solid #f9a825;
    border-radius: 6px;
    padding: 12px 16px;
    margin-top: 8px;
    font-size: 14px;
    color: #7a5c00;
  ">
    ⚠️ Please arrive <strong>10 minutes early</strong>.
    Contact us if you need to reschedule.
  </div>

  <p style="margin-top: 20px;">
    Thanks & Regards,<br/>
    <strong style="color: #1a7a5e;">Swasthya Team</strong>
  </p>
`);

const reminder2hHTML = (data) => baseLayout(`
  <div style="
    background: #fff3e0;
    border-left: 4px solid #e65100;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 20px;
  ">
    <h2 style="margin: 0; color: #e65100; font-size: 18px;">
      ⏰ Appointment in 2 Hours
    </h2>
  </div>

  <p style="margin-top: 0;">Hi <strong>${data.patientName}</strong>,</p>
  <p>
    Your appointment with <strong>Dr. ${data.doctorName}</strong>
    is coming up <strong>in just 2 hours</strong>. Please get ready!
  </p>

  ${appointmentTable(data)}

  <div style="
    background: #fce4ec;
    border-left: 4px solid #c62828;
    border-radius: 6px;
    padding: 12px 16px;
    margin-top: 8px;
    font-size: 14px;
    color: #7a0c0c;
  ">
    🚨 Please leave now if you need travel time.
    We look forward to seeing you soon!
  </div>

  <p style="margin-top: 20px;">
    Thanks & Regards,<br/>
    <strong style="color: #1a7a5e;">Swasthya Team</strong>
  </p>
`);



const emailConfig = {
  "appointment-confirmation": (data) => ({
    subject: "✅ Your Appointment is Confirmed – Swasthya",
    htmlContent: confirmationHTML(data),
  }),
  "reminder-24h": (data) => ({
    subject: "🔔 Reminder: Your Appointment is Tomorrow – Swasthya",
    htmlContent: reminder24hHTML(data),
  }),
  "reminder-2h": (data) => ({
    subject: "⏰ Reminder: Your Appointment is in 2 Hours – Swasthya",
    htmlContent: reminder2hHTML(data),
  }),
};



export const worker = new Worker(
  "Appoinment-Booking-emails",
  async (job) => {
    console.log(`[Worker] Processing: ${job.name} | appointmentId: ${job.data.appointment}`);

  
const appointmentDoc = await Appointment.findById(job.data.appointment)
  .populate("Patient_id", "Email Name PhoneNumber Age")
  .populate({
    path: "Doctor_id",
    populate: {
      path: "User_id",
      select: "Name",
    },
  });

    console.log(appointmentDoc)
    if (!appointmentDoc) {
      // appointment deleted or cancelled — don't retry, just skip
      console.warn(`[Worker] Appointment ${job.data.appointmentId} not found. Skipping.`);
      return;
    }

    const { Patient_id: patient, Doctor_id: doctor } = appointmentDoc;

    // build template data from DB — never from job.data
    const templateData = {
      patientName: patient.Name,
      doctorName:  doctor.User_id?.Name,
      appointment: appointmentDoc.Appointment_Date,     
      timeSlot:    appointmentDoc.Time_slot,  
      condition:   appointmentDoc.Condition,  
      phone:       patient.PhoneNumber,
      age:         patient.Age,
    };

    const config = emailConfig[job.name];
    if (!config) {
      throw new Error(`[Worker] Unknown job name: ${job.name}`);
    }

    const { subject, htmlContent } = config(templateData);

    await callBrevoApi({
      to: [{ email: patient.Email, name: patient.Name }],
      subject,
      htmlContent,
    });

    console.log(`[Worker] "${job.name}" sent to ${patient.Email}`);
  },
  { connection }
);


worker.on("ready",     ()          => console.log("[Worker] Ready"));
worker.on("active",    (job)       => console.log(`[Worker] Active: ${job.name} (${job.id})`));
worker.on("completed", (job)       => console.log(`[Worker] Completed: ${job.name} (${job.id})`));
worker.on("failed",    (job, err)  => console.error(`[Worker] Failed: ${job.name} → ${err.message}`));
worker.on("error",     (err)       => console.error("[Worker] Error:", err));