import { TestBed } from '@angular/core/testing';
import { ValidationMessageService } from './validation-message.service';

describe('ValidationMessageService', () => {
  let service: ValidationMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationMessageService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getValidationMessage', () => {
    const minGrams = 3.75;
    const maxGrams = 90;
    const minCups = 0.25;
    const maxCups = 6;

    it('returns empty string when errors are null', () => {
      const message = service.getValidationMessage(null, minGrams, maxGrams, minCups, maxCups);
      expect(message).toBe('');
    });

    it('returns empty string when errors object is empty', () => {
      const message = service.getValidationMessage({}, minGrams, maxGrams, minCups, maxCups);
      expect(message).toBe('');
    });

    it('returns required message for required error', () => {
      const errors = { required: true };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toBe('Add how many grams of coffee you have.');
    });

    it('returns min message with correct values', () => {
      const errors = { min: { min: minGrams, actual: 1 } };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toContain('Use at least');
      expect(message).toContain('3.75g');
      expect(message).toContain('0.25');
    });

    it('returns max message with correct values', () => {
      const errors = { max: { max: maxGrams, actual: 100 } };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toContain('french press holds up to');
      expect(message).toContain('6');
      expect(message).toContain('90g');
    });

    it('prioritizes required error over others', () => {
      const errors = { required: true, min: true, max: true };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toBe('Add how many grams of coffee you have.');
    });

    it('returns min message if required is not present', () => {
      const errors = { min: true, max: true };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toContain('Use at least');
    });

    it('returns max message if only max error exists', () => {
      const errors = { max: true };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toContain('french press holds up to');
    });

    it('returns generic message for unknown error types', () => {
      const errors = { customError: true };
      const message = service.getValidationMessage(errors, minGrams, maxGrams, minCups, maxCups);

      expect(message).toBe('Enter a valid coffee amount.');
    });

    it('formats min value with 2 decimal places', () => {
      const errors = { min: true };
      const message = service.getValidationMessage(errors, 3.7, maxGrams, minCups, maxCups);

      expect(message).toContain('3.70g');
    });

    it('formats max value as integer without decimals', () => {
      const errors = { max: true };
      const message = service.getValidationMessage(errors, minGrams, 89.5, minCups, maxCups);

      expect(message).toContain('89g');
    });
  });
});
