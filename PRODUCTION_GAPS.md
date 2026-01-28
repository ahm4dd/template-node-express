# Production Gaps Checklist

This template is intentionally small. The items below are **not fully implemented** and should be added before production.

## Security
- Rate limiting and abuse protection
- CSRF protection for cookie-based auth
- Security headers (Helmet)
- Request body size limits + input validation for all routes
- Dependency vulnerability monitoring (SCA)

## Authentication & Authorization
- Email verification flows
- Password reset flow and email provider integration
- MFA / 2FA (Better Auth plugins)
- Role-based access control (RBAC)
- Admin interfaces / user management UI

## Observability
- Centralized logs (ship Pino logs to a provider)
- Metrics (Prometheus/OpenTelemetry)
- Tracing for request correlation
- Error reporting (Sentry, Datadog, etc.)

## Reliability
- Database connection pooling limits & timeouts
- RabbitMQ retry, dead-letter queues, and backoff strategy
- Health checks for dependencies
- Graceful shutdown for workers

## Data & Backups
- Automated backups and restore testing
- Migrations in CI before deploy
- Seeds for staging environments

## Infrastructure
- CI/CD pipeline
- Secrets manager (Doppler, AWS Secrets Manager, Vault)
- TLS/HTTPS configuration
- Reverse proxy (Nginx, Traefik, or managed load balancer)

## Performance & Scaling
- Caching layer (Redis)
- Pagination & filtering on read endpoints
- Load testing baseline
- Horizontal scaling readiness

## Environment Strategy
- Separate `.env` files per environment
- Staging environment for pre-prod validation
- Separate DBs per environment

## Compliance (if needed)
- Audit logs
- Data retention policies
- GDPR/CCPA processes
