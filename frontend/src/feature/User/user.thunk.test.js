import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getDoshaStatusThunk,
  submitDoshaThunk,
} from "./user.thunk";

// Mock axiosInstance
vi.mock("../../axios/url.axios", () => {
  return {
    axiosInstance: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

import { axiosInstance } from "../../axios/url.axios";

describe("User Auth Redux Thunks & Slice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe("loginThunk", () => {
    const mockLoginSuccess = {
      responseData: { Name: "John User", Email: "john@example.com", isDoctor: false },
      token: "fake-jwt-token",
    };

    it("should login user successfully", async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: mockLoginSuccess });

      const result = await store.dispatch(
        loginThunk({ Email: "john@example.com", Password: "password123" })
      );

      expect(result.type).toBe("users/login/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith("/login", {
        Email: "john@example.com",
        Password: "password123",
      });

      const state = store.getState().user;
      expect(state.ButtonLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.userProfile).toEqual(mockLoginSuccess.responseData);
    });

    it("should handle login failure", async () => {
      axiosInstance.post.mockRejectedValueOnce({
        response: { data: { message: "Invalid credentials" } },
      });

      const result = await store.dispatch(
        loginThunk({ Email: "wrong@example.com", Password: "wrong" })
      );

      expect(result.type).toBe("users/login/rejected");
      expect(store.getState().user.ButtonLoading).toBe(false);
    });
  });

  describe("registerThunk", () => {
    const mockUserData = {
      Name: "Jane Doctor",
      Email: "jane@example.com",
      Password: "pass",
      Age: 30,
      Height: 165,
      Weight: 58,
      Gender: "Female",
      isDoctor: true,
      Specialization: "Ayurveda",
      Experience: 5,
    };

    it("should register doctor user successfully", async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: { responseData: { Name: "Jane Doctor" } },
      });

      const result = await store.dispatch(registerThunk(mockUserData));

      expect(result.type).toBe("user/register/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/register",
        expect.any(FormData),
        expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } })
      );
    });
  });

  describe("logoutThunk", () => {
    it("should logout user and clear state", async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

      const result = await store.dispatch(logoutThunk());

      expect(result.type).toBe("users/logout/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith("/logout");

      const state = store.getState().user;
      expect(state.userProfile).toBeNull();
    });
  });

  describe("getDoshaStatusThunk & submitDoshaThunk", () => {
    it("should fetch dosha status", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { completed: true } });

      const result = await store.dispatch(getDoshaStatusThunk());

      expect(result.type).toBe("user/getDoshaStatusThunk/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/status");
    });

    it("should submit dosha assessment", async () => {
      const payload = { vata: 10, pitta: 20, kapha: 5 };
      axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

      const result = await store.dispatch(submitDoshaThunk(payload));

      expect(result.type).toBe("user/submitDoshaThunk/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith("/submit", payload);
    });
  });
});
