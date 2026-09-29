
import { useState } from "react";
import axios from "axios";
import "./PatientQueueTracking.css";

function PatientQueueTracking() {
  const [appointmentId, setAppointmentId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackPatient = async (e) => {
    e.preventDefault();
    setTracking(null);
    setError("");

    if (!appointmentId || Number(appointmentId) <= 0) {
      setError("Please enter a valid appointment ID");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/queue/track/${appointmentId}`
      );

      setTracking(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to fetch queue details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Not available";

    // Backend LocalDateTime has no timezone; parse its local date/time.
    const [datePart, timePart] = dateTime.split("T");
    if (!datePart || !timePart) return "Not available";

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second = 0] = timePart.split(":").map(Number);
    const date = new Date(year, month - 1, day, hour, minute, second);

    return date.toLocaleString();
  };

  const getAppointmentMessage = () => {
    if (!tracking) return null;

    const status = tracking.status?.toUpperCase();

    if (status === "COMPLETED") {
      return "Your consultation is completed.";
    }

    if (status === "CANCELLED") {
      return "Your appointment is cancelled.";
    }

    if (status === "IN_PROGRESS") {
      return "Your consultation is in progress.";
    }

    if (status === "WAITING") {
      const appointmentDate = tracking.queueDate;
      if (!appointmentDate) {
        return "Your appointment is waiting in the queue.";
      }

      const [year, month, day] = appointmentDate.split("-").map(Number);
      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const scheduledDate = new Date(year, month - 1, day);

      if (scheduledDate > todayDate) {
        return `Your appointment is scheduled for ${scheduledDate.toLocaleDateString(
          undefined,
          { year: "numeric", month: "long", day: "numeric" }
        )}.`;
      }

      if (scheduledDate < todayDate) {
        return "Your appointment date has passed. Please contact the hospital.";
      }

      return "Your appointment is scheduled for today. Check your estimated waiting time below.";
    }

    return "Appointment details retrieved.";
  };

  const isFutureAppointment = () => {
    if (!tracking?.queueDate || tracking.status?.toUpperCase() !== "WAITING") {
      return false;
    }

    const [year, month, day] = tracking.queueDate.split("-").map(Number);
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const scheduledDate = new Date(year, month - 1, day);

    return scheduledDate > todayDate;
  };

  return (
    <div className="tracking-container">
      <h2>Patient Queue Tracking</h2>

      <form onSubmit={trackPatient}>
        <input
          type="number"
          min="1"
          placeholder="Enter Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Track Queue"}
        </button>
      </form>

      {error && <p className="error">{String(error)}</p>}

      {tracking && (
        <div className="tracking-card">
          <h3>Queue Details</h3>

          <p>
            <strong>Appointment ID:</strong> {tracking.appointmentId}
          </p>

          <p>
            <strong>Token:</strong> {tracking.tokenNumber}
          </p>

          <p>
            <strong>Date:</strong> {tracking.queueDate}
          </p>

          <p>
            <strong>Status:</strong> {tracking.status}
          </p>

          <p>
            <strong>Queue Position:</strong>{" "}
            {tracking.queuePosition ?? "Not available"}
          </p>

          <div className="appointment-message">
            <strong>{getAppointmentMessage()}</strong>
          </div>

          {tracking.status?.toUpperCase() === "WAITING" &&
            !isFutureAppointment() && (
              <>
                <p>
                  <strong>Estimated Wait:</strong>{" "}
                  {tracking.estimatedWaitMinutes == null
                    ? "Not available"
                    : `${tracking.estimatedWaitMinutes} minutes`}
                </p>

                <p>
                  <strong>Estimated Consultation:</strong>{" "}
                  {formatDateTime(tracking.estimatedConsultationTime)}
                </p>
              </>
            )}

          {tracking.status?.toUpperCase() === "IN_PROGRESS" && (
            <p>
              <strong>Estimated Consultation:</strong>{" "}
              {formatDateTime(tracking.estimatedConsultationTime)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientQueueTracking;