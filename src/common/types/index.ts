export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface AsyncResult<T> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
