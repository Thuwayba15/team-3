# UbuntuLearn

---

## What is UbuntuLearn?

UbuntuLearn is an adaptive learning platform designed to guide students through personalized educational journeys. The system leverages student progress data, topic mastery, and performance history to provide intelligent recommendations on what to study next.

Unlike traditional tutoring platforms, UbuntuLearn focuses on **data-driven learning**, ensuring that each student receives targeted guidance based on their strengths, weaknesses, and learning progression.

---

## Problem Statement

Students often struggle with:
- Knowing **what to study next**
- Identifying **weak areas**
- Tracking meaningful **learning progress**
- Receiving **personalized guidance**

Most systems provide content, but **lack adaptive intelligence**.

### Our Solution

UbuntuLearn solves this by:
- Tracking **topic-level mastery**
- Monitoring **assessment performance**
- Using a **recommendation engine** to guide learning
- Providing a **dashboard that explains progress clearly**

---

## Why Choose UbuntuLearn?

- **Adaptive Learning**: Personalized recommendations based on mastery and performance  
- **Clarity**: Students always know what to focus on next  
- **Efficiency**: Eliminates wasted time on irrelevant content  
- **Scalability**: Designed for future AI-driven learning enhancements  
- **Community-Oriented**: Inspired by collaborative and accessible education principles  

---

# Architecture Overview

## High-Level Architecture

UbuntuLearn follows a **full-stack modular architecture**:

### Backend (ASP.NET Core + ABP Framework)
- Domain-driven structure  
- Application services for business logic  
- PostgreSQL (Neon) database  
- Recommendation engine implemented as a service layer  

### Frontend (Next.js / React)
- Component-based UI  
- Dashboard-driven experience  
- API-driven data fetching  
- Clean separation of concerns  

---

## Core Components

### 1. Student Experience
The student-facing side of UbuntuLearn is centered around guided learning and progress tracking. Core student features include:
- **Student Dashboard** for overall progress, topics mastered, lessons completed, weak areas, and recommended next steps  
- **Learning Path** for navigating enrolled subjects, topics, lessons, and structured progression  
- **Lesson Access** for reading lesson content, summaries, objectives, and revision material  
- **Quiz and Assessment Flow** for completing quizzes and tracking performance across topics  
- **Progress Tracking** for subject-level and topic-level mastery, revision needs, and intervention flags  

### 2. Admin Experience
The admin-facing side focuses on managing the platform’s curriculum, users, and AI configuration. Core admin features include:
- **Admin Dashboard** for monitoring platform activity and managing academic content at a high level  
- **User Management** for overseeing student accounts and role-controlled access  
- **Curriculum Management** for creating and maintaining subjects, topics, lessons, and related learning structures  
- **AI Configuration** for managing AI-related setup, prompt behavior, and platform-level adaptive learning controls  

### 3. Recommendation Engine
UbuntuLearn includes a recommendation engine that supports adaptive learning by guiding students toward what to study next. Core logic includes:
- Using **topic mastery scores**  
- Using **past performance and assessment results**  
- Using **topic sequencing / dependencies**  
- Producing:
  - a recommended next lesson  
  - a clear explanation of why that lesson was chosen  

### 4. Multilingual Support
The system allows for four supported official South African languages to make learning fair and accessible to everyone:
- UI components are translated for ease of navigation
- Lessons and quizzes are automatically translated
- The user's preferred language is stored across sessions

---

# Setup Instructions

## Prerequisites

- Node.js (v18+)  
- npm 
- .NET SDK  
- PostgreSQL / Neon DB  
- Visual Studio or VS Code  

---

## Backend Setup

1. Open solution in Visual Studio  
2. Set `Web.Host` as startup project  
3. Configure connection string in:

```json
appsettings.json
```

4. Run migrations (if needed)  
5. Start backend:

```
Run via IIS Express or dotnet run
```

---

## Frontend Setup

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## Docker (Frontend)

```bash
npm run docker
npm run docker-start
```

Set environment variable:

```
NEXT_PUBLIC_API_BASE_URI=<YOUR_BACKEND_URL>
```

---

## CI

```bash
npm run ci
```

---

## Husky Setup

```bash
npm run prepare
```

---

# Assumptions

- The platform serves multiple role-based experiences (Admin and Student workflows) with clearly separated permissions and UI routes.
- The curriculum model remains hierarchical and consistent across backend and frontend flows: **Subject -> Topic -> Lesson -> Assessment**.
- A learner must be enrolled in at least one subject for progress analytics and recommendations to produce meaningful output.
- Core workflows are API-first: frontend pages, dashboard cards, and management modules depend on stable application-service contracts.
- An Admin user is responsible for uploading standardized lessons per topic.
- The subjects and topics are pre-defined to ensure curriculum consistency.
- The system is expected to operate in multi-environment setups (local, CI, hosted) with environment-specific configuration for secrets, endpoints, and connection strings.
- Localization is a platform concern, not a page-level add-on; key student/admin/tutor workflows should remain functional across supported languages.
- Security and governance assumptions include authenticated access, role-based authorization, and auditable changes for sensitive operations.
- The architecture favors modular growth, allowing new features (analytics, interventions, communication, AI tooling) without tightly coupling domain, application, and UI layers.

---

# Trade-offs

## 1. Monorepo Full-Stack Structure
- Chose a combined backend/frontend repository structure.
- Pros:
  - shared visibility across API, UI, and tests
  - easier cross-layer feature delivery
- Cons:
  - larger pull requests and higher coordination overhead

---

## 2. API-Driven Next.js Frontend
- Chose a frontend that consumes backend app services rather than embedding business logic in UI.
- Pros:
  - thin UI orchestration and consistent behavior across pages
  - easier reuse of backend rules across channels
- Cons:
  - more dependency on backend response shape and availability

---

## 3. Rule-Based Recommendation Baseline
- Chose deterministic recommendation logic for the initial adaptive-learning core.
- Pros:
  - explainable outputs and predictable behavior
  - straightforward validation and testing
- Cons:
  - less personalized than data-driven ML approaches

---

## .4 Localization and Multi-Role UX Scope
- Chose to support localization and role-specific interfaces early in development.
- Pros:
  - better accessibility and broader usability across user groups
  - clearer separation of student/admin/tutor workflows
- Cons:
  - increased maintenance for translations, route guards, and regression testing

---

# AI Usage Disclosure

AI tools were used during the development of UbuntuLearn to support productivity, design decisions, and implementation.

## How AI was used

- Assisting with **code generation, scaffolding and structure**
- Generating and refining **documentation (README, specs, explanations)**
- Supporting **UI/UX structuring and component breakdowns**
- Debugging and improving implementation efficiency

## Developer Responsibility

All AI-generated outputs were:
- reviewed
- validated
- modified where necessary
- integrated into the system with full understanding

## Purpose of AI Usage

AI was used as a **development assistant** to:
- speed up development
- improve code quality
- enhance clarity of explanations

---

# Design

## [Wireframes](https://www.figma.com/proto/t2fwZ1w2wxnsS9xFcuirDk/Ubuntu-Learn?node-id=0-1&t=XW4aQGuyEAzecwVq-1)

## [Domain Model](https://drive.google.com/file/d/1Wsbk6MD8gc6VKeSFTmFPhKKgORauUpjd/view?usp=sharing)