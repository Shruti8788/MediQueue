
import { useEffect, useState } from "react";
import axios from "axios";

const QUEUE_API = "http://localhost:8080/api/queue";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Queue() {
  const [tokens, setTokens] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [queueCounts, setQueueCounts] = useState({
    WAITING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  });

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${QUEUE_API}/date/${date}`
      );

      const queueData = Array.isArray(response.data)
        ? response.data
        : [];

      setTokens(queueData);

      const counts = {
        WAITING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
      };

      queueData.forEach((token) => {
        if (counts[token.status] !== undefined) {
          counts[token.status]++;
        }
      });

      setQueueCounts(counts);
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              "Failed to load queue. Check backend connection."
      );
      setTokens([]);
      setQueueCounts({
        WAITING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [date]);

  const updateStatus = async (id, status) => {
    try {
      setError("");
      setMessage("");
      setUpdatingId(id);

      await axios.put(
        `${QUEUE_API}/${id}/status`,
        null,
        { params: { status } }
      );

      setMessage(`Token status updated to ${status}`);
      await loadQueue();
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              "Failed to update token status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="queue-page">
      <div className="page-heading">
        <div>
          <h2>Queue Management</h2>
          <p>View and manage patient queue tokens.</p>
        </div>

        <button
          className="queue-refresh-btn"
          onClick={loadQueue}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Queue"}
        </button>
      </div>

      <div className="queue-counts">
        <div className="queue-count-card waiting">
          <h3>Waiting</h3>
          <h2>{queueCounts.WAITING}</h2>
        </div>

        <div className="queue-count-card progress">
          <h3>In Progress</h3>
          <h2>{queueCounts.IN_PROGRESS}</h2>
        </div>

        <div className="queue-count-card completed">
          <h3>Completed</h3>
          <h2>{queueCounts.COMPLETED}</h2>
        </div>
      </div>

      <div className="queue-filter">
        <label htmlFor="queueDate">Select Date</label>
        <input
          id="queueDate"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setMessage("");
            setError("");
          }}
        />
      </div>

      {message && (
        <p className="success-message">{message}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {loading ? (
        <p className="queue-loading">Loading queue...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No queue tokens for this date.
                  </td>
                </tr>
              ) : (
                tokens.map((token) => (
                  <tr key={token.id}>
                    <td>{token.tokenNumber}</td>
                    <td>{token.appointmentId}</td>
                    <td>{token.queueDate}</td>

                    <td>
                      <span
                        className={`status-badge ${token.status?.toLowerCase()}`}
                      >
                        {token.status}
                      </span>
                    </td>

                    <td className="queue-actions">
                      {token.status === "WAITING" && (
                        <button
                          className="queue-call-btn"
                          disabled={updatingId === token.id}
                          onClick={() =>
                            updateStatus(token.id, "IN_PROGRESS")
                          }
                        >
                          {updatingId === token.id
                            ? "Updating..."
                            : "Call Patient"}
                        </button>
                      )}

                      {token.status === "IN_PROGRESS" && (
                        <button
                          className="queue-complete-btn"
                          disabled={updatingId === token.id}
                          onClick={() =>
                            updateStatus(token.id, "COMPLETED")
                          }
                        >
                          {updatingId === token.id
                            ? "Updating..."
                            : "Complete"}
                        </button>
                      )}

                      {token.status !== "COMPLETED" &&
                        token.status !== "CANCELLED" && (
                          <button
                            className="cancel-button"
                            disabled={updatingId === token.id}
                            onClick={() =>
                              updateStatus(token.id, "CANCELLED")
                            }
                          >
                            Cancel
                          </button>
                        )}

                      {(token.status === "COMPLETED" ||
                        token.status === "CANCELLED") && (
                        <span className="queue-no-action">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Queue;