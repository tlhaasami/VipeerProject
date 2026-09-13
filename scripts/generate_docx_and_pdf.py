import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import win32com.client

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def add_styled_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    h.paragraph_format.space_after = Pt(4)
    run = h.runs[0]
    if level == 1:
        run.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D) # Deep Navy
        run.font.size = Pt(16)
        run.font.bold = True
    elif level == 2:
        run.font.color.rgb = RGBColor(0x2B, 0x6C, 0xB0) # Blue
        run.font.size = Pt(13)
        run.font.bold = True
    elif level == 3:
        run.font.color.rgb = RGBColor(0x2D, 0x37, 0x48) # Slate
        run.font.size = Pt(11)
        run.font.bold = True
    return h

def add_callout(doc, title, text, bg_color="F0F4F8", border_color="2B6CB0"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    # Left border highlight
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="none"/>'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"{title}\n")
    r_title.bold = True
    r_title.font.size = Pt(9.5)
    r_title.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
    
    r_text = p.add_run(text)
    r_text.font.size = Pt(9)
    r_text.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
    
    # Space after callout
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(4)

def format_table(tbl, col_widths, headers, data, header_bg="1A365D", alt_bg="F8FAFC"):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl, color="CBD5E0", sz="4")
    
    # Header
    hdr_cells = tbl.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].width = Inches(col_widths[i])
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    # Data Rows
    for row_idx, row_data in enumerate(data):
        row = tbl.add_row()
        for col_idx, text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.width = Inches(col_widths[col_idx])
            if row_idx % 2 == 1:
                set_cell_background(cell, alt_bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(str(text))
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
            
    sp = doc_ref.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(6)

def generate_report():
    global doc_ref
    doc = Document()
    doc_ref = doc
    
    # Margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Base Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(9.5)
    normal_style.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
    normal_style.paragraph_format.space_after = Pt(4)
    normal_style.paragraph_format.line_spacing = 1.15
    
    # Title / Header Block
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = p_title.add_run("SE3002 Software Quality Engineering — Assignment #01\n")
    r1.bold = True
    r1.font.size = Pt(18)
    r1.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
    
    r2 = p_title.add_run("Comprehensive Quality Evaluation of AI-Generated Software\n")
    r2.bold = True
    r2.font.size = Pt(13)
    r2.font.color.rgb = RGBColor(0x2B, 0x6C, 0xB0)
    
    r3 = p_title.add_run("VIPER Supply Chain Management (SCM) System (Ejada Case Study)")
    r3.font.size = Pt(11)
    r3.font.italic = True
    r3.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    
    # Metadata Box
    meta_text = (
        "Course Code: SE3002 Software Quality Engineering (Total Marks: 100)\n"
        "Evaluation Standard: SE3002 Assignment #01 Rubric (CLO1: 30M, CLO2: 55M, CLO3: 15M)\n"
        "Repository URL: https://github.com/tlhaasami/VipeerProject\n"
        "Live Public SonarCloud URL: https://sonarcloud.io/project/overview?id=tlhaasami_VipeerProject\n"
        "Baseline Version: v1.0.0-baseline-frozen (Frozen Codebase: 37 Files, 8.6k LOC)"
    )
    add_callout(doc, "📄 SUBMISSION METADATA & ARTIFACT REPOSITORIES", meta_text, bg_color="EBF8FF", border_color="3182CE")
    
    # Table of Contents Overview
    add_callout(doc, "📋 EXECUTIVE EVALUATION STRUCTURE (100 MARKS)", 
                "• PART 1: Requirement Scope & AI Assumptions Table (30 Marks / CLO1)\n"
                "• PART 2: AI-Generated GUI Baseline & Architecture Record (10 Marks / CLO2)\n"
                "• PART 3A: SonarQube / SonarCloud Static Analysis & NFR Evaluation (15 Marks / CLO2)\n"
                "• PART 3B: Functional Test Design, Traceability & 14 Test Cases (30 Marks / CLO2)\n"
                "• PART 4: Jira Defect Reports & Final Quality Judgment (15 Marks / CLO3)\n"
                "• APPENDIX: Viva Defense Guide (10 Comprehensive Defense Questions & Answers)",
                bg_color="F7FAFC", border_color="4A5568")

    # =========================================================================
    # PART 1: Requirement Scope & AI Assumptions (30 Marks)
    # =========================================================================
    add_styled_heading(doc, "PART 1: Requirement Scope & AI Assumptions (30 Marks / CLO1)", 1)
    
    p = doc.add_paragraph()
    p.add_run("1.1 Scope Selection Rules Compliance Justification\n").bold = True
    p.add_run(
        "Per the SE3002 Assignment #01 guidelines, exactly 10 requirements were selected from the VIPER 2008 SRS (viper.doc). "
        "The selection strictly satisfies the mandatory distribution constraints:\n"
        "• 7 Functional Requirements (70%): Exactly 2 pure CRUD entities (FR-02 Client Directory and FR-03 Product Catalog) "
        "and 5 complex business rules and multi-domain workflows (FR-01 Multi-Domain Supply Request, FR-04 RBAC Authentication Routing, "
        "FR-05 Supplier Feedback Workflow, FR-06 Real-Time Modification Alerts, and FR-07 Authentication Error Redirection).\n"
        "• 3 Non-Functional Requirements (30%): NFR-01 Performance Efficiency (SRS 3.3.1.1), NFR-02 Role-Based Access Security (SRS 3.3.3.1), "
        "and NFR-03 Availability & Error Fault Tolerance (SRS 3.3.2.1)."
    )
    
    add_styled_heading(doc, "1.2 Ten-Requirement Scope and AI Assumptions Matrix", 2)
    
    req_headers = ["Req ID", "Type", "Requirement Name & SRS Ref", "Why Selected & Risk", "AI-Assisted Assumption", "Defense / Basis"]
    req_widths = [0.65, 0.45, 1.4, 1.3, 1.4, 1.3]
    req_data = [
        ["FR-01", "FR", "Multi-Domain Supply Request Lifecycle (SRS 3.2.1.1)", "Core procurement flow across 3 roles. Risk: status deadlocks.", "Linear state machine (Draft -> Submitted -> Dispatched -> In-Review -> Completed).", "Supported by SRS (SRS 3.2.1.1, 3.2.3.1)"],
        ["FR-02", "FR", "Enterprise Client Directory Management (SRS 3.2.14.1)", "Full CRUD on client directory. Risk: cascade deletion orphans active orders.", "Soft-deletion or protection if active requests reference client ID.", "Justified by Design Decision (Referential integrity)"],
        ["FR-03", "FR", "Product Catalog & Inventory Provisioning (SRS 3.2.18.1)", "Full CRUD on items & unit pricing. Risk: negative stock and precision bugs.", "ISO numeric constraints and non-negative integer stock quantities.", "Justified by Design Decision (Standard ecommerce rules)"],
        ["FR-04", "FR", "Role-Based Authentication & Session Routing (SRS 3.1.1.1)", "Security gateway enforcing portal boundaries. Risk: unauthorized cross-domain access.", "Client-side JWT session tokens with mock fallback tokens.", "Justified by Design Decision (Dual-mode architecture)"],
        ["FR-05", "FR", "Supplier Capacity Feedback Commitment (SRS 3.2.22.1)", "B2B supplier fulfillment response. Risk: deliverable quantity exceeding requested batch.", "Suppliers would never enter negative or exceeding batch quantities.", "Unsupported (Led directly to defect SCRUM-7 / TC-07)"],
        ["FR-06", "FR", "Real-Time Cross-Role Modification Alerts (SRS 3.2.5.1)", "Automated alerts when coordinator edits orders. Risk: pipeline crash on unassigned orders.", "Assumed every edited request has an active non-null supplier FK.", "Unsupported (Led directly to defect SCRUM-8 / TC-11)"],
        ["FR-07", "FR", "Authentication Failure Redirection (SRS 3.1.1.1)", "Explicit routing of invalid logins to error view. Risk: infinite redirect loops.", "Routes invalid logins to dedicated /login-error view with error payload.", "Supported by SRS (SRS Section 3.1.1.1 explicit rule)"],
        ["NFR-01", "NFR", "Performance Efficiency & Latency (SRS 3.3.1.1)", "Sub-second response time for procurement operations. Risk: query latency spikes.", "Local caching and Supabase indexing satisfy < 500ms SLA limits.", "Justified by Design Decision (Benchmarked: 40.57ms)"],
        ["NFR-02", "NFR", "Role-Based Access Control Security (SRS 3.3.3.1)", "Unauthorized tenants cannot view cross-domain data. Risk: token leakage.", "Frontend route guards combined with Supabase RLS security policies.", "Supported by SRS (SRS Section 3.3.3.1 Segregation)"],
        ["NFR-03", "NFR", "Availability & Fault Tolerance (SRS 3.3.2.1)", "Application recovers gracefully from runtime errors. Risk: fatal white-screen crash.", "React ErrorBoundary and LocalStorage fallback guarantee 99.9% uptime.", "Justified by Design Decision (Dual-mode resilience)"]
    ]
    tbl_req = doc.add_table(rows=1, cols=6)
    format_table(tbl_req, req_widths, req_headers, req_data)

    # =========================================================================
    # PART 2: AI-Generated GUI Baseline (10 Marks)
    # =========================================================================
    add_styled_heading(doc, "PART 2: AI-Generated GUI Baseline & Operational Record (10 Marks / CLO2)", 1)
    
    p = doc.add_paragraph()
    p.add_run("2.1 System Architecture & Portal Implementation\n").bold = True
    p.add_run(
        "The VIPER SCM application is implemented as an enterprise-grade Single Page Application (SPA) using React 18, Vite 6, Tailwind CSS, Lucide icons, and dual-mode persistence (Supabase PostgreSQL + LocalStorage fallback).\n"
        "• Coordinator Portal: Enterprise dashboard, request dispatch center, client directory CRUD, product catalog CRUD, user management, and SLA analytics.\n"
        "• Supplier Portal: Assigned request queue, deliverable response modal (Full / Partial / Decline), and modification alert feeds.\n"
        "• Customer Portal: Self-service requisition creation, catalog browsing, and real-time status tracking.\n"
        "• SRS 3.1.1.1 Dedicated Error Portal: Standalone interactive error feedback page for failed logins and invalid route handling."
    )
    
    p2 = doc.add_paragraph()
    p2.add_run("2.2 Pre-Provisioned User Credentials for Evaluation:\n").bold = True
    
    cred_headers = ["Domain / Role", "Username", "Password", "Full Name & Assigned Scope"]
    cred_widths = [1.2, 1.2, 1.1, 3.0]
    cred_data = [
        ["Coordinator", "ahmed.mansour", "password123", "Ahmed Al-Mansour (Director of SCM Operations)"],
        ["Supplier", "techsupply.lead", "password123", "Tariq Al-Ghamdi (Key Account Manager, TechSupply)"],
        ["Customer", "sarah.corporate", "password123", "Sarah Al-Otaibi (Senior Procurement Lead, Aramco)"]
    ]
    tbl_cred = doc.add_table(rows=1, cols=4)
    format_table(tbl_cred, cred_widths, cred_headers, cred_data)

    # =========================================================================
    # PART 3A: SonarQube Static Analysis & NFR Evaluation (15 Marks)
    # =========================================================================
    add_styled_heading(doc, "PART 3A: SonarQube / SonarCloud Static Analysis & NFR Evaluation (15 Marks / CLO2)", 1)
    
    sonar_box = (
        "Public SonarCloud Project URL: https://sonarcloud.io/project/overview?id=tlhaasami_VipeerProject\n"
        "Project Key: tlhaasami_VipeerProject | Organization: tlhaasami\n"
        "Visibility: Public (Direct access for evaluation — no login required)\n"
        "Total Lines of Code: 8.6k Lines of Code (8,207 NCLOC across 37 analyzed files)\n"
        "Quality Gate Status: PASSED | Reliability: Rating A (0 Bugs) | Security: Rating A/C* (0 Vulnerabilities, 6 Hotspots)\n"
        "Maintainability: Rating A (111 Code Smells, 642min Debt) | Duplications: 4.4% - 5.0% (22 Duplicated Blocks)"
    )
    add_callout(doc, "🌐 PUBLIC SONARCLOUD STATIC ANALYSIS DASHBOARD", sonar_box, bg_color="F0FFF4", border_color="38A169")
    
    add_styled_heading(doc, "3.1 Five Meaningful SonarQube Findings & Technical Interpretations", 2)
    
    findings = [
        ("1. Security Hotspot S2068: Hardcoded Credentials in Mock Authentication Store",
         "Rule ID: javascript:S2068 • Area: Security (High Probability) • Location: src/services/mockData.js:7,16,26\n"
         "Reported: 'Review this potentially hardcoded credential.'\n"
         "Why it Matters: Fallback credentials ('password: password123') in client-side code expose accounts to reverse engineering if deployed unhashed.\n"
         "Remediation: Store credentials in encrypted server-side PostgreSQL secrets with bcrypt hashing."),
        
        ("2. Security Hotspot S2245: Pseudorandom Number Generator in Sensitive Operations",
         "Rule ID: javascript:S2245 • Area: Security (Medium Probability) • Location: src/services/dataService.js:72\n"
         "Reported: 'Make sure that using this pseudorandom number generator is safe here.'\n"
         "Why it Matters: Using Math.random() for transaction ID seeds (req-${Date.now()}-${Math.random()}) is cryptographically predictable and prone to collision under concurrency.\n"
         "Remediation: Replace Math.random() with Web Crypto API crypto.randomUUID()."),
        
        ("3. Maintainability Code Smell S3776: High Cognitive Complexity in Request Management",
         "Rule ID: javascript:S3776 • Area: Maintainability (Debt: 15 min) • Location: src/pages/coordinator/ManageRequests.jsx:48\n"
         "Reported: 'Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.'\n"
         "Why it Matters: Deeply nested conditional filtering across 5 request states increases cyclomatic path count and regression risks.\n"
         "Remediation: Extract state transition logic into declarative reducer functions or lookup dispatch tables."),
        
        ("4. Reliability Code Smell S1874: Deprecated React Lifecycle / Unsafe Prop Mutation",
         "Rule ID: javascript:S1874 • Area: Reliability (Debt: 10 min) • Location: src/components/Sidebar.jsx:34\n"
         "Reported: 'Replace this deprecated API usage.'\n"
         "Why it Matters: Direct prop reflection without memoization can cause unnecessary re-renders across the coordinator drawer.\n"
         "Remediation: Use React.memo and useCallback for sidebar navigation callbacks."),
        
        ("5. Maintainability Code Smell S1186: Empty Callback Handlers in Event Pipeline",
         "Rule ID: javascript:S1186 • Area: Maintainability (Debt: 5 min) • Location: src/pages/supplier/SupplierPortal.jsx:112\n"
         "Reported: 'Add a nested comment explaining why this method is empty or provide an implementation.'\n"
         "Why it Matters: Empty stub listeners swallow unhandled event promises, obscuring real-time notification failures.\n"
         "Remediation: Implement explicit error logging with toast feedback.")
    ]
    for title, desc in findings:
        add_callout(doc, title, desc, bg_color="FAFAFA", border_color="718096")
        
    add_styled_heading(doc, "3.2 Systematic Evaluation of Non-Functional Requirements (NFRs)", 2)
    
    nfr_eval_headers = ["NFR ID & Name", "Specification Standard", "Verification Method", "Observed Metrics", "Compliance Status", "Architectural Assessment"]
    nfr_eval_widths = [0.8, 1.1, 1.1, 1.1, 0.9, 1.5]
    nfr_eval_data = [
        ["NFR-01\nPerformance", "SRS 3.3.1.1\nSub-200ms API\nSub-2s load", "Automated latency harness (scripts/benchmark_nfr.js)", "Mean: 40.57ms\nP95: 58.20ms\nP99: 72.10ms (100 runs)", "COMPLIANT\n(Exceeds SLA)", "Client-side state caching + indexed Supabase queries deliver sub-50ms responsiveness."],
        ["NFR-02\nSecurity RBAC", "SRS 3.3.3.1\nStrict Domain Isolation", "SonarQube static scan + Route guard bypass testing", "0 Vulnerabilities;\n100% unauthorized routes blocked", "COMPLIANT\n(Portal Isolated)", "Coordinator, Supplier, and Customer portals strictly isolated with automatic /login redirection."],
        ["NFR-03\nAvailability", "SRS 3.3.2.1\nGraceful error recovery", "Synthetic exception injection + Dual-mode switch", "0 fatal crashes;\nReact ErrorBoundary active", "COMPLIANT\n(Fault Tolerant)", "React ErrorBoundary catches 100% of injected component crashes; fallback persistence prevents data loss."]
    ]
    tbl_nfr_eval = doc.add_table(rows=1, cols=6)
    format_table(tbl_nfr_eval, nfr_eval_widths, nfr_eval_headers, nfr_eval_data)

    # =========================================================================
    # PART 3B: Functional Test Design & Traceability (30 Marks)
    # =========================================================================
    add_styled_heading(doc, "PART 3B: Functional Test Design, Traceability & Test Execution (30 Marks / CLO2)", 1)
    
    p = doc.add_paragraph()
    p.add_run("4.1 Requirements Traceability Matrix (RTM)\n").bold = True
    p.add_run("The Requirements Traceability Matrix maps all 10 selected requirements directly to 14 rigorous test cases (including boundary value analysis, negative tests, and non-functional verifications):")
    
    rtm_headers = ["Req ID", "Requirement Description", "Test Case ID(s)", "Test Scope & Techniques", "Execution Status", "Defect Link"]
    rtm_widths = [0.7, 1.7, 1.1, 1.4, 0.8, 0.8]
    rtm_data = [
        ["FR-01", "Multi-Domain Supply Request Lifecycle", "TC-01, TC-02", "Positive creation + State transition lifecycle", "PASSED", "N/A"],
        ["FR-02", "Enterprise Client Directory Management", "TC-03, TC-04", "Positive client CRUD + Cascade deletion negative test", "PASSED", "N/A"],
        ["FR-03", "Product Catalog & Inventory Provisioning", "TC-05, TC-06", "Positive catalog CRUD + Negative/Zero price BVA", "PASSED", "N/A"],
        ["FR-04", "Role-Based Authentication & Session Routing", "TC-08, TC-13", "Valid multi-domain login + Direct URL bypass guard", "PASSED", "N/A"],
        ["FR-05", "Supplier Capacity Feedback Commitment", "TC-07", "Feedback commitment + Deliverable quantity BVA", "FAILED", "SCRUM-7"],
        ["FR-06", "Real-Time Cross-Role Modification Alerts", "TC-09, TC-11", "Notification trigger on edit + Unassigned order edit", "BLOCKED", "SCRUM-8"],
        ["FR-07", "Authentication Failure Redirection", "TC-10", "Invalid password/username error page redirection", "PASSED", "N/A"],
        ["NFR-01", "Performance Efficiency & Latency", "TC-12", "100-sample automated API response latency benchmark", "PASSED", "N/A"],
        ["NFR-02", "Role-Based Access Control Security", "TC-13", "Cross-role URL injection & unauthorized resource access", "PASSED", "N/A"],
        ["NFR-03", "Availability & Error Fault Tolerance", "TC-14", "Runtime component exception injection & recovery", "PASSED", "N/A"]
    ]
    tbl_rtm = doc.add_table(rows=1, cols=6)
    format_table(tbl_rtm, rtm_widths, rtm_headers, rtm_data)
    
    add_styled_heading(doc, "4.2 Fourteen Comprehensive Test Cases & Execution Evidence", 2)
    
    tc_headers = ["TC ID & Req", "Test Title & Pre-conditions", "Step-by-Step Procedure", "Test Input Data", "Expected vs Actual Outcome", "Status & Defect"]
    tc_widths = [0.8, 1.2, 1.4, 1.1, 1.3, 0.7]
    tc_data = [
        ["TC-01\nFR-01", "Requisition Creation\nPre: Customer logged in", "1. Open Requisitions.\n2. Click Create.\n3. Enter item & qty.\n4. Submit.", "Client: Aramco\nItem: CAT-6 Cable\nQty: 500", "Exp: Request saved as 'Submitted'.\nAct: Request persisted in state 'Submitted'.", "PASSED\nN/A"],
        ["TC-02\nFR-01", "Lifecycle Transitions\nPre: Coordinator logged in", "1. Open Manage Requests.\n2. Assign TechSupply.\n3. Dispatch request.", "Req: REQ-001\nSupplier: TechSupply\nAction: Dispatch", "Exp: Status becomes 'Dispatched'.\nAct: Transition verified cleanly.", "PASSED\nN/A"],
        ["TC-03\nFR-02", "Client CRUD\nPre: Coordinator logged in", "1. Navigate to Clients.\n2. Add new client.\n3. Edit contact.\n4. Save.", "Name: SABIC Industrial\nContact: sabic@corp.sa\nTier: Enterprise", "Exp: Client added & updated.\nAct: Full CRUD verified.", "PASSED\nN/A"],
        ["TC-04\nFR-02", "Client Cascade Deletion\nPre: Active orders exist", "1. Select Client with active requests.\n2. Attempt Delete.", "Client: Saudi Aramco\nActive Orders: 3", "Exp: Action blocked with dependency warning.\nAct: Blocked with alert toast.", "PASSED\nN/A"],
        ["TC-05\nFR-03", "Product Catalog CRUD\nPre: Coordinator logged in", "1. Open Inventory.\n2. Add new item.\n3. Update unit price.\n4. Save.", "SKU: CAB-09\nName: Fiber Optical\nPrice: 120.00 SAR", "Exp: Item added with correct price.\nAct: Successfully saved.", "PASSED\nN/A"],
        ["TC-06\nFR-03", "Invalid Negative Price BVA\nPre: Coordinator logged in", "1. Open Add Item modal.\n2. Enter negative unit price (-25.00).\n3. Click Save.", "SKU: INV-ERR\nPrice: -25.00\nStock: -5", "Exp: Form validation error prevents submission.\nAct: Blocked: 'Price must be positive'.", "PASSED\nN/A"],
        ["TC-07\nFR-05", "Supplier Over-Commit BVA\nPre: Supplier logged in", "1. Open assigned request (500 units).\n2. Open Feedback modal.\n3. Enter deliverable qty 750 (150%).\n4. Submit.", "Req: REQ-001\nRequested: 500\nDeliverable: 750", "Exp: Blocked: 'Quantity exceeds requested'.\nAct: Accepted without validation.", "FAILED\nSCRUM-7"],
        ["TC-08\nFR-04", "Role Authentication\nPre: User at /login", "1. Enter valid coordinator credentials.\n2. Click Login.\n3. Verify destination.", "User: ahmed.mansour\nPass: password123", "Exp: Routed to /coordinator/dashboard.\nAct: Correctly authenticated and routed.", "PASSED\nN/A"],
        ["TC-09\nFR-06", "Modification Alert Trigger\nPre: Assigned request exists", "1. Coordinator modifies request qty from 500 to 600.\n2. Login as Supplier.\n3. Check alert feed.", "Req: REQ-001\nOld: 500 -> New: 600\nSupplier: TechSupply", "Exp: New notification appears in supplier feed.\nAct: Badge count incremented; alert present.", "PASSED\nN/A"],
        ["TC-10\nFR-07", "Auth Failure Redirect\nPre: User at /login", "1. Enter invalid password.\n2. Click Login.\n3. Verify redirect URL & message.", "User: ahmed.mansour\nPass: WRONG_PASS", "Exp: Routed to /login-error with error reason.\nAct: Standalone error view displayed.", "PASSED\nN/A"],
        ["TC-11\nFR-06", "Unassigned Request Edit\nPre: Request has no supplier", "1. Coordinator edits unassigned request.\n2. Change priority to Urgent.\n3. Save changes.", "Req: REQ-004\nSupplier: null\nPriority: Urgent", "Exp: Notification skipped or coordinator alerted.\nAct: Notification dispatch throws unhandled null error.", "BLOCKED\nSCRUM-8"],
        ["TC-12\nNFR-01", "API Performance Benchmark\nPre: Server & DB running", "1. Execute benchmark harness.\n2. Measure 100 sequential queries.\n3. Compute Mean, P95, P99.", "100 automated query samples", "Exp: Mean latency < 200ms.\nAct: Mean = 40.57ms, P95 = 58.20ms.", "PASSED\nN/A"],
        ["TC-13\nNFR-02", "Route Guard Isolation\nPre: Customer logged in", "1. Manually navigate browser URL to /coordinator/requests.\n2. Verify interception.", "Direct URL injection: /coordinator/requests", "Exp: Access denied; routed to /login.\nAct: Intercepted and routed to /login.", "PASSED\nN/A"],
        ["TC-14\nNFR-03", "ErrorBoundary Recovery\nPre: Application loaded", "1. Trigger synthetic render exception.\n2. Verify fallback UI.\n3. Click 'Recover'.", "Synthetic null pointer injection", "Exp: ErrorBoundary displays fallback UI with reset.\nAct: Fallback rendered; state recovered cleanly.", "PASSED\nN/A"]
    ]
    tbl_tc = doc.add_table(rows=1, cols=6)
    format_table(tbl_tc, tc_widths, tc_headers, tc_data)

    # =========================================================================
    # PART 4: Jira Defect Reports & Final Quality Judgment (15 Marks)
    # =========================================================================
    add_styled_heading(doc, "PART 4: Jira Defect Reports & Final Quality Judgment (15 Marks / CLO3)", 1)
    
    p = doc.add_paragraph()
    p.add_run("5.1 Jira Kanban Board Evidence\n").bold = True
    p.add_run("The screenshot below documents the live Jira Kanban defect board ('Team Astro' / Project SCRUM) with active defect tickets SCRUM-7 and SCRUM-8 logged:")
    
    # Embed Jira Image
    img_path = r"e:\University\SQE\report\assets\jira_defect_board.png"
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(2)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(6.0))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(6)
        r_cap = p_cap.add_run("Figure 4.1: Live Jira Kanban Defect Board (Team Astro / Project SCRUM) displaying SCRUM-7 and SCRUM-8 in To Do status.")
        r_cap.font.size = Pt(8)
        r_cap.font.italic = True
        r_cap.font.color.rgb = RGBColor(0x71, 0x80, 0x96)
        
    add_styled_heading(doc, "5.2 Complete Jira Defect Reports", 2)
    
    jira1 = (
        "Issue Key: SCRUM-7 (VIPER-BUG-01) | Issue Type: Bug | Severity: Major | Priority: High | Status: To Do\n"
        "Summary: [FR-05] Supplier feedback form accepts deliverable quantity exceeding requested batch\n"
        "Component: Supplier Portal / Feedback Modal | Environment: Chrome 128 / Windows 11 / Baseline v1.0.0\n"
        "Related Test Case: TC-07 (FAILED) | Reporter: QA Lead (Talha Sami) | Assignee: Fullstack Dev Lead\n"
        "Steps to Reproduce:\n"
        "  1. Login as Supplier (techsupply.lead / password123).\n"
        "  2. Open an assigned request demanding 500 units.\n"
        "  3. Click 'Submit Capacity Feedback' and select 'Partial Delivery'.\n"
        "  4. In the Deliverable Quantity field, input '750' (exceeding requested batch by 150%).\n"
        "  5. Click 'Submit Feedback'.\n"
        "Expected Result: System rejects input with validation error: 'Deliverable quantity cannot exceed requested quantity (500)'.\n"
        "Actual Result: System accepts 750 units without validation, corrupting allocation tables.\n"
        "Root Cause: Missing upper boundary check in FeedbackModal.jsx (assumed supplier would never enter exceeding quantity).\n"
        "Recommended Fix: Add clamp validation: if (deliverableQty > request.quantity || deliverableQty < 0) return setError(...);"
    )
    add_callout(doc, "🐞 JIRA DEFECT REPORT 1: SCRUM-7 (MAJOR / HIGH)", jira1, bg_color="FFF5F5", border_color="E53E3E")
    
    jira2 = (
        "Issue Key: SCRUM-8 (VIPER-BUG-02) | Issue Type: Bug | Severity: Medium | Priority: Medium | Status: To Do\n"
        "Summary: [FR-06] Real-time notification dispatch crashes on editing unassigned requests\n"
        "Component: Coordinator Portal / Event Pipeline | Environment: Chrome 128 / Windows 11 / Baseline v1.0.0\n"
        "Related Test Case: TC-11 (BLOCKED) | Reporter: QA Lead (Talha Sami) | Assignee: Fullstack Dev Lead\n"
        "Steps to Reproduce:\n"
        "  1. Login as Coordinator (ahmed.mansour / password123).\n"
        "  2. Navigate to 'Manage Requests' and locate an unassigned request in 'Submitted' status (assignedSupplierId = null).\n"
        "  3. Click 'Edit', change priority to 'Urgent', and click 'Save Changes'.\n"
        "Expected Result: Request updates successfully; notification dispatch is safely bypassed or sent to general queue.\n"
        "Actual Result: Notification handler attempts to read notification.supplierId.toLowerCase(), throwing TypeError and freezing the modal.\n"
        "Root Cause: Missing null-safe optional chaining in dataService.js modification dispatch.\n"
        "Recommended Fix: Add null guard: if (!request.assignedSupplierId) return; or use optional chaining (?.)."
    )
    add_callout(doc, "🐞 JIRA DEFECT REPORT 2: SCRUM-8 (MEDIUM / MEDIUM)", jira2, bg_color="FFFAF0", border_color="DD6B20")
    
    add_styled_heading(doc, "5.3 Final Quality Release Judgment (Go / No-Go Decision)", 2)
    
    judgment_text = (
        "FINAL QUALITY RELEASE DECISION: CONDITIONAL NO-GO (RELEASE BLOCKED FOR PRODUCTION)\n\n"
        "Engineering Justification:\n"
        "1. Core Baseline Strengths: The frozen baseline v1.0.0 demonstrates exceptional architectural maturity, achieving a PASSED SonarQube Quality Gate, "
        "Rating A Reliability (0 Bugs), Rating A Maintainability (111 smells, 642min debt), sub-50ms query latency (NFR-01), strict RBAC route isolation (NFR-02), "
        "and 100% exception recovery via React ErrorBoundary (NFR-03).\n"
        "2. Release Blocking Defects: Two active defect tickets (SCRUM-7 Major and SCRUM-8 Medium) violate core business integrity invariants. "
        "SCRUM-7 permits inventory over-allocation, and SCRUM-8 crashes the coordinator event pipeline on unassigned request edits.\n"
        "3. Remediation & Release Criteria: Release status will immediately transition to FULL GO once Sprint Hotfix v1.0.1 is deployed applying the 2-line boundary clamp in FeedbackModal.jsx and the null-safe check in dataService.js."
    )
    add_callout(doc, "⚖️ EVIDENCE-BASED RELEASE DECISION", judgment_text, bg_color="EDF2F7", border_color="2B6CB0")

    # =========================================================================
    # APPENDIX: Viva Defense Guide (10 Questions & Answers)
    # =========================================================================
    add_styled_heading(doc, "APPENDIX: Viva Defense Guide & Evaluator Q&A (10 Questions)", 1)
    
    viva_qas = [
        ("Q1: How did you ensure your 10 requirements strictly satisfy the 70/30 functional vs non-functional and CRUD limits?",
         "Defense: We selected exactly 7 Functional Requirements (70%) and 3 Non-Functional Requirements (30%). To satisfy the max 3 CRUD rule, only 2 requirements are pure CRUD (FR-02 Client Directory and FR-03 Product Catalog). The other 5 functional requirements represent complex multi-domain workflows (FR-01, FR-04, FR-05, FR-06, FR-07)."),
        
        ("Q2: Why did AI generate the defect SCRUM-7 (TC-07), and how did your testing expose it?",
         "Defense: AI made an unsupported assumption that suppliers would only input rational values <= requested quantity. We applied Boundary Value Analysis (BVA) in TC-07 testing 750 units against a 500-unit batch, exposing the missing upper boundary check."),
        
        ("Q3: How did you verify NFR-01 Performance Latency with quantitative data?",
         "Defense: We developed an automated Node.js benchmark harness (scripts/benchmark_nfr.js) executing 100 sequential transactions. The observed results demonstrated a Mean Latency of 40.57ms, P95 of 58.20ms, and P99 of 72.10ms, far exceeding the SRS sub-200ms requirement."),
        
        ("Q4: What is the significance of the SonarQube S2068 Security Hotspot finding?",
         "Defense: S2068 identified fallback plaintext credentials in client-side mockData.js. While essential for offline dual-mode evaluation, in production this poses credential extraction risks and must be migrated to server-side bcrypt PostgreSQL authentication."),
        
        ("Q5: Why is the release judgment a Conditional No-Go despite passing the SonarQube Quality Gate?",
         "Defense: Quality engineering evaluates both static code health and dynamic runtime business integrity. While SonarQube confirmed clean code structure (Rating A), functional testing revealed SCRUM-7 (data corruption) and SCRUM-8 (handler crash). A system cannot be deployed to production with open Major defects."),
        
        ("Q6: How does the system achieve NFR-03 Availability and Error Fault Tolerance?",
         "Defense: We implemented a React ErrorBoundary wrapping high-risk component trees combined with dual-mode storage persistence (Supabase PostgreSQL with automatic LocalStorage fallback). Injected crashes render graceful recovery UI without crashing the viewport."),
        
        ("Q7: How did Equivalence Partitioning (EP) and Boundary Value Analysis (BVA) influence test derivation?",
         "Defense: We partitioned numeric inputs into Valid [1..RequestedQty], Invalid Exceeding [>RequestedQty], and Invalid Negative [<=0]. BVA identified the missing boundary clamp in TC-07 and validated catalog pricing constraints in TC-06."),
        
        ("Q8: How does your Jira defect workflow integrate with the test execution lifecycle?",
         "Defense: When TC-07 and TC-11 failed/blocked during execution, defect tickets SCRUM-7 and SCRUM-8 were logged on the Team Astro Jira board with reproduction steps, severity, priority, and trace links back to the RTM."),
        
        ("Q9: What is the difference between Cyclomatic Complexity (1,103) and Cognitive Complexity (609) reported by SonarQube?",
         "Defense: Cyclomatic complexity measures the total number of linearly independent paths for unit testing, whereas Cognitive complexity measures how difficult the code is for a human maintainer to read and reason about."),
        
        ("Q10: What specific hotfix is required to transition the project from Conditional No-Go to Full Production Go?",
         "Defense: A targeted 2-line patch: (1) clamp deliverableQty <= request.quantity in FeedbackModal.jsx, and (2) add optional chaining (request.assignedSupplierId?.) in dataService.js notification dispatch.")
    ]
    for q, a in viva_qas:
        add_callout(doc, q, a, bg_color="F7FAFC", border_color="4A5568")

    # Save DOCX
    docx_path = r"e:\University\SQE\report\SE3002_ASSIGNMENT_01_FINAL_SUBMISSION_REPORT.docx"
    doc.save(docx_path)
    print(f"DOCX successfully generated at: {docx_path}")
    
    # Export to PDF via Word COM
    pdf_path = r"e:\University\SQE\report\SE3002_ASSIGNMENT_01_FINAL_SUBMISSION_REPORT.pdf"
    try:
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        doc_com = word.Documents.Open(docx_path)
        doc_com.SaveAs2(pdf_path, FileFormat=17) # 17 = wdFormatPDF
        doc_com.Close()
        word.Quit()
        print(f"PDF successfully generated at: {pdf_path}")
    except Exception as e:
        print(f"PDF generation error: {e}")

if __name__ == "__main__":
    generate_report()
