import { TestBed } from '@angular/core/testing';
import { ValidationMessageService } from './validation-message.service';

describe('ValidationMessageService', () => {
  let service: ValidationMessageService;

  const messages = {
    requiredMessage: 'This field is required.',
    minMessage: 'Value is too small.',
    maxMessage: 'Value is too large.',
    invalidMessage: 'This value is not valid.',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationMessageService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('returns an empty string when there are no errors', () => {
    expect(service.getValidationMessage(null, messages)).toBe('');
    expect(service.getValidationMessage({}, messages)).toBe('');
  });

  it('returns the required message for a required error', () => {
    expect(service.getValidationMessage({ required: true }, messages)).toBe(
      'This field is required.'
    );
  });

  it('returns the min message for a min error', () => {
    expect(service.getValidationMessage({ min: { min: 5, actual: 1 } }, messages)).toBe(
      'Value is too small.'
    );
  });

  it('returns the max message for a max error', () => {
    expect(service.getValidationMessage({ max: { max: 5, actual: 9 } }, messages)).toBe(
      'Value is too large.'
    );
  });

  it('returns the invalid message for an unrecognized error when provided', () => {
    expect(service.getValidationMessage({ integer: true }, messages)).toBe(
      'This value is not valid.'
    );
  });

  it('falls back to a generic message when invalidMessage is not provided', () => {
    const { invalidMessage, ...withoutInvalid } = messages;
    expect(service.getValidationMessage({ integer: true }, withoutInvalid)).toBe(
      'Enter a valid amount.'
    );
  });

  it('prioritizes required over min and max when multiple errors are present', () => {
    expect(
      service.getValidationMessage({ required: true, min: { min: 5, actual: 1 } }, messages)
    ).toBe('This field is required.');
  });
});
