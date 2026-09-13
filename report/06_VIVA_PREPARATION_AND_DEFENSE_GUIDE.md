# SE3002 Quality Engineering - Viva & Demo Defense Guide

**Course:** SE3002 Software Quality Engineering  
**Purpose:** Comprehensive Oral Defense Guide for Demo Evaluation & Marks Retention  
**Project:** VIPER Supply Chain Management (SCM) Baseline System  

---

## 1. Requirement Scope & Selection Defense (Part 1 - 30 Marks)

### Q1: Why did you choose these specific 7 Functional Requirements? How does your selection comply with the assignment CRUD rule?
**Defensible Answer:**
> "The assignment strictly limits pure CRUD entities to **at most 3 out of the 7 FRs**. We selected:
> 1. **FR-01 (Manage Requests):** Pure CRUD Entity #1 (Add, View, Edit, Delete supply requests).
> 2. **FR-02 (Manage Customers):** Pure CRUD Entity #2 (Add, View, Edit, Delete corporate clients).
> 3. **FR-03 (Manage Items):** Pure CRUD Entity #3 (Add, View, Edit, Delete catalog hardware/services).
> 
> The remaining 4 Functional Requirements represent critical non-CRUD business rules and workflows:
> 4. **FR-04 (Domain Authentication & Routing):** Enforces multi-role login and domain portal redirection (SRS 3.1.1.1).
> 5. **FR-05 (Supplier Feedback Workflow):** B2B workflow where suppliers inspect requests and commit fulfillment capacity and delivery timeframe (SRS 3.2.22.1).
> 6. **FR-06 (Request Modification Notifications):** Cross-role automated communication dispatching real-time alerts to suppliers on request modifications (SRS 3.2.5.1).
> 7. **FR-07 (Invalid Login Error Handling):** Security & UX business rule directing invalid logins to a dedicated error page with `[ Try again ]` navigation (SRS 3.1.1.1)."

---

### Q2: How do you defend your AI-assisted assumptions? Which ones are unsupported?
**Defensible Answer:**
> "We classified every assumption into three defensible categories:
> - **Supported by SRS:** FR-01, FR-03, FR-04, FR-07, NFR-01, NFR-02, and NFR-03 are directly substantiated by explicit SRS sections and sequence diagrams.
> - **Justified by Design Decisions:** FR-02 (enforcing referential integrity when deleting customers) and FR-06 (implementing an in-app reactive notification store because the 2008 SRS left the channel as *'not yet determined'*).
> - **Unsupported / AI Implementation Gap:** In **FR-05**, the AI code generator omitted upper/lower boundary validation on supplier deliverable quantities. Rather than hiding this gap or patching it post-freeze, we preserved it to provide an authentic test failure (**TC-07 / VIPER-BUG-01**)."

---

## 2. Baseline Architecture & Dual-Mode Data Layer (Part 2 - 10 Marks)

### Q3: How is your application built, and how does the database layer work?
**Defensible Answer:**
> "We built a modern React 18 SPA with Vite and Tailwind CSS. The persistence architecture is **Dual-Mode**:
> - **Default Offline Mode:** Uses a robust in-browser LocalStorage engine pre-seeded with realistic Ejada SCM data (Customers, Items, Requests, Suppliers, Feedbacks, Notifications, and Audit Logs). This guarantees **100% zero-configuration runnability** for any examiner or peer.
> - **Live Supabase Mode:** When `.env` credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are provided, the system seamlessly interfaces with a cloud Supabase PostgreSQL database using our provided SQL schema (`supabase/schema.sql`)."

---

## 3. SonarQube Findings & NFR Evaluation (Part 3A - 15 Marks)

### Q4: Explain the SonarQube findings you analyzed. Why do ratings alone not equal quality interpretation?
**Defensible Answer:**
> "Raw ratings or Quality Gate passes can create a false sense of security. While SonarQube 9.9.8 gave our 8,207 LOC codebase a PASSED Quality Gate with A ratings, we deeply analyzed 5 distinct technical findings:
> 1. **Security Hotspot (S2068):** Hardcoded plaintext passwords in `mockData.js:7,16,26` evaluated client-side in the prototype fallback.
> 2. **Security Hotspot (S2245):** Usage of predictable pseudorandom number generator `Math.random()` for transaction identifiers in `dataService.js:72`.
> 3. **Maintainability / Complexity (S3776):** High Cognitive Complexity (score: 24 vs 15 threshold) in `ManageRequests.jsx` and `ManageUsers.jsx` due to combined filter predicates and state branching.
> 4. **Maintainability / Code Style (S3358):** Nested ternary operators in status badge rendering.
> 5. **Maintainability / Code Smells (S1128 & S1854):** Unused imports and dead store variables adding unnecessary bundle overhead."

---

### Q5: How did you evaluate the 3 NFRs when SonarQube cannot measure runtime metrics?
**Defensible Answer:**
> "We recognized that static code analysis cannot evaluate runtime latency or fault tolerance. We applied targeted empirical evaluation methods:
> - **NFR-01 (Performance Efficiency):** We executed an automated 10-iteration continuous burst benchmark against the backend. **100% of transactions completed well under the 500ms SLA, averaging 40.57 ms** (P95: 47.73 ms) with 18.4 KB payloads.
> - **NFR-02 (Security RBAC):** We conducted structural code inspection and route-level session verification in `AuthContext`, confirming that Suppliers and Customers cannot access Coordinator controls.
> - **NFR-03 (Availability & Fault Tolerance):** We executed a synthetic exception test via the React `ErrorBoundary`, proving that unhandled runtime exceptions are intercepted with user-friendly recovery UI rather than crashing the browser tab."

---

## 4. Test Execution, Traceability & Jira Defects (Part 3B & 4 - 45 Marks)

### Q6: Walk us through your FAILED (`TC-07`) and BLOCKED (`TC-11`) test cases. How do you defend that these are genuine?
**Defensible Answer:**
> "We did not manufacture or relabel passed tests. Both cases represent authentic baseline behaviors:
> 1. **TC-07 (FAILED - FR-05 Boundary Defect):** We tested submitting a supplier feedback commitment of `50 units` on a request requiring only `5 units` (and tested `-5 units`). The SRS requires stating deliverable capacity, but the baseline accepted the input without validation error, producing a genuine `actual != expected` failure (**Jira Bug: `SCRUM-7` / `VIPER-BUG-01`**).
> 2. **TC-11 (BLOCKED - FR-06 Dependency Blocker):** When a coordinator edits an unassigned request (`REQ-2026-003` where `assignedSupplierId` is null), the notification pipeline cannot dispatch the alert because the prerequisite entity linkage (`supplierId`) is missing. The test could not verify notification delivery because the prerequisite dependency prevented execution (**Jira Bug: `SCRUM-8` / `VIPER-BUG-02`**)."

---

### Q7: What is the difference between a Test Execution Status and a Jira Defect?
**Defensible Answer:**
> "A **Test Execution Status** (`PASSED`, `FAILED`, `BLOCKED`, `NOT EXECUTED`) is an empirical observation of test step execution.  
> A **Jira Defect** is a formally investigated, confirmed, and reproducible software flaw. Not every test failure is an implementation bug—failures can stem from incorrect test data, flawed test scripts, or environment outages. We investigated all failures before logging only confirmed, reproducible implementation bugs in Jira."

---

### Q8: What is your final conclusion on the software quality?
**Defensible Answer:**
> "Based on 14 test executions, NFR telemetry, and SonarQube analysis, the baseline is **conditionally acceptable as an operational prototype**, but requires two mandatory fixes before commercial release:
> 1. Input range validation on supplier feedback quantity (`SCRUM-7`).
> 2. Nullable supplier handling in the notification pipeline (`SCRUM-8`).
> With 85.7% functional pass rate and 100% performance/availability compliance, the core workflow is solid and defensible."
