

import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import {
  FaBell,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const Alerts = () => {

  const { getappointmentschedules } = useSelector(
    (state) => state.patient
  );

 
  const alerts =
    getappointmentschedules
      ?.map((appt) => {
        const doctorName =
          appt?.Doctor_id?.User_id?.Name || "Doctor";

        const apptDateObj = new Date(
          appt.Appointment_Date
        );

        const formattedDate =
          apptDateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          });
        const [, end] =
          appt.Time_slot.split("-");

        const [endHour, endMinute] = end
          .split(":")
          .map(Number);

        const apptEnd = new Date(apptDateObj);
        apptEnd.setHours(endHour);
        apptEnd.setMinutes(endMinute);
        apptEnd.setSeconds(0);

        apptEnd.setHours(apptEnd.getHours() + 1);

        const now = new Date();

        if (now > apptEnd) return null;
        const diffDays = Math.ceil(
          (apptDateObj - now) /
            (1000 * 60 * 60 * 24)
        );

        let type = "info";
        let message = "";

        if (diffDays === 0) {
          type = "warning";
          message = `Appointment TODAY with Dr. ${doctorName} at ${appt.Time_slot}`;
        } else if (diffDays === 1) {
          type = "warning";
          message = `Appointment TOMORROW with Dr. ${doctorName} at ${appt.Time_slot}`;
        } else {
          message = `Upcoming appointment on ${formattedDate} with Dr. ${doctorName}`;
        }

        return {
          id: appt._id,
          type,
          message,
        };
      })
      .filter(Boolean) || [];
  const alertStyles = {
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: (
        <FaExclamationTriangle className="text-yellow-500" />
      ),
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: (
        <FaInfoCircle className="text-blue-500" />
      ),
    },
  };

  return (
    <Card title="Alerts & Notifications" icon={FaBell}>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="mx-auto text-gray-300 w-12 h-12 mb-3" />
            <p className="text-gray-500 text-sm">
              No alerts at this time
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const style =
              alertStyles[alert.type] ||
              alertStyles.info;

            return (
              <div
                key={alert.id}
                className={`p-3 sm:p-4 rounded-lg flex items-start border ${style.bg} ${style.border}`}
              >
                <div className="mr-3 flex-shrink-0 mt-1">
                  {style.icon}
                </div>

                <p
                  className={`text-xs sm:text-sm font-medium ${style.text}`}
                >
                  {alert.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default Alerts;
