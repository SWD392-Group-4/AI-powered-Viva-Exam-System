erDiagram
%% ==========================================
%% CORE BUSINESS ENTITIES & CONCEPTUAL ATTRIBUTES
%% ==========================================
USER {
string full_name
string email
string role
string status
}

    COURSE {
        string code
        string name
        string description
        string status
    }

    TOPIC {
        string name
        string description
    }

    COURSE_DOCUMENT {
        string title
        string file_type
        string status
    }

    RUBRIC {
        string name
        number max_score
        string status
    }

    RUBRIC_CRITERIA {
        string name
        string description
        number weight_percentage
        number max_points
    }

    QUESTION {
        string content
        string bloom_level
        string model_answer
        string source
        string status
    }

    EXAM_PLAN {
        string title
        datetime start_time
        datetime end_time
        number total_questions
        number max_follow_ups
        string status
    }

    VIVA_SESSION {
        datetime started_at
        datetime completed_at
        string status
        string recording_reference
    }

    INTERACTION_EXCHANGE {
        number sequence_number
        string exchange_type
        string question_text
        string answer_transcript
        string trigger_reason
    }

    EVALUATION {
        number suggested_score
        number final_score
        string rationale
        string status
    }

    CRITERIA_EVALUATION {
        number score
        string evidence
    }

    EXAM_RESULT {
        number total_score
        string feedback
        string publish_status
        datetime published_at
    }

    %% ==========================================
    %% CONCEPTUAL RELATIONSHIPS (CROW'S FOOT NOTATION)
    %% ==========================================

    %% Academic & Course Management (Native Many-to-Many)
    USER }o--o{ COURSE : "teaches or enrolls in"
    COURSE ||--o{ TOPIC : "structures into"
    COURSE ||--o{ COURSE_DOCUMENT : "provides"
    COURSE ||--o{ RUBRIC : "defines"
    COURSE ||--o{ QUESTION : "maintains in bank"
    COURSE ||--o{ EXAM_PLAN : "schedules"

    %% Rubric Structure & Standards
    RUBRIC ||--|{ RUBRIC_CRITERIA : "comprises"
    TOPIC ||--o{ QUESTION : "categorizes"
    RUBRIC ||--o{ QUESTION : "evaluates against"

    %% Exam Planning & Sessions
    EXAM_PLAN ||--o{ VIVA_SESSION : "conducts"
    USER ||--o{ VIVA_SESSION : "undertakes as candidate"
    VIVA_SESSION }o--|{ QUESTION : "selects dynamically for"

    %% Real-time Interaction Flow
    VIVA_SESSION ||--|{ INTERACTION_EXCHANGE : "records dialogues"
    QUESTION ||--o{ INTERACTION_EXCHANGE : "prompts"

    %% Deferred Assessment & Grading (0..1 Optional Cardinality)
    VIVA_SESSION ||--o| EXAM_RESULT : "yields overall"
    INTERACTION_EXCHANGE ||--o| EVALUATION : "assesses"
    RUBRIC_CRITERIA ||--o{ CRITERIA_EVALUATION : "benchmarks"
    EVALUATION ||--|{ CRITERIA_EVALUATION : "details by criteria"

    %% Human-In-The-Loop (HITL) Review
    USER ||--o{ EVALUATION : "reviews and overrides"
    USER ||--o{ EXAM_RESULT : "approves and publishes"
