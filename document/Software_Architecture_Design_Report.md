---
title: Software Architecture Design Report — AI-Powered Viva Exam System (AIVES)
date: October 2026
version: 1.0
audience: Academic Instructor, Review Board, Software Engineering Department
author: Software Engineering Project Team (FPT University)
---

# Cover Page

| Item | Details |
| :--- | :--- |
| **University / Institute** | FPT University |
| **Course Code & Name** | SWD392 — Software Architecture and Design |
| **Project Name** | AI-Powered Viva Exam System (**AIVES**) |
| **Academic Instructor** | [Instructor Name] |
| **Class** | [Class ID, e.g., SE17xx] |
| **Project Repository** | AI-powered-Viva-Exam-System |
| **Submission Date** | October 2026 |

### Project Team Members & Contribution

| No. | Student ID | Full Name | Role | Responsibilities | Signature |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | [Student ID 1] | [Team Member 1] | Team Leader / Backend Lead | Architecture Design, Spring Boot Core, Security | ________ |
| 2 | [Student ID 2] | [Team Member 2] | Frontend Lead | Web Portal (React + Vite), UI/UX Design | ________ |
| 3 | [Student ID 3] | [Team Member 3] | AI / ML Engineer | Vertex AI RAG Integration, STT/TTS, Prompt Engineering | ________ |
| 4 | [Student ID 4] | [Team Member 4] | Database & Quality Engineer | PostgreSQL Schema, ERD, Test Cases & QA | ________ |
| 5 | [Student ID 5] | [Team Member 5] | Fullstack / Mobile Developer | Exam Room Workflow, Mobile Integration | ________ |

---

# 1. Introduction

## 1.1 Context
Oral examination (commonly known as *Viva Voce*) is widely recognized in higher education and professional qualification as one of the most effective assessment methods. Unlike multiple-choice or standard written tests, oral examinations rigorously evaluate a student's deep comprehension, analytical reasoning, articulation under pressure, and authenticity of knowledge. 

However, conducting oral exams in traditional academic environments presents significant operational bottlenecks:
1. **High Labor and Time Costs**: Faculty members must spend dozens to hundreds of hours interviewing students individually. This linear scaling constraint makes large-scale viva exams practically impossible.
2. **Inconsistent Difficulty and Subjectivity**: Interviewers' cognitive fatigue, unconscious biases, and spontaneous questioning create variability in question difficulty and grading criteria across candidates.
3. **Lack of Verifiable Audit Trails**: Oral examinations often lack verbatim transcription or transparent, criteria-by-criteria rubric justifications, complicating post-exam dispute resolution and quality audits.

## 1.2 Proposed Solution: AIVES
To address these challenges, the **AI-powered Viva Exam System (AIVES)** is developed as an intelligent viva examination platform. AIVES couples speech processing (Speech-to-Text and Text-to-Speech) with Large Language Models (LLMs) to serve as an **Autonomous Virtual Oral Examiner** working under a strict **Human-in-the-Loop (HITL)** governance paradigm.

The core innovations of AIVES include:
- **RAG-based Automated Question and Rubric Generation**: Extracting curriculum concepts from course textbooks and lecture slides into Bloom's taxonomy-aligned questions with deterministic multi-level rubrics.
- **Contextual Adaptive Interrogation (Follow-up Questioning)**: The AI dynamically evaluates candidate speech transcripts in real time, detecting ambiguities, omissions, or logical contradictions to ask precise follow-up questions.
- **Evidence-Based Grading Suggestions**: Mapping verbatim transcripts against structured rubric criteria with exact citation of student strengths and weaknesses.
- **Human Authority Preservation**: Faculty members retain ultimate jurisdiction to inspect transcripts, audit AI scoring rationales, adjust scores, and publish official grades.

## 1.3 Objectives
- **Scalability**: Reduce faculty assessment workload by over 75% by automating oral interviewing and preliminary rubric-based grading.
- **Standardization & Fairness**: Ensure every student receives uniform question difficulty, structured follow-up probing, and transparent rubric-based evaluations.
- **Real-Time Responsiveness**: Maintain low-latency bidirectional voice interactions (audio processing and question dispatching under 3 seconds).
- **Integrity & Security**: Prevent academic dishonesty through single-session enforcement, silence detection auto-submission, and cryptographically secure exam tokens.

## 1.4 Scope

### In-Scope (Functional System Boundaries)
- Secure role-based authentication and authorization (Admin, Lecturer, Student).
- Course lecture, topic, and rubric management.
- Manual and AI-assisted question generation categorized by Bloom's cognitive levels.
- Exam session creation with access code validation and configurable attempt limits.
- Real-time virtual oral examination room with voice synthesis (TTS), recording, and speech recognition (STT).
- Adaptive follow-up questioning based on real-time transcript evaluation.
- Asynchronous background AI grading with criterion-level scoring suggestions and textual justifications.
- Lecturer grading review portal with score override capabilities and audit notes.
- Student result portal and grade appeal workflows.

### Out-of-Scope (Excluded from Current Release)
- Autonomous publishing of final official grades without lecturer approval.
- Automated complex multi-room physical exam timetabling.
- Complete replacement of faculty pedagogical judgment.

## 1.5 Functional Requirements Summary

| Module | Functional Requirements (FR) | Target Roles |
| :--- | :--- | :--- |
| **Authentication & RBAC** | - User login with JWT issuance<br>- Password reset with OTP verification<br>- Forced password change on first login for provisioned accounts<br>- Strict role separation (`ADMIN`, `LECTURER`, `STUDENT`) | All Users |
| **Curriculum & Content** | - Manage courses, lessons, and topics<br>- Upload reference lecture slides and syllabi<br>- AI-assisted question drafting via Retrieval-Augmented Generation (RAG)<br>- Multi-criteria rubric configuration (criteria weights totaling 100%) | Lecturer, Admin |
| **Exam Management** | - Configure viva exams (session code, access key, duration, question count)<br>- Select topics and questions for exam sessions<br>- Enable/disable mobile platform access (`allow_mobile_exam`)<br>- Track student exam attempt quotas (`max_attempts`) | Lecturer, Admin |
| **Real-time Viva Room** | - Hardware diagnostics (microphone and speaker check)<br>- Audio synthesis of questions via Text-to-Speech (TTS)<br>- Candidate voice recording and Speech-to-Text (STT) transcription<br>- Silence detection (auto-submit after 10s of continuous silence)<br>- Adaptive follow-up probing (max 2 follow-ups per primary question) | Student |
| **Grading & HITL** | - Asynchronous evaluation background job upon exam completion<br>- Criteria-level score matching with evidence citation<br>- Lecturer appraisal dashboard with side-by-side transcript review<br>- Score override with mandatory justification for deviations > 2.0 points<br>- Final score publication and grade appeal management | Lecturer, Student |
| **Audit & Administration**| - Audit logging for grade adjustments and critical administrative actions<br>- System configuration management (LLM model parameters, thresholds) | Admin, Lecturer |

---

# 2. Software Development Approach

## 2.1 SDLC Model: Agile Scrum
The AIVES platform is developed adopting the **Agile Scrum** methodology. Given the innovative nature of integrating multimodal Generative AI into high-stakes academic evaluations, an iterative and incremental model is essential.

### Rationale for Choosing Agile Scrum:
- **Iterative AI Prompt & Prompt Engineering Optimization**: AI prompt accuracy, hallucination mitigation, and JSON schema compliance require continuous experimentation and adjustment based on real audio feedback.
- **Frequent Stakeholder Verification**: Regular sprint reviews with academic instructors allow early validation of pedagogical rules (e.g., Bloom taxonomy alignment, rubric criteria weighting).
- **Risk Mitigation**: Decoupling the project into two-week sprints allows the team to isolate technical challenges (such as speech latency and JPA transaction isolation) early in the development lifecycle.

## 2.2 Development Process & Phases

```
[Sprint 0: Planning & Setup] ➔ [Sprint 1: Architecture & Data] ➔ [Sprint 2: Core Viva & AI] ➔ [Sprint 3: HITL & QA] ➔ [Final: Release]
```

1. **Phase 1: Planning and Requirements Engineering**
   - Stakeholder interviews, identification of problem domain and operational bottlenecks.
   - Formal specification of Business Rules (`BR-AUTH`, `BR-BANK`, `BR-VIVA`, `BR-GRADE`).
   - Definition of User Stories, acceptance criteria, and backlog grooming.
2. **Phase 2: Architectural and Detailed Design**
   - System decomposition into a Clean Layered Architecture.
   - Conceptual, Logical, and Physical Database Modeling (PostgreSQL).
   - Dynamic workflow modeling (Sequence Diagrams, State Machine specifications).
   - OpenAPI 3.0 specification drafting for backend REST interfaces.
3. **Phase 3: Implementation & Continuous Integration**
   - Backend development using Spring Boot 3, Java 17, and Spring Security 6.
   - Frontend development using React 18, Vite, and TailwindCSS.
   - Multimodal integration with Google Cloud STT/TTS and Google Cloud Vertex AI Managed RAG Engine (Gemini 1.5 Flash grounded on course slides).
   - Automated builds, static code analysis, and unit testing via GitHub Actions.
4. **Phase 4: Verification and Quality Assurance**
   - End-to-end integration testing across the virtual exam pipeline.
   - Stress testing for concurrent audio streams and latency benchmarking.
   - User Acceptance Testing (UAT) with faculty review board.
5. **Phase 5: Deployment and Maintenance**
   - Containerized multi-service packaging via Docker.
   - Database migration automation with versioned SQL scripts.
   - Monitoring, logging, and error tracking in staging environments.

---

# 3. Architectural Design

## 3.1 Chosen Architecture Style: Layered Client-Server Monolith
AIVES adopts a **Modular Layered Client-Server Architecture** featuring a single backend Spring Boot service orchestrating third-party AI cloud services via secure HTTPS REST APIs.

### Architecture Style Rationale:
- **Simplicity and Maintainability**: A modular monolith avoids the operational overhead, network latency, distributed transaction complexity, and deployment orchestration of microservices, which is ideal for the project scope and team scale.
- **Centralized Security and Credential Isolation**: The backend server acts as the **exclusive API Gateway and custodian** of all external cloud credentials (Enterprise OAuth2 tokens and API keys for the RAG Engine, Gemini Flash LLM, and Speech Services). Client applications (Web Portal and Mobile App) never communicate directly with AI cloud providers.
- **Clear Separation of Cognitive Concerns (Dual-AI Architecture)**: Distinct separation between (1) curriculum knowledge retrieval, slide grounding, and rubric-based evaluation via the **Knowledge RAG Service**, and (2) real-time conversational reasoning, adaptive follow-up questioning, and post-exam transcript briefing via the **Gemini Flash API**.

## 3.2 System Architecture Diagram

![High-Level System Architecture](02-architecture-design/images/architecture-diagram.png)

### High-Level Architecture Block Diagram (Mermaid Representation):

```mermaid
flowchart LR
    subgraph FE["Frontend Tier (Client Applications)"]
        REACT["Web Portal<br/>(Vite + React + TailwindCSS)"]
        MOBILE["Mobile Client<br/>(React Native + Expo)"]
    end

    subgraph BE["Backend Tier (Spring Boot 3 Modular Monolith)"]
        CTRL["REST Controllers & Security Filters"]
        SERV["Core Business & Orchestration Services"]
        REPO["Data Access Repositories (JPA)"]
        JOBS["Background Task Scheduler"]
    end

    subgraph AI_SERVICES["External Cloud AI Infrastructure (Dual-AI Architecture)"]
        RAG_API["📚 Knowledge RAG Service<br/>(Slide Grounding, Vector Search & Rubric Assessment)"]
        GEMINI_API["🧠 Conversational Gemini API<br/>(Real-Time Viva Voice Loop & Transcript Briefing)"]
        SPEECH_API["🎙️ Speech Services<br/>(Google Cloud STT & TTS)"]
    end

    subgraph DB["Persistence Tier"]
        PG[("PostgreSQL Relational Database")]
    end

    REACT <-- "HTTPS REST (JSON / Audio Multipart) + JWT" --> CTRL
    MOBILE <-- "HTTPS REST (JSON / Audio Multipart) + JWT" --> CTRL
    CTRL --> SERV
    SERV --> REPO
    SERV --> JOBS
    
    SERV <-- "HTTPS REST / Gateway (Slide Ingestion & Grounded Rubric Evaluation)" --> RAG_API
    SERV <-- "HTTPS REST / API Key (Sub-second Viva Voice Probing & Transcript Briefing)" --> GEMINI_API
    SERV <-- "HTTPS REST (Audio Transcription & Voice Synthesis)" --> SPEECH_API
    
    REPO <-- "JDBC TCP/IP Port 5432 (Hibernate ORM)" --> PG
```

## 3.3 Component Interaction & Communication Protocols

| Channel | Source ➔ Destination | Protocol & Format | Payload Description | Security & Reliability |
| :---: | :--- | :--- | :--- | :--- |
| **CH-1** | Web / Mobile ➔ Backend | HTTPS / REST | JSON for commands; `multipart/form-data` for candidate voice recordings | Bearer JWT header validation; client request validation |
| **CH-2** | Backend ➔ Web / Mobile | HTTPS Response | Standard HTTP Status Codes (`200`, `400`, `401`, `403`, `404`, `409`, `500`) + JSON body | Base64 synthesized audio payloads or presigned audio URLs |
| **CH-3a** | Backend ➔ RAG Service | HTTPS / REST | Course slides (PDF/PPTX), semantic vector search queries, Bloom question generation prompts, synthesized candidate briefs & rubric evaluation | Server-side gateway authentication; isolated document namespace per course |
| **CH-3b** | Backend ➔ Gemini Flash API | HTTPS / REST | Spoken answer transcripts, conversational history, adaptive follow-up prompts, post-exam transcript synthesis & briefing prompts | Sub-second latency (< 1.5s); strict JSON schema enforcement; secure server-side API key |
| **CH-3c** | Backend ➔ Speech Services | HTTPS / REST | Raw candidate audio streaming (STT) and synthesized question text (TTS) | Technical domain phrase hints for Vietnamese; neural speech synthesis |
| **CH-4** | Cloud Services ➔ Backend | HTTPS Response | Standardized JSON payloads, vector search chunks, evaluated rubric grades with slide citations, candidate brief, audio streams | Server-side response validation, timeout handling, and exponential backoff retries |
| **CH-5** | Backend ➔ PostgreSQL | JDBC (TCP Port 5432) | SQL queries generated by Hibernate ORM; HikariCP connection pool | Prepared statements, connection pooling, transactional isolation |

## 3.4 Deployment Diagram

```mermaid
flowchart TD
    subgraph ClientDevice["Client Tier"]
        BrowserNode["User Workstation<br/>Chrome / Edge Browser (Web Portal)"]
        MobileNode["Mobile Device<br/>Android / iOS (Expo Runtime)"]
    end

    subgraph ApplicationHost["Application Hosting Tier (Docker Environment)"]
        NginxNode["Reverse Proxy / Web Server<br/>Nginx (Port 80/443 SSL Termination)"]
        AppNode["Backend Container<br/>Java 17 OpenJDK + Spring Boot JAR (Port 8080)"]
    end

    subgraph DatabaseHost["Database Tier"]
        DBNode["PostgreSQL Server (Version 14+)<br/>Managed Relational Database (Port 5432)"]
    end

    subgraph CloudServices["External Cloud AI Infrastructure"]
        RAGNode["Managed RAG Service<br/>Curriculum Knowledge Base & Retrieval Endpoint"]
        GeminiNode["Google Cloud AI Gateway<br/>Gemini 1.5 Flash API Endpoint"]
        SpeechNode["Google Cloud Speech Services<br/>STT / TTS APIs"]
    end

    BrowserNode -- "HTTPS / WSS (Port 443)" --> NginxNode
    MobileNode -- "HTTPS (Port 443)" --> NginxNode
    NginxNode -- "Reverse Proxy HTTP (Port 8080)" --> AppNode
    AppNode -- "JDBC / TCP (Port 5432)" --> DBNode
    AppNode -- "HTTPS / Gateway (Knowledge Grounding)" --> RAGNode
    AppNode -- "HTTPS REST (Sub-second Viva Reasoning)" --> GeminiNode
    AppNode -- "HTTPS REST (Speech Recognition & Synthesis)" --> SpeechNode
```

---

# 4. Technology Stack

## 4.1 Programming Languages & Frameworks

| Tier | Technology | Selected Version | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Core** | Java | OpenJDK 17 LTS | Enterprise standard offering strong typing, virtual threads readiness, performance, and long-term support. |
| **Backend Framework**| Spring Boot | 3.2.x | Comprehensive ecosystem with Spring Security 6, Spring Data JPA, automated configuration, and production-ready metrics. |
| **Frontend Web** | React | 18.x | Declarative component model, rich ecosystem, optimized reconciliation, and widespread enterprise adoption. |
| **Frontend Tooling** | Vite | 5.x | Instant hot module replacement (HMR), lightweight development server, and optimized rollup production bundles. |
| **Frontend Styling** | TailwindCSS | 3.x | Utility-first CSS framework enabling rapid, highly consistent, and responsive UI design without stylesheet bloat. |
| **Mobile Client** | React Native | Expo SDK 50+ | Cross-platform codebase supporting iOS and Android with native audio recording modules (`expo-av`). |

## 4.2 Database & Data Storage

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Relational DBMS** | PostgreSQL 14+ | Robust open-source ACID-compliant relational database. Native UTF-8 support ensures seamless handling of Vietnamese text and transcriptions. |
| **Persistence Layer**| Spring Data JPA / Hibernate | Object-Relational Mapping (ORM) reducing boilerplate SQL, providing compile-time type safety and transparent transaction management. |
| **Connection Pool** | HikariCP | High-performance, lightweight JDBC connection pool with minimal thread overhead. |

## 4.3 Artificial Intelligence & Cloud Services

| Service Component | Architecture Role | Engineering Rationale & Implementation Scope |
| :--- | :--- | :--- |
| **Knowledge RAG Service (RAG API)** | Curriculum Grounding, Question Drafting & Rubric Evaluation | Cloud-managed RAG pipeline for lecture slides (PDF, PPTX). Performs structural text extraction, semantic vector chunking, grounded question synthesis, and post-exam rubric evaluation. Cross-references student brief against slide chunks to provide objective scores and exact slide citations. |
| **Conversational LLM (Gemini API)** | Live Adaptive Viva Voice Loop & Post-Exam Transcript Briefing | Google Gemini 1.5 Flash. Delivers sub-second token latency (< 1.5s) for real-time oral examination, generating adaptive probing questions ($\le 40$ words) and post-viva conversational synthesis (distilling raw oral transcripts into structured technical briefs for RAG evaluation). |
| **Speech-to-Text (STT)**| Candidate Voice Transcription | Google Cloud Speech-to-Text. Vietnamese language acoustic model (`vi-VN`) with technical domain phrase hint boosting to capture software engineering terminology accurately. |
| **Text-to-Speech (TTS)**| Oral Examiner Question Synthesis | Google Cloud Text-to-Speech. High-fidelity neural voice synthesis converting written examination prompts into clear, articulate audio for candidate playback. |

## 4.4 DevOps, Version Control & Development Tools
- **Version Control**: Git & GitHub with branch protection rules (`main`, feature branches).
- **API Documentation**: OpenAPI 3.0 / Swagger UI for interactive endpoint testing and verification.
- **Containerization**: Docker and Docker Compose for reproducible local development and production orchestration.
- **Modeling & Architecture**: Mermaid.js, PlantUML, and Draw.io.

---

# 5. Requirements Modeling

## 5.1 System Actors

| Actor | Type | Description & System Permissions |
| :--- | :--- | :--- |
| **Student (Examinee)** | Human | Candidates authenticated via institutional email. Can participate in scheduled viva sessions, interact with the AI examiner, view officially published results, and submit grade appeals. |
| **Lecturer (Examiner)** | Human | Faculty members responsible for course content. Can upload materials, review/approve AI-generated questions and rubrics, schedule exam sessions, review transcripts, override AI proposed scores, and publish final grades. |
| **Administrator** | Human | System managers responsible for institutional user provisioning, role assignments, system-wide settings, and auditing security logs. |
| **External AI Engine** | System | Cloud services (Gemini LLM, Google STT/TTS) acting as processing workers invoked by the backend via secure APIs. |

## 5.2 Use Case Diagram & Descriptions

```mermaid
flowchart LR
    subgraph Actors
        STU["Student"]
        LEC["Lecturer"]
        ADM["Administrator"]
    end

    subgraph AIVES_System["AIVES System Boundaries"]
        UC01["UC01: Login & Manage Profile"]
        UC02["UC02: Manage Lessons & Topics"]
        UC03["UC03: Generate & Approve Questions (RAG)"]
        UC04["UC04: Configure Rubrics & Criteria"]
        UC05["UC05: Schedule Viva Exam Session"]
        UC06["UC06: Join Exam & Voice Testing"]
        UC07["UC07: Take Oral Viva Exam (Real-time)"]
        UC08["UC08: Asynchronous AI Grading"]
        UC09["UC09: Review & Override Scores (HITL)"]
        UC10["UC10: Publish Grades & Handle Appeals"]
        UC11["UC11: System Audit & User Provisioning"]
    end

    STU --> UC01
    STU --> UC06
    STU --> UC07
    STU --> UC10

    LEC --> UC01
    LEC --> UC02
    LEC --> UC03
    LEC --> UC04
    LEC --> UC05
    LEC --> UC09
    LEC --> UC10

    ADM --> UC01
    ADM --> UC11
```

### Detailed Core Use Case Descriptions:
- **UC07: Take Oral Viva Exam**: The student enters the exam room using session credentials. The system sequentially renders question text and audio, records the student's voice response, monitors speech boundaries, performs transcription, evaluates adaptive follow-ups, and completes the attempt.
- **UC09: Review & Override Scores (HITL)**: The lecturer accesses the evaluation portal, examines the verbatim transcript and audio playback alongside the AI suggested score, provides manual overrides with required justifications for discrepancies over 2.0 points, and commits the official grade.

## 5.3 Non-Functional Requirements (NFRs)

| Category | Metric / Specification | Architectural Measure |
| :--- | :--- | :--- |
| **Security & Privacy** | - Passwords hashed with BCrypt (strength 10+)<br>- Stateless JWT with 24-hour expiration<br>- Strict RBAC validation on all endpoints<br>- Audio data encrypted at rest | Spring Security filter chain; encrypted storage; Google Cloud IAM Service Account authorization (Least Privilege, no static AI API keys) |
| **Performance & Latency**| - Voice turnaround latency < 3.0s<br>- Database query execution time < 50ms (p95)<br>- Backend REST API throughput > 200 req/s | Asynchronous speech synthesis; indexing on all foreign keys; connection pooling |
| **Reliability & Resilience**| - 99.5% uptime during examination windows<br>- Guaranteed exam state recovery upon client disconnection<br>- Background job retry policy (up to 3 attempts) | Status-driven transactional state machine; persistent audit logs; exponential backoff retries |
| **Scalability** | - Support 100+ concurrent viva sessions per institutional node | Decoupled background workers; stateless backend enabling horizontal scaling |
| **Data Integrity** | - Sum of rubric criteria weights must equal exactly 100%<br>- One single active attempt per student per exam session | Database CHECK constraints, partial unique indexes, transactional service validations |

---

# 6. Main Flows

## 6.1 Flow 1: Question Bank & Rubric Preparation
This flow describes the curriculum ingestion, automated RAG question drafting, and mandatory faculty validation.

```mermaid
sequenceDiagram
    autonumber
    actor LEC as Lecturer
    participant SYS as AIVES Portal (Backend)
    participant AI as Gemini Flash API
    participant DB as PostgreSQL Database

    LEC->>SYS: Upload Course Material (PDF / Slide) & Select Topic
    SYS->>DB: Store Document Metadata & Associated Topic
    LEC->>SYS: Request AI Question Generation (Topic, Bloom Level, Count)
    SYS->>AI: Dispatch Prompt (Curriculum Context + Bloom Taxonomy Guidelines)
    AI-->>SYS: Return Structured Question Proposals & Model Answers (JSON)
    SYS->>DB: Persist Questions in DRAFT Status (source = AI_GENERATED)
    SYS-->>LEC: Render Question Drafting Workspace
    
    rect rgb(240, 248, 255)
        Note over LEC,SYS: Human-in-the-Loop Review (BR-BANK-001 / 002)
        LEC->>SYS: Edit question text, verify model answer, define Rubric Criteria
        LEC->>SYS: Validate Total Criteria Weight = 100%
        LEC->>SYS: Submit Approval Action
    end

    SYS->>DB: Update Status to APPROVED (Ready for Examination)
    SYS-->>LEC: 200 OK (Questions Added to Active Bank)
```

## 6.2 Flow 2: Real-Time Viva Examination (Voice AI & Adaptive Interrogation)
This flow encapsulates the candidate's real-time interaction with the virtual examiner.

```mermaid
sequenceDiagram
    autonumber
    actor STU as Student
    participant FE as Web / Mobile Client
    participant BE as Spring Boot Backend
    participant STT as Google Speech-to-Text
    participant AI as Gemini Flash LLM
    participant TTS as Google Text-to-Speech
    participant DB as PostgreSQL Database

    STU->>FE: Enter Session Code & Access Key
    FE->>BE: POST /api/attempts/start
    BE->>DB: Validate Eligibility (BR-AUTH-002) & Create Attempt (IN_PROGRESS)
    BE->>TTS: Synthesize Primary Question Text
    TTS-->>BE: Audio Stream (Base64)
    BE-->>FE: 200 OK {exchangeId, questionText, audioPayload}
    
    FE->>STU: Play Question Audio & Start Countdown Timer
    STU->>FE: Speak Answer via Microphone
    Note over FE: Client records audio.<br/>Auto-locks mic if continuous silence >= 10s (BR-VIVA-003)
    
    FE->>BE: POST /api/attempts/{id}/answers (Multipart Audio)
    BE->>STT: Recognize Speech (vi-VN, technical keywords)
    STT-->>BE: Verbatim Candidate Transcript
    BE->>DB: Save Transcript in interview_exchanges
    
    BE->>AI: Evaluate Transcript against Model Answer & Rubric
    AI-->>BE: Decision: {decision: "FOLLOW_UP", question: "Explain edge cases", reason: "Omitted boundary checks"}
    
    alt Follow-up Condition Met (Count <= 2 and words <= 40)
        BE->>TTS: Synthesize Follow-up Audio
        TTS-->>BE: Follow-up Audio
        BE->>DB: Insert Child Exchange (parent_exchange_id)
        BE-->>FE: 200 OK {exchangeId, followUpQuestion, audioPayload, isFinished: false}
    else Next Question or Exam Concluded
        BE-->>FE: 200 OK {isFinished: true}
    end
```

## 6.3 Flow 3: AI-Assisted Scoring & Human-in-the-Loop (HITL) Review
This flow covers the asynchronous grading pipeline and faculty review.

```mermaid
sequenceDiagram
    autonumber
    actor STU as Student
    participant BE as Spring Boot Backend
    participant JOB as Background Job Worker
    participant AI as Gemini Flash LLM
    actor LEC as Lecturer
    participant DB as PostgreSQL Database

    STU->>BE: Submit Exam / Session Timer Expires
    BE->>DB: Set Attempt Status = COMPLETED & Insert Background Job (EVALUATE_ATTEMPT)
    BE-->>STU: Exam Submitted Successfully
    
    Note over JOB: Asynchronous Processing (Scheduled Worker)
    JOB->>DB: Fetch PENDING Job & Complete Transcript
    JOB->>AI: Send Rubric Criteria + Complete Interview Exchange History
    AI-->>JOB: Return Criterion Scores, Strengths, Weaknesses, Suggestions
    JOB->>DB: Insert question_grades (AI_DRAFT) & Update Status = PENDING_REVIEW
    
    rect rgb(255, 250, 240)
        Note over LEC,DB: Faculty Appraisal (BR-GRADE-001 / 002)
        LEC->>BE: Access Review Dashboard & Audit AI Proposed Scores
        LEC->>BE: Adjust Question Score (Enter Mandatory Note if Diff > 2.0)
        LEC->>BE: Finalize and Click "Publish Grades"
    end

    BE->>DB: Set Result Status = PUBLISHED & Lock Attempt
    BE-->>LEC: Grades Officially Published
    STU->>BE: View Official Grade, Breakdown, and Feedback
```

---

# 7. Static Modeling

## 7.1 Conceptual ERD & Domain Entities
The domain model captures 16 primary business entities mapped across 4 core operational subdomains:

```mermaid
erDiagram
    ROLE ||--o{ USER : "assigned to"
    USER ||--o{ LESSON : "author of"
    LESSON ||--o{ TOPIC : "contains"
    TOPIC ||--o{ QUESTION : "categorizes"
    QUESTION ||--o| RUBRIC : "evaluated by"
    RUBRIC ||--o{ RUBRIC_CRITERION : "decomposed into"
    USER ||--o{ VIVA_EXAM : "created by"
    VIVA_EXAM ||--o{ VIVA_EXAM_TOPIC : "includes"
    VIVA_EXAM ||--o{ VIVA_EXAM_QUESTION : "selects"
    VIVA_EXAM ||--o{ VIVA_ATTEMPT : "attempted through"
    USER ||--o{ VIVA_ATTEMPT : "submitted by"
    VIVA_ATTEMPT ||--o{ INTERVIEW_EXCHANGE : "records"
    VIVA_ATTEMPT ||--o{ QUESTION_GRADE : "graded into"
    QUESTION_GRADE ||--o{ CRITERIA_GRADE : "detailed by"
    QUESTION_GRADE ||--o{ GRADE_APPEAL : "appealed via"
```

## 7.2 Class Diagram: Domain & Layered Architecture

```mermaid
classDiagram
    direction TB

    class User {
        +String usersId
        +String email
        +String passwordHash
        +String fullName
        +Boolean isActive
        +Role role
        +validateCredentials()
    }

    class VivaExam {
        +String vivaExamsId
        +String title
        +String sessionCode
        +String accessKey
        +Integer durationMinutes
        +Integer maxAttempts
        +Boolean allowMobileExam
        +Boolean isPublished
    }

    class VivaAttempt {
        +String vivaAttemptsId
        +Integer attemptNo
        +AttemptStatus status
        +ResultStatus resultStatus
        +LocalDateTime startedAt
        +LocalDateTime completedAt
        +BigDecimal finalScore
    }

    class InterviewExchange {
        +String interviewExchangesId
        +Integer exchangeOrder
        +String questionText
        +String answerTranscript
        +AiDecision aiDecision
        +String aiDecisionReason
        +String parentExchangeId
    }

    class QuestionGrade {
        +String questionGradesId
        +BigDecimal aiSuggestedScore
        +BigDecimal finalScore
        +GradeStatus status
        +String lecturerNotes
        +String aiStrengths
        +String aiWeaknesses
    }

    class RubricCriterion {
        +String rubricCriteriaId
        +String criterionName
        +BigDecimal weightPercentage
        +BigDecimal maxScore
    }

    User "1" --> "*" VivaExam : manages
    User "1" --> "*" VivaAttempt : undertakes
    VivaExam "1" --> "*" VivaAttempt : generates
    VivaAttempt "1" --> "*" InterviewExchange : logs
    VivaAttempt "1" --> "*" QuestionGrade : produces
    QuestionGrade "1" --> "*" RubricCriterion : evaluated_by
```

---

# 8. Database Design

## 8.1 Physical Database Diagram
The relational schema comprises **18 production tables** in PostgreSQL 14+, structured with standardized primary keys (`VARCHAR(20)`/`VARCHAR(30)`), foreign key constraints, explicit non-null invariants, and domain check constraints.

![Physical ERD Diagram](ERD/images/physical-erd.png)

## 8.2 Data Dictionary (Core Production Tables)

### Table: `users`
Represents all system users with role-based access.

| Column Name | Data Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `users_id` | `VARCHAR(20)` | No | PK | Formatted identifier (`ADxxxxxx`, `LExxxxxx`, `STxxxxxx`) |
| `roles_id` | `VARCHAR(20)` | No | FK ➔ `roles(roles_id)` | Role reference (`AD`, `LE`, `ST`) |
| `email` | `VARCHAR(255)` | No | UNIQUE | Institutional email address |
| `password_hash` | `VARCHAR(255)` | No | | BCrypt encrypted hash |
| `full_name` | `VARCHAR(150)` | No | | Full legal name |
| `is_active` | `BOOLEAN` | No | DEFAULT `TRUE` | Account active flag |
| `must_change_password` | `BOOLEAN` | No | DEFAULT `FALSE` | Forced password reset flag on first login |
| `created_at` | `TIMESTAMP(6)` | No | DEFAULT `LOCALTIMESTAMP`| Record creation timestamp |
| `updated_at` | `TIMESTAMP(6)` | No | DEFAULT `LOCALTIMESTAMP`| Last modification timestamp |

### Table: `viva_exams`
Configuration for an oral examination session.

| Column Name | Data Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `viva_exams_id` | `VARCHAR(30)` | No | PK | Unique identifier (`EXAM-YYYYMMDD-XXXX`) |
| `created_by` | `VARCHAR(20)` | No | FK ➔ `users(users_id)` | Lecturer who created the exam |
| `title` | `VARCHAR(200)` | No | | Exam title |
| `session_code` | `VARCHAR(50)` | No | UNIQUE | Public session code |
| `access_key` | `VARCHAR(100)` | No | | Secret passkey required to join |
| `duration_minutes` | `INTEGER` | No | CHECK (`> 0`) | Allowed exam duration |
| `max_attempts` | `INTEGER` | No | DEFAULT `1` | Max allowed attempts per student |
| `allow_mobile_exam` | `BOOLEAN` | No | DEFAULT `FALSE` | Enable/disable mobile app participation |
| `is_published` | `BOOLEAN` | No | DEFAULT `FALSE` | Exam visibility status |

### Table: `viva_attempts`
Records an individual student's examination attempt.

| Column Name | Data Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `viva_attempts_id` | `VARCHAR(20)` | No | PK | Identifier (`ATTxxxxxx`) |
| `viva_exams_id` | `VARCHAR(30)` | No | FK ➔ `viva_exams` | Associated exam session |
| `student_id` | `VARCHAR(20)` | No | FK ➔ `users(users_id)` | Student examinee identifier |
| `attempt_no` | `INTEGER` | No | DEFAULT `1` | Sequential attempt counter |
| `status` | `VARCHAR(20)` | No | CHECK in (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED`) | Lifecycle state |
| `result_status` | `VARCHAR(20)` | No | CHECK in (`NONE`, `GRADING`, `PENDING_REVIEW`, `PUBLISHED`, `GRADING_FAILED`) | Grading state |
| `started_at` | `TIMESTAMP(6)` | Yes | | Exam commencement timestamp |
| `completed_at` | `TIMESTAMP(6)` | Yes | | Exam submission timestamp |
| `final_score` | `NUMERIC(5,2)` | Yes | CHECK (`0 <= score <= 10.00`)| Official final score |

### Table: `interview_exchanges`
Auditable turn-by-turn question and response transcripts.

| Column Name | Data Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `interview_exchanges_id` | `VARCHAR(20)` | No | PK | Identifier (`EXCxxxxxx`) |
| `viva_attempts_id` | `VARCHAR(20)` | No | FK ➔ `viva_attempts` | Parent attempt reference |
| `parent_exchange_id` | `VARCHAR(20)` | Yes| FK ➔ `interview_exchanges`| References primary exchange if follow-up |
| `exchange_order` | `INTEGER` | No | | Sequential ordering within attempt |
| `question_text` | `TEXT` | No | | Question prompt spoken by AI |
| `answer_transcript` | `TEXT` | Yes | | Verbatim STT transcription of answer |
| `ai_decision` | `VARCHAR(20)` | Yes| CHECK in (`FOLLOW_UP`, `NEXT`, `SKIPPED`) | Real-time adaptive AI routing decision |
| `ai_decision_reason` | `TEXT` | Yes | | Explanation for asking follow-up |

---

# 9. Dynamic Modeling

## 9.1 Sequence Diagram: Real-Time Oral Exam Session with Adaptive AI Follow-up

```mermaid
sequenceDiagram
    autonumber
    actor STU as Student
    participant FE as Web Browser (React)
    participant BE as Spring Boot Controller
    participant VIVA as VivaRoomService
    participant STT as Google Speech-to-Text
    participant AI as Gemini Flash LLM
    participant TTS as Google Text-to-Speech

    STU->>FE: Click "Submit Answer" (or 10s silence detected)
    FE->>BE: POST /api/viva/attempts/{id}/exchange/{excId}/answer (Audio Blob)
    BE->>VIVA: processAnswerAudio(attemptId, excId, audioBytes)
    VIVA->>STT: recognize(audioBytes, language="vi-VN")
    STT-->>VIVA: return transcript text: "Polymorphism allows..."
    VIVA->>VIVA: Update interview_exchanges (answer_transcript)
    
    VIVA->>AI: Evaluate Response against Model Answer (JSON schema)
    AI-->>VIVA: {decision: "FOLLOW_UP", reason: "Missed runtime vs compile time difference", question: "Can you distinguish dynamic method dispatch?"}
    
    VIVA->>VIVA: Validate Follow-up Rules (Count < 2, words < 40)
    VIVA->>TTS: synthesizeSpeech(followUpText)
    TTS-->>VIVA: return audioBuffer
    VIVA->>BE: Persist new follow-up exchange record
    BE-->>FE: 200 OK {exchangeId, questionText, audioBase64, isFollowUp: true}
    FE->>STU: Play Follow-up Audio & Reset Recording State
```

## 9.2 State Machine Diagram: Viva Attempt Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NOT_STARTED: Student Joins Room
    NOT_STARTED --> IN_PROGRESS: Verify Hardware & Click Start
    
    state IN_PROGRESS {
        [*] --> RECEIVING_QUESTION
        RECEIVING_QUESTION --> THINKING: Audio Playback Complete
        THINKING --> ANSWERING: Microphone Active
        ANSWERING --> EVALUATING_ADAPTIVE: Audio Chunk Submitted
        EVALUATING_ADAPTIVE --> RECEIVING_QUESTION: Follow-up Triggered
        EVALUATING_ADAPTIVE --> NEXT_QUESTION: Primary Question Finished
        NEXT_QUESTION --> RECEIVING_QUESTION: Questions Remaining
    }

    IN_PROGRESS --> COMPLETED: All Questions Answered / Manual Submit
    IN_PROGRESS --> ABANDONED: Network Timeout / Session Expired

    COMPLETED --> PENDING_REVIEW: Background AI Grading Finishes
    PENDING_REVIEW --> PUBLISHED: Lecturer Reviews & Approves Score
    PUBLISHED --> [*]
```

---

# 10. Product & User Interface

## 10.1 UI/UX Architecture
The AIVES frontend delivers an accessible, high-performance interface with clear role-specific layouts:
- **Responsive Layout**: Designed primarily for modern desktop browsers with fallback mobile responsiveness.
- **Audio Feedback**: Live visual wave animations indicating microphone activity and silence timeout warnings.
- **Side-by-Side Review Workspace**: For faculty members to view candidate video/audio recordings, verbatim transcripts, and AI suggestions simultaneously.

## 10.2 Core Screens Walkthrough

| Screen | Primary User | Core Capabilities |
| :--- | :--- | :--- |
| **Authentication & Profile** | All Users | JWT authentication, role routing, password reset, and first-time forced credential update. |
| **Question Bank & Rubric Editor** | Lecturer | Document uploader for RAG, Bloom-level question generator, weight allocator for criteria totaling 100%. |
| **Exam Setup & Scheduling** | Lecturer | Session configuration, access key generation, exam duration, attempt quota, and mobile permission toggle. |
| **Virtual Viva Examination Room** | Student | Audio diagnostics, countdown timer, question synthesizer, real-time voice recording, and progress tracker. |
| **Faculty Appraisal Dashboard (HITL)** | Lecturer | Full transcript inspection, audio playback, AI criteria breakdown, score adjustment with audit notes, and one-click publishing. |
| **Student Score Portal & Appeals** | Student | Breakdown of verified criteria scores, teacher comments, and grade appeal submission form. |

## 10.3 CRUD Demonstration & API Verification
The backend includes a verified REST API and CRUD demonstration suite (`/api/demo/crud`) validating:
- Entity creation, retrieval, updates, and soft deletes across `users`, `lessons`, `questions`, and `viva_exams`.
- Integration test results proving database transaction isolation and OpenAPI compliance.

---

# 11. Test Cases

## 11.1 Test Strategy
Testing follows a standard pyramid structure comprising:
- **Unit Tests**: Business rule verifications (criteria weight totaling 100%, silence timeout limit, score deviation check).
- **Integration Tests**: Spring Boot `@SpringBootTest` testing REST controllers, JPA persistence, and database constraint triggers.
- **End-to-End Tests**: Simulated full oral exam sessions validating STT, LLM JSON schema outputs, and TTS playback.

## 11.2 Core Functional Test Suite

| Test ID | Test Scenario | Preconditions | Execution Steps | Expected Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Standard Student Login | Active account exists in `users` | 1. Enter email and password<br>2. Send POST `/api/auth/login` | Returns 200 OK with valid JWT bearer token and `STUDENT` role | **PASSED** |
| **TC-AUTH-02** | Prevent Unauthorized Role Access | Student token obtained | 1. Attempt GET `/api/admin/users`<br>2. Inspect HTTP status | Returns 403 Forbidden with standard error body | **PASSED** |
| **TC-BANK-01** | Rubric Criteria Weight Validation | Topic exists | 1. Create rubric with criteria weights totaling 90%<br>2. Submit to POST `/api/rubrics` | Returns 400 Bad Request (`INVALID_RUBRIC_WEIGHT_SUM`) | **PASSED** |
| **TC-VIVA-01** | Enforce Max Attempts Limit | Attempt 1 marked `COMPLETED` | 1. Student attempts to start second attempt when `max_attempts = 1` | Returns 409 Conflict (`MAX_ATTEMPTS_EXCEEDED`) | **PASSED** |
| **TC-VIVA-02** | Silence Detection Auto-Submit | Exam `IN_PROGRESS` | 1. Open microphone<br>2. Remain silent for 10 consecutive seconds | Frontend automatically locks recording and sends audio buffer to server | **PASSED** |
| **TC-VIVA-03** | Adaptive Follow-Up Questioning | Vague student answer provided | 1. Submit partial answer<br>2. Backend invokes Gemini LLM | Backend creates child exchange with `parent_exchange_id` and plays follow-up audio | **PASSED** |
| **TC-GRADE-01**| Mandatory Justification for Score Override | Score deviation > 2.0 | 1. Lecturer overrides AI score from 6.0 to 9.0 without entering note | Returns 400 Bad Request (`NOTE_REQUIRED_FOR_LARGE_DEVIATION`) | **PASSED** |
| **TC-GRADE-02**| Prevent Student Viewing Unpublished Scores | Result status = `PENDING_REVIEW` | 1. Student requests GET `/api/attempts/{id}/result` | Returns 403 Forbidden (`RESULT_NOT_PUBLISHED`) | **PASSED** |

---

# 12. Conclusion

## 12.1 Summary of Architecture & Design Accomplishments
The AIVES architecture bridges advanced artificial intelligence with rigorous academic evaluation standards:
- **Pragmatic Architecture**: A layered modular monolith backed by PostgreSQL and Spring Boot ensures high developer productivity, rapid deployment, and minimal operational overhead.
- **Pedagogical Alignment**: Embedding Bloom's cognitive taxonomy and multi-criteria rubrics into AI prompts guarantees structured and objective assessments.
- **Ethical AI Governance**: The Human-in-the-Loop design preserves faculty authority while eliminating repetitive manual interviewing.

## 12.2 Known Limitations & Engineering Trade-offs
- **Network Dependency**: Real-time voice interaction requires a stable internet connection for low-latency STT and TTS streaming.
- **Language Nuances**: Speech recognition in noisy environments or with heavy regional accents may occasionally require transcription confirmation.
- **Monolithic Cloud Calls**: Synchronous LLM calls during real-time follow-ups introduce a 1.0–2.0 second turnaround time.

## 12.3 Future Work & Roadmap
- **Edge AI & WebAssembly Speech Processing**: Moving preliminary voice activity detection (VAD) and noise filtering to client devices to reduce cloud bandwidth.
- **Multimodal Visual Proctoring**: Adding browser tab locking and optional webcam gaze analysis to verify candidate focus during viva examinations.
- **Automated Audio Diarization**: Supporting multi-speaker panel examinations with multiple candidates evaluated in the same session.

---

# 13. AI Appendix (Phụ lục sử dụng AI)

## 13.1 Dual-AI Architectural Paradigm (Kiến Trúc Trí Tuệ Nhân Tạo Hai Tầng)
AIVES adopts a **Decoupled Dual-AI Integration Architecture** that deliberately separates high-precision curriculum knowledge retrieval (**Knowledge RAG Service**) from ultra-low latency conversational oral examination and scoring (**Conversational Gemini API**).

```
+---------------------------------------------------------------------------------------------------------+
|                                     AIVES Dual-AI Architectural Matrix                                  |
+------------------------------------+----------------------------------+---------------------------------+
| Architectural Dimension            | Knowledge RAG Service (RAG API)  | Conversational LLM (Gemini API) |
+------------------------------------+----------------------------------+---------------------------------+
| Primary Operational Objective      | Curriculum grounding, Bloom gen  | Real-time adaptive oral viva &  |
|                                    | & Grounded Rubric Evaluation     | post-exam transcript briefing   |
+------------------------------------+----------------------------------+---------------------------------+
| Operational Pipeline               | Pipeline 1 (Prep) &              | Pipeline 2 Step A               |
|                                    | Pipeline 2 Step B (Grounded Eval)| (Live Voice Loop & Synthesis)   |
+------------------------------------+----------------------------------+---------------------------------+
| Primary Input Artifacts            | Lecture slides (PDF, PPTX),      | Speech transcripts, dialog      |
|                                    | student brief & rubric criteria  | history, question context       |
+------------------------------------+----------------------------------+---------------------------------+
| Latency Requirement                | Asynchronous (batch: 2s - 15s)   | Ultra-low latency (< 1.5s TTFT) |
+------------------------------------+----------------------------------+---------------------------------+
| Cognitive Specialty                | Anti-hallucination semantic      | Conversational agility, concise |
|                                    | retrieval, slide citations       | probing (<= 40 words), briefing |
+------------------------------------+----------------------------------+---------------------------------+
```

### 13.1.1 Engineering Rationale for the Examination Board
The architectural decision to decouple the system into two distinct AI services addresses three fundamental engineering requirements:
1. **Latency Profile Divergence (Tối ưu hóa độ trễ theo đặc thù tác vụ)**: 
   - Extracting and vectorizing multi-page lecture decks is an inherently compute-heavy, batch-oriented task well-suited for asynchronous offline processing.
   - Conversely, live oral examination is an interactive voice loop where human conversational psychology demands sub-second turnaround (< 1.5s) between the student's silence and the AI examiner's spoken follow-up. Invoking multi-document vector retrieval during an ongoing voice loop introduces unacceptable latency. Decoupling ensures live viva exams remain fluid, natural, and responsive.
2. **Specialized Cognitive Alignment & Synergistic Two-Stage Evaluation (Phân định nhận thức và phối hợp hai giai đoạn)**:
   - **Gemini Flash API**: Functions as the *Dynamic Viva Proctor and Synthesizer*. It excels at real-time intent analysis, detecting logical gaps in candidate speech, formulating sharp follow-up questions under 40 words, and synthesizing raw, noisy oral transcripts into structured, coherent candidate response briefs.
   - **Knowledge RAG Service**: Functions as the *Institutional Knowledge Custodian and Grounded Evaluator*. It receives the structured brief from Gemini, performs semantic vector retrieval against verified course slide chunks, and cross-references the student's actual arguments against official slide content to produce objective rubric scores with verifiable slide citations.
3. **Architectural Modularity & Fault Domain Isolation (Cách ly miền lỗi)**:
   - Any document processing delays, cloud storage throughput limits, or indexing tasks cannot compromise or disrupt ongoing viva examination rooms across concurrent exam sessions.

### 13.1.2 Two-Stage Operational Pipelines

#### Pipeline 1: Offline Knowledge Ingestion & Question Bank Curation (Preparation Phase)
1. **Document Ingestion**: Faculty members upload course lecture slides (PDF, PPTX) via the Web Portal.
2. **Semantic Processing**: The backend invokes the Knowledge RAG Service to parse document layouts, segment content into contextual text chunks, and compute vector embeddings.
3. **Grounded Question Synthesis**: Grounded prompts construct Bloom-aligned candidate questions (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`) alongside reference answers and domain keywords.
4. **Human Review**: Generated items enter the repository in `DRAFT` status and require mandatory faculty validation and rubric binding before exam activation.

#### Pipeline 2: Real-time Live Adaptive Viva Loop & Two-Stage Automated Scoring (Examination & Assessment Phase)
1. **Voice Acquisition & Transcription**: The candidate's spoken answer is captured and transcribed into text via Google Cloud Speech-to-Text (`vi-VN`) with technical domain hint boosting.
2. **Real-time Conversational Assessment**: The backend dispatches the candidate's transcript, prior conversation history, and question context to the **Gemini Flash API**.
3. **Adaptive Probing**: If the response is incomplete or ambiguous and the probing threshold (`max_follow_up_per_question`) has not been reached, Gemini Flash synthesizes a targeted follow-up question ($\le 40$ words).
4. **Voice Feedback**: The follow-up text is converted to natural audio via Google Cloud Text-to-Speech and streamed to the student.
5. **Post-Exam Candidate Transcript Briefing (Gemini API - Step A)**: Upon exam completion, an asynchronous background job sends the full viva dialogue transcript to the Gemini Flash API. Gemini condenses the conversation, extracts the student's key claims, explanations, and arguments, and filters out oral filler words to produce a clean, structured `candidate_response_brief`.
6. **Grounded Rubric Evaluation & Slide Citations (RAG Service - Step B)**: The backend submits this candidate brief and the pre-approved rubric criteria to the **Knowledge RAG Service**. The RAG Engine performs similarity search across slide vector chunks, verifies the accuracy of the student's claims against official lecture slides, and outputs criteria-level scores accompanied by exact slide citations.
7. **Human-in-the-Loop Review**: Scores, slide citations, and the briefing summary are stored as `PENDING_REVIEW` in the database, allowing faculty members to inspect, adjust, and approve final grades.

```
+------------------------------------------------------------------------------------+
|               Two-Stage Post-Exam Assessment Pipeline                              |
+------------------------------------------------------------------------------------+
|                                                                                    |
|  [Full Viva Dialogue] ──> [Gemini Flash API] ──> [Structured Candidate Brief]      |
|                                                           │                        |
|                                                           ▼                        |
|  [Approved Rubric] ───────────────────────────> [Knowledge RAG Service]            |
|  [Slide Vector Chunks] ───────────────────────>           │                        |
|                                                           ▼                        |
|                                            [Grounded Criteria Scores +             |
|                                             Verifiable Slide Citations]            |
|                                                           │                        |
|                                                           ▼                        |
|                                            [Lecturer HITL Review Dashboard]        |
+------------------------------------------------------------------------------------+
```

### 13.1.3 Security & Centralized API Gateway Pattern
To ensure robust credential isolation and defense-in-depth:
- **Centralized Custodian**: The Spring Boot Backend serves as the single trusted intermediary. Client applications (Web Portal and Mobile App) possess zero direct network routes or credentials to external AI services.
- **Enterprise Credential Isolation**: All authentication tokens (OAuth2 credentials for cloud services and API keys for LLM reasoning) reside strictly within server-side environment variables and secrets vaults.
- **Payload Validation**: All inputs and outputs traversing external boundaries undergo schema validation, sanitization, and automated timeout/retry protection.

## 13.2 Structured JSON Output Schemas

### 1. Adaptive Follow-Up Questioning Schema (Gemini Flash API - Real-time Loop)
```json
{
  "type": "OBJECT",
  "properties": {
    "decision": {
      "type": "STRING",
      "enum": ["FOLLOW_UP", "NEXT", "SKIPPED"]
    },
    "reason": {
      "type": "STRING",
      "description": "Justification explaining why follow-up probing is required"
    },
    "followUpQuestion": {
      "type": "STRING",
      "description": "Concise follow-up question under 40 words"
    }
  },
  "required": ["decision", "reason"]
}
```

### 2. Candidate Transcript Briefing Schema (Gemini Flash API - Post-Viva Synthesis)
```json
{
  "type": "OBJECT",
  "properties": {
    "questionId": { "type": "STRING" },
    "coreArguments": {
      "type": "ARRAY",
      "items": { "type": "STRING" },
      "description": "Key technical claims and explanations presented by candidate"
    },
    "identifiedGaps": {
      "type": "ARRAY",
      "items": { "type": "STRING" },
      "description": "Concepts missing, misunderstood, or contradicted during probing"
    },
    "executiveSummary": {
      "type": "STRING",
      "description": "Concise 150-word synthesis of student technical mastery"
    }
  },
  "required": ["questionId", "coreArguments", "identifiedGaps", "executiveSummary"]
}
```

### 3. Grounded Rubric-Based Scoring Schema (Knowledge RAG Service - Assessment)
```json
{
  "type": "OBJECT",
  "properties": {
    "criteriaScores": {
      "type": "ARRAY",
      "items": {
        "properties": {
          "criterionId": { "type": "STRING" },
          "awardedScore": { "type": "NUMBER" },
          "evidenceCitation": { 
            "type": "STRING",
            "description": "Slide source, page number, and matched chunk excerpt" 
          },
          "criterionFeedback": { "type": "STRING" }
        },
        "required": ["criterionId", "awardedScore", "evidenceCitation", "criterionFeedback"]
      }
    },
    "strengths": { "type": "STRING" },
    "weaknesses": { "type": "STRING" },
    "suggestedTotalScore": { "type": "NUMBER" }
  },
  "required": ["criteriaScores", "strengths", "weaknesses", "suggestedTotalScore"]
}
```

## 13.3 Speech Processing (STT / TTS) Integration
- **Google Cloud Speech-to-Text (v2)**: Configured with `recognition_metadata` set to `ACADEMIC_VOICE`, language set to `vi-VN` (and fallback `en-US`), using word-level confidence scores and domain phrase hints to accurately transcribe software engineering terms (e.g., "Polymorphism", "PostgreSQL", "Encapsulation").
- **Google Cloud Text-to-Speech**: Utilizing neural WaveNet voices (`vi-VN-Wavenet-B`) with speaking rate configured at 0.95x for clear, articulate speech delivery.

## 13.4 Human-in-the-Loop (HITL) Safety & Responsible AI Governance
AIVES adheres strictly to responsible AI principles:
- **No Autonomous Final Grading**: AI outputs are strictly tagged as `AI_DRAFT` and cannot be published to students until explicitly validated by a lecturer.
- **Auditability**: Every score adjustment deviating by more than 2.0 points from AI suggestions requires mandatory justification notes stored permanently in `question_grades.lecturer_notes`.
- **Right to Appeal**: Students possess a transparent appeal channel to request secondary human review on any evaluated viva response.
