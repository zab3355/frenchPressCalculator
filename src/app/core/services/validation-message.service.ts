import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Caller-supplied copy for each validation state a range-bound
 * numeric field can be in.
 */
export interface ValidationRangeMessages {
  requiredMessage: string;
  minMessage: string;
  maxMessage: string;
  invalidMessage?: string;
}

/**
 * Resolves a `FormControl`'s validation errors into a single
 * user-facing message. Callers own their own copy; this service
 * only decides which message applies.
 */
@Injectable({ providedIn: 'root' })
export class ValidationMessageService {
  getValidationMessage(
    errors: ValidationErrors | null,
    messages: ValidationRangeMessages
  ): string {
    if (!errors || Object.keys(errors).length === 0) {
      return '';
    }

    if (errors['required']) {
      return messages.requiredMessage;
    }

    if (errors['min']) {
      return messages.minMessage;
    }

    if (errors['max']) {
      return messages.maxMessage;
    }

    return messages.invalidMessage ?? 'Enter a valid amount.';
  }
}
