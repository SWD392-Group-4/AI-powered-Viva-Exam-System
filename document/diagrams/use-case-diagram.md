# Use Case Diagram

## 1. Use Case Diagram (Mermaid Flowchart)

```mermaid
flowchart LR
    %% Define Actors
    STU(["🎓 Student"])
    LEC(["👨‍🏫 Lecturer"])
    ADM(["👨‍💻 Admin"])
    AI(["🤖 AI Engine"])

    %% Student Actions
    subgraph Student_Actions ["Student Actions"]
        direction TB
        UC_TestMic([Test Audio/Mic])
        UC_JoinRoom([Join Virtual Exam Room])
        UC_Answer([Answer Voice Interview])
        UC_ViewResult([View Score & Detailed Report])
    end

    %% Lecturer Actions
    subgraph Lecturer_Actions ["Lecturer Actions (HITL)"]
        direction TB
        UC_UploadDoc([Upload Course Documents])
        UC_ManageBank([Manage Question Bank & Rubric])
        UC_CreateExam([Create Exam Session])
        UC_ReviewExam([Review Student Exam])
        UC_PublishScore([Publish Final Score])
    end

    %% Admin Actions
    subgraph Admin_Actions ["Admin Actions"]
        direction TB
        UC_ManageUsers([Manage Users & Courses])
        UC_ConfigSys([Configure System & AI Endpoints])
    end

    %% AI Actions
    subgraph AI_Actions ["Automated AI Actions"]
        direction TB
        UC_GenQ([Auto-generate Questions via RAG])
        UC_FollowUp([Adaptive Follow-up Questions])
        UC_Grade([Background AI Scoring & Feedback])
    end

    %% Attach Actors to Use Cases (Student)
    STU --> UC_TestMic
    STU --> UC_JoinRoom
    STU --> UC_Answer
    STU --> UC_ViewResult

    %% Attach Actors to Use Cases (Lecturer)
    LEC --> UC_UploadDoc
    LEC --> UC_ManageBank
    LEC --> UC_CreateExam
    LEC --> UC_ReviewExam
    LEC --> UC_PublishScore

    %% Attach Actors to Use Cases (Admin)
    ADM --> UC_ManageUsers
    ADM --> UC_ConfigSys

    %% Include / Extend Relationships (Simulation)
    UC_ManageBank -.->|<<includes>>| UC_GenQ
    UC_Answer -.->|<<includes>>| UC_FollowUp
    UC_ReviewExam -.->|<<includes>>| UC_Grade

    %% AI Background Execution
    AI --- UC_GenQ
    AI --- UC_FollowUp
    AI --- UC_Grade
```

---

## 2. List of Actors

1. **Student**: The examinee participating in the viva exam. The primary interaction is voice-based examination.
2. **Lecturer**: The person responsible for academic content, managing exams, grading, and reviewing results (Human-in-the-Loop).
3. **Admin**: The person in charge of the system, configuring users and API connections.
4. **AI Engine**: The automated assistant agent that supports question generation, real-time follow-up questions, and automated background grading.

---

## 3. Use Case Descriptions

| Use Case Name | Primary Actor | Brief Description |
| :--- | :--- | :--- |
| **Manage Question Bank & Rubric** | Lecturer | The lecturer reviews questions and grading criteria generated manually or suggested by AI. |
| **Auto-generate Questions via RAG** | AI Engine | (*Included*) AI reads uploaded course materials to extract and generate multiple-choice / essay questions. |
| **Join Virtual Exam Room** | Student | The examinee connects to the exam room to interact directly with the AI Examiner. |
| **Answer Voice Interview** | Student | The examinee uses a microphone to answer questions prompted by the AI. |
| **Adaptive Follow-up Questions** | AI Engine | (*Included*) If the examinee's answer is incomplete, the AI automatically generates follow-up questions to clarify points in real-time. |
| **Review Student Exam** | Lecturer | After the exam session ends, the lecturer listens to/reads the transcript and reviews the score suggested by the AI. |
| **Background AI Scoring & Feedback** | AI Engine | (*Included*) Background processing: Matches the student's transcript against the Rubric to output a score and rationale. |
| **Publish Final Score** | Lecturer | The final decision (HITL), locking the score and publishing the results for the student to view. |
