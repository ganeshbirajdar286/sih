import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  FaTimesCircle,

  FaHome,

} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  PaymentCancelThunk,
} from "../../feature/Payment/Payment.thunk";

export default function Cancel() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {

    const pending = JSON.parse(
      localStorage.getItem("pending_booking")
    );

    if (pending) {

      dispatch(
        PaymentCancelThunk(
          pending.session_id
        )
      );

      localStorage.removeItem(
        "pending_booking"
      );

      toast.error(
        "Payment was cancelled"
      );
    }

  }, []);

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-red-50
      via-white
      to-rose-100
      flex
      items-center
      justify-center
      px-4
    "
    >

      <div
        className="
        w-full
        max-w-lg
        bg-white/90
        backdrop-blur-lg
        rounded-3xl
        shadow-2xl
        overflow-hidden
        border
        border-red-100
      "
      >

        {/* HEADER */}
        <div
          className="
          bg-gradient-to-r
          from-red-600
          to-rose-500
          p-8
          text-center
          text-white
        "
        >

          <div
            className="
            w-24
            h-24
            rounded-full
            bg-white/20
            flex
            items-center
            justify-center
            mx-auto
            mb-5
            shadow-lg
          "
          >
            <FaTimesCircle
              className="
              text-6xl
              text-white
            "
            />
          </div>

          <h1
            className="
            text-3xl
            font-bold
          "
          >
            Payment Cancelled
          </h1>

          <p
            className="
            mt-3
            text-red-100
            text-sm
          "
          >
            Your appointment booking payment
            was cancelled or failed.
          </p>

        </div>

        {/* BODY */}
        <div className="p-8">

          <div
            className="
            bg-red-50
            border
            border-red-100
            rounded-2xl
            p-5
            text-center
          "
          >

            <p
              className="
              text-gray-700
              leading-relaxed
            "
            >
              Don’t worry — your appointment
              was not booked and no payment
              was deducted.
            </p>

          </div>

          {/* ACTION BUTTONS */}
          <div
            className="
            mt-8
            flex
            flex-col
            gap-4
          "
          >

           

            {/* Dashboard */}
            <button
              onClick={() =>
                navigate(
                  "/patient-dashboard"
                )
              }
              className="
                w-full
                border-2
                border-gray-200
                text-gray-700
                py-4
                rounded-xl
                font-semibold
                hover:bg-gray-50
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-3
                cursor-pointer
              "
            >
              <FaHome />
              Return to Dashboard
            </button>

          </div>

          

        </div>

      </div>

    </div>
  );
}