
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Queue from "./Queue";
import PatientQueueTracking from "./PatientQueueTracking";

const PATIENT_API = "http://localhost:8080/api/patients";
const DOCTOR_API = "http://localhost:8080/api/doctors";
const APPOINTMENT_API = "http://localhost:8080/api/appointments";
const QUEUE_API = "http://localhost:8080/api/queue";

function App() {
  const emptyPatient = {
    name: "", email: "", phone: "", gender: "", age: ""
  };

  const emptyDoctor = {
    name: "", specialization: "", email: "", phone: "", availability: ""
  };

  const emptyAppointment = {
    patientId: "", doctorId: "", appointmentDate: "",
    appointmentTime: "", reason: ""
  };

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [p, d, a] = await Promise.all([
        axios.get(PATIENT_API),
        axios.get(DOCTOR_API),
        axios.get(APPOINTMENT_API)
      ]);
      setPatients(p.data);
      setDoctors(d.data);
      setAppointments(a.data);
    } catch (err) {
      setError("Unable to load data. Please check the backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (text) => {
    setMessage(text);
    setError("");
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  // Patient operations
  const handlePatientChange = (e) => {
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });
  };

  const submitPatient = async (e) => {
    e.preventDefault();
    const data = { ...patientForm, age: Number(patientForm.age) };
    try {
      if (editingPatientId === null) {
        await axios.post(PATIENT_API, data);
        notify("Patient registered successfully.");
      } else {
        await axios.put(`${PATIENT_API}/${editingPatientId}`, data);
        notify("Patient details updated successfully.");
      }
      setPatientForm(emptyPatient);
      setEditingPatientId(null);
      await loadData();
    } catch (err) {
      showError("Unable to save patient. Please check the details.");
      console.error(err);
    }
  };

  const editPatient = (patient) => {
    setPatientForm({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      gender: patient.gender || "",
      age: patient.age ?? ""
    });
    setEditingPatientId(patient.id);
    setActiveTab("patients");
    setMessage("");
    setError("");
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`${PATIENT_API}/${id}`);
      notify("Patient deleted successfully.");
      if (editingPatientId === id) {
        setPatientForm(emptyPatient);
        setEditingPatientId(null);
      }
      await loadData();
    } catch (err) {
      showError("Unable to delete patient.");
      console.error(err);
    }
  };

  const cancelPatientEdit = () => {
    setPatientForm(emptyPatient);
    setEditingPatientId(null);
    setMessage("");
    setError("");
  };

  // Doctor operations
  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const submitDoctor = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId === null) {
        await axios.post(DOCTOR_API, doctorForm);
        notify("Doctor registered successfully.");
      } else {
        await axios.put(`${DOCTOR_API}/${editingDoctorId}`, doctorForm);
        notify("Doctor details updated successfully.");
      }
      setDoctorForm(emptyDoctor);
      setEditingDoctorId(null);
      await loadData();
    } catch (err) {
      showError("Unable to save doctor. Please check the details.");
      console.error(err);
    }
  };

  const editDoctor = (doctor) => {
    setDoctorForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      availability: doctor.availability || ""
    });
    setEditingDoctorId(doctor.id);
    setActiveTab("doctors");
    setMessage("");
    setError("");
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${DOCTOR_API}/${id}`);
      notify("Doctor deleted successfully.");
      if (editingDoctorId === id) {
        setDoctorForm(emptyDoctor);
        setEditingDoctorId(null);
      }
      await loadData();
    } catch (err) {
      showError("Unable to delete doctor.");
      console.error(err);
    }
  };

  const cancelDoctorEdit = () => {
    setDoctorForm(emptyDoctor);
    setEditingDoctorId(null);
    setMessage("");
    setError("");
  };

  // Appointment operations
  const handleAppointmentChange = (e) => {
    setAppointmentForm({
      ...appointmentForm,
      [e.target.name]: e.target.value
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      const data = {
        patientId: Number(appointmentForm.patientId),
        doctorId: Number(appointmentForm.doctorId),
        appointmentDate: appointmentForm.appointmentDate,
        appointmentTime: appointmentForm.appointmentTime,
        reason: appointmentForm.reason
      };
      await axios.post(APPOINTMENT_API, data);
      notify("Appointment booked successfully.");
      setAppointmentForm(emptyAppointment);
      await loadData();
    } catch (err) {
      showError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to book appointment. Check the selected patient, doctor and date.")
      );
      console.error(err);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.put(`${APPOINTMENT_API}/${id}/cancel`);
      notify("Appointment cancelled successfully.");
      await loadData();
    } catch (err) {
      showError("Unable to cancel appointment.");
      console.error(err);
    }
  };

  // Generate queue token
  const generateQueueToken = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${QUEUE_API}/generate/${appointmentId}`
      );

      notify(
        `Queue token ${response.data.tokenNumber} generated successfully.`
      );
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            "Unable to generate queue token.";

      showError(errorMessage);
      console.error(err);
    }
  };

  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0")
  ].join("-");

  const todayAppointments = appointments.filter(
    (a) => a.appointmentDate === today && a.status !== "CANCELLED"
  );

  const pendingAppointments = appointments.filter(
    (a) => a.status === "BOOKED"
  );

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.email} ${p.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) =>
    `${d.name} ${d.specialization} ${d.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter((a) => {
    const patient = patients.find((p) => Number(p.id) === Number(a.patientId));
    const doctor = doctors.find((d) => Number(d.id) === Number(a.doctorId));
    return `${patient?.name || ""} ${doctor?.name || ""} ${a.status || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // NEW: Patient Tracking page title
  const pageTitles = {
    dashboard: ["Dashboard", "Overview of hospital activity"],
    patients: ["Patient Management", "Register and manage patient records"],
    doctors: ["Doctor Management", "Manage doctors and their availability"],
    appointments: ["Appointment Management", "Schedule and track patient visits"],
    queue: ["Queue Management", "View and manage patient queue tokens"],
    tracking: [
      "Patient Tracking",
      "Track patient queue position and estimated waiting time"
    ]
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setError("");
    setSearchTerm("");
  };

  const renderSearch = () => (
    <div className="search-wrap">
      <span className="search-symbol">⌕</span>
      <input
        aria-label="Search records"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search ${activeTab}...`}
      />
    </div>
  );

  const renderPatientTable = (rows) => (
    rows.length === 0 ? (
      <div className="empty-state">
        <span className="empty-icon">♙</span>
        <strong>No patient records found</strong>
        <p>Register a patient to see their information here.</p>
      </div>
    ) : (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th><th>Contact</th><th>Gender</th>
              <th>Age</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="person-cell">
                    <span className="avatar patient-avatar">
                      {(p.name || "P").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{p.name}</strong>
                      <small>Patient #{p.id}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span>{p.email}</span>
                  <small className="table-sub">{p.phone}</small>
                </td>
                <td>{p.gender || "—"}</td>
                <td>{p.age ?? "—"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => editPatient(p)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deletePatient(p.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  const renderDoctorTable = (rows) => (
    rows.length === 0 ? (
      <div className="empty-state">
        <span className="empty-icon">⚕</span>
        <strong>No doctor records found</strong>
        <p>Add a doctor to manage their details here.</p>
      </div>
    ) : (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doctor</th><th>Specialization</th><th>Contact</th>
              <th>Availability</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>
                  <div className="person-cell">
                    <span className="avatar doctor-avatar">⚕</span>
                    <div>
                      <strong>{d.name}</strong>
                      <small>Doctor #{d.id}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="specialty-tag">{d.specialization}</span>
                </td>
                <td>
                  <span>{d.email}</span>
                  <small className="table-sub">{d.phone}</small>
                </td>
                <td>{d.availability || "—"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => editDoctor(d)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteDoctor(d.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  const renderAppointmentTable = (rows) => (
    rows.length === 0 ? (
      <div className="empty-state">
        <span className="empty-icon">▦</span>
        <strong>No appointments found</strong>
        <p>Book an appointment to see it listed here.</p>
      </div>
    ) : (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Appointment</th><th>Patient</th><th>Doctor</th>
              <th>Date &amp; time</th><th>Reason</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const patient = patients.find(
                (p) => Number(p.id) === Number(a.patientId)
              );
              const doctor = doctors.find(
                (d) => Number(d.id) === Number(a.doctorId)
              );
              return (
                <tr key={a.id}>
                  <td>
                    <strong>APT-{String(a.id).padStart(3, "0")}</strong>
                  </td>
                  <td>{patient?.name || `Patient #${a.patientId}`}</td>
                  <td>{doctor?.name || `Doctor #${a.doctorId}`}</td>
                  <td>
                    <strong>{a.appointmentDate}</strong>
                    <small className="table-sub">{a.appointmentTime}</small>
                  </td>
                  <td className="reason-cell">{a.reason}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        a.status === "CANCELLED"
                          ? "status-cancelled"
                          : "status-booked"
                      }`}
                    >
                      <i />{a.status || "BOOKED"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {a.status === "BOOKED" && (
                        <button
                          className="edit-btn"
                          onClick={() => generateQueueToken(a.id)}
                        >
                          Generate Token
                        </button>
                      )}

                      {a.status !== "CANCELLED" && (
                        <button
                          className="delete-btn"
                          onClick={() => cancelAppointment(a.id)}
                        >
                          Cancel
                        </button>
                      )}

                      {a.status === "CANCELLED" && (
                        <span className="muted-text">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✚</div>
          <div>
            <strong>CarePoint</strong>
            <small>HOSPITAL SYSTEM</small>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          <button
            className={activeTab === "dashboard" ? "side-link selected" : "side-link"}
            onClick={() => navigate("dashboard")}
          >
            <span className="side-icon">▦</span>Dashboard
          </button>

          <button
            className={activeTab === "patients" ? "side-link selected" : "side-link"}
            onClick={() => navigate("patients")}
          >
            <span className="side-icon">♙</span>Patients
            <span className="nav-count">{patients.length}</span>
          </button>

          <button
            className={activeTab === "doctors" ? "side-link selected" : "side-link"}
            onClick={() => navigate("doctors")}
          >
            <span className="side-icon">⚕</span>Doctors
            <span className="nav-count">{doctors.length}</span>
          </button>

          <button
            className={activeTab === "appointments" ? "side-link selected" : "side-link"}
            onClick={() => navigate("appointments")}
          >
            <span className="side-icon">▣</span>Appointments
            <span className="nav-count">{appointments.length}</span>
          </button>

          <button
            className={activeTab === "queue" ? "side-link selected" : "side-link"}
            onClick={() => navigate("queue")}
          >
            <span className="side-icon">☷</span>Queue Management
          </button>

          {/* NEW: Patient Tracking sidebar tab */}
          <button
            className={activeTab === "tracking" ? "side-link selected" : "side-link"}
            onClick={() => navigate("tracking")}
          >
            <span className="side-icon">⌕</span>Patient Tracking
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">✚</div>
            <strong>Hospital support</strong>
            <p>Manage your hospital records from one place.</p>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Hospital Admin</small>
            </div>
            <span className="user-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            CarePoint <span>/</span> {pageTitles[activeTab][0]}
          </div>
          <div className="topbar-right">
            <div className="system-status"><i /> System online</div>
            <div className="topbar-date">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </div>
            <div className="topbar-user">A</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">HOSPITAL ADMINISTRATION</p>
              <h1>{pageTitles[activeTab][0]}</h1>
              <p className="page-subtitle">{pageTitles[activeTab][1]}</p>
            </div>

            {activeTab !== "dashboard" &&
              activeTab !== "queue" &&
              activeTab !== "tracking" && (
                <button
                  className="primary-button"
                  onClick={() => {
                    if (activeTab === "patients") {
                      setPatientForm(emptyPatient);
                      setEditingPatientId(null);
                    } else if (activeTab === "doctors") {
                      setDoctorForm(emptyDoctor);
                      setEditingDoctorId(null);
                    } else {
                      setAppointmentForm(emptyAppointment);
                    }
                    setMessage("");
                    setError("");
                    document.querySelector(".form-panel")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });
                  }}
                >
                  <span>＋</span>{" "}
                  {activeTab === "patients"
                    ? "Add patient"
                    : activeTab === "doctors"
                    ? "Add doctor"
                    : "New appointment"}
                </button>
              )}
          </div>

          {message && (
            <div className="alert alert-success">
              <span>✓</span>{message}
              <button onClick={() => setMessage("")}>×</button>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span>!</span>{error}
              <button onClick={() => setError("")}>×</button>
            </div>
          )}

          {/* NEW: Patient Tracking page rendering */}
          {activeTab === "tracking" ? (
            <PatientQueueTracking />
          ) : activeTab === "queue" ? (
            <Queue />
          ) : loading ? (
            <div className="loading-panel">
              <div className="loader" />Loading hospital data...
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <>
                  <section className="welcome-panel">
                    <div>
                      <span className="welcome-kicker">CAREPOINT OVERVIEW</span>
                      <h2>Good day, Administrator</h2>
                      <p>Here’s what’s happening at your hospital today.</p>
                    </div>
                    <div className="welcome-symbol">✚</div>
                  </section>

                  <section className="stats-grid">
                    <div className="metric-card">
                      <div className="metric-top">
                        <span>Total patients</span>
                        <span className="metric-icon icon-blue">♙</span>
                      </div>
                      <strong>{patients.length}</strong>
                      <small>Registered patient records</small>
                    </div>
                    <div className="metric-card">
                      <div className="metric-top">
                        <span>Medical staff</span>
                        <span className="metric-icon icon-green">⚕</span>
                      </div>
                      <strong>{doctors.length}</strong>
                      <small>Registered doctors</small>
                    </div>
                    <div className="metric-card">
                      <div className="metric-top">
                        <span>Today's appointments</span>
                        <span className="metric-icon icon-purple">▣</span>
                      </div>
                      <strong>{todayAppointments.length}</strong>
                      <small>Scheduled for today</small>
                    </div>
                    <div className="metric-card">
                      <div className="metric-top">
                        <span>Booked appointments</span>
                        <span className="metric-icon icon-orange">◷</span>
                      </div>
                      <strong>{pendingAppointments.length}</strong>
                      <small>Currently marked as booked</small>
                    </div>
                  </section>

                  <section className="dashboard-grid">
                    <div className="panel">
                      <div className="panel-heading">
                        <div>
                          <h2>Recent appointments</h2>
                          <p>Latest appointment records</p>
                        </div>
                        <button
                          className="text-button"
                          onClick={() => navigate("appointments")}
                        >
                          View all →
                        </button>
                      </div>
                      {appointments.length === 0 ? (
                        <div className="empty-state compact">
                          <strong>No appointments yet</strong>
                          <p>New bookings will appear here.</p>
                        </div>
                      ) : (
                        renderAppointmentTable(
                          [...appointments].slice(-5).reverse()
                        )
                      )}
                    </div>

                    <div className="panel quick-panel">
                      <div className="panel-heading">
                        <div>
                          <h2>Quick actions</h2>
                          <p>Common hospital tasks</p>
                        </div>
                      </div>
                      <button
                        className="quick-action"
                        onClick={() => navigate("patients")}
                      >
                        <span className="quick-icon quick-blue">♙</span>
                        <span>
                          <strong>Manage patients</strong>
                          <small>Register or update patient details</small>
                        </span>
                        <b>→</b>
                      </button>
                      <button
                        className="quick-action"
                        onClick={() => navigate("doctors")}
                      >
                        <span className="quick-icon quick-green">⚕</span>
                        <span>
                          <strong>Manage doctors</strong>
                          <small>View doctors and availability</small>
                        </span>
                        <b>→</b>
                      </button>
                      <button
                        className="quick-action"
                        onClick={() => navigate("appointments")}
                      >
                        <span className="quick-icon quick-purple">▣</span>
                        <span>
                          <strong>Book appointment</strong>
                          <small>Schedule a patient visit</small>
                        </span>
                        <b>→</b>
                      </button>
                      <button
                        className="quick-action"
                        onClick={() => navigate("queue")}
                      >
                        <span className="quick-icon quick-orange">☷</span>
                        <span>
                          <strong>Manage queue</strong>
                          <small>View tokens and update status</small>
                        </span>
                        <b>→</b>
                      </button>
                      {/* NEW: Quick action for patient tracking */}
                      <button
                        className="quick-action"
                        onClick={() => navigate("tracking")}
                      >
                        <span className="quick-icon quick-blue">⌕</span>
                        <span>
                          <strong>Patient tracking</strong>
                          <small>Check queue position and wait time</small>
                        </span>
                        <b>→</b>
                      </button>
                    </div>
                  </section>
                </>
              )}

              {activeTab === "patients" && (
                <section className="management-layout">
                  <div className="panel form-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>
                          {editingPatientId === null
                            ? "Register a patient"
                            : "Edit patient"}
                        </h2>
                        <p>
                          Enter the patient's personal and contact information.
                        </p>
                      </div>
                    </div>
                    <form className="app-form" onSubmit={submitPatient}>
                      <label>
                        Full name
                        <input
                          name="name"
                          value={patientForm.name}
                          onChange={handlePatientChange}
                          placeholder="Enter full name"
                          required
                        />
                      </label>
                      <label>
                        Email address
                        <input
                          type="email"
                          name="email"
                          value={patientForm.email}
                          onChange={handlePatientChange}
                          placeholder="name@example.com"
                          required
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          type="tel"
                          name="phone"
                          value={patientForm.phone}
                          onChange={handlePatientChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </label>
                      <div className="form-row">
                        <label>
                          Gender
                          <select
                            name="gender"
                            value={patientForm.gender}
                            onChange={handlePatientChange}
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </label>
                        <label>
                          Age
                          <input
                            type="number"
                            name="age"
                            min="0"
                            max="120"
                            value={patientForm.age}
                            onChange={handlePatientChange}
                            placeholder="Age"
                            required
                          />
                        </label>
                      </div>
                      <div className="form-actions">
                        <button className="primary-button" type="submit">
                          {editingPatientId === null
                            ? "Register patient"
                            : "Save changes"}
                        </button>
                        {editingPatientId !== null && (
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={cancelPatientEdit}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="panel records-panel">
                    <div className="panel-heading records-heading">
                      <div>
                        <h2>Patient directory</h2>
                        <p>{patients.length} registered patient(s)</p>
                      </div>
                      {renderSearch()}
                    </div>
                    {renderPatientTable(filteredPatients)}
                  </div>
                </section>
              )}

              {activeTab === "doctors" && (
                <section className="management-layout">
                  <div className="panel form-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>
                          {editingDoctorId === null
                            ? "Register a doctor"
                            : "Edit doctor"}
                        </h2>
                        <p>Add professional and availability details.</p>
                      </div>
                    </div>
                    <form className="app-form" onSubmit={submitDoctor}>
                      <label>
                        Doctor's name
                        <input
                          name="name"
                          value={doctorForm.name}
                          onChange={handleDoctorChange}
                          placeholder="Enter doctor's name"
                          required
                        />
                      </label>
                      <label>
                        Specialization
                        <input
                          name="specialization"
                          value={doctorForm.specialization}
                          onChange={handleDoctorChange}
                          placeholder="e.g. Cardiologist"
                          required
                        />
                      </label>
                      <label>
                        Email address
                        <input
                          type="email"
                          name="email"
                          value={doctorForm.email}
                          onChange={handleDoctorChange}
                          placeholder="doctor@example.com"
                          required
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          type="tel"
                          name="phone"
                          value={doctorForm.phone}
                          onChange={handleDoctorChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </label>
                      <label>
                        Availability
                        <input
                          name="availability"
                          value={doctorForm.availability}
                          onChange={handleDoctorChange}
                          placeholder="e.g. Mon-Sat, 10 AM - 5 PM"
                          required
                        />
                      </label>
                      <div className="form-actions">
                        <button className="primary-button" type="submit">
                          {editingDoctorId === null
                            ? "Register doctor"
                            : "Save changes"}
                        </button>
                        {editingDoctorId !== null && (
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={cancelDoctorEdit}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="panel records-panel">
                    <div className="panel-heading records-heading">
                      <div>
                        <h2>Medical team</h2>
                        <p>{doctors.length} registered doctor(s)</p>
                      </div>
                      {renderSearch()}
                    </div>
                    {renderDoctorTable(filteredDoctors)}
                  </div>
                </section>
              )}

              {activeTab === "appointments" && (
                <section className="management-layout">
                  <div className="panel form-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>Book an appointment</h2>
                        <p>Schedule a visit with an available doctor.</p>
                      </div>
                    </div>
                    {patients.length === 0 || doctors.length === 0 ? (
                      <div className="form-notice">
                        Please register at least one patient and one doctor
                        before booking.
                      </div>
                    ) : (
                      <form className="app-form" onSubmit={bookAppointment}>
                        <label>
                          Select patient
                          <select
                            name="patientId"
                            value={appointmentForm.patientId}
                            onChange={handleAppointmentChange}
                            required
                          >
                            <option value="">Choose a patient</option>
                            {patients.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (#{p.id})
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Select doctor
                          <select
                            name="doctorId"
                            value={appointmentForm.doctorId}
                            onChange={handleAppointmentChange}
                            required
                          >
                            <option value="">Choose a doctor</option>
                            {doctors.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name} — {d.specialization}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="form-row">
                          <label>
                            Appointment date
                            <input
                              type="date"
                              name="appointmentDate"
                              min={today}
                              value={appointmentForm.appointmentDate}
                              onChange={handleAppointmentChange}
                              required
                            />
                          </label>
                          <label>
                            Appointment time
                            <input
                              type="time"
                              name="appointmentTime"
                              value={appointmentForm.appointmentTime}
                              onChange={handleAppointmentChange}
                              required
                            />
                          </label>
                        </div>
                        <label>
                          Reason for visit
                          <textarea
                            name="reason"
                            rows="4"
                            value={appointmentForm.reason}
                            onChange={handleAppointmentChange}
                            placeholder="Briefly describe the reason for the visit"
                            required
                          />
                        </label>
                        <div className="form-actions">
                          <button className="primary-button" type="submit">
                            Confirm appointment
                          </button>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setAppointmentForm(emptyAppointment)}
                          >
                            Clear form
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  <div className="panel records-panel">
                    <div className="panel-heading records-heading">
                      <div>
                        <h2>Appointment schedule</h2>
                        <p>{appointments.length} appointment record(s)</p>
                      </div>
                      {renderSearch()}
                    </div>
                    {renderAppointmentTable(filteredAppointments)}
                  </div>
                </section>
              )}
            </>
          )}

          <footer className="page-footer">
            CarePoint Hospital Management <span>•</span> Administration workspace
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;