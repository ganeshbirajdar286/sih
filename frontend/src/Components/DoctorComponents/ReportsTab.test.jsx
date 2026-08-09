import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

// Mock axiosInstance API
vi.mock("../../axios/url.axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import { axiosInstance } from "../../axios/url.axios";
import ReportsTab from "./ReportsTab";
import doctorReducer from "../../feature/Doctor/doctor.slice";

// Mock data
const mockAppointments = [
  {
    _id: "apt1",
    Patient_id: {
      _id: "p1",
      Name: "John Doe",
      Email: "john@example.com",
      Age: 35,
      Gender: "Male",
      Medical_records: [
        {
          _id: "rec1",
          Title: "Blood Test CBC",
          Category: "Lab Reports",
          File_url: "https://example.com/blood_test.pdf",
          Report_date: "2025-01-15T00:00:00.000Z",
        },
      ],
    },
  },
];

const mockReports = [
  {
    _id: "rep100",
    Title: "Chest X-Ray Scan",
    Category: "Imaging",
    File_url: "https://example.com/xray.pdf",
    Report_date: "2025-02-01T00:00:00.000Z",
    Patient_id: {
      _id: "p1",
      Name: "John Doe",
      Email: "john@example.com",
      Age: 35,
      Gender: "Male",
    },
  },
];

const renderComponent = (customState = {}) => {
  axiosInstance.get.mockImplementation((url) => {
    if (url === "/doctor/mypatient") {
      return Promise.resolve({ data: { patient: mockAppointments } });
    }
    if (url === "/doctor/getreport") {
      return Promise.resolve({ data: { reports: mockReports } });
    }
    return Promise.resolve({ data: {} });
  });

  const store = configureStore({
    reducer: {
      doctor: doctorReducer,
    },
    preloadedState: {
      doctor: {
        appointment: mockAppointments,
        reports: mockReports,
        loading: false,
        error: null,
        ...customState,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ReportsTab />
      </MemoryRouter>
    </Provider>
  );
};

describe("ReportsTab Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header and upload report form", () => {
    renderComponent();

    expect(screen.getByText(/Doctor Medical Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload & Manage Patient Medical Reports/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Upload Medical Report/i })).toBeInTheDocument();
  });

  it("fetches myPatient and getReports endpoints on mount", () => {
    renderComponent();

    expect(axiosInstance.get).toHaveBeenCalledWith("/doctor/mypatient");
    expect(axiosInstance.get).toHaveBeenCalledWith("/doctor/getreport");
  });

  it("displays metric overview cards", () => {
    renderComponent();

    expect(screen.getByText("Total Reports")).toBeInTheDocument();
    expect(screen.getByText("Patients Covered")).toBeInTheDocument();
    expect(screen.getAllByText("Lab Reports")[0]).toBeInTheDocument();
    expect(screen.getByText("Imaging & Scans")).toBeInTheDocument();
  });

  it("renders report cards from both store.reports and patient records", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
      expect(screen.getByText("Chest X-Ray Scan")).toBeInTheDocument();
    });
  });

  it("filters reports by category tabs", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Chest X-Ray Scan")).toBeInTheDocument();
    });

    // Click "Imaging" tab
    const imagingTab = screen.getByRole("button", { name: /Imaging/i });
    await user.click(imagingTab);

    expect(screen.getByText("Chest X-Ray Scan")).toBeInTheDocument();
    expect(screen.queryByText("Blood Test CBC")).not.toBeInTheDocument();
  });

  it("filters reports by search query input", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search reports by title/i);
    await user.type(searchInput, "CBC");

    expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
    expect(screen.queryByText("Chest X-Ray Scan")).not.toBeInTheDocument();
  });

  it("submits upload report form successfully", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true, data: { Title: "ECG Test Report" } },
    });
    const toastSpy = vi.spyOn(toast, "success");
    renderComponent();

    const titleInput = screen.getByPlaceholderText(/e.g., Blood Test Report/i);
    fireEvent.change(titleInput, { target: { value: "ECG Test Report" } });

    // Select file
    const file = new File(["dummy content"], "ecg.pdf", { type: "application/pdf" });
    const fileInput = document.getElementById("doctor-report-file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Upload Report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining("/doctor/createreport/"),
        expect.any(FormData)
      );
      expect(toastSpy).toHaveBeenCalledWith("Medical report uploaded successfully!");
    });
  });

  it("opens delete confirmation modal when Delete button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument();
  });

  it("calls delete endpoint when deletion is confirmed", async () => {
    axiosInstance.delete.mockResolvedValueOnce({
      data: { success: true, message: "Report deleted" },
    });
    const user = userEvent.setup();
    const toastSpy = vi.spyOn(toast, "success");
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    // Click confirm delete in modal
    const confirmDeleteBtn = screen.getByRole("button", { name: /Delete Report/i });
    await user.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith(expect.stringContaining("/doctor/report/"));
      expect(toastSpy).toHaveBeenCalledWith("Medical report deleted successfully!");
    });
  });

  it("opens report preview modal when Preview is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Blood Test CBC")).toBeInTheDocument();
    });

    const previewButtons = screen.getAllByText("Preview");
    await user.click(previewButtons[0]);

    expect(screen.getByText("Medical Report Document")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Full Document/i })).toBeInTheDocument();
  });
});
