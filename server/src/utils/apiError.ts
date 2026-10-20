export interface FieldError {
  field: string;
  message: string;
}

// Errors that are safe to show to clients. Anything else becomes a generic 500.
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: FieldError[] | undefined;

  constructor(status: number, code: string, message: string, fields?: FieldError[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
