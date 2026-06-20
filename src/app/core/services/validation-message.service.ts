import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Service for generating user-friendly validation error messages.
 * Encapsulates validation logic for better testability and reusability.
 */
@Injectable({ providedIn: 'root' })
export class ValidationMessageService {
  /**
   * Generates a validation error message based on form control errors.
   * Returns empty string if no errors to display.
   *
   * @param errors - Validation errors from FormControl
   * @param minGrams - Minimum allowed grams (for min validation message)
   * @param maxGrams - Maximum allowed grams (for max validation message)
   * @param minCups - Minimum cups equivalent (for min validation message)
   * @param maxCups - Maximum cups equivalent (for max validation message)
   * @returns User-friendly error message string
   */
  getValidationMessage(
    errors: ValidationErrors | null,
    minGrams: number,
    maxGrams: number,
    minCups: number,
    maxCups: number
  ): string {
    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return 'Add how many grams of coffee you have.';
    }

    if (errors['min']) {
      return `Use at least ${minGrams.toFixed(2)}g for about ${minCups} cup.`;
    }

    if (errors['max']) {
      return `This french press holds up to ${maxCups} cups. Use ${maxGrams.toFixed(0)}g or less.`;
    }

    return 'Enter a valid coffee amount.';
  }
}
