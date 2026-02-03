/**
 * Logger Tests
 *
 * Tests PHI redaction functionality to ensure HIPAA compliance.
 * These tests verify that sensitive patient data is never logged.
 */

// Mock __DEV__ before importing logger
declare const global: { __DEV__: boolean };
global.__DEV__ = true;

// We need to test the redaction logic directly since console methods are mocked
import logger from '@/utils/logger';

describe('logger', () => {
  let consoleSpy: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    // Create fresh spies for each test
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper to get the last logged output for a given spy
  const getLastLog = (spy: jest.SpyInstance): string => {
    const calls = spy.mock.calls;
    return calls[calls.length - 1][0];
  };

  describe('PHI redaction', () => {
    it('redacts patientId from logged data', () => {
      const data = { patientId: 'pat_12345', status: 'completed' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('[REDACTED]');
      expect(loggedOutput).not.toContain('pat_12345');
      expect(loggedOutput).toContain('completed');
    });

    it('redacts patientInitials from logged data', () => {
      const data = { patientInitials: 'JD', encounterType: 'therapy_session' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('[REDACTED]');
      expect(loggedOutput).not.toContain('"JD"');
      expect(loggedOutput).toContain('therapy_session');
    });

    it('redacts notes from logged data', () => {
      const data = {
        notes: 'Patient reported feeling anxious about work',
        duration: 60,
      };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('[REDACTED]');
      expect(loggedOutput).not.toContain('anxious');
      expect(loggedOutput).toContain('60');
    });

    it('redacts assessments from logged data', () => {
      const data = {
        assessments: [{ type: 'GAD-7', score: 15 }],
        status: 'completed',
      };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('[REDACTED]');
      expect(loggedOutput).not.toContain('GAD-7');
      // Note: '15' might appear in timestamps, so check the assessment context
      expect(loggedOutput).not.toContain('"score": 15');
    });

    it('redacts nested sensitive fields', () => {
      const data = {
        encounter: {
          id: 'enc_001',
          patient: {
            patientId: 'pat_secret',
            patientInitials: 'XX',
          },
        },
      };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('enc_001');
      expect(loggedOutput).not.toContain('pat_secret');
      expect(loggedOutput).not.toContain('"XX"');
    });

    it('redacts sensitive fields in arrays', () => {
      const data = {
        encounters: [
          { id: 'enc_001', patientId: 'pat_001' },
          { id: 'enc_002', patientId: 'pat_002' },
        ],
      };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('enc_001');
      expect(loggedOutput).toContain('enc_002');
      expect(loggedOutput).not.toContain('pat_001');
      expect(loggedOutput).not.toContain('pat_002');
    });

    it('redacts email field', () => {
      const data = { email: 'patient@example.com', status: 'active' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).not.toContain('patient@example.com');
    });

    it('redacts phone field', () => {
      const data = { phone: '555-123-4567', status: 'active' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).not.toContain('555-123-4567');
    });

    it('redacts ssn field', () => {
      const data = { ssn: '123-45-6789', name: 'safe' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).not.toContain('123-45-6789');
    });

    it('redacts dateOfBirth field', () => {
      const data = { dateOfBirth: '1990-01-15', status: 'active' };
      logger.info('Test message', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).not.toContain('1990-01-15');
    });
  });

  describe('log levels', () => {
    it('logs info messages', () => {
      logger.info('Info message');

      expect(consoleSpy.info).toHaveBeenCalled();
      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('[INFO]');
      expect(loggedOutput).toContain('Info message');
    });

    it('logs warn messages', () => {
      logger.warn('Warning message');

      expect(consoleSpy.warn).toHaveBeenCalled();
      const loggedOutput = getLastLog(consoleSpy.warn);
      expect(loggedOutput).toContain('[WARN]');
    });

    it('logs error messages with error object', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(consoleSpy.error).toHaveBeenCalled();
      const loggedOutput = getLastLog(consoleSpy.error);
      expect(loggedOutput).toContain('[ERROR]');
      expect(loggedOutput).toContain('Test error');
    });

    it('logs error messages with context data', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error, { encounterId: 'enc_001' });

      const loggedOutput = getLastLog(consoleSpy.error);
      expect(loggedOutput).toContain('enc_001');
    });
  });

  describe('safe fields', () => {
    it('preserves encounter ID', () => {
      const data = { id: 'enc_12345', patientId: 'secret' };
      logger.info('Test', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('enc_12345');
    });

    it('preserves encounterDate', () => {
      const data = { encounterDate: '2024-01-15T10:00:00Z', patientId: 'secret' };
      logger.info('Test', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('2024-01-15T10:00:00Z');
    });

    it('preserves encounterType', () => {
      const data = { encounterType: 'therapy_session', patientId: 'secret' };
      logger.info('Test', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('therapy_session');
    });

    it('preserves duration', () => {
      const data = { duration: 60, patientId: 'secret' };
      logger.info('Test', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('60');
    });

    it('preserves status', () => {
      const data = { status: 'completed', patientId: 'secret' };
      logger.info('Test', data);

      const loggedOutput = getLastLog(consoleSpy.info);
      expect(loggedOutput).toContain('completed');
    });
  });

  describe('edge cases', () => {
    it('handles null data', () => {
      expect(() => logger.info('Test', null)).not.toThrow();
    });

    it('handles undefined data', () => {
      expect(() => logger.info('Test', undefined)).not.toThrow();
    });

    it('handles empty object', () => {
      expect(() => logger.info('Test', {})).not.toThrow();
    });

    it('handles primitive data', () => {
      expect(() => logger.info('Test', 'string')).not.toThrow();
      expect(() => logger.info('Test', 123)).not.toThrow();
      expect(() => logger.info('Test', true)).not.toThrow();
    });
  });
});
