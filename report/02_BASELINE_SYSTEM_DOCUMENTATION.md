# SE3002 Quality Evaluation - Part 2: Baseline System Documentation

**Course:** SE3002 Software Quality Engineering  
**Project:** VIPER Supply Chain Management (SCM) System  
**Evaluation Standard:** SE3002 Assignment #01 Rubric (CLO2 - K3 Apply)  
**Baseline Status:** **FROZEN BASELINE v1.0** (Code Freeze active for quality evaluation)  

---

## 1. System Architecture Overview

The VIPER SCM system is architected as a modern, high-performance web application designed to fulfill the 10 scoped requirements from the 2008 Ejada VIPER SRS.

```
+-----------------------------------------------------------------------------+
|                          VIPER SCM Web Application                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [Presentation Layer]                                                       |
|  ├── React 18 + Vite 6 Single-Page Application (SPA)                        |
|  ├── Tailwind CSS Responsive Glassmorphism Design System                    |
|  ├── Lucide Modern Enterprise Iconography                                   |
|  └── Role-Specific Views (Coordinator, Supplier, Customer Portals)          |
|                                                                             |
|  [Business Logic & Diagnostics Layer]                                       |
|  ├── AuthContext (Domain Authentication, Session Management, RBAC Guards)   |
|  ├── ErrorBoundary (NFR-03 Fault Interception & Recovery Component)         |
|  ├── PerformanceMonitor (NFR-01 Millisecond Latency & 100-Op Benchmark)     |
|  └── ToastNotification Engine (Real-time User Action Feedback)              |
|                                                                             |
|  [Unified Data Access Layer (dataService.js)]                               |
|  ├── CRUD Modules: Requests (FR-01), Customers (FR-02), Items (FR-03)       |
|  ├── Workflow Modules: Feedback (FR-05), Notifications (FR-06)              |
|  └── Real-time Transaction Telemetry & Execution Logging                    |
|                                                                             |
|  [Dual-Mode Persistence Layer]                                              |
|  ├── Mode A (Offline Fallback): In-Browser LocalStorage + Seed Data Engine  |
|  └── Mode B (Live Cloud): Supabase PostgreSQL Client (Row-Level Security)   |
+-----------------------------------------------------------------------------+
```

---

## 2. Technology Stack Justification

| Technology Component | Selection | Engineering Rationale |
|---|---|---|
| **Core Framework** | **React 18 (Vite 6)** | High rendering performance, component reusability, instant Hot Module Replacement (HMR), and predictable unidirectional state flow. |
| **Styling & UI Design** | **Tailwind CSS 3.4** | Utility-first CSS providing a responsive design matching enterprise ERP standards without heavy third-party UI framework lock-in. |
| **Icons & Visual Language**| **Lucide Icons** | Clean, accessible vector icons for clear workflow affordances (status indicators, domain badges, priority badges). |
| **Database (Dual-Mode)** | **Supabase (PostgreSQL) + LocalStorage Fallback** | **Zero-Configuration Runnability:** The application works instantly out-of-the-box using the seeded LocalStorage engine without requiring database credentials, while seamlessly connecting to a live Supabase PostgreSQL database whenever `.env` variables are supplied. |
| **Quality & NFR Tooling** | **Custom Performance Monitor + ErrorBoundary** | Native instrumentation directly measuring transaction execution times in milliseconds, payload sizes in KB (SRS 3.3), and runtime error interception (SRS 3.6.2). |

---

## 3. Setup and Run Instructions

### 3.1 Prerequisites
- **Node.js:** Version `18.x` or higher (tested on Node `v24.18.1`).
- **npm:** Version `9.x` or higher (tested on npm `11.16.0`).
- **Web Browser:** Any modern Chromium, Firefox, or WebKit browser.

### 3.2 Step-by-Step Installation & Execution

1. **Navigate to the Project Root Directory:**
   ```powershell
   cd "e:\University\SQE"
   ```

2. **Install Project Dependencies:**
   ```powershell
   npm install
   ```

3. **Start the Development Server:**
   ```powershell
   npm run dev
   ```

4. **Access the Application in Your Browser:**
   Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

5. **(Optional) Configure Live Supabase Cloud Database:**
   If you wish to connect to a live Supabase project rather than the built-in offline engine:
   - Copy `.env.example` to `.env`:
     ```powershell
     cp .env.example .env
     ```
   - Enter your Supabase project credentials in `.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-public-key
     ```
   - Execute `supabase/schema.sql` in the Supabase SQL Editor to generate the PostgreSQL tables and RLS policies.

---

## 4. Default Test Accounts (Pre-Seeded)

The baseline includes pre-configured test credentials for all three VIPER SRS domains:

| Role / Domain | Username | Password | Assigned Domain | Associated Profile / Capabilities |
|---|---|---|---|---|
| **Coordinator** | `coordinator` | `admin123` | `coordinator` | SCM Operations Coordinator (Full CRUD on Requests, Customers, Items, Supplier Assignment) |
| **Supplier** | `supplier1` | `supp123` | `supplier` | TechCorp Hardware Solutions (Assigned Requests, Submit Feedback, View Modification Alerts) |
| **Customer** | `customer1` | `cust123` | `customer` | Ejada IT Enterprise (Submit New Supply Requests, View Request Status) |

---

## 5. AI-Assisted Development Record & Prompts

### 5.1 Development Tooling & Approach
The baseline was synthesized using an AI-assisted vibe-coding approach with Anthropic / Google DeepMind reasoning models. The development strategy followed a strict 4-phase prompt pipeline:

1. **Phase 1 (SRS Analysis & Domain Modeling):**
   - *Prompt Goal:* Ingest `2008 - viper.doc`, extract all use cases, identify entity relationships (Coordinator, Customer, Supplier, Item, Request, Feedback, Notification), and structure the 7 FR / 3 NFR matrix.
2. **Phase 2 (Architecture & Dual-Mode Data Layer):**
   - *Prompt Goal:* Build a modular React + Vite architecture with a resilient dual-mode persistence layer (`supabaseClient.js` + `dataService.js`) ensuring complete offline standalone functionality with seeded Ejada ERP records.
3. **Phase 3 (Role Portals & Interactive Workflows):**
   - *Prompt Goal:* Implement Coordinator (CRUD Requests, Customers, Items), Supplier (Feedback submission, Notification inbox), Customer (Create requests), and Authentication (Domain routing & dedicated SRS 3.1.1.1 error page).
4. **Phase 4 (NFR Instrumentation & Diagnostics):**
   - *Prompt Goal:* Embed live transaction telemetry measuring execution latencies against the 1.0s / 50KB threshold (SRS 3.3) and React `ErrorBoundary` with a forced crash test for SRS 3.6.2 availability validation.

---

## 6. Code Freeze Declaration

> [!IMPORTANT]
> **Baseline Code Freeze Notice:**  
> The codebase in this repository represents the **Frozen Baseline Version 1.0**.  
> In strict accordance with SE3002 Assignment #01 rules (Part 2), this exact codebase has been preserved without retroactive patching to allow authentic quality evaluation, static analysis via SonarQube, functional test execution, and reproducible Jira defect logging.
