export function apiError(
  code: string,
  message: string,
  status: number,
  details?: object
): Response {
  return Response.json({ error: code, message, ...(details && { details }) }, { status })
}

export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json(data, { status })
}
