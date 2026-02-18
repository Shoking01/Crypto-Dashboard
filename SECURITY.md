# Security Analysis - Crypto Dashboard

## Threat Model (STRIDE)

### 1. SPOOFING

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| S-001 | API Request Spoofing | CoinGecko API Client | HIGH | LOW |
| S-002 | XSS via Search Input | SearchBar Component | HIGH | MEDIUM |
| S-003 | Theme Preference Injection | localStorage | LOW | LOW |

### 2. TAMPERING

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| T-001 | API Response Manipulation | API Client | HIGH | LOW |
| T-002 | Chart Data Tampering | PriceChart | MEDIUM | LOW |
| T-003 | LocalStorage Data Tampering | Theme Context | LOW | MEDIUM |

### 3. REPUDIATION

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| R-001 | Lack of Security Event Logging | Entire Application | MEDIUM | HIGH |
| R-002 | No Audit Trail for API Calls | API Service | MEDIUM | MEDIUM |

### 4. INFORMATION DISCLOSURE

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| I-001 | API Key Exposure (if added) | Environment Variables | CRITICAL | LOW |
| I-002 | Error Message Information Leakage | Error Handling | MEDIUM | MEDIUM |
| I-003 | Console Logging Sensitive Data | Development Mode | LOW | HIGH |
| I-004 | CORS Misconfiguration | API Requests | HIGH | LOW |

### 5. DENIAL OF SERVICE

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| D-001 | API Rate Limiting Exhaustion | CoinGecko API | MEDIUM | MEDIUM |
| D-002 | Infinite Re-render Loop | React Components | MEDIUM | LOW |
| D-003 | Memory Leak from Event Listeners | Theme Context | LOW | LOW |

### 6. ELEVATION OF PRIVILEGE

| Threat ID | Title | Target | Impact | Likelihood |
|-----------|-------|--------|--------|------------|
| E-001 | DOM-based XSS | Dynamic Content | HIGH | MEDIUM |
| E-002 | Third-party Script Injection | External Dependencies | HIGH | LOW |

---

## Security Requirements

### Domain: Input Validation

#### SR-001: Validate Search Query Input

**Priority:** HIGH | **Type:** Functional

As a security-conscious system,
I need to validate and sanitize all search input,
So that malicious scripts cannot be injected into the application.

**Acceptance Criteria:**
- [ ] Search queries are sanitized before processing
- [ ] Maximum query length is enforced (100 chars)
- [ ] Special characters are escaped or rejected
- [ ] XSS payloads are neutralized

**Test Cases:**
1. Test: `<script>alert(1)</script>` is sanitized
2. Test: Query longer than 100 chars is truncated
3. Test: SQL injection patterns are rejected
4. Test: URL-encoded payloads are decoded and validated

**Threat References:** S-002, E-001

---

#### SR-002: Validate API Response Data

**Priority:** HIGH | **Type:** Functional

As a security-conscious system,
I need to validate all data received from external APIs,
So that malformed or malicious data cannot compromise the application.

**Acceptance Criteria:**
- [ ] API responses are validated against expected schema
- [ ] Unexpected data types are handled gracefully
- [ ] Null/undefined values are checked before use
- [ ] Array bounds are verified

**Test Cases:**
1. Test: Malformed JSON response is handled
2. Test: Missing required fields don't crash the app
3. Test: Array with unexpected length is handled
4. Test: Invalid data types are logged and rejected

**Threat References:** T-001, T-002

---

### Domain: Error Handling

#### SR-003: Implement Secure Error Messages

**Priority:** MEDIUM | **Type:** Functional

As a security-conscious system,
I need to display sanitized error messages to users,
So that sensitive system information is not leaked.

**Acceptance Criteria:**
- [ ] Error messages don't expose stack traces
- [ ] Internal URLs are not shown to users
- [ ] Generic messages are shown for unexpected errors
- [ ] Detailed errors are logged server-side only

**Test Cases:**
1. Test: API error doesn't show full URL with tokens
2. Test: Network error shows generic message
3. Test: Stack trace is not visible in production
4. Test: Error logging includes context for debugging

**Threat References:** I-002

---

### Domain: Audit Logging

#### SR-004: Implement Security Event Logging

**Priority:** MEDIUM | **Type:** Functional

As a security analyst,
I need to log security-relevant events,
So that I can investigate security incidents.

**Acceptance Criteria:**
- [ ] Failed API requests are logged
- [ ] Rate limiting events are recorded
- [ ] Error events include context and timestamp
- [ ] Logs don't contain sensitive user data

**Test Cases:**
1. Test: API failures generate log entries
2. Test: Log entries include timestamp and context
3. Test: Logs are structured for analysis
4. Test: Sensitive data is masked in logs

**Threat References:** R-001, R-002

---

### Domain: Availability

#### SR-005: Implement API Rate Limiting Protection

**Priority:** HIGH | **Type:** Functional

As a security-conscious system,
I need to protect against API rate limiting exhaustion,
So that the application remains available under rate limit conditions.

**Acceptance Criteria:**
- [ ] Exponential backoff is implemented for retries
- [ ] Maximum retry attempts are enforced
- [ ] Rate limit responses are cached appropriately
- [ ] User is notified of rate limit status

**Test Cases:**
1. Test: Backoff increases exponentially
2. Test: Retry stops after max attempts
3. Test: User sees appropriate rate limit message
4. Test: Cached data is shown during rate limit

**Threat References:** D-001

---

### Domain: Data Protection

#### SR-006: Secure LocalStorage Usage

**Priority:** LOW | **Type:** Functional

As a security-conscious system,
I need to validate data read from localStorage,
So that tampered data cannot affect application behavior.

**Acceptance Criteria:**
- [ ] LocalStorage data is validated before use
- [ ] Invalid theme values default to system preference
- [ ] Storage access is wrapped in try-catch
- [ ] No sensitive data is stored in localStorage

**Test Cases:**
1. Test: Invalid theme value defaults correctly
2. Test: Corrupted storage doesn't crash app
3. Test: Storage quota exceeded is handled
4. Test: No API keys in localStorage

**Threat References:** T-003, S-003

---

#### SR-007: Prevent Console Data Leakage in Production

**Priority:** LOW | **Type:** Functional

As a security-conscious system,
I need to disable verbose logging in production,
So that sensitive information is not exposed in browser console.

**Acceptance Criteria:**
- [ ] Console.log is stripped in production build
- [ ] Debug information is only available in dev mode
- [ ] Error details are not logged to console in production
- [ ] Source maps are not exposed in production

**Test Cases:**
1. Test: Production build has no console.log
2. Test: Debug mode flag controls logging
3. Test: Errors are logged to service, not console
4. Test: Source maps are protected or absent

**Threat References:** I-003

---

### Domain: Network Security

#### SR-008: Secure External API Communication

**Priority:** HIGH | **Type:** Functional

As a security-conscious system,
I need to ensure secure communication with external APIs,
So that data in transit is protected from interception.

**Acceptance Criteria:**
- [ ] All API calls use HTTPS
- [ ] Certificate validation is enforced
- [ ] Request timeout prevents hanging connections
- [ ] CORS policies are properly configured

**Test Cases:**
1. Test: HTTP requests are rejected
2. Test: Self-signed certificates are rejected
3. Test: Requests timeout after configured duration
4. Test: Cross-origin errors are handled gracefully

**Threat References:** I-004, T-001

---

### Domain: Cryptography

#### SR-009: No Hardcoded Secrets

**Priority:** CRITICAL | **Type:** Constraint

As a security-conscious system,
I need to ensure no secrets are hardcoded,
So that credentials cannot be extracted from source code.

**Acceptance Criteria:**
- [ ] No API keys in source code
- [ ] No passwords in configuration files
- [ ] Environment variables are used for secrets
- [ ] .env files are excluded from git

**Test Cases:**
1. Test: Grep for common secret patterns returns empty
2. Test: No API keys in bundled JavaScript
3. Test: .env is in .gitignore
4. Test: Secrets are loaded from environment

**Threat References:** I-001

---

## Implementation Checklist

### Immediate Actions (HIGH Priority)

- [ ] **SR-001**: Add input sanitization to SearchBar
- [ ] **SR-002**: Add response validation to API client
- [ ] **SR-005**: Verify rate limiting handling
- [ ] **SR-008**: Ensure HTTPS-only API calls
- [ ] **SR-009**: Audit for hardcoded secrets

### Short-term Actions (MEDIUM Priority)

- [ ] **SR-003**: Review error messages for information leakage
- [ ] **SR-004**: Implement security event logging
- [ ] **SR-007**: Strip console.log in production

### Long-term Actions (LOW Priority)

- [ ] **SR-006**: Add localStorage validation wrapper

---

## Code Recommendations

### 1. Input Sanitization (SearchBar)

```typescript
// src/utils/sanitize.ts
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '')           // Remove < and >
    .replace(/javascript:/gi, '')   // Remove javascript:
    .replace(/on\w+=/gi, '')        // Remove event handlers
    .slice(0, 100)                  // Limit length
    .trim();
}
```

### 2. API Response Validation

```typescript
// src/utils/validation.ts
import { z } from 'zod';

const CryptocurrencySchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  current_price: z.number().nullable(),
  // ... other fields
});

export function validateCryptoResponse(data: unknown): Cryptocurrency[] {
  const result = z.array(CryptocurrencySchema).safeParse(data);
  if (!result.success) {
    console.error('Validation error:', result.error);
    return [];
  }
  return result.data;
}
```

### 3. Secure Error Handling

```typescript
// src/utils/errors.ts
export function getSafeErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Rate limit reached. Please wait a moment.';
    }
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
```

### 4. Production Logging

```typescript
// src/utils/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => isDev && console.log(...args),
  error: (...args: unknown[]) => isDev && console.error(...args),
  warn: (...args: unknown[]) => isDev && console.warn(...args),
};
```

---

## Compliance Mapping

| Requirement | OWASP ASVS | NIST CSF |
|-------------|------------|----------|
| SR-001 | V5.3.1 - Input Validation | PR.AC-4 |
| SR-002 | V5.3.3 - Schema Validation | PR.DS-6 |
| SR-003 | V7.1.1 - Error Handling | PR.DS-5 |
| SR-004 | V7.3.1 - Audit Logging | DE.AE-3 |
| SR-005 | V11.1.1 - Rate Limiting | PR.DS-4 |
| SR-008 | V6.1.1 - TLS | PR.DS-2 |
| SR-009 | V2.10.1 - No Hardcoded Secrets | PR.AC-3 |

---

## Summary

**Total Requirements:** 9
- CRITICAL: 1
- HIGH: 4
- MEDIUM: 2
- LOW: 2

**Risk Assessment:** MEDIUM

The application is a client-side only dashboard with no authentication or user data storage, which limits the attack surface. The main risks are:
1. XSS via search input
2. API response tampering
3. Information disclosure via error messages

All identified risks have documented mitigations above.
