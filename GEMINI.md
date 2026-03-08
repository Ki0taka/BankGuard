# AML Blacklist Synchronization Platform - Project Memory

## 🎯 Project Overview
A specialized web-based platform for a financial institution to manage, validate, and synchronize AML (Anti-Money Laundering) blacklist entries across multiple external banking systems. This is a Bachelor Final Year Project (PFE).

## 🛠 Tech Stack
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL (TypeORM)
- **Search:** Elasticsearch (for high-speed entity lookups)
- **Messaging/Jobs:** BullMQ & Redis (for handling external system sync attempts)
- **Auth:** JWT-based with Role-Based Access Control (RBAC)

## 👥 Roles & Responsibilities
- **ADMIN:** System configuration, user management, and platform setup.
- **COMPLIANCE_OFFICER:** Creates/updates blacklist entries, uploads evidence, and performs reviews.
- **AUDITOR:** Read-only access to view entries and complete audit trails for compliance checks.

## 📍 Current Status (March 8, 2026)
1.  **Foundation:** `main.ts` configured with Swagger (`/api/docs`) and Global Validation.
2.  **Environment:** `.env.example` created.
3.  **Architecture:** Modular structure created, but entities are currently empty shells.
4.  **Context:** Full project requirements integrated from `Project_details.txt`.

## 🚀 Active Roadmap (Incremental Development)

### Phase 1: Authentication & User Management
- [ ] Implement `User` and `Role` entities.
- [ ] Setup JWT Login and `RolesGuard`.
- [ ] Create initial seed data (Admin/Compliance/Auditor users).

### Phase 2: Blacklist Management (The Core)
- [ ] **Task 2.1: BlacklistEntry Entity:** Implement fields (fullName, alias, DOB, nationality, source, justification, status).
- [ ] **Task 2.2: Status Workflow:** Logic for `PENDING` -> `ACTIVE` -> `REMOVED`.
- [ ] **Task 2.3: Evidence/Documents:** Integration with the `File/Document Module` for supporting evidence.

### Phase 3: Review & Approval Workflow
- [ ] Implement `Review` entity to track decisions (Approved/Rejected) by Compliance Officers.
- [ ] Link `AuditLog` to every state change.

### Phase 4: External Platforms & Synchronization
- [ ] **Task 4.1: ExternalPlatform Entity:** Manage API endpoints for external systems.
- [ ] **Task 4.2: Sync Logic:** Implement `SyncBatch` and `SyncAttempt` using BullMQ for reliability.
- [ ] **Task 4.3: Strategy Pattern:** Create a flexible way to handle different external API types.

## 📝 Architectural Decisions
- **Auditability:** Every action (Create, Update, Sync, Review) MUST generate an `AuditLog` entry.
- **Reliability:** External synchronizations must use background jobs (BullMQ) to handle timeouts or temporary platform downtime.
- **Validation:** Strict DTO validation to ensure data integrity before it reaches external systems.

---
*Note: This file is the primary context source for Gemini CLI.*
