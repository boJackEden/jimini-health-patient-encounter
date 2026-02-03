/**
 * PHI-Safe Logger
 *
 * HIPAA Compliance: This logger automatically redacts sensitive PHI/PII fields
 * before outputting to console. In production, this would integrate with a
 * secure logging service (e.g., Datadog, Sentry) with proper PHI handling.
 *
 * Sensitive fields that are ALWAYS redacted:
 * - patientId
 * - patientInitials
 * - notes (clinical notes content)
 * - assessments (clinical assessment data)
 *
 * Safe fields that are logged:
 * - id (encounter ID)
 * - encounterDate
 * - encounterType
 * - duration
 * - status
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const REDACTED = '[REDACTED]';

// Fields that contain PHI/PII and must never be logged
const SENSITIVE_FIELDS = new Set([
  'patientId',
  'patientInitials',
  'notes',
  'assessments',
  'patientName',
  'email',
  'phone',
  'address',
  'ssn',
  'dateOfBirth',
  'dob',
]);

/**
 * Recursively redacts sensitive fields from an object
 */
function redactSensitiveData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item)) as T;
  }

  if (typeof data === 'object') {
    const redacted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.has(key)) {
        redacted[key] = REDACTED;
      } else if (typeof value === 'object' && value !== null) {
        redacted[key] = redactSensitiveData(value);
      } else {
        redacted[key] = value;
      }
    }

    return redacted as T;
  }

  return data;
}

/**
 * Formats log output with timestamp and level
 */
function formatLog(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data !== undefined) {
    const safeData = redactSensitiveData(data);
    return `${prefix} ${message} ${JSON.stringify(safeData, null, 2)}`;
  }

  return `${prefix} ${message}`;
}

/**
 * Development-only flag - in production, this would be controlled by environment
 */
const isDev = __DEV__;

export const logger = {
  /**
   * Debug level - only logged in development
   */
  debug(message: string, data?: unknown): void {
    if (isDev) {
      console.debug(formatLog('debug', message, data));
    }
  },

  /**
   * Info level - general information
   */
  info(message: string, data?: unknown): void {
    console.info(formatLog('info', message, data));
  },

  /**
   * Warn level - potential issues
   */
  warn(message: string, data?: unknown): void {
    console.warn(formatLog('warn', message, data));
  },

  /**
   * Error level - errors and exceptions
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorInfo =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;

    console.error(
      formatLog('error', message, { error: errorInfo, context: data })
    );
  },

  /**
   * Log API request (redacts body if contains PHI)
   */
  apiRequest(method: string, url: string, params?: unknown): void {
    if (isDev) {
      this.debug(`API Request: ${method} ${url}`, params);
    }
  },

  /**
   * Log API response (redacts PHI in response body)
   */
  apiResponse(
    method: string,
    url: string,
    status: number,
    data?: unknown
  ): void {
    if (isDev) {
      this.debug(`API Response: ${method} ${url} [${status}]`, data);
    }
  },
};

export default logger;
