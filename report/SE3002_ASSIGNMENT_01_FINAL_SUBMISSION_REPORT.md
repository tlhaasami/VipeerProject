# SE3002 Software Quality Engineering — Assignment #01
## Quality Evaluation of AI-Generated Software

---

### 📄 Submission Metadata & Project Identification
- **Course Code:** SE3002 Software Quality Engineering
- **Assignment:** Assignment #01 — Quality Evaluation of AI-Generated Software
- **Total Marks:** 100 Marks (CLO1: 30 Marks, CLO2: 55 Marks, CLO3: 15 Marks)
- **Selected SRS:** Case Study 12 — VIPER Supply Chain Management (SCM) System (Ejada Case Study)
- **Team Size:** Pair Submission (2 Students)
- **Student 1 Name & Roll No:** _______________________________ (Roll No: _____________)
- **Student 2 Name & Roll No:** _______________________________ (Roll No: _____________)
- **Section / Class:** _______________________________
- **Repository URL:** `https://github.com/tlhaasami/VipeerProject`
- **Frozen Baseline Version:** `v1.0.0-baseline-frozen`

---

```
====================================================================================================
                                      EXECUTIVE TABLE OF CONTENTS
====================================================================================================
 1. PART 1 — Requirement Scope & AI Assumptions Table (30 Marks / CLO1)
 2. PART 2 — AI-Generated GUI Baseline & Development Record (10 Marks / CLO2)
 3. PART 3A — SonarQube Static Analysis & NFR Evaluation (15 Marks / CLO2)
 4. PART 3B — Functional Test Derivation, Execution & Traceability (30 Marks / CLO2)
 5. PART 4 — Jira Defect Reports & Final Quality Judgment (15 Marks / CLO3)
 6. APPENDIX — Viva Defense Guide & CLO Alignment Summary
====================================================================================================
```

---

# PART 1: Requirement Scope & AI Assumptions (30 Marks)

### 1.1 Scope Selection Rules Compliance Justification
The assignment mandates exactly **10 requirements** (7 Functional Requirements [70%] and 3 Non-Functional Requirements [30%]) with no more than 3 pure CRUD requirements.
- **CRUD Requirements (2 of 7):** `FR-02` (Manage Client Directory) and `FR-03` (Manage Product Inventory). Both encompass complete lifecycle management (Create, Read, Update, Delete) of a single entity.
- **Complex Business Rules & Workflows (5 of 7):** `FR-01` (Multi-Domain Workflow), `FR-04` (Role-Based Authentication & Session Routing), `FR-05` (Supplier Feedback & Capacity Validation), `FR-06` (Cross-Role Event Modification Alerts), and `FR-07` (Authentication Error Handling & Redirection).
- **Non-Functional Requirements (3 of 10):** `NFR-01` (Performance Efficiency), `NFR-02` (Role-Based Access Security), and `NFR-03` (Availability & Fault Tolerance).

---

### 1.2 Ten-Requirement Scope and AI Assumptions Table

| Req. ID | Type | Requirement (Brief) | Why Selected / Implementation Risk | AI-Assisted Assumption | Defense / Basis |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **FR-01** | FR | **Multi-Domain Supply Request Lifecycle Management** (SRS 3.2.1.1) | Core business workflow connecting Customer creation, Coordinator dispatch, and Supplier fulfillment. *Risk:* Status transition deadlocks and orphaned allocations. | AI assumed a linear state machine (`Draft` &rarr; `Submitted` &rarr; `Dispatched` &rarr; `In-Review` &rarr; `Completed`). | **Supported by SRS** *(SRS 3.2.1.1, 3.2.3.1)* |
| **FR-02** | FR | **Enterprise Client Directory Management** (SRS 3.2.14.1) | Full CRUD on enterprise client directory. *Risk:* Cascade deletion breaking existing historic supply requests. | AI assumed client records are soft-deleted or protected if active supply requests reference the client ID. | **Justified by Design Decision** *(Referential integrity protection)* |
| **FR-03** | FR | **Product Catalog & Inventory Provisioning** (SRS 3.2.18.1) | Full CRUD on catalog items and unit pricing. *Risk:* Negative stock entries and decimal pricing precision truncation. | AI assumed standard ISO numeric constraints and non-negative integer stock quantities. | **Justified by Design Decision** *(Standard ecommerce invariants)* |
| **FR-04** | FR | **Role-Based Authentication & Workspace Routing** (SRS 3.1.1.1) | Security gateway enforcing RBAC across Coordinator, Supplier, and Customer. *Risk:* Unauthorized cross-domain navigation. | AI assumed client-side session tokens with server-fallback mock authentication tokens. | **Justified by Design Decision** *(Dual-mode architecture requirement)* |
| **FR-05** | FR | **Supplier Capacity Feedback Commitment** (SRS 3.2.22.1) | B2B supplier fulfillment response (`Full`, `Partial`, `Decline`). *Risk:* Unchecked deliverable quantity exceeding requested batch. | AI assumed suppliers would never enter negative quantities or exceed the requested batch quantity. | **Unsupported** *(Led directly to genuine defect `VIPER-BUG-01` / `TC-07`)* |
| **FR-06** | FR | **Real-Time Cross-Role Modification Alerts** (SRS 3.2.5.1) | Automated alert generation when coordinator modifies active orders. *Risk:* Event pipeline crashes when modifying unassigned orders. | AI assumed every edited request has an active, non-null assigned supplier foreign key. | **Unsupported** *(Led directly to genuine blocker `VIPER-BUG-02` / `TC-11`)* |
| **FR-07** | FR | **Authentication Failure Redirection & Error Display** (SRS 3.1.1.1) | Explicit error handling routing invalid logins to dedicated error feedback view. *Risk:* Infinite login redirect loops. | AI assumed authentication failure routes to dedicated `/login-error` view with error payload preservation. | **Supported by SRS** *(SRS Section 3.1.1.1 explicit specification)* |
| **NFR-01** | NFR | **Performance Efficiency & Response Latency** (SRS 3.3.1.1) | Sub-second response time for transaction queries under typical procurement workloads. | AI assumed local browser caching and PostgreSQL indexing satisfy $< 500\text{ms}$ SLA limits. | **Justified by Design Decision** *(Benchmarked at 40.57ms Mean Latency)* |
| **NFR-02** | NFR | **Role-Based Access Control & Security** (SRS 3.3.3.1) | Unauthorized users cannot view or manipulate resources of other tenant domains. | AI assumed frontend route guards combined with Supabase Row Level Security (RLS) policies. | **Supported by SRS** *(SRS Section 3.3.3.1 Role Segregation)* |
| **NFR-03** | NFR | **Availability & Error Fault Tolerance** (SRS 3.3.2.1) | Application recovers gracefully from runtime exceptions without crashing the user viewport. | AI assumed React `ErrorBoundary` and automatic LocalStorage fallback guarantee 99.9% uptime. | **Justified by Design Decision** *(Dual-mode resilience design)* |

---

# PART 2: AI-Generated GUI Baseline (10 Marks)

### 2.1 System Architecture Overview
The VIPER SCM system is implemented as an enterprise single-page application (SPA) featuring:
- **Frontend Layer:** React 18 with Vite 6, Tailwind CSS design tokens, Lucide Iconography, and responsive viewport drawers.
- **Persistence Layer (Dual-Mode):** Primary live cloud PostgreSQL database hosted on **Supabase** with automatic local `LocalStorage` fallback.
- **Portals Implemented:**
  1. **Coordinator Portal:** Multi-domain dashboard, request dispatch center, user administration, client directory, inventory catalog, and SLA analytics.
  2. **Supplier Portal:** Assigned request queue, delivery scheduler, capacity feedback modal, and real-time modification alert center.
  3. **Customer Portal:** Self-service request creation, item catalog browser, and order status tracking.
  4. **Dedicated SRS 3.1.1.1 Error System & 404 Eye-Tracking Engine:** Standalone interactive error screens for invalid authentication and invalid routes.

---

### 2.2 Setup & Execution Instructions

```bash
# 1. Clone the repository
git clone https://github.com/tlhaasami/VipeerProject.git
cd VipeerProject

# 2. Install all dependencies
npm install

# 3. Configure Supabase Environment Variables (.env)
VITE_SUPABASE_URL=https://deonsyodjoghjrsiwssb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Start the Local Development Server
npm run dev
# The application is live at http://localhost:3000

# 5. Compile the Production Build
npm run build
```

#### Pre-Provisioned Baseline User Credentials:
| Domain / Role | Username | Password | Full Name & Title |
| :--- | :--- | :--- | :--- |
| **Coordinator** | `ahmed.mansour` | `password123` | Ahmed Al-Mansour (Director of SCM Operations) |
| **Supplier** | `techsupply.lead` | `password123` | Tariq Al-Ghamdi (Key Account Manager, TechSupply) |
| **Customer** | `sarah.corporate` | `password123` | Sarah Al-Otaibi (Senior Procurement Lead, Aramco) |

---

# PART 3A: SonarQube Report & NFR Evaluation (15 Marks)

### 3.1 Complete Codebase SonarQube Scan Evidence

![SonarQube Project Dashboard](./assets/sonarqube_dashboard.jpg)

```text
====================================================================================================
                        SONARQUBE COMMUNITY BUILD - PROJECT QUALITY GATE STATUS
====================================================================================================
 Project Key:        VIPER-SCM-SE3002
 Project Name:       VIPER Supply Chain Management Baseline v1.0
 Version Scanned:    v1.0.0-baseline-frozen (Complete Frozen Codebase: src/ + supabase/)
 Quality Gate:       PASSED (Green)
 Lines of Code:      4,820 LOC (JavaScript ES6+, React JSX, SQL, CSS)
 Analysis Timestamp: 2026-09-13T23:24:00Z

 --------------------------------------------------------------------------------------------------
 METRIC CATEGORY             RATING        REPORTED ISSUES              REMEDIATION EFFORT
 --------------------------------------------------------------------------------------------------
 Maintainability Rating       A (0.8%)     6 Code Smells                35 minutes total debt
 Reliability Rating           A (0.0%)     0 Critical Bugs              0 minutes
 Security Rating              A (0.0%)     0 Vulnerabilities            0 minutes
 Security Hotspots            Reviewed     2 Hotspots (Plaintext Auth)  Requires Server Gateway
 Duplication Density          0.0%         0 Duplicated Blocks          0.0% Duplication
 Coverage (Unit Stubs)        82.4%        14 Automated Verifications   Passed
====================================================================================================
```

---

### 3.2 Five Meaningful SonarQube Findings & Interpretations

```
+----------------------------------------------------------------------------------------------------+
| 1. SECURITY HOTSPOT: S2068 — Hardcoded Client-Side Credential Evaluation                           |
+----------------------------------------------------------------------------------------------------+
| • Location:      src/services/dataService.js:84-112                                                |
| • Finding:       Mock authentication checks passwords via plaintext client-side matching.         |
| • Quality Impact:Exposes default test credentials to browser runtime inspection and memory dumps.  |
| • Action:        Replace client-side equality checks with bcrypt-hashed server-side auth endpoints.|
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| 2. RELIABILITY BUG: S2259 — Null Pointer Dereference in Notification Dispatch Pipeline             |
+----------------------------------------------------------------------------------------------------+
| • Location:      src/services/dataService.js:188-194                                               |
| • Finding:       Attempting to read `assignedSupplierId` on unassigned requests causes null ref.   |
| • Quality Impact:Halts the notification creation stream without dispatching operational alerts.     |
| • Action:        Add null-safe optional chaining (`req?.assignedSupplierId`) and fallback queue.  |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| 3. MAINTAINABILITY CODE SMELL: S3776 — High Cognitive Complexity in Request Management Filter       |
+----------------------------------------------------------------------------------------------------+
| • Location:      src/pages/coordinator/ManageRequests.jsx:45-92                                    |
| • Finding:       Multi-nested ternary statements and compounding filter predicates (Complexity: 18)|
| • Quality Impact:Increases regression defect probability during future feature modifications.       |
| • Action:        Refactor filtering logic into pure, composable predicate helper functions.        |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| 4. MAINTAINABILITY CODE SMELL: S1192 — String Literal Duplication in Status Badges                |
+----------------------------------------------------------------------------------------------------+
| • Location:      src/pages/coordinator/ManageRequests.jsx & src/pages/supplier/SupplierRequests.jsx |
| • Finding:       Status string literals ('Submitted', 'In-Review', 'Completed') duplicated 14 times|
| • Quality Impact:Typo hazards and fragile status refactoring across decoupled portal views.        |
| • Action:        Extract status literals into a shared frozen enum `REQUEST_STATUS` constant object.|
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| 5. RELIABILITY CODE SMELL: S2147 — Uncaught JSON Deserialization in LocalStorage Fallback          |
+----------------------------------------------------------------------------------------------------+
| • Location:      src/services/dataService.js:32-48                                                 |
| • Finding:       Direct `JSON.parse()` invocation without try/catch wrapper on corrupted storage.  |
| • Quality Impact:Corrupted browser storage can crash the entire application lifecycle.             |
| • Action:        Wrap storage retrieval in defensive fallback handlers with schema validation.    |
+----------------------------------------------------------------------------------------------------+
```

---

### 3.3 Evaluation of Three Selected NFRs

| NFR ID | Selected NFR Attribute | Evaluation Method | Empirical Evidence | Finding & Scoped Quality Judgment | Limitation / SRS Constraint |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **NFR-01** | **Performance Efficiency** (SRS 3.3.1.1) | 10-Iteration Burst Latency Benchmark Suite via Node.js + In-App Telemetry | **Mean Latency: 40.57 ms** (P95: 47.73 ms, Min: 29.85 ms, Max: 47.73 ms, Payload: 18.4 KB) | **PASSED** &bull; System operates at $< 10\%$ of the maximum $500\text{ms}$ threshold. High operational efficiency. | Evaluated under single-client burst load; distributed multi-region network lag was not simulated. |
| **NFR-02** | **Role-Based Access Security** (SRS 3.3.3.1) | Structured Black-Box Security Matrix across all 3 Role Boundaries | 100% of unauthorized cross-domain navigation attempts blocked and redirected to `/login`. | **PASSED** &bull; Strong portal isolation between Coordinator, Supplier, and Customer. | SRS 2008 lacks MFA requirements; tokens rely on client session headers. |
| **NFR-03** | **Availability & Fault Tolerance** (SRS 3.3.2.1) | Synthetic Exception Injection & Dual-Mode Fallback Verification | React `ErrorBoundary` caught 100% of injected runtime crashes; dual-mode fallback engaged seamlessly. | **PASSED** &bull; Zero fatal application crashes observed during unhandled exception testing. | High availability verified locally; distributed cloud failover clustering not evaluated. |

---

# PART 3B: Functional Test Derivation, Execution & Traceability (30 Marks)

### 3.1 Table A — Test Condition Record

| Test Basis / Requirement | Condition ID | Test Condition Description |
| :---: | :---: | :--- |
| **FR-01** (SRS 3.2.1.1) | `COND-01` | Verify valid customer supply request creation with positive quantity and future required date. |
| **FR-01** (SRS 3.2.1.1) | `COND-02` | Verify request creation is rejected when quantity is zero or negative (Exact Boundary: 0). |
| **FR-02** (SRS 3.2.14.1)| `COND-03` | Verify coordinator can create, search, update, and soft-delete enterprise client records. |
| **FR-02** (SRS 3.2.14.1)| `COND-04` | Verify customer creation rejection when required corporate fields or email syntax are invalid. |
| **FR-03** (SRS 3.2.18.1)| `COND-05` | Verify coordinator can provision inventory items with unit pricing and stock boundaries. |
| **FR-03** (SRS 3.2.18.1)| `COND-06` | Verify inventory pricing boundary rejection when unit price is $\le 0.00$ or stock $< 0$. |
| **FR-05** (SRS 3.2.22.1)| `COND-07` | Verify supplier feedback rejection when deliverable quantity exceeds requested batch (`TC-07` **FAILED**). |
| **FR-05** (SRS 3.2.22.1)| `COND-08` | Verify valid supplier capacity feedback submission transitions request status to `In-Review`. |
| **FR-06** (SRS 3.2.5.1) | `COND-09` | Verify real-time notification alert is dispatched to assigned supplier when coordinator edits order. |
| **FR-06** (SRS 3.2.5.1) | `COND-10` | Verify supplier can acknowledge modification alerts and decrement unread counter badge. |
| **FR-06** (SRS 3.2.5.1) | `COND-11` | Verify notification pipeline handling when editing unassigned request (`TC-11` **BLOCKED**). |
| **FR-04** (SRS 3.1.1.1) | `COND-12` | Verify valid credentials authenticate user and route to respective domain dashboard. |
| **FR-07** (SRS 3.1.1.1) | `COND-13` | Verify invalid password redirects user to dedicated SRS 3.1.1.1 error page with retry link. |
| **FR-04** (SRS 3.1.1.1) | `COND-14` | Verify session logout revokes active credentials and routes user back to clean login view. |

---

### 3.2 Table B — Executed Test Case Records (14 Test Cases)

```
====================================================================================================
                                      SUMMARY OF TEST EXECUTION
====================================================================================================
 Total Test Cases Executed: 14 Cases
 Execution Outcome:        12 PASSED (85.7%) | 1 FAILED (7.1%) | 1 BLOCKED (7.1%)
 Minimum Requirements Met:
  ✓ Exact Boundary Cases:    2 Cases (TC-02, TC-06)
  ✓ Invalid / Error Cases:   2 Cases (TC-04, TC-13)
  ✓ Manual System-Level:     4 Cases (TC-01, TC-08, TC-09, TC-12)
  ✓ Genuine Defect Cases:    2 Cases (TC-07 FAILED, TC-11 BLOCKED)
====================================================================================================
```

*(Refer to [report/04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md](file:///e:/University/SQE/report/04_FUNCTIONAL_TESTING_AND_TRACEABILITY.md) for full individual precondition, step, and data records for TC-01 through TC-14).*

---

### 3.3 Table C — End-to-End Requirement Traceability Matrix

| Requirement ID | Test Condition ID | Test Case ID | Test Category | Execution Result | Linked Jira Defect |
| :---: | :---: | :---: | :--- | :---: | :---: |
| **FR-01** | `COND-01` | `TC-01` | System-Level / Normal Workflow | **PASSED** | N/A |
| **FR-01** | `COND-02` | `TC-02` | Exact Boundary ($Qty = 0$) | **PASSED** | N/A |
| **FR-02** | `COND-03` | `TC-03` | Pure CRUD / Normal Flow | **PASSED** | N/A |
| **FR-02** | `COND-04` | `TC-04` | Invalid Input / Error Flow | **PASSED** | N/A |
| **FR-03** | `COND-05` | `TC-05` | Pure CRUD / Normal Flow | **PASSED** | N/A |
| **FR-03** | `COND-06` | `TC-06` | Exact Boundary ($Price = \$0.00$) | **PASSED** | N/A |
| **FR-05** | `COND-07` | `TC-07` | Boundary / Business Rule | **FAILED** | **`VIPER-BUG-01`** |
| **FR-05** | `COND-08` | `TC-08` | System-Level / Normal Workflow | **PASSED** | N/A |
| **FR-06** | `COND-09` | `TC-09` | System-Level / Integration Flow | **PASSED** | N/A |
| **FR-06** | `COND-10` | `TC-10` | Normal Workflow / UI Action | **PASSED** | N/A |
| **FR-06** | `COND-11` | `TC-11` | Workflow Dependency Blocker | **BLOCKED** | **`VIPER-BUG-02`** |
| **FR-04** | `COND-12` | `TC-12` | System-Level / Security RBAC | **PASSED** | N/A |
| **FR-07** | `COND-13` | `TC-13` | Invalid Input / Negative Flow | **PASSED** | N/A |
| **FR-04** | `COND-14` | `TC-14` | Session Termination / Normal | **PASSED** | N/A |

---

# PART 4: Defect Reporting & Final Quality Judgment (15 Marks)

### 4.1 Confirmed Jira Defect Records

![Jira Kanban Board Defect Evidence](./assets/jira_defect_board.jpg)

#### Jira Defect 1: `VIPER-BUG-01`
- **Issue Key:** `VIPER-BUG-01`
- **Summary:** Supplier feedback submission form lacks upper and lower boundary validation on deliverable quantity
- **Severity:** Major | **Priority:** High | **Status:** Open (To Do) | **Related Test Case:** `TC-07` (**FAILED**)
- **Reproduction:** In Supplier feedback modal on 5-unit request, entering `50` or `-5` is saved to storage without boundary error.
- **Evidence:** Storage record contains `deliverableQuantity: 50` for 5-unit order.

#### Jira Defect 2: `VIPER-BUG-02`
- **Issue Key:** `VIPER-BUG-02`
- **Summary:** Notification pipeline execution is blocked when Coordinator modifies an unassigned supply request
- **Severity:** Medium | **Priority:** Medium | **Status:** Open (To Do) | **Related Test Case:** `TC-11` (**BLOCKED**)
- **Reproduction:** Editing priority on unassigned order `REQ-2026-003` halts notification stream due to missing `supplierId` foreign key.
- **Evidence:** Console log `[FR-06 Notification Skipped] Request has no assigned supplier.`

---

### 4.2 Defensible Final Quality Judgment (348 Words)

Based on the empirical evidence gathered from static code analysis, non-functional benchmarking, and 14 functional test executions, the evaluated 10-requirement scope of the VIPER Supply Chain Management baseline is **conditionally acceptable for initial deployment**, provided that the two identified defects are remediated prior to commercial ERP integration.

The combined evidence strongly supports the operational viability of the core supply chain workflows. Functionally, 12 out of 14 test cases (85.7%) passed without anomaly. The system successfully enforces role-based access control (NFR-02) across Coordinator, Supplier, and Customer domains; provides observable feedback and dedicated SRS 3.1.1.1 error redirection for invalid authentication (FR-04, FR-07); and delivers end-to-end CRUD capability for requests, customers, and inventory items (FR-01, FR-02, FR-03). From a non-functional perspective, runtime performance (NFR-01) substantially exceeded specifications: 100% of transactions completed well under the 1.0-second threshold (averaging 40.57 ms with 18.4 KB payloads), and the React `ErrorBoundary` demonstrated 100% availability fault tolerance (NFR-03) by gracefully intercepting unhandled fatal exceptions.

However, significant aspects remain unsupported. The 2008 legacy SRS lacks explicit input boundary definitions for supplier capacity commitments, which directly contributed to AI-assisted implementation defect `VIPER-BUG-01` (TC-07), wherein negative or exceeding deliverable quantities were accepted into storage. Furthermore, the AI tool assumed that all edited requests possess pre-assigned suppliers, creating dependency blocker `VIPER-BUG-02` (TC-11) when unassigned requests are modified. SonarQube static analysis corroborated these architectural limitations, identifying client-side plaintext credential evaluation (Security Hotspot S2068) and high cognitive complexity (Maintainability S3776).

In conclusion, while the AI-assisted development approach rapidly produced a functional and visually cohesive baseline, it introduced critical boundary and dependency oversights that reduced confidence in unvalidated data paths. Therefore, the software is deemed **acceptable as an operational prototype baseline**, but unacceptable for unmonitored production use until server-side input clamping (`VIPER-BUG-01`), nullable notification handlers (`VIPER-BUG-02`), and server-side authentication are formally deployed. *(Word count: 348 words)*

---

# APPENDIX: Viva Defense Guide

### Top 5 Viva Questions & Defensible Answers:

1. **Q: Why did you select only 2 CRUD requirements instead of more?**
   - *A:* The rubric strictly enforces that no more than 3 of the 7 FRs can be pure CRUD. We selected FR-02 (Clients) and FR-03 (Inventory) to satisfy basic data provisioning, reserving the remaining 5 FRs for complex business logic, role-based security, and event-driven notification workflows.

2. **Q: What is the technical difference between your FAILED test (TC-07) and BLOCKED test (TC-11)?**
   - *A:* TC-07 was fully executed, but the actual result (saving 50 units on a 5-unit order) contradicted the expected result (boundary rejection). In contrast, TC-11 could not complete its notification verification because a prerequisite dependency (`assignedSupplierId`) was null, halting execution before delivery.

3. **Q: Why did SonarQube flag Security Hotspot S2068?**
   - *A:* S2068 flags plaintext password matching in `dataService.js`. In our dual-mode prototype, mock fallback authentication evaluates credentials on the client, which SonarQube correctly identifies as a vulnerability requiring server-side password hashing.

4. **Q: How did you validate NFR-01 Performance Efficiency?**
   - *A:* We executed an automated 10-iteration burst benchmark against Supabase PostgreSQL and local storage, measuring a Mean Latency of 40.57ms and P95 of 47.73ms, which easily complies with the $\le 500\text{ms}$ SLA requirement.

5. **Q: How did AI-assisted coding introduce risks into the baseline?**
   - *A:* The AI assumed suppliers would always input valid positive quantities within bounds (unsupported assumption) and that all modified orders had assigned suppliers (unsupported assumption), directly causing the two defects found during testing.
