# SE3002 Assignment 01: Evidence Pack for Step 1 (NFR-01) & Step 2 (Jira Defects)

**Course:** SE3002 Software Quality Engineering  
**Project:** VIPER Supply Chain Management (SCM) System  
**Evaluation Standard:** 100-Mark SQE Assignment Rubric  

---

## 🚀 Step 1 Evidence: NFR-01 Performance Efficiency Benchmark Suite

### Empirical Test Execution Output:
```text
===========================================================
 VIPER SCM - NFR-01 PERFORMANCE EFFICIENCY BENCHMARK SUITE
 Target SLA: Mean Latency <= 500ms | Concurrency: 10 cycles
===========================================================

 Cycle #01: Execution Latency = 34.61 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #02: Execution Latency = 45.58 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #03: Execution Latency = 46.14 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #04: Execution Latency = 47.73 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #05: Execution Latency = 29.85 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #06: Execution Latency = 31.50 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #07: Execution Latency = 30.91 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #08: Execution Latency = 46.30 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #09: Execution Latency = 46.01 ms | HTTP 200 OK | Size: 18.4 KB
 Cycle #10: Execution Latency = 47.06 ms | HTTP 200 OK | Size: 18.4 KB

-----------------------------------------------------------
 STATISTICAL TELEMETRY SUMMARY:
 - Iterations Tested:    10 Continuous Query Cycles
 - Mean Latency (avg):   40.57 ms (Threshold <= 500.00 ms)
 - 95th Percentile (P95):47.73 ms
 - Minimum Burst:        29.85 ms
 - Maximum Burst:        47.73 ms
 - SLA Threshold:        <= 500.00 ms
 - Conformance Result:   PASSED (100% SLA Compliance)
-----------------------------------------------------------
```

### Table 3A Evaluation Row for Submission:
| NFR ID | Target Quality Attribute | Evaluation Method | Empirical Evidence | Quality Judgment | Limitation / Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NFR-01** | Performance Efficiency (Response Latency $\le 500\text{ms}$) | 10-Iteration Burst Latency Benchmark via Node.js + In-App Telemetry Engine | **Mean Latency: 40.57 ms** (P95: 47.73 ms, Min: 29.85 ms, Max: 47.73 ms) | **PASSED** &bull; Substantially exceeds the SLA requirement ($< 10\%$ of maximum allowable threshold). | Evaluated under single-client burst load; multi-region distributed network jitter not simulated. |

---

## 📋 Step 2 Evidence: Jira Defect Registry

### Jira Tickets Summary Table:
| Issue Key | Summary / Title | Severity | Priority | Status | Related Test Case | Defect Classification |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **VIPER-BUG-01** | `[FR-05]` Supplier feedback accepts exceeding / negative quantity without validation | **Major** | **High** | `To Do` / `Open` | `TC-07` (**FAILED**) | Implementation Boundary Defect |
| **VIPER-BUG-02** | `[FR-06]` Notification pipeline execution blocked when editing unassigned request | **Medium** | **Medium** | `To Do` / `Open` | `TC-11` (**BLOCKED**) | Architecture Dependency Blocker |

### Complete Jira Ticket Fields:

#### 1. Jira Ticket VIPER-BUG-01
- **Issue Key:** `VIPER-BUG-01`
- **Issue Type:** Bug / Defect
- **Summary:** Supplier feedback submission form lacks upper and lower boundary validation on deliverable quantity
- **Affected Environment / Build:** Web Baseline v1.0 (Frozen Build &bull; Node 24 / React 18 SPA)
- **Component:** Supplier Portal / Feedback Workflow (`FR-05`, `dataService.js`, `SupplierRequests.jsx`)
- **Related Test Case ID:** `TC-07`
- **Severity:** Major
- **Priority:** High
- **Jira Workflow Status:** Open / To Do
- **Reproducibility:** 100% Reproducible (5/5 attempts)
- **Preconditions:**
  1. User is authenticated as a Supplier (`supplier1`).
  2. A supply request exists assigned to this supplier with required quantity = `5 Units` (`REQ-2026-001`).
- **Steps to Reproduce:**
  1. Navigate to *Supply Requests* in the Supplier Portal.
  2. On request `REQ-2026-001`, click the *Send Feedback* button.
  3. In the feedback modal, set Capacity = `Full`.
  4. In the *Deliverable Quantity* input, enter `50` (or `-5`).
  5. Click *Submit Supplier Response*.
- **Expected Result:**
  The system must reject the submission, display an observable error toast (*"Deliverable quantity cannot exceed requested quantity (5 units) or be less than 1"*), and refuse to persist the invalid record.
- **Actual Result:**
  The system accepted the submission without boundary validation, saved deliverable quantity `50` to storage, displayed a success toast, and transitioned the request status to `In-Review`.
- **Supporting Evidence:**
  LocalStorage dump of `viper_feedbacks` shows `{ "requestId": "req-001", "deliverableQuantity": 50, "capacity": "Full" }` for a request requiring only 5 units.

---

#### 2. Jira Ticket VIPER-BUG-02
- **Issue Key:** `VIPER-BUG-02`
- **Issue Type:** Bug / Dependency Blocker
- **Summary:** Notification pipeline execution is blocked when Coordinator modifies an unassigned supply request
- **Affected Environment / Build:** Web Baseline v1.0 (Frozen Build &bull; React 18 SPA)
- **Component:** Coordinator Request Management / Notification Engine (`FR-06`, `dataService.js`)
- **Related Test Case ID:** `TC-11`
- **Severity:** Medium
- **Priority:** Medium
- **Jira Workflow Status:** Open / To Do
- **Reproducibility:** 100% Reproducible (5/5 attempts)
- **Preconditions:**
  1. User is authenticated as Coordinator (`coordinator`).
  2. An unassigned supply request exists (`REQ-2026-003` with `assignedSupplierId: null`).
- **Steps to Reproduce:**
  1. Navigate to *Manage Requests* in the Coordinator Portal.
  2. Locate unassigned request `REQ-2026-003` and click *Edit*.
  3. Modify Priority from `Medium` to `High`.
  4. Click *Update & Dispatch Alert*.
  5. Check notification records and recipient notification logs.
- **Expected Result:**
  System should handle the unassigned supplier case by either prompting for supplier assignment or dispatching the update event to a general coordinator operational log.
- **Actual Result:**
  The notification creation pipeline is blocked because the required `supplierId` foreign key is null. The notification creation is skipped entirely (`console.warn`), and no stakeholder receives the update alert.
- **Supporting Evidence:**
  Console log trace: `[FR-06 Notification Skipped] Request REQ-2026-003 has no assigned supplier to receive update notifications.` No notification object created in `viper_notifications`.
