import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
