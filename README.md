# Sanctions Intelligence Management System API

Backend API for a Sanctions Intelligence Management System (SIMS). The project provides the server-side foundation for managing sanctioned entities, profiles, requisitions, evidence documents, reviews, notifications, audit logs, imports, exports, and webhook integrations.

This repository contains the NestJS backend only. It exposes a REST API with Swagger documentation, JWT authentication, PostgreSQL persistence, Elasticsearch integration, file uploads, email delivery, and optional Google AI/API integrations.

## Features

- JWT-based authentication with OTP verification support.
- Role-based access control for protected administrative routes.
- Sanctioned entity management with create, update, archive, restore, permanent delete, statistics, and related entry management.
- Individual, organization, vessel, address, date of birth, name, bank account, and profile records.
- Bulk sanctions import from uploaded files and public URLs.
- Optional AI-assisted extraction for sanctioned entity data.
- Evidence document upload and metadata management.
- Requisition, review, audit log, notification, system setting, sync, export, and external source modules.
- Webhook target management, signed webhook deliveries, and test delivery support.
- Swagger API documentation at `/api/docs`.
- Docker support for the API, PostgreSQL, and Elasticsearch.

## Tech Stack

- Node.js 20
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Elasticsearch
- JWT / Passport
- Swagger / OpenAPI
- Nodemailer and EmailJS
- Multer for uploads
- Jest for testing
- Docker and Docker Compose

## Project Structure

```text
src/
  auth/                 Authentication, JWT strategy, guards, OTP flow
  user/                 User management and account confirmation
  sanctioned-entity/    Core sanctions entity logic, imports, extraction
  entity-*/             Entity-related child records and profile data
  requisition/          Requisition workflow
  review/               Review workflow
  evidence-document/    Evidence upload and document metadata
  notification/         Notification API and WebSocket gateway
  webhook/              Webhook targets and deliveries
  audit-log/            Audit log records
  export-job/           Export jobs
  export-row/           Export rows
  external-source/      External data sources
  sync-run/             Synchronization run tracking
  synced-entity/        Synchronized entity tracking
  system-setting/       Runtime system settings
  common/               Shared enums, mail, encryption, utilities
  database/             Database helpers and seed service
test/                   End-to-end test setup
uploads/                Runtime upload directory
```

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 15 or compatible
- Elasticsearch 8.x
- Docker and Docker Compose, if using the containerized setup

## Environment Variables

Create a local `.env` file from the public template:

```bash
cp .env.example .env
```

Then update the values for your environment.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port. Defaults to `3000`. |
| `NODE_ENV` | Runtime environment, for example `development` or `production`. |
| `DB_HOST` | PostgreSQL host. |
| `DB_PORT` | PostgreSQL port. |
| `DB_USER` | PostgreSQL username. |
| `DB_PASSWORD` | PostgreSQL password. |
| `DB_NAME` | PostgreSQL database name. |
| `JWT_SECRET` | Secret used to sign JWT access tokens. Use a long random value. |
| `JWT_EXPIRATION` | JWT lifetime, for example `1h`. |
| `ELASTICSEARCH_NODE` | Elasticsearch URL. |
| `REDIS_HOST` | Redis host, if Redis-backed features are enabled. |
| `REDIS_PORT` | Redis port. |
| `REDIS_PASSWORD` | Redis password, if required. |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost. |
| `ENCRYPTION_KEYS` | Comma-separated 32-character encryption keys. The first key is active. |
| `GOOGLE_API_KEY` | Optional Google API key for Drive import and AI extraction features. |
| `EMAILJS_SERVICE_ID` | Optional EmailJS service ID. |
| `EMAILJS_PUBLIC_KEY` | Optional EmailJS public key. |
| `EMAILJS_PRIVATE_KEY` | Optional EmailJS private key. |
| `EMAILJS_INVITE_TEMPLATE_ID` | Optional EmailJS invite email template ID. |
| `EMAILJS_OTP_TEMPLATE_ID` | Optional EmailJS OTP email template ID. |
| `SMTP_HOST` | SMTP server host used as mail fallback. |
| `SMTP_PORT` | SMTP server port. |
| `SMTP_USER` | SMTP username. |
| `SMTP_PASSWORD` | SMTP password. |
| `SMTP_SECURE` | Whether SMTP uses TLS. |
| `MAIL_FROM` | Sender address for application emails. |
| `FRONTEND_URL` | Frontend origin used for CORS and account confirmation links. |

Do not commit your real `.env` file.

## Installation

```bash
npm ci --legacy-peer-deps
```

## Running Locally

Start PostgreSQL and Elasticsearch first, then run:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

## Running With Docker

Build and start the API, PostgreSQL, and Elasticsearch:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up -d --build
```

Stop the services:

```bash
docker compose down
```

The Docker setup reads environment values from `.env`.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Start the NestJS application. |
| `npm run start:dev` | Start the application in watch mode. |
| `npm run start:debug` | Start in debug watch mode. |
| `npm run build` | Compile TypeScript into `dist/`. |
| `npm run start:prod` | Run the compiled production build. |
| `npm run lint` | Run ESLint with auto-fix. |
| `npm run format` | Format source and test files with Prettier. |
| `npm run test` | Run unit tests. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run test:cov` | Run tests with coverage. |
| `npm run test:e2e` | Run end-to-end tests. |
| `npm run seed:admin` | Run the admin seed script. |

## API Overview

Detailed schemas and request/response examples are available through Swagger at `/api/docs`.

Main route groups:

| Route Group | Purpose |
| --- | --- |
| `/auth` | Login, OTP verification, OTP sending, account confirmation. |
| `/user` | User management and current-user profile operations. |
| `/sanctioned-entity` | Sanctioned entity CRUD, stats, archive/restore, upload/import, and related entries. |
| `/entity-name` | Entity name records. |
| `/entity-date-of-birth` | Date of birth records. |
| `/entity-address` | Address records. |
| `/entity-status` | Status records. |
| `/entity-profile` | Shared entity profile records. |
| `/individual-profile` | Individual-specific profile records. |
| `/organization-profile` | Organization-specific profile records. |
| `/vessel-profile` | Vessel-specific profile records. |
| `/entity-bank-account` | Bank account records. |
| `/evidence-document` | Evidence document metadata and file uploads. |
| `/requisition` | Requisition records. |
| `/reviews` | Review records. |
| `/notifications` | Notifications and read status updates. |
| `/webhooks` | Webhook targets, deliveries, and test delivery. |
| `/audit-log` | Audit log records. |
| `/aggregate-snapshot` | Aggregate snapshot records. |
| `/export-job` | Export job records. |
| `/export-row` | Export row records. |
| `/external-source` | External source records. |
| `/sync-run` | Synchronization run records. |
| `/synced-entity` | Synchronized entity records. |
| `/system-settings` | System settings. |

Most protected routes require a Bearer token:

```http
Authorization: Bearer <access_token>
```

## Uploads

Uploaded files are served from:

```text
/uploads/<filename>
```

The repository only keeps `uploads/.gitkeep` so the directory exists. Runtime uploads are ignored by Git and should not be committed.

## Security Notes

- Keep `.env` private and use `.env.example` only as a public template.
- Replace `JWT_SECRET` and `ENCRYPTION_KEYS` with strong random values before running outside local development.
- Do not reuse development database credentials in production.
- The current TypeORM configuration uses `synchronize: true`, which is convenient for development but should be disabled in production in favor of migrations.
- Review CORS, SMTP, Google API, and Elasticsearch settings before deployment.

## Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run coverage:

```bash
npm run test:cov
```

## Deployment Notes

For production deployments:

- Build the application with `npm run build`.
- Run `node dist/main.js` or use the provided Dockerfile.
- Provide environment variables through your hosting platform or secret manager.
- Use managed PostgreSQL and Elasticsearch where possible.
- Disable TypeORM schema synchronization and manage schema changes with migrations.
- Configure HTTPS, trusted CORS origins, logging, backups, and monitoring.

## License

This project is currently marked as `UNLICENSED` in `package.json`. Add a license file and update `package.json` before publishing if you want others to have explicit rights to use, modify, or distribute the code.
