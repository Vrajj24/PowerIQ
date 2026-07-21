# ⚡ PowerIQ

**PowerIQ** is a comprehensive, full-stack Smart Home Energy Management System. It tracks live power draw, detects anomalous high-load devices, projects estimated utility bills, and provides historical data analysis using a responsive, modern dashboard.

## 🚀 Features

- **Live Telemetry & Dashboard:** Real-time web socket connections deliver instant updates on active power draw, active device counts, and daily/monthly summaries.
- **Smart Device Management:** Add, configure, toggle, and delete household devices. Devices have contextual data including rooms and real-time wattage.
- **Advanced Energy Analytics:** Visualize historical power consumption trends with granular "Today," "7-Day", and "30-Day" interactive charts.
- **Automated Alerting Engine:** Real-time push notifications warn you if high-load devices (like HVACs) exceed predefined efficiency thresholds.
- **Reporting & Exporting:** Instantly generate and download CSV usage reports directly to your computer.
- **Authentication & Security:** Fully secured endpoints with JWT-based Spring Security. File-based H2 database ensures your user and device data persist.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite) with TypeScript
- Tailwind CSS for sleek, responsive styling
- Recharts for data visualization
- Axios for API requests
- Context API for global state management
- Lucide React for modern iconography

**Backend:**
- Java 17 & Spring Boot 3
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- H2 Database (File-based for persistence)
- WebSockets (`STOMP`) for real-time telemetry

## 📋 Prerequisites

To run PowerIQ locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16+)
- [Java Development Kit (JDK) 17](https://adoptium.net/)
- Docker & Docker Compose (optional, for containerized backend)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Vrajj24/PowerIQ.git
cd PowerIQ
```

### 2. Start the Backend (Spring Boot)
The backend is completely containerized. You can run it via Docker:
```bash
cd backend
docker-compose up -d
```
Alternatively, to run natively via Maven:
```bash
cd backend
./mvnw spring-boot:run
```
*(The backend runs on `http://localhost:8080`. Upon first startup, it will automatically seed the database with mock devices and 30 days of historical data).*

### 3. Start the Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`. Simply navigate to the URL and register an account to get started!).*

## 📖 System Architecture

- **Auth Interceptors:** The React frontend securely attaches JWT tokens to API requests. Response interceptors automatically handle expired sessions by gracefully logging the user out.
- **Data Generator Engine:** A custom Spring Boot `DataInitializer` populates realistic data alongside historical trends to ensure the dashboard has meaningful analytics upon fresh installs.
- **Dynamic Contexts:** The React `DeviceContext` consolidates all data fetching (Telemetry, Devices, Alerts) so the UI components maintain a single source of truth.

## 📜 License
Distributed under the MIT License.
