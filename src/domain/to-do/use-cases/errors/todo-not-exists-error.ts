import { UseCaseError } from 'src/core/errors/use-case-error';

export class TodoNotExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Todo "${identifier}" not exists.`);
  }
}
