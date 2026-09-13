# SE3002 Quality Evaluation - Part 4: Defect Reporting & Final Quality Judgment

**Course:** SE3002 Software Quality Engineering  
**Project:** VIPER Supply Chain Management (SCM) System  
**Evaluation Standard:** SE3002 Assignment #01 Rubric (CLO3 - K4 Analyze)  

---

## 1. Defect Investigation Summary

Before logging issues in Jira, all failed and blocked test executions from Part 3B were thoroughly investigated across test data, preconditions, component bindings, and storage serialization:

1. **Investigation of TC-07 (Failed Test):**
   - *Investigation Findings:* Inspecting [`src/services/dataService.js:284-315`](file:///e:/University/SQE/src/services/dataService.js#L284-L315) and [`src/pages/supplier/SupplierRequests.jsx:68-88`](file:///e:/University/SQE/src/pages/supplier/SupplierRequests.jsx#L68-L88) confirmed that the AI code generator accepted `deliverableQuantity` from the number input without verifying whether `deliverableQuantity <= targetRequest.quantity` or `deliverableQuantity > 0`. The payload was written directly to `localStorage`, corrupting ERP feedback records.
   - *Classification:* **Confirmed Implementation Defect &bull; Logged as `VIPER-BUG-01`**.

2. **Investigation of TC-11 (Blocked Test):**
   - *Investigation Findings:* Inspecting [`src/services/dataService.js:180-195`](file:///e:/University/SQE/src/services/dataService.js#L180-L195) confirmed that when a Coordinator edits an unassigned request (`assignedSupplierId: null`), the notification subsystem requires a valid `supplierId` foreign key. Because `supplierId` is missing, the notification pipeline halts execution, skipping notification delivery without routing to a general queue or alerting the coordinator.
   - *Classification:* **Confirmed Architecture Dependency Blocker &bull; Logged as `VIPER-BUG-02`**.

---

## 2. Standardized Jira Defect Tickets

```
+---------------------------------------------------------------------------------------------------+
|                                     JIRA DEFECT EXPORT LOG                                        |
+---------------+---------------------------------------------------+------------+----------+-------+
| Issue Key     | Summary / Title                                   | Severity   | Priority | Status|
+---------------+---------------------------------------------------+------------+----------+-------+
| VIPER-BUG-01  | Supplier feedback accepts exceeding/negative qty  | Major      | High     | OPEN  |
| VIPER-BUG-02  | Notification dispatch blocked on unassigned req   | Medium     | Medium   | OPEN  |
+---------------+---------------------------------------------------+------------+----------+-------+
```

---

### Jira Ticket VIPER-BUG-01

- **Issue Key:** `VIPER-BUG-01`
- **Issue Type:** Bug / Defect
- **Summary:** Supplier feedback submission form lacks upper and lower boundary validation on deliverable quantity
- **Affected Environment / Build:** Web Baseline v1.0 (Frozen Build &bull; Node 24 / React 18 SPA)
- **Component:** Supplier Portal / Feedback Workflow (`FR-05`, `dataService.js`, `SupplierRequests.jsx`)
- **Related Test Case ID:** `TC-07`
- **Severity:** **Major** *(Corrupts supply chain fulfillment records)*
- **Priority:** **High** *(Breaks core B2B commitment logic)*
- **Jira Workflow Status:** `To Do` / `Open`
- **Reproducibility:** 100% Reproducible (5/5 attempts)
- **Preconditions:**
  1. User is authenticated as a Supplier (`supplier1`).
  2. A supply request exists assigned to this supplier with required quantity = `5 Units` (e.g. `REQ-2026-001`).
- **Steps to Reproduce:**
  1. Navigate to *Supply Requests* in the Supplier Portal.
  2. On request `REQ-2026-001`, click the *Send Feedback* button.
  3. In the feedback modal, set Capacity = `Full`.
  4. In the *Deliverable Quantity* input, enter `50` (or `-5`).
  5. Click *Submit Supplier Response*.
- **Expected Result:**
  The system must reject the submission, display an observable error toast (*"Deliverable quantity cannot exceed requested quantity (5 units) or be less than 1"*), and refuse to persist the invalid record.
- **Actual Result:**
  The system accepted the submission without boundary validation, saved deliverable quantity `50` to `viper_feedbacks`, displayed a success toast, and transitioned the request status to `In-Review`.
- **Supporting Evidence:**
  LocalStorage dump of `viper_feedbacks` shows `{ "requestId": "req-001", "deliverableQuantity": 50, "capacity": "Full" }` for a request requiring only 5 units.

---

### Jira Ticket VIPER-BUG-02

- **Issue Key:** `VIPER-BUG-02`
- **Issue Type:** Bug / Dependency Blocker
- **Summary:** Notification pipeline execution is blocked when Coordinator modifies an unassigned supply request
- **Affected Environment / Build:** Web Baseline v1.0 (Frozen Build &bull; React 18 SPA)
- **Component:** Coordinator Request Management / Notification Engine (`FR-06`, `dataService.js`)
- **Related Test Case ID:** `TC-11`
- **Severity:** **Medium** *(Workflow blocker on unassigned entities)*
- **Priority:** **Medium** *(Prevents audit notification capture for unassigned orders)*
- **Jira Workflow Status:** `To Do` / `Open`
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

---

## 3. Final Quality Engineering Judgment (300–400 Words)

### Defensible Scoped Quality Judgment
Based on the empirical evidence gathered from static code analysis, non-functional benchmarking, and 14 functional test executions, the evaluated 10-requirement scope of the VIPER Supply Chain Management baseline is **conditionally acceptable for initial deployment**, provided that the two identified defects are remediated prior to commercial ERP integration.

The combined evidence strongly supports the operational viability of the core supply chain workflows. Functionally, 12 out of 14 test cases (85.7%) passed without anomaly. The system successfully enforces role-based access control (NFR-02) across Coordinator, Supplier, and Customer domains; provides observable feedback and dedicated SRS 3.1.1.1 error redirection for invalid authentication (FR-04, FR-07); and delivers end-to-end CRUD capability for requests, customers, and inventory items (FR-01, FR-02, FR-03). From a non-functional perspective, runtime performance (NFR-01) substantially exceeded specifications: 100% of transactions completed well under the 1.0-second threshold (averaging 12.4 ms with 1.45 KB payloads), and the React `ErrorBoundary` demonstrated 100% availability fault tolerance (NFR-03) by gracefully intercepting unhandled fatal exceptions.

However, significant aspects remain unsupported. The 2008 legacy SRS lacks explicit input boundary definitions for supplier capacity commitments, which directly contributed to AI-assisted implementation defect `VIPER-BUG-01` (TC-07), wherein negative or exceeding deliverable quantities were accepted into storage. Furthermore, the AI tool assumed that all edited requests possess pre-assigned suppliers, creating dependency blocker `VIPER-BUG-02` (TC-11) when unassigned requests are modified. SonarQube static analysis corroborated these architectural limitations, identifying client-side plaintext credential evaluation (Security Hotspot S2068) and high cognitive complexity (Maintainability S3776).

In conclusion, while the AI-assisted development approach rapidly produced a functional and visually cohesive baseline, it introduced critical boundary and dependency oversights that reduced confidence in unvalidated data paths. Therefore, the software is deemed **acceptable as an operational prototype baseline**, but unacceptable for unmonitored production use until server-side input clamping (`VIPER-BUG-01`), nullable notification handlers (`VIPER-BUG-02`), and server-side authentication are formally deployed. *(Word count: 348 words)*
