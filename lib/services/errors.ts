export type ServiceErrorCode = 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST' | 'CONFLICT';

/**
 * Ошибка бизнес-логики — бросается из сервисов, перехватывается в route handlers.
 * Код маппится на HTTP-статус: NOT_FOUND→404, FORBIDDEN→403, BAD_REQUEST→400, CONFLICT→409.
 */
export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const HTTP_STATUS: Record<ServiceErrorCode, number> = {
  NOT_FOUND:   404,
  FORBIDDEN:   403,
  BAD_REQUEST: 400,
  CONFLICT:    409,
};
