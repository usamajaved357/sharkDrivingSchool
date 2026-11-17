/**
 * Typed client for apps/api. All network calls from the browser go through here.
 */
import type {
  ApiResponse,
  AvailabilityResponse,
  BookingRequest,
  CoverageResponse,
  CreateBookingResponse,
} from '@shark/shared';

const BASE = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('We could not reach the server. Please check your connection or call us.', 'NETWORK');
  }
  let body: ApiResponse<T>;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Unexpected server response. Please call us to book.', 'BAD_RESPONSE');
  }
  if (!body.ok) throw new ApiError(body.error.message, body.error.code, body.error.fields);
  return body.data;
}

export const getAvailability = (date: string) =>
  request<AvailabilityResponse>(`/availability?date=${encodeURIComponent(date)}`);

export const createBooking = (booking: BookingRequest) =>
  request<CreateBookingResponse>('/bookings', { method: 'POST', body: JSON.stringify(booking) });

export const checkCoverage = (postcode: string) =>
  request<CoverageResponse>(`/coverage?postcode=${encodeURIComponent(postcode)}`);
