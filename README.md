# MediQueue – Smart Hospital Appointment & Patient Tracking

**MediQueue** is a web-based hospital appointment and patient queue tracking application designed to simplify appointment booking, token generation, and patient queue monitoring. It provides a user-friendly React frontend, a Java Spring Boot backend, and a MySQL database for storing and managing hospital-related information.

The application allows patients to book appointments, receive queue tokens, and track their queue status. It also supports hospital staff in managing appointments, generating tokens, updating queue statuses, and monitoring patient flow.


## Table of Contents

1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Frontend – React.js](#frontend--reactjs)
7. [Backend – Java Spring Boot](#backend--java-spring-boot)
8. [Database – MySQL](#database--mysql)
9. [Application Workflow](#application-workflow)
10. [REST API Endpoints](#rest-api-endpoints)
11. [Project Structure](#project-structure)
12. [Installation and Setup](#installation-and-setup)
13. [Configuration](#configuration)
14. [Testing with Postman](#testing-with-postman)
15. [Advantages](#advantages)
16. [Future Enhancements](#future-enhancements)
17. [Author](#author)

---

## 1. Project Overview

**Project Name:** MediQueue – Smart Hospital Appointment & Patient Tracking

**Project Type:** Full Stack Web Application

**Domain:** Healthcare / Hospital Automation

**Purpose:** To digitize hospital appointment booking and patient queue tracking, making the appointment process more organized and convenient for patients and hospital staff.

Traditional hospital appointment and queue processes can involve long waiting times, manual token management, and difficulty checking appointment status. MediQueue provides a centralized web application to handle these processes digitally.

Patients can book appointments with doctors, receive queue tokens, and track their queue progress using their appointment ID. The backend processes appointment and queue information, while MySQL stores the application data.

## 2. Objectives

* Provide a simple and user-friendly hospital appointment booking interface.
* Maintain patient and doctor information digitally.
* Generate unique queue tokens for eligible appointments.
* Allow patients to check their queue position and status.
* Estimate patient waiting time based on queue information and consultation duration.
* Enable staff to manage appointments and update queue statuses.
* Store and retrieve application information using a relational database.
* Connect the React frontend with the Spring Boot backend through REST APIs.

## 3. Key Features

### Patient Features

* Patient registration and information management.
* View available doctors and their details.
* Book hospital appointments.
* View appointment information.
* Receive a queue token after token generation.
* Track queue position using the appointment ID.
* View token status and estimated waiting time.

### Doctor Features

* Store and view doctor information.
* Maintain doctor details such as name, specialization, email, and phone number.
* Associate appointments with doctors.

### Appointment Features

* Create and store patient appointments.
* Associate appointments with patients and doctors.
* Maintain appointment dates, times, reasons, and statuses.
* Retrieve appointment information through backend APIs.

### Queue Management Features

* Generate queue tokens for eligible appointments.
* Prevent duplicate token generation for the same appointment.
* Assign sequential token numbers, such as `A-001`, `A-002`, and `A-003`.
* Retrieve queue tokens by date or token ID.
* Track patients by appointment ID.
* Update token statuses, such as `WAITING`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`.
* Calculate estimated waiting time using queue position and consultation duration information.

### User Interface Features

* React-based interactive frontend.
* Separate pages or components for the application's main functions.
* Forms for entering patient and appointment details.
* API integration using Axios.
* Display of backend responses and error messages.
* Responsive layout, depending on the implemented CSS.

## 4. Technology Stack

| Layer                    | Technologies                                |
| ------------------------ | ------------------------------------------- |
| Frontend                 | React.js, JavaScript, HTML5, CSS3           |
| Frontend API integration | Axios                                       |
| Backend                  | Java 17, Spring Boot                        |
| Backend architecture     | RESTful APIs, Controller-Service-Repository |
| Persistence              | Spring Data JPA, Hibernate                  |
| Database                 | MySQL 8                                     |
| API testing              | Postman                                     |
| IDE                      | Visual Studio Code, Spring Tool Suite (STS) |
| Build tool               | Maven                                       |
| Version control          | Git and GitHub                              |

## 5. System Architecture

MediQueue follows a three-tier architecture, separating the user interface, application logic, and data storage.

```text
             PATIENT / HOSPITAL STAFF
                        |
                        v
             REACT.JS FRONTEND
          HTML | CSS | JavaScript
                        |
                        v
                 AXIOS / HTTP
                        |
                        v
              SPRING BOOT BACKEND
                        |
             REST API CONTROLLERS
                        |
                        v
                SERVICE LAYER
          Business Logic and Validation
                        |
                        v
              REPOSITORY LAYER
                Spring Data JPA
                        |
                        v
               HIBERNATE ORM
                        |
                        v
                MYSQL DATABASE
      Patient | Doctor | Appointment
                  Queue Token
```

### Architecture Explanation

**1. Presentation Layer – React.js**

The frontend provides the interface through which patients and staff interact with the application. It collects user input, displays appointment and queue information, and sends HTTP requests to the backend using Axios.

**2. Application Layer – Spring Boot**

The backend receives frontend requests through REST controllers. The service layer processes application logic, including appointment handling, token generation, queue tracking, and status updates.

**3. Persistence Layer – Spring Data JPA and Hibernate**

Repositories communicate with the database through Spring Data JPA. Hibernate maps Java entity classes to relational database tables and handles persistence operations.

**4. Database Layer – MySQL**

MySQL stores patient, doctor, appointment, and queue token information. The backend retrieves and updates this information as required by the application.

## 6. Frontend – React.js

The frontend is developed using React.js, a JavaScript library for building interactive user interfaces.

### Frontend Responsibilities

* Display patient, doctor, appointment, and queue information.
* Collect patient details through forms.
* Submit appointment booking requests to the backend.
* Retrieve and display doctor and appointment records.
* Request queue token generation.
* Display queue token details and patient tracking information.
* Show loading, success, and error states where implemented.

### React Concepts Used

| Concept               | Purpose                                      |
| --------------------- | -------------------------------------------- |
| Components            | Divide the interface into reusable sections  |
| JSX                   | Write UI structures using JavaScript syntax  |
| useState              | Store and update component state             |
| useEffect             | Perform API requests and other side effects  |
| Axios                 | Send HTTP requests to Spring Boot            |
| Event handling        | Handle form submissions and button clicks    |
| Conditional rendering | Display data, loading indicators, and errors |
| CSS                   | Style application pages and components       |

### Frontend API Integration

The React application communicates with the backend through Axios.

Example:

```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Fetch patients
const getPatients = async () => {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
};

// Fetch doctors
const getDoctors = async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
};

// Track patient queue
const trackQueue = async (appointmentId) => {
    const response = await axios.get(
        `${API_URL}/queue/track/${appointmentId}`
    );
    return response.data;
};
```

These are example API integration functions; align the paths with the actual controllers in your project.

## 7. Backend – Java Spring Boot

The backend is developed using Java and Spring Boot. It exposes REST APIs, processes business logic, communicates with the MySQL database, and returns responses to the React frontend.

### Backend Responsibilities

* Handle patient and doctor information.
* Process appointment requests.
* Generate and manage queue tokens.
* Prevent duplicate token generation for an appointment.
* Calculate and return queue tracking information.
* Update token status.
* Retrieve queue records by date or token ID.
* Persist and retrieve records using Spring Data JPA.

### Backend Architecture

The backend follows a layered structure.

**Controller Layer**

The controller layer receives HTTP requests and returns HTTP responses. It defines endpoints for patient, doctor, appointment, and queue operations.

**Service Layer**

The service layer contains business logic, including appointment validation, token generation, queue position calculation, estimated waiting time, and status changes.

**Repository Layer**

The repository layer uses Spring Data JPA to perform database operations such as saving, retrieving, updating, and deleting records.

**Entity Layer**

Entity classes represent the application's database records. Examples include `Patient`, `Doctor`, `Appointment`, and `QueueToken`.

**DTO Layer**

Data Transfer Objects (DTOs) are used to return structured information to the frontend. For example, `QueueTrackingResponse` can provide appointment ID, token number, queue date, status, queue position, and estimated waiting information.

### Important Spring Boot Components

| Component         | Responsibility                         |
| ----------------- | -------------------------------------- |
| `@RestController` | Defines REST API controllers           |
| `@RequestMapping` | Sets the base URL for endpoints        |
| `@GetMapping`     | Handles HTTP GET requests              |
| `@PostMapping`    | Handles HTTP POST requests             |
| `@PutMapping`     | Handles HTTP PUT requests              |
| `@PathVariable`   | Reads values from the URL              |
| `@RequestParam`   | Reads query parameters                 |
| `@Service`        | Marks a service class                  |
| `@Repository`     | Defines the persistence layer          |
| `@Entity`         | Maps a Java class to a database entity |
| `@Id`             | Identifies the primary key             |
| `@GeneratedValue` | Configures generated primary keys      |
| `JpaRepository`   | Provides common database operations    |
| `@Autowired`      | Injects required dependencies          |

## 8. Database – MySQL

MySQL is used as the relational database for storing and managing hospital application data. Spring Data JPA and Hibernate provide the mapping between Java entities and database tables.

**Database Name:** `hospital_db`

### Main Database Entities

#### 1. Patient

Stores patient information.

| Field                    | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `id`                     | Unique patient identifier                            |
| `name`                   | Patient's name                                       |
| `email`                  | Patient's email address                              |
| `phone`                  | Patient's contact number                             |
| Other implemented fields | Additional patient details, if present in the entity |

#### 2. Doctor

Stores doctor information.

| Field            | Description              |
| ---------------- | ------------------------ |
| `id`             | Unique doctor identifier |
| `name`           | Doctor's name            |
| `specialization` | Medical specialization   |
| `email`          | Doctor's email address   |
| `phone`          | Doctor's contact number  |

#### 3. Appointment

Stores patient appointment details.

| Field             | Description                   |
| ----------------- | ----------------------------- |
| `id`              | Unique appointment identifier |
| `patientId`       | Associated patient ID         |
| `doctorId`        | Associated doctor ID          |
| `appointmentDate` | Scheduled appointment date    |
| `appointmentTime` | Scheduled appointment time    |
| `reason`          | Reason for appointment        |
| `status`          | Appointment status            |

#### 4. Queue Token

Stores queue and consultation tracking information.

| Field                       | Description                         |
| --------------------------- | ----------------------------------- |
| `id`                        | Unique queue token record ID        |
| `appointmentId`             | Associated appointment ID           |
| `tokenNumber`               | Generated queue token, e.g. `A-001` |
| `queueDate`                 | Queue date                          |
| `status`                    | Current token status                |
| `createdAt`                 | Token creation timestamp            |
| `consultationStartTime`     | Consultation start time             |
| `consultationEndTime`       | Consultation completion time        |
| `estimatedWaitMinutes`      | Estimated waiting duration          |
| `estimatedConsultationTime` | Estimated consultation duration     |

*The field lists above describe the project entities discussed during development. Confirm the exact field names and database constraints against your final Java entity classes.*

### Database Relationships

The logical relationships between the main entities are:

* One patient can have multiple appointments.
* One doctor can have multiple appointments.
* Each appointment is associated with a patient and a doctor.
* A queue token is associated with an appointment.

```text
PATIENT
   |
   | One-to-Many
   v
APPOINTMENT
   ^
   | Many-to-One
   |
 DOCTOR

APPOINTMENT
   |
   | Queue token association
   v
QUEUE_TOKEN
```

### Database Configuration

Example Spring Boot configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Set `DB_USERNAME` and `DB_PASSWORD` as environment variables before starting the backend. Never publish actual database credentials in a public repository.

## 9. Application Workflow

### Step 1: Patient Registration

The patient enters the required personal information in the React frontend. The frontend sends the details to the backend, which validates and saves the record in MySQL.

### Step 2: Doctor Selection

The frontend retrieves available doctor information through the backend API and displays the doctor details for selection.

### Step 3: Appointment Booking

The patient selects a doctor, appointment date, appointment time, and enters the appointment reason. The React application sends the appointment details to Spring Boot, which processes and stores the appointment.

### Step 4: Queue Token Generation

After an eligible appointment is created, the queue token generation API can be called with the appointment ID. The service checks eligibility and prevents duplicate token generation for the same appointment. It then creates and saves the token.

Example token sequence:

```text
A-001
A-002
A-003
A-004
```

### Step 5: Patient Queue Tracking

The patient enters their appointment ID in the tracking interface. The frontend calls the queue tracking API, and the backend retrieves the associated queue details and returns the tracking response.

### Step 6: Queue Status Updates

Hospital staff can update the token status as the patient progresses through the queue.

```text
WAITING
   |
   v
IN_PROGRESS
   |
   v
COMPLETED
```

A token may also be marked `CANCELLED` when applicable, according to the implemented business rules.

### Step 7: Waiting-Time Estimation

The application uses queue position and consultation duration information to estimate patient waiting time. The estimate is dependent on available queue data and the calculation implemented in the backend; it is not a guaranteed consultation time.

## 10. REST API Endpoints

The following queue endpoints match the `QueueTokenController` implemented during development.

**Base URL:** `http://localhost:8080`

| Method | Endpoint                                    | Description                |
| ------ | ------------------------------------------- | -------------------------- |
| `POST` | `/api/queue/generate/{appointmentId}`       | Generate a queue token     |
| `GET`  | `/api/queue/date/{date}`                    | Retrieve tokens for a date |
| `GET`  | `/api/queue/{id}`                           | Retrieve a token by ID     |
| `GET`  | `/api/queue/track/{appointmentId}`          | Track a patient's queue    |
| `PUT`  | `/api/queue/{id}/status?status=IN_PROGRESS` | Update token status        |

### Example API Requests

**Generate a queue token**

```http
POST http://localhost:8080/api/queue/generate/1
```

**Get queue tokens by date**

```http
GET http://localhost:8080/api/queue/date/2026-09-29
```

**Get a queue token by ID**

```http
GET http://localhost:8080/api/queue/1
```

**Track a patient's queue**

```http
GET http://localhost:8080/api/queue/track/1
```

**Update token status**

```http
PUT http://localhost:8080/api/queue/1/status?status=IN_PROGRESS
```

The status update endpoint uses `PUT`, not `PATCH`, and requires no JSON request body because the status is passed as a query parameter.

### Other API Modules

The application also includes patient, doctor, and appointment functionality. Add the exact endpoint paths from your respective controllers before publishing this README, rather than assuming their routes.

## 11. Project Structure

The following is a representative structure for the application. Adjust the component and file names to match your actual repository.

```text
MediQueue/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Patient/
│   │   │   ├── Doctor/
│   │   │   ├── Appointment/
│   │   │   └── Queue/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/hospital/queue/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repo/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       └── DemoApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── .gitignore
└── README.md
```

## 12. Installation and Setup

### Prerequisites

Install the following software:

* Java Development Kit (JDK) 17
* Node.js and npm
* MySQL Server
* MySQL Workbench (optional, for database inspection)
* Spring Tool Suite (STS) or another Java IDE
* Visual Studio Code
* Postman
* Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MediQueue.git
cd MediQueue
```

Replace `YOUR_USERNAME` with your GitHub username and use the actual repository URL.

### Step 2: Create the MySQL Database

Open MySQL Workbench or the MySQL command line and execute:

```sql
CREATE DATABASE hospital_db;
```

### Step 3: Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure the database connection in `src/main/resources/application.properties` or the corresponding configuration file.

Set the database username and password as environment variables:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

Use your own local credentials. Do not commit them to GitHub.

### Step 4: Run the Spring Boot Backend

Using STS:

1. Import the backend project as an existing Maven project.
2. Wait for Maven dependencies to download.
3. Configure the required database environment variables.
4. Run `DemoApplication.java` as a Spring Boot application.
5. Confirm that the application starts on port `8080` and connects to MySQL.

Alternatively, if Maven is available:

```bash
mvn spring-boot:run
```

### Step 5: Run the React Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, commonly:

```text
http://localhost:5173
```

Use the exact URL displayed in your terminal, since the port may differ.

### Step 6: Verify the Application

1. Ensure the MySQL server is running.
2. Start the Spring Boot backend.
3. Start the React frontend.
4. Open the Vite local URL in your browser.
5. Test patient registration and doctor information.
6. Book an appointment.
7. Generate a queue token.
8. Track the appointment using its ID.
9. Test queue status updates.
10. Verify that the records are saved in MySQL.

## 13. Configuration

### Backend

| Setting         | Example          |
| --------------- | ---------------- |
| Server port     | `8080`           |
| Database        | `hospital_db`    |
| Database server | `localhost:3306` |
| Java version    | `17`             |
| Build tool      | Maven            |
| ORM             | Hibernate        |
| Persistence     | Spring Data JPA  |

### Frontend

| Setting            | Example                     |
| ------------------ | --------------------------- |
| Framework          | React.js                    |
| Development server | Vite                        |
| Development port   | `5173` (may vary)           |
| API base URL       | `http://localhost:8080/api` |
| HTTP client        | Axios                       |

Ensure the backend CORS configuration permits the actual frontend origin displayed by Vite. For production, configure the deployed frontend domain instead of allowing local development origins.

## 14. Testing with Postman

Postman is used to test the backend REST APIs independently of the React frontend.

### Testing Sequence

1. Retrieve or create a patient.
2. Retrieve or create a doctor.
3. Create an appointment using valid patient and doctor IDs.
4. Generate a queue token for the appointment.
5. Retrieve the generated token.
6. Track the patient queue using the appointment ID.
7. Update the token status using a `PUT` request.
8. Retrieve queue tokens for a selected date.

### Expected Results

| Test                    | Expected result                              |
| ----------------------- | -------------------------------------------- |
| Patient API             | Patient details returned or saved            |
| Doctor API              | Doctor details returned or saved             |
| Appointment API         | Appointment created and retrievable          |
| Token generation        | Token created for an eligible appointment    |
| Duplicate token request | Existing token not duplicated                |
| Queue tracking          | Token and queue tracking details returned    |
| Status update           | Token status updated if the request is valid |
| Date-based queue lookup | Tokens for the requested date returned       |

Actual HTTP status codes and response structures depend on the controller and service implementation.

## 15. Advantages

* **Convenient appointment booking:** Patients can submit appointment details through a web interface.
* **Organized queue handling:** Queue tokens provide an ordered way to track patients.
* **Patient queue visibility:** Patients can check their queue information using an appointment ID.
* **Centralized data storage:** Patient, doctor, appointment, and queue information is stored in MySQL.
* **Modular backend:** Controller, service, repository, entity, and DTO layers separate application responsibilities.
* **Frontend-backend integration:** React communicates with Spring Boot using REST APIs.
* **Maintainable design:** The layered structure supports future feature development.
* **Reduced manual coordination:** Digital appointment and token handling can reduce some repetitive administrative tasks.

## 16. Future Enhancements

The following are possible future improvements and should not be considered completed features unless implemented:

* Secure patient and staff authentication with role-based access.
* Email or SMS appointment confirmations and reminders.
* Automatic queue refresh or live notifications.
* Doctor availability and appointment-slot management.
* Appointment cancellation and rescheduling.
* Admin analytics and reporting dashboard.
* Search and filtering for patients, doctors, and appointments.
* Improved audit logs and access controls.
* Deployment to a cloud hosting platform.
* Automated backend and frontend testing.

## 17. Author

**Shruti Subhash Kumbhar**

**Project:** MediQueue – Smart Hospital Appointment & Patient Tracking

**Technologies:** React.js, Java, Spring Boot, Spring Data JPA, Hibernate, REST APIs, MySQL

**GitHub:** [Shruti87888](https://github.com/Shruti87888)

**LinkedIn:** [Shruti Kumbhar](https://www.linkedin.com/in/shruti-kumbhar-baa49a27a/)

