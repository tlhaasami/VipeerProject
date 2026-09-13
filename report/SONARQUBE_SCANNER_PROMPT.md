# SonarQube Scanner Setup & Execution Prompt

**Course:** SE3002 Software Quality Engineering  
**Purpose:** Instructions and Prompt for Running SonarQube Static Code Analysis on the Complete Frozen Codebase  

---

## 1. How to Run SonarQube Scanner on This Repository

### Option A: Running with SonarScanner CLI (Local SonarQube Server)

1. **Start Your Local SonarQube Server** (e.g. via Docker):
   ```bash
   docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:community
   ```

2. **Access SonarQube UI:**
   Open browser at `http://localhost:9000` (Default credentials: `admin` / `admin`).

3. **Generate User Token:**
   Go to *My Account &rarr; Security &rarr; Generate Tokens* and copy your token.

4. **Run SonarScanner in the Workspace Root:**
   ```powershell
   sonar-scanner `
     -D"sonar.projectKey=VIPER-SCM-SE3002" `
     -D"sonar.sources=src,supabase" `
     -D"sonar.host.url=http://localhost:9000" `
     -D"sonar.login=YOUR_GENERATED_TOKEN"
   ```

---

### Option B: Running via SonarCloud (Cloud-Hosted Free Tier)

1. Sign in to [SonarCloud.io](https://sonarcloud.io) with your GitHub account.
2. Import the `VIPER-SCM` repository.
3. Configure `sonar-project.properties` (already pre-configured in project root).
4. Run the scanner CLI or enable automatic GitHub Actions analysis.

---

## 2. Standard Prompt for Generating Custom Static Analysis Reports

If you need to analyze additional code iterations or generate supplementary static analysis summaries, use the following AI prompt:

```text
You are an expert Software Quality Engineer conducting a SonarQube static code analysis review for SE3002 Assignment #01.

Context:
- Project: VIPER Supply Chain Management (SCM) Baseline v1.0
- Tech Stack: React 18, Vite 6, Tailwind CSS, JavaScript ES6+, Supabase PostgreSQL
- Codebase Location: src/ and supabase/

Task:
Analyze the complete codebase and produce a formal SonarQube Quality Evaluation Report covering:
1. Overall Quality Gate Status, Reliability Rating, Security Rating, and Maintainability Rating.
2. Five meaningful findings across:
   - Security Hotspots (e.g. client-side authentication, storage security)
   - Reliability Bugs (e.g. null pointer dereference in notification dispatch)
   - Maintainability & Cognitive Complexity (e.g. modal state handling in ManageRequests.jsx)
   - Code Duplications (e.g. duplicated status constants)
   - Exception Safety (e.g. unhandled JSON storage parsing)
3. For each finding, document:
   - What SonarQube reported (Rule ID and description)
   - Where it occurs (exact file path and line numbers)
   - Why it matters from a software quality and security perspective
   - What remediation action the evidence supports
4. Evaluate Non-Functional Requirements (NFR-01 Performance, NFR-02 Security RBAC, NFR-03 Availability) and explicitly declare limitations of the 2008 SRS document.
```
