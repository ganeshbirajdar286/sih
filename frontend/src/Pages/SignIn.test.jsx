import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

// Mock axiosInstance
vi.mock("../axios/url.axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { axiosInstance } from "../axios/url.axios";
import SignIn from "./SignIn";
import userReducer from "../feature/User/user.slice";

const renderSignIn = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );
};

describe("SignIn Component Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sign in form elements", () => {
    renderSignIn();

    expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("shows error if terms are not accepted on submit", async () => {
    const toastSpy = vi.spyOn(toast, "error");
    renderSignIn();

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(toastSpy).toHaveBeenCalledWith("Please accept Terms & Conditions");
  });

  it("calls login endpoint when terms are checked and form is submitted", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        responseData: { isDoctor: false, Name: "Test User" },
        token: "fake-jwt-token",
      },
    });

    axiosInstance.get.mockResolvedValueOnce({
      data: { mustFill: false },
    });

    renderSignIn();

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const termsCheckbox = screen.getByRole("checkbox");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(termsCheckbox);

    const submitBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/login", {
        Email: "user@example.com",
        Password: "password123",
      });
    });
  });
});
