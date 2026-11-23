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

/** One review as Google Maps returns it right now (GET /api/reviews). */
export interface LiveReview {
  author: string;
  /** Reviewer's Google Maps profile (required attribution link). */
  authorUrl: string;
  authorPhoto: string;
  rating: number;
  text: string;
  /** e.g. "2 weeks ago". */
  relativeTime: string;
  /** ISO date-time the review was posted. */
  publishTime: string;
  /** The review on Google Maps (required source link). */
  mapsUrl: string;
}

/** Live Google rating and up to 5 reviews (Google orders them by relevance). Null when not set up. */
export interface LiveReviewsResponse {
  rating: number;
  count: number;
  reviews: LiveReview[];
}

export interface CoverageResponse {
  postcode: string;
  covered: boolean;
}
