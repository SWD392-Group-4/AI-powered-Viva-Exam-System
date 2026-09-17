# Modern Software Architecture Specification: AIVES
**System**: AI-powered Viva Exam System (AIVES)  
**Target Audience**: Dev, AI Agent, Solution Architect  
**Design Philosophy**: Event-Driven, Real-Time Streaming, Modular Monolith / Microservices-Ready, Resilient AI Integration (HITL).

---

## 1. Architectural Topology Overview

Hệ thống kết hợp giữa **Sync/Async Core API (Modular)** và **Real-Time Streaming Engine (WebSocket/WebRTC)** nhằm đảm bảo SLA độ trễ ($\le 3s$) khi vấn đáp trực tiếp:

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        STU["Student App (Next.js / React)"]
        LEC["Lecturer/Admin Portal (Next.js / React)"]
    end

    subgraph Gateway["Edge & Gateway Layer"]
        CDN["Cloudflare / CDN"]
        APIGW["API Gateway / Reverse Proxy (Envoy / Traefik)"]
    end

    subgraph CoreBackend["Core Application Services"]
        AUTH["Auth & Identity (OAuth2/JWT)"]
        EXAM["Exam & Roster Service"]
        BANK["Question Bank & Rubric Service"]
        GRADE["Grading & HITL Service"]
        AUDIT["Audit & Evidence Service"]
    end

    subgraph RealTime["Real-Time AI Viva Engine (High Throughput)"]
        WS["WebSocket Gateway (Socket.io / Fastify WS)"]
        ORCH["Viva State Machine & Orchestrator"]
        AUDIO_BUF["Audio Stream Buffer"]
    end

    subgraph AIServices["AI & Speech Pipeline"]
        STT["Real-time STT Worker (Whisper / Google Speech)"]
        LLM["Follow-up & Scoring Engine (LangChain/LlamaIndex)"]
        TTS["TTS Worker (Edge-TTS / ElevenLabs / Coqui)"]
        RAG["RAG Vector Store (Milvus / Qdrant / PgVector)"]
    end

    subgraph Storage["Data & Event Persistence"]
        RDBMS[("Relational DB (PostgreSQL)")]
        REDIS[("In-Memory DB & Broker (Redis)")]
        MQ[("Message Queue (RabbitMQ / Kafka)")]
        OBJ[("Immutable Object Storage (MinIO / S3 WORM)")]
    end

    STU <-->|HTTPS/WSS| APIGW
    LEC <-->|HTTPS| APIGW
    APIGW --> CoreBackend
    APIGW <--> WS

    WS <--> ORCH
    ORCH <--> REDIS
    ORCH --> AUDIO_BUF
    AUDIO_BUF --> STT
    STT --> ORCH
    ORCH --> LLM
    LLM --> TTS
    TTS --> WS

    CoreBackend --> RDBMS
    CoreBackend --> MQ
    MQ --> GRADE
    GRADE --> LLM
    AUDIT --> OBJ
    BANK --> RAG
```

---

## 2. Technology Stack Recommendation

| Tầng (Layer) | Công nghệ đề xuất | Lý do kỹ thuật |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+ (App Router), TypeScript, TailwindCSS, Zustand / TanStack Query** | Hỗ trợ SSR cho Dashboard, SPA tối ưu cho Real-time Viva Room qua Web Audio API & MediaRecorder. |
| **API Gateway** | **Traefik / Nginx / NestJS Gateway** | Rate limiting, WebSocket upgrade management, SSL termination. |
| **Backend Core** | **Node.js (NestJS) hoặc Golang** | - **NestJS**: Kiến trúc Module rõ ràng, DI mạnh mẽ, cực hợp DDD.<br>- **Golang**: Tối ưu tuyệt đối nếu cần xử lý streaming audio raw socket với độ trễ siêu thấp. |
| **AI Orchestration** | **Python (FastAPI + LangGraph / LlamaIndex)** | Hệ sinh thái AI tốt nhất, LangGraph xử lý cực mạnh đồ thị hội thoại (Adaptive Follow-up state machine). |
| **Speech Pipeline** | - **STT**: OpenAI Whisper v3 (Self-hosted via vLLM/Faster-Whisper) hoặc Google Speech API.<br>- **TTS**: Kokoro TTS / Edge-TTS / ElevenLabs. | Tối ưu độ trễ và khả năng nhận diện tiếng Việt chuyên ngành. |
| **Database (OLTP)** | **PostgreSQL (v15+)** | Schema quan hệ chặt chẽ cho đề thi, sinh viên, rubric, điểm số; tích hợp `pgvector` cho RAG câu hỏi. |
| **Cache & State** | **Redis (Cluster / Sentinel)** | Lưu phiên thi active, ephemeral state machine, Pub/Sub tín hiệu realtime, Distributed Lock. |
| **Message Queue** | **RabbitMQ / Apache Kafka** | Xử lý bất đồng bộ các tác vụ nặng: bóc băng hoàn chỉnh, AI chấm điểm Rubric, convert/compress video audio. |
| **Object Storage** | **MinIO / AWS S3 (WORM Object Lock)** | Lưu audio/video bản ghi và raw transcript, tuân thủ quy tắc bất biến chống sửa xóa. |

---

## 3. Real-Time Viva Streaming Architecture (Core Latency Engine)

Điểm then chốt nhất của hệ thống là **độ trễ phản hồi viva $\le 3000\text{ ms}$**. Kiến trúc xử lý luồng (Streaming Pipeline):

```mermaid
sequenceDiagram
    autonumber
    participant S as Student Client
    participant GW as WebSocket Gateway
    participant VAD as VAD / Buffer
    participant STT as Streaming STT
    participant AI as Adaptive Follow-up Engine
    participant TTS as TTS Streamer

    S->>GW: Audio Chunk Stream (Webm/PCM 100ms)
    GW->>VAD: Push to VAD (Voice Activity Detection)
    VAD->>STT: Active Voice Audio Segments
    STT-->>GW: Partial Transcripts (Interim)
    GW-->>S: Real-time Transcript Preview
    
    Note over VAD,STT: Phát hiện im lặng >= 5s hoặc bấm Kết thúc
    VAD->>GW: End-of-Speech Detected
    GW->>AI: Final Answer Transcript + Context (Question + Rubric)
    
    par AI Phân tích & Sinh Follow-up
        AI->>AI: Check completeness vs Rubric
        AI->>TTS: Stream tokens (LLM streaming response)
    end
    
    TTS-->>GW: Stream Audio Chunks
    GW-->>S: Play Audio Question (TTS)
```

---

## 4. Key Architectural Patterns

### 4.1. Human-in-the-Loop (HITL) CQRS Pattern
- **Command**: AI sinh đề xuất điểm $\rightarrow$ ghi vào `ScoreDraft` (chưa public).
- **Query**: Sinh viên chỉ query được từ `PublishedScoresView`.
- **Lecturer Action**: Giảng viên thực hiện Command `ReviewAndPublishExamScore`, commit sự kiện `ScoreApprovedEvent` để publish điểm chính thức.

### 4.2. Finite State Machine (FSM) cho Viva Session
- Trạng thái từng câu hỏi và toàn phiên thi được quản lý bằng FSM trên Redis:
  - `INIT` $\rightarrow$ `QUESTION_ANNOUNCED` $\rightarrow$ `THINKING` $\rightarrow$ `ANSWERING` $\rightarrow$ `EVALUATING` $\rightarrow$ `FOLLOW_UP_TRIGGERED` / `NEXT_QUESTION` $\rightarrow$ `FINISHED`.
- Mọi action gửi từ Client bắt buộc phải khớp với State hiện tại của FSM (ngăn chặn hành vi can thiệp DOM/API).

### 4.3. WORM Audit Trail Pattern (Write Once, Read Many)
- Mọi lượt thi sinh ra một `SessionAuditEnvelope` gồm: `SHA-256(Audio)` + `SHA-256(Transcript)` + `ScoringLogs`.
- Ghi trực tiếp vào Object Storage với header `Object-Lock: Retention`.

---

## 5. Non-Functional Architecture (SLA, Scalability & Security)

1. **High Availability (HA)**:
   - Stateless WebSocket Nodes đằng sau Layer 4/7 Load Balancer, sticky-session hoặc đồng bộ state qua Redis Pub/Sub.
2. **Graceful Degradation**:
   - Khi mạng sinh viên yếu: Tự động hạ bitrate audio từ 64kbps xuống 16kbps Opus mono.
   - Khi TTS gặp sự cố/chậm: Fallback ngay lập tức hiển thị text câu hỏi trên UI kèm đếm ngược để không làm gián đoạn bài thi.
3. **Security & Privacy**:
   - E2E Token-based Audio stream (JWT scoped cho từng `SessionId`).
   - Short-lived Presigned URLs cho audio playback ($\le 30\text{ mins}$).
