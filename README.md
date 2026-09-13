# VIPER Supply Chain Management (SCM) System
## SE3002 Software Quality Engineering — Assignment #01

**Course:** SE3002 Software Quality Engineering  
**Institution:** King Fahd University of Petroleum & Minerals (KFUPM) / Ejada Case Study  
**Total Marks:** 100 Marks (CLO1, CLO2, CLO3)  
**Baseline Status:** **FROZEN BASELINE v1.0** (Code freeze active for formal quality evaluation)  

---

## 📌 Executive Summary

This repository contains the complete Software Quality Engineering implementation and formal evaluation suite for the **VIPER Supply Chain Management (SCM) System** based on the 2008 Ejada SCM SRS specification.

The project encompasses:
1. **Interactive Web Application (React 18 + Vite 6 + Tailwind CSS):** Implements all 10 scoped requirements across Coordinator, Supplier, and Customer domains with a zero-configuration **Dual-Mode Data Layer (Supabase PostgreSQL + LocalStorage Fallback)**.
2. **Quality Telemetry & Diagnostics:** Embedded real-time transaction latency tracker (<1.0s / 50KB constraint per SRS 3.3) and React `ErrorBoundary` with fatal error recovery (SRS 3.6.2).
3. **Comprehensive Quality Engineering Reports (`report/` folder):** All four assignment deliverables, 14 executed test cases, SonarQube interpretations, Jira defect tickets, and a 300–400 word final quality judgment.
4. **Viva & Demo Oral Defense Guide:** In-depth defense rationale for pairing evaluations.

---

## 📂 Repository Structure

```
e:/University/SQE/
├── report/                                  # Comprehensive SE3002 Quality Reports Suite
│   ├── 01_REQUIREMENTS_AND_ASSUMPTIONS.md   # Part 1: 7 FR + 3 NFR Table & AI Assumptions (30 Marks)
│   ├── 02_BASELINE_SYSTEM_DOCUMENTATION.md  # Part 2: Architecture, Dual-Mode Store & Run Guide (10 Marks)
│   ├── 03_SONARQUBE_ANALYSIS_AND_NFR_EVALUATION.md # Part 3A: SonarQube 5 Findings & NFR Evidence (15 Marks)
│   ├── 04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md   # Part 3B: Tables A, B (14 TCs), and C Matrix (30 Marks)
│   ├── 05_JIRA_DEFECT_REPORTS_AND_QUALITY_JUDGMENT.md # Part 4: Jira Bug Export & 350-word Judgment (15 Marks)
│   ├── 06_VIVA_PREPARATION_AND_DEFENSE_GUIDE.md    # Viva & Demo Question/Answer Defense Cheatsheet
│   └── SONARQUBE_SCANNER_PROMPT.md          # SonarQube Scanner Setup & Execution Prompt
├── src/                                     # Application Source Code (Frozen Baseline v1.0)
│   ├── components/                          # Navbar, Sidebar, PerformanceMonitor, ErrorBoundary, Toast
│   ├── context/                             # AuthContext (Domain session & RBAC route guards)
│   ├── pages/                               # Login, LoginError, Coordinator, Supplier, Customer Portals
│   ├── services/                            # dataService.js, supabaseClient.js, mockData.js
│   ├── App.jsx                              # Main App Component
│   ├── main.jsx                             # React DOM Entrypoint
│   └── index.css                            # Tailwind CSS Design System Directives
├── supabase/
│   └── schema.sql                           # Full PostgreSQL DDL Schema with RLS Policies & Indexes
├── sonar-project.properties                 # SonarQube / SonarCloud Scanner Configuration
├── package.json                             # Dependencies & Scripts
├── vite.config.js                           # Vite Bundler Configuration
├── tailwind.config.js                       # Tailwind Styling Palette
└── README.md                                # Project Documentation (This File)
```

---

## 🚀 Quick Start & Setup Instructions

### 1. Prerequisites
- **Node.js:** `v18.x` or higher (verified on `v24.18.1`).
- **npm:** `v9.x` or higher (verified on `11.16.0`).

### 2. Run the Application Locally
```powershell
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000/
```

### 3. Pre-Configured Test Accounts (Viva & Demo Evaluation)

| Role / Domain | Username | Password | Domain Selection | Features & Access Scope |
|---|---|---|---|---|
| **Coordinator** | `coordinator` | `admin123` | `coordinator` | SCM Operations: Manage Requests, Customers, Items, Assign Suppliers |
| **Supplier** | `supplier1` | `supp123` | `supplier` | Partner Portal: View Assigned Requests, Submit Feedback, View Alerts |
| **Customer** | `customer1` | `cust123` | `customer` | Client Portal: Submit New Supply Requests, Track Request Status |

> **Viva Demo Tip:** Use the **Role Switcher** in the top navbar to instantly change roles without logging in and out during the viva!

---

## 🎯 Scoped Requirements Overview (7 FRs + 3 NFRs)

| Req ID | Type | Requirement Summary | Classification |
|---|---|---|---|
| **FR-01** | FR | **Manage Requests:** Coordinator can create, view, edit, and delete supply requests. | CRUD Entity (1/3) |
| **FR-02** | FR | **Manage Customers:** Coordinator can create, view, edit, and delete customer profiles. | CRUD Entity (2/3) |
| **FR-03** | FR | **Manage Items:** Coordinator can create, view, filter by category, and update catalog items. | CRUD Entity (3/3) |
| **FR-04** | FR | **Domain Routing:** Authenticate users and direct them to Coordinator, Supplier, or Customer portals. | Business Rule / Routing |
| **FR-05** | FR | **Supplier Feedback:** Suppliers inspect requests and submit fulfillment capacity and timeframe. | Business Workflow |
| **FR-06** | FR | **Modification Alerts:** Real-time notifications dispatched to suppliers when requests are edited/deleted. | Workflow / Interaction |
| **FR-07** | FR | **Invalid Login Error:** Directs invalid credentials or domain mismatches to dedicated SRS 3.1.1.1 error page. | Error Handling / Security |
| **NFR-01** | NFR | **Performance & Concurrency:** 90% of transactions < 1.0s; support 100 concurrent operations; payloads &le; 50 KB. | Performance |
| **NFR-02** | NFR | **Role-Based Access Control:** Strict domain boundary enforcement preventing unauthorized cross-domain actions. | Security |
| **NFR-03** | NFR | **High Availability:** 100% uptime with graceful, user-friendly error recovery screens upon fatal runtime errors. | Availability / Resilience |

---

## 🧪 Testing & Defect Summary

- **Total Test Cases Executed:** **14 Test Cases** ([Read Full Test Case Log](file:///e:/University/SQE/report/04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md))
- **Passed Cases:** 12 (85.7%)
- **Genuine Failed Defect (TC-07):** `VIPER-BUG-01` &bull; Supplier feedback form lacks upper/lower boundary validation on deliverable quantities.
- **Genuine Blocked Defect (TC-11):** `VIPER-BUG-02` &bull; Notification pipeline fails to dispatch update alerts when a modified request has no assigned supplier (`null` reference blocker).
- **Jira Bug Tickets:** Formatted in [`report/05_JIRA_DEFECT_REPORTS_AND_QUALITY_JUDGMENT.md`](file:///e:/University/SQE/report/05_JIRA_DEFECT_REPORTS_AND_QUALITY_JUDGMENT.md).

---

## 📊 Complete Reports Index

1. [`report/01_REQUIREMENTS_AND_ASSUMPTIONS.md`](file:///e:/University/SQE/report/01_REQUIREMENTS_AND_ASSUMPTIONS.md) — 7 FR / 3 NFR Selection Table, Rationale, and AI Assumptions.
2. [`report/02_BASELINE_SYSTEM_DOCUMENTATION.md`](file:///e:/University/SQE/report/02_BASELINE_SYSTEM_DOCUMENTATION.md) — Architecture, Dual-Mode Persistence, and Run Instructions.
3. [`report/03_SONARQUBE_ANALYSIS_AND_NFR_EVALUATION.md`](file:///e:/University/SQE/report/03_SONARQUBE_ANALYSIS_AND_NFR_EVALUATION.md) — SonarQube 5 Findings Interpretation and NFR Evaluation.
4. [`report/04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md`](file:///e:/University/SQE/report/04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md) — Tables A, B (14 Detailed Test Cases), and Table C Traceability Matrix.
5. [`report/05_JIRA_DEFECT_REPORTS_AND_QUALITY_JUDGMENT.md`](file:///e:/University/SQE/report/05_JIRA_DEFECT_REPORTS_AND_QUALITY_JUDGMENT.md) — Standardized Jira Bug Tickets and 350-word Defensible Final Judgment.
6. [`report/06_VIVA_PREPARATION_AND_DEFENSE_GUIDE.md`](file:///e:/University/SQE/report/06_VIVA_PREPARATION_AND_DEFENSE_GUIDE.md) — Oral Viva & Demo Defense Q&A Cheatsheet.
7. [`report/SONARQUBE_SCANNER_PROMPT.md`](file:///e:/University/SQE/report/SONARQUBE_SCANNER_PROMPT.md) — SonarQube Scanner Setup & Execution Prompt.

---

*Authored for SE3002 Software Quality Engineering &bull; Spring 2026*
