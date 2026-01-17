import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}
