/** Uniform JSON envelope returned by every API endpoint. */
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  error: { code: string; message: string; fields?: Record<string, string> };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface CreateEnquiryResponse {
  id: string;
  reference: string;
}

export interface CoverageResponse {
  postcode: string;
  covered: boolean;
}
