import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaCheckCircle,
  FaCalendarCheck,
  FaUserMd,
  FaShieldAlt,
} from "react-icons/fa";

import { BookingAppointments } from "../../feature/Patient/patient.thunk";

import {
  PaymentSuccessThunk,
} from "../../feature/Payment/Payment.thunk";

export default function Success() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {

    const pending = JSON.parse(
      localStorage.getItem("pending_booking")
    );

    if (pending) {

      dispatch(
        PaymentSuccessThunk(
          pending.session_id
        )
      ).then((paymentResult) => {

        // VERIFY PAYMENT
        if (
          paymentResult.payload?.success
        ) {

          dispatch(
            BookingAppointments({
              id: pending.id,
              data: pending.formData,
            })
          ).then((result) => {

            if (
              result.meta.requestStatus ===
              "fulfilled"
            ) {

              localStorage.removeItem(
                "pending_booking"
              );

              toast.success(
                "Appointment booked successfully!"
              );

              setTimeout(() => {

                navigate(
                  "/patient-dashboard"
                );

              }, 2000);
            }
          });

        } else {

          toast.error(
            "Payment verification failed"
          );

          localStorage.removeItem(
            "pending_booking"
          );

          navigate("/cancel");
        }
      });

    } else {

      navigate("/patient-dashboard");
    }

  }, []);

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-green-50
      via-white
      to-emerald-100
      flex
      items-center
      justify-center
      px-4
      py-8
    "
    >

      <div
        className="
        w-full
        max-w-2xl
        bg-white/90
        backdrop-blur-lg
        shadow-2xl
        rounded-3xl
        overflow-hidden
        border
        border-green-100
      "
      >

        {/* TOP SECTION */}
        <div
          className="
          bg-gradient-to-r
          from-green-600
          to-emerald-500
          text-white
          text-center
          px-6
          py-10
        "
        >

          <div
            className="
            w-28
            h-28
            rounded-full
            bg-white/20
            flex
            items-center
            justify-center
            mx-auto
            shadow-xl
            mb-6
            animate-pulse
          "
          >
            <FaCheckCircle
              className="
              text-7xl
              text-white
            "
            />
          </div>

          <h1
            className="
            text-3xl
            sm:text-4xl
            font-bold
          "
          >
            Payment Successful
          </h1>

          <p
            className="
            mt-4
            text-green-100
            text-sm
            sm:text-base
            max-w-md
            mx-auto
          "
          >
            Your payment has been verified
            successfully. We are now booking
            your appointment securely.
          </p>

        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8">

          {/* STATUS CARDS */}
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          "
          >

            <div
              className="
              bg-green-50
              border
              border-green-100
              rounded-2xl
              p-5
              text-center
            "
            >
              <FaShieldAlt
                className="
                text-3xl
                text-green-600
                mx-auto
                mb-3
              "
              />

              <h3
                className="
                font-semibold
                text-gray-800
              "
              >
                Secure Payment
              </h3>

              <p
                className="
                text-xs
                text-gray-500
                mt-2
              "
              >
                Transaction verified
                successfully
              </p>

            </div>

            <div
              className="
              bg-emerald-50
              border
              border-emerald-100
              rounded-2xl
              p-5
              text-center
            "
            >
              <FaCalendarCheck
                className="
                text-3xl
                text-emerald-600
                mx-auto
                mb-3
              "
              />

              <h3
                className="
                font-semibold
                text-gray-800
              "
              >
                Appointment
              </h3>

              <p
                className="
                text-xs
                text-gray-500
                mt-2
              "
              >
                Booking confirmation
                in progress
              </p>

            </div>

            <div
              className="
              bg-teal-50
              border
              border-teal-100
              rounded-2xl
              p-5
              text-center
            "
            >
              <FaUserMd
                className="
                text-3xl
                text-teal-600
                mx-auto
                mb-3
              "
              />

              <h3
                className="
                font-semibold
                text-gray-800
              "
              >
                Doctor Ready
              </h3>

              <p
                className="
                text-xs
                text-gray-500
                mt-2
              "
              >
                Your doctor will receive
                the appointment shortly
              </p>

            </div>

          </div>

          {/* LOADING SECTION */}
          <div
            className="
            mt-10
            text-center
          "
          >

            <div
              className="
              w-16
              h-16
              border-4
              border-green-200
              border-t-green-600
              rounded-full
              animate-spin
              mx-auto
            "
            />

            <p
              className="
              mt-6
              text-lg
              font-semibold
              text-gray-700
            "
            >
              Finalizing your appointment...
            </p>

            <p
              className="
              mt-2
              text-sm
              text-gray-500
            "
            >
              Please wait while we securely
              confirm your booking.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}