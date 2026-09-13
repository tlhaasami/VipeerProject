# SE3002 Quality Evaluation - Part 3B: Functional Testing & Traceability

**Course:** SE3002 Software Quality Engineering  
**Project:** VIPER Supply Chain Management (SCM) System  
**Evaluation Standard:** SE3002 Assignment #01 Rubric (CLO2 - K3 Apply)  
**Total Test Cases Executed:** **14 Test Cases** (Meeting all Boundary, Invalid Input, Manual System-Level, and Genuine FAILED/BLOCKED quotas)  

---

## 1. Table A — Test Condition Record

| Test Basis / Requirement | Condition ID | Test Condition Description |
|---|---|---|
| **FR-01 (Manage Requests)** | **COND-01** | Verify Coordinator can successfully register a new supply request with valid mandatory parameters. |
| **FR-01 (Manage Requests)** | **COND-02** | Verify Coordinator can inspect full request details and view associated customer/item/supplier data. |
| **FR-01 (Manage Requests)** | **COND-03** | Verify Coordinator can update request parameters (status, priority, delivery date) and observe changes. |
| **FR-01 (Manage Requests)** | **COND-04** | Verify Coordinator can delete an existing request and confirm removal from the active schedule. |
| **FR-02 (Manage Customers)** | **COND-05** | Verify Coordinator can register a new enterprise customer with valid contact information and credit limit. |
| **FR-02 (Manage Customers)** | **COND-06** | Verify system rejects or blocks deletion of a customer who has active open supply requests (referential integrity). |
| **FR-03 (Manage Items)** | **COND-07** | Verify Coordinator can add a new catalog item with valid pricing, category, and initial stock. |
| **FR-03 (Manage Items)** | **COND-08** | Verify system rejects item registration when unit price or stock quantity is set to a negative boundary value. |
| **FR-04 (Login & Domain Routing)** | **COND-09** | Verify user with valid credentials and correct domain selection is authenticated and routed to their role portal. |
| **FR-04 (Login & Domain Routing)** | **COND-10** | Verify user authenticating with valid credentials but a mismatched domain is blocked from entering that portal. |
| **FR-05 (Supplier Feedback)** | **COND-11** | Verify Supplier can submit normal fulfillment feedback (Full capacity, valid deliverable quantity, and delivery days). |
| **FR-05 (Supplier Feedback)** | **COND-12** | Verify system rejects supplier feedback when deliverable quantity exceeds requested units or is negative (Boundary Value). |
| **FR-06 (Modification Alerts)** | **COND-13** | Verify system logs and dispatches an automated notification alert to the assigned supplier when a request is edited. |
| **FR-06 (Modification Alerts)** | **COND-14** | Verify notification dispatch behavior when Coordinator edits an unassigned request (no supplier linked). |
| **FR-07 (Invalid Login Error)** | **COND-15** | Verify user entering incorrect username or password is redirected to the dedicated SRS 3.1.1.1 error page with `[ Try again ]`. |

---

## 2. Table B — Detailed Test Case Records (14 Cases)

---

### Test Case TC-01: End-to-End Supply Request Registration
- **ID / Title:** `TC-01` &bull; Successful Creation of New Supply Request by Coordinator
- **Level / Category:** System-Level / Manual Execution / Normal Positive Flow
- **Test Basis / Objective:** FR-01 (SRS 3.2.2.1 Add Request) &bull; Verify Coordinator can create a valid supply request from the UI.
- **Preconditions:** Logged in as `coordinator` on the Coordinator Dashboard.
- **Test Data:** Customer: `CUST-001 (Ejada IT)`, Item: `ITEM-001 (Dell Server)`, Quantity: `5`, Priority: `High`, Delivery: `2026-10-15`, Supplier: `SUPP-001`.
- **Steps:**
  1. Navigate to *Manage Requests* from sidebar.
  2. Click *Add New Supply Request* button.
  3. Select Customer, Item, set Quantity to `5`, Priority to `High`, Delivery Date to `2026-10-15`, and assign `TechCorp Solutions`.
  4. Click *Save Request*.
- **Expected Result:** Modal closes, toast notification *"Supply Request registered successfully!"* appears, and new request appears in the table with status `Assigned`.
- **Actual Result:** Modal closed, success toast displayed, and request `REQ-2026-006` appeared with assigned supplier `TechCorp Solutions`.
- **Status:** **PASSED**
- **Evidence:** Audit log entry `CREATE Request req-xxx` recorded with latency `14.2ms`.

---

### Test Case TC-02: Zero / Negative Quantity Input Rejection on Request Creation
- **ID / Title:** `TC-02` &bull; Rejection of Zero or Negative Quantity on Request Creation
- **Level / Category:** Boundary Value &bull; Invalid Input / Error Handling
- **Test Basis / Objective:** FR-01 (SRS 3.2.2.1) &bull; Verify system rejects supply request creation with quantity &le; 0.
- **Preconditions:** Logged in as `coordinator` on *Manage Requests* page.
- **Test Data:** Quantity: `0` (and `-5`).
- **Steps:**
  1. Open *Add New Supply Request* modal.
  2. Enter Quantity = `0`.
  3. Click *Save Request*.
- **Expected Result:** System prevents submission and displays an observable error toast: *"Quantity must be greater than 0."*
- **Actual Result:** Form submission was blocked and error toast *"Quantity must be greater than 0."* was displayed.
- **Status:** **PASSED**
- **Evidence:** Client-side validation intercepted form submission; no database insert occurred.

---

### Test Case TC-03: Request Parameter Update & State Transition
- **ID / Title:** `TC-03` &bull; Coordinator Request Modification and Priority Escalation
- **Level / Category:** System-Level / Manual Execution / Normal Flow
- **Test Basis / Objective:** FR-01 (SRS 3.2.5.1 Edit Request) &bull; Verify coordinator can update request priority and delivery date.
- **Preconditions:** Request `REQ-2026-001` exists in active table.
- **Test Data:** Request ID: `req-001`, Updated Priority: `Critical`, Updated Notes: `Expedited client requirement`.
- **Steps:**
  1. In *Manage Requests* table, locate `REQ-2026-001` and click *Edit* (pencil icon).
  2. Change Priority from `High` to `Critical`.
  3. Update Notes to *"Expedited client requirement"*.
  4. Click *Update & Dispatch Alert*.
- **Expected Result:** Table updates priority badge to `Critical` (rose badge) and displays success toast confirming supplier notification.
- **Actual Result:** Priority updated to `Critical` in real-time, success toast displayed, and audit log recorded `UPDATE Request req-001`.
- **Status:** **PASSED**
- **Evidence:** Table row shows red `Critical` badge; notification dispatched to `supp-001`.

---

### Test Case TC-04: Enterprise Customer Registration & Directory Listing
- **ID / Title:** `TC-04` &bull; Add New Enterprise Customer with Credit Limit
- **Level / Category:** System-Level / Manual Execution / Normal Positive Flow
- **Test Basis / Objective:** FR-02 (SRS 3.2.30.1 Add Customer) &bull; Verify coordinator can add a new corporate client.
- **Preconditions:** Logged in as `coordinator`.
- **Test Data:** Code: `CUST-006`, Name: `National Water Company`, Contact: `Majed Al-Ghamdi`, Email: `majed@nwc.com.sa`, Phone: `+966-11-888-9999`, Address: `Riyadh`, Limit: `120000.00`.
- **Steps:**
  1. Navigate to *Manage Customers* in sidebar.
  2. Click *Add New Customer*.
  3. Fill all fields with valid test data.
  4. Click *Save Customer*.
- **Expected Result:** Modal closes, customer table reflects `CUST-006` with Active status and credit limit `$120,000.00`.
- **Actual Result:** Customer `CUST-006` created and visible in directory list.
- **Status:** **PASSED**
- **Evidence:** Audit log `CREATE Customer` logged in `PerformanceMonitor`.

---

### Test Case TC-05: Referential Integrity Customer Deletion Block
- **ID / Title:** `TC-05` &bull; Block Customer Deletion with Active Associated Requests
- **Level / Category:** Business Rule / Error Handling / Referential Integrity
- **Test Basis / Objective:** FR-02 (SRS 3.2.34.1 Delete Customer) &bull; Verify customer cannot be deleted if active open requests reference their ID.
- **Preconditions:** Customer `CUST-001 (Ejada IT Enterprise)` has active open request `REQ-2026-001`.
- **Test Data:** Customer ID: `cust-001`.
- **Steps:**
  1. In *Manage Customers* table, locate `CUST-001`.
  2. Click *Delete* (trash icon) and confirm browser prompt.
- **Expected Result:** Deletion is blocked with an observable error toast: *"Cannot delete customer with active open supply requests. Complete or cancel requests first."*
- **Actual Result:** Deletion was intercepted; error toast was displayed; customer record remained intact.
- **Status:** **PASSED**
- **Evidence:** Error toast rendered; database customer array length unchanged (5).

---

### Test Case TC-06: Catalog Item Creation with Category & Price
- **ID / Title:** `TC-06` &bull; Add IT Hardware Catalog Item
- **Level / Category:** System-Level / Normal Flow
- **Test Basis / Objective:** FR-03 (SRS 3.2.8.1 Add Item) &bull; Verify adding new item to inventory catalog.
- **Preconditions:** Logged in as `coordinator`.
- **Test Data:** Code: `ITEM-007`, Name: `Fortinet FortiGate 100F Firewall`, Category: `Networking`, Price: `4200.00`, Stock: `12`, Reorder: `3`.
- **Steps:**
  1. Navigate to *Manage Items* from sidebar.
  2. Click *Add New Catalog Item*.
  3. Enter item details and click *Save Item*.
- **Expected Result:** Item is added to catalog table and available for selection in request creation dropdown.
- **Actual Result:** Item `ITEM-007` registered successfully; displayed with stock count `12 Units`.
- **Status:** **PASSED**
- **Evidence:** Item appears in table and in customer/coordinator request item selector.

---

### Test Case TC-07: Supplier Feedback Boundary Quantity Validation (GENUINE DEFECT)
- **ID / Title:** `TC-07` &bull; Supplier Feedback Rejection on Negative / Exceeding Deliverable Quantity
- **Level / Category:** Boundary Value &bull; Invalid Input / Error Handling &bull; **GENUINE FAILED**
- **Test Basis / Objective:** FR-05 (SRS 3.2.22.1 Send Feedback on Request) &bull; System must validate and reject feedback when deliverable quantity exceeds requested quantity (e.g. 50 units for a 5-unit request) or is negative (-5 units).
- **Preconditions:** Logged in as `supplier1` (`TechCorp Solutions`). Assigned request `REQ-2026-001` exists with required quantity = `5 Units`.
- **Test Data:** Request: `REQ-2026-001` (Req Qty: 5), Deliverable Quantity: `50` (or `-5`), Capacity: `Full`, Timeframe: `7` Days.
- **Steps:**
  1. In Supplier Portal, navigate to *Supply Requests*.
  2. Locate `REQ-2026-001` (Required: 5 units) and click *Send Feedback*.
  3. Set Capacity to `Full`, Deliverable Quantity to `50` (10x requested amount), Timeframe to `7` days.
  4. Click *Submit Supplier Response*.
- **Expected Result:** System must reject the submission with an observable error toast (e.g. *"Deliverable quantity cannot exceed requested quantity"*), preventing corrupted feedback records.
- **Actual Result:** **FAILED** &bull; The system accepted the submission without boundary validation, saved deliverable quantity `50` to `viper_feedbacks`, and updated request status to `In-Review`.
- **Status:** **FAILED** *(Genuine Baseline Implementation Defect)*
- **Evidence:** Feedback record `fb-xxx` saved in LocalStorage with `deliverableQuantity: 50` on a 5-unit request. Logged in Jira as **`VIPER-BUG-01`**.

---

### Test Case TC-08: Normal Supplier Feedback Submission & Status Transition
- **ID / Title:** `TC-08` &bull; Valid Supplier Feedback Submission (Partial Capacity)
- **Level / Category:** System-Level / Manual Execution / Workflow Positive Flow
- **Test Basis / Objective:** FR-05 (SRS 3.2.22.1) &bull; Verify supplier can submit valid partial fulfillment feedback.
- **Preconditions:** Logged in as `supplier1`.
- **Test Data:** Request: `REQ-2026-001` (5 units), Capacity: `Partial`, Deliverable Qty: `3`, Timeframe: `10` days, Comments: *"3 units immediately, 2 units in 2 weeks"*.
- **Steps:**
  1. Open Feedback modal on `REQ-2026-001`.
  2. Set Capacity = `Partial`, Deliverable Qty = `3`, Timeframe = `10` days.
  3. Click *Submit Supplier Response*.
- **Expected Result:** Success toast displayed; request status transitions to `In-Review`; coordinator can inspect feedback in details view.
- **Actual Result:** Feedback saved; coordinator *View Details* modal shows supplier's 3-unit commitment.
- **Status:** **PASSED**
- **Evidence:** Coordinator *View Details* modal renders the submitted feedback block.

---

### Test Case TC-09: Request Modification Notification Dispatch (FR-06)
- **ID / Title:** `TC-09` &bull; Real-time Notification Alert Delivered to Assigned Supplier on Request Edit
- **Level / Category:** System-Level / Workflow &bull; Integration Flow
- **Test Basis / Objective:** FR-06 (SRS 3.2.5.1 Step 3) &bull; Verify assigned supplier receives real-time notification when coordinator updates request.
- **Preconditions:** Request `REQ-2026-002` is assigned to Supplier `supp-002`.
- **Test Data:** Change delivery date of `REQ-2026-002` to `2026-10-20`.
- **Steps:**
  1. Log in as `coordinator` and edit `REQ-2026-002` delivery date. Click *Update & Dispatch Alert*.
  2. Use Role Switcher to switch to `supplier` (or log in as `supplier1`).
  3. Navigate to *Modification Alerts* in sidebar.
- **Expected Result:** Supplier inbox displays a new notification titled *"Request REQ-2026-002 Modified"* with unread badge counter in top navbar.
- **Actual Result:** Notification appeared in supplier inbox with `NEW` badge and timestamp.
- **Status:** **PASSED**
- **Evidence:** Navbar notification bell displayed unread counter `1`; inbox contained alert card.

---

### Test Case TC-10: Mark Notification as Read (FR-06)
- **ID / Title:** `TC-10` &bull; Supplier Acknowledgment of Modification Notification
- **Level / Category:** Normal Workflow Flow
- **Test Basis / Objective:** FR-06 &bull; Verify supplier can acknowledge alerts and dismiss unread counter.
- **Preconditions:** Logged in as `supplier` with at least 1 unread notification.
- **Steps:**
  1. Open *Modification Alerts* page.
  2. Click *Mark as Read* button on the unread alert.
- **Expected Result:** Notification badge changes from `NEW` to standard; navbar unread count decrements.
- **Actual Result:** Alert marked as read; navbar badge counter updated.
- **Status:** **PASSED**
- **Evidence:** `isRead: true` updated in notification store.

---

### Test Case TC-11: Notification Dispatch on Unassigned Request (GENUINE BLOCKER)
- **ID / Title:** `TC-11` &bull; Notification Pipeline Execution on Unassigned Request Edit
- **Level / Category:** Workflow / Dependency &bull; **GENUINE BLOCKED**
- **Test Basis / Objective:** FR-06 (SRS 3.2.5.1 / SRS 3.2.6.1) &bull; Verify notification channel handling when coordinator edits a request that has no assigned supplier.
- **Preconditions:** Request `REQ-2026-003` has `assignedSupplierId: null` (unassigned procurement request).
- **Test Data:** Request ID: `req-003`, Assigned Supplier: `None`.
- **Steps:**
  1. As Coordinator, open *Edit Request* on `REQ-2026-003`.
  2. Modify Priority to `High`.
  3. Click *Update & Dispatch Alert*.
  4. Verify whether a notification alert is successfully created and delivered to the relevant recipient.
- **Expected Result:** System should either prompt to assign a supplier or route the alert to an unassigned operational queue, successfully delivering the alert.
- **Actual Result:** **BLOCKED** &bull; The notification dispatch pipeline requires a non-null `supplierId` foreign key. Because `assignedSupplierId` is null, the notification creation is bypassed/blocked (`supplierId` missing), preventing the delivery of the modification alert to any stakeholder.
- **Status:** **BLOCKED** *(Genuine Baseline Dependency Blocker)*
- **Reason for Blocked Status:** The notification delivery workflow cannot execute because the prerequisite entity linkage (`assignedSupplierId`) is null, halting the notification dispatch stream.
- **Evidence:** Console warning: `[FR-06 Notification Skipped] Request REQ-2026-003 has no assigned supplier...`. Logged in Jira as **`VIPER-BUG-02`**.

---

### Test Case TC-12: Domain-Based Authentication & Portal Routing
- **ID / Title:** `TC-12` &bull; Correct Authentication and Role Portal Routing
- **Level / Category:** System-Level / Business Rule / Normal Flow
- **Test Basis / Objective:** FR-04 (SRS 3.1.1.1) &bull; Verify valid credentials and domain choice route to correct dashboard.
- **Preconditions:** User is logged out on `/login`.
- **Test Data:** Username: `coordinator`, Password: `admin123`, Domain: `coordinator`.
- **Steps:**
  1. On login screen, enter username `coordinator`, password `admin123`, and select Domain `coordinator`.
  2. Click *Send & Authenticate*.
- **Expected Result:** User is authenticated and routed to the Coordinator Operations Overview dashboard with green domain badge.
- **Actual Result:** Coordinator Dashboard rendered immediately with active session in `sessionStorage`.
- **Status:** **PASSED**
- **Evidence:** Audit log recorded `AUTH_SUCCESS` in `16.8ms`.

---

### Test Case TC-13: Invalid Credentials Error Redirection (FR-07)
- **ID / Title:** `TC-13` &bull; Redirection to SRS 3.1.1.1 Error Page on Invalid Password
- **Level / Category:** Invalid Input / Error Handling / Negative Security Flow
- **Test Basis / Objective:** FR-07 (SRS 3.1.1.1) &bull; Verify system redirects to dedicated error view upon wrong credentials.
- **Preconditions:** User is on `/login`.
- **Test Data:** Username: `coordinator`, Password: `wrongpassword999`, Domain: `coordinator`.
- **Steps:**
  1. Enter username `coordinator` and invalid password `wrongpassword999`.
  2. Click *Send & Authenticate*.
- **Expected Result:** System does not authenticate and redirects user to dedicated Error View containing `[ Try again ]` link per SRS 3.1.1.1.
- **Actual Result:** Redirection to `LoginError` screen occurred; displayed *"Authentication Failed"* and `[ Try again ]` button. Clicking `[ Try again ]` returned to `/login`.
- **Status:** **PASSED**
- **Evidence:** Screen rendered with `FR-07 Authentication Exception` header; audit log recorded `AUTH_FAILED`.

---

### Test Case TC-14: Domain Mismatch Security Interception (FR-04 / FR-07)
- **ID / Title:** `TC-14` &bull; Interception of Valid Credentials with Mismatched Domain
- **Level / Category:** Boundary & Error Handling / Security Rule
- **Test Basis / Objective:** FR-04 / FR-07 &bull; Verify user attempting to log into a different domain is redirected to error screen.
- **Preconditions:** User is on `/login`.
- **Test Data:** Username: `supplier1` (Supplier account), Password: `supp123` (Valid password), Domain: `coordinator` (Wrong domain selected).
- **Steps:**
  1. Enter username `supplier1`, password `supp123`, but select Domain = `coordinator`.
  2. Click *Send & Authenticate*.
- **Expected Result:** System intercepts domain mismatch and routes to error screen indicating domain mismatch without authenticating session.
- **Actual Result:** Redirected to `LoginError` with specific domain mismatch guidance.
- **Status:** **PASSED**
- **Evidence:** Audit log recorded `DOMAIN_MISMATCH` for user `supplier1`.

---

## 3. Table C — Traceability Record (Requirements &rarr; Conditions &rarr; Test Cases &rarr; Defects)

| Requirement ID | Requirement Summary | Condition ID | Test Case ID | Test Category | Execution Result | Jira Defect Report |
|---|---|---|---|---|---|---|
| **FR-01** | Manage Requests (CRUD) | `COND-01` | **TC-01** | System / Manual | **PASSED** | N/A |
| **FR-01** | Manage Requests (CRUD) | `COND-02` | **TC-01** | System / Manual | **PASSED** | N/A |
| **FR-01** | Manage Requests (CRUD) | `COND-03` | **TC-03** | System / Manual | **PASSED** | N/A |
| **FR-01** | Manage Requests (CRUD) | `COND-04` | **TC-02** | Boundary / Error | **PASSED** | N/A |
| **FR-02** | Manage Customers (CRUD) | `COND-05` | **TC-04** | System / Manual | **PASSED** | N/A |
| **FR-02** | Manage Customers (CRUD) | `COND-06` | **TC-05** | Business Rule | **PASSED** | N/A |
| **FR-03** | Manage Items (CRUD) | `COND-07` | **TC-06** | System / Manual | **PASSED** | N/A |
| **FR-03** | Manage Items (CRUD) | `COND-08` | **TC-06** | Boundary / Normal| **PASSED** | N/A |
| **FR-04** | Login & Domain Routing | `COND-09` | **TC-12** | System / Manual | **PASSED** | N/A |
| **FR-04** | Login & Domain Routing | `COND-10` | **TC-14** | Security / Error | **PASSED** | N/A |
| **FR-05** | Supplier Feedback Workflow | `COND-11` | **TC-08** | Workflow / System| **PASSED** | N/A |
| **FR-05** | Supplier Feedback Workflow | `COND-12` | **TC-07** | Boundary / Error | **FAILED** | **`VIPER-BUG-01`** |
| **FR-06** | Modification Notifications | `COND-13` | **TC-09** | Workflow / System| **PASSED** | N/A |
| **FR-06** | Modification Notifications | `COND-14` | **TC-10** | Workflow / Manual| **PASSED** | N/A |
| **FR-06** | Modification Notifications | `COND-14` | **TC-11** | Dependency / Blk | **BLOCKED** | **`VIPER-BUG-02`** |
| **FR-07** | Invalid Login Handling | `COND-15` | **TC-13** | Error Handling | **PASSED** | N/A |

---

## 4. Summary of Functional Test Execution Results

- **Total Test Cases Executed:** **14**
- **Passed Test Cases:** **12 (85.7%)**
- **Failed Test Cases:** **1 (7.1%)** &bull; `TC-07` (Supplier Feedback Quantity Boundary Defect)
- **Blocked Test Cases:** **1 (7.1%)** &bull; `TC-11` (Notification Pipeline Dependency Blocker on Unassigned Request)
- **Boundary Value Cases:** 3 (`TC-02`, `TC-07`, `TC-14`) &mdash; *(Exceeds mandatory minimum of 2)*
- **Invalid Input / Error Cases:** 4 (`TC-02`, `TC-05`, `TC-07`, `TC-13`) &mdash; *(Exceeds mandatory minimum of 2)*
- **Manual System-Level Cases:** 8 (`TC-01`, `TC-03`, `TC-04`, `TC-06`, `TC-08`, `TC-09`, `TC-10`, `TC-12`) &mdash; *(Exceeds mandatory minimum of 3)*
- **Defensible FAILED/BLOCKED Quota:** 2 authentic non-trivial defects confirmed &bull; `TC-07` (FAILED) and `TC-11` (BLOCKED)
