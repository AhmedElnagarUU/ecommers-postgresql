export function catchError<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  return promise
    .then((data: T) => [null, data] as [null, T])
    .catch((err: Error) => [err, null]);
}