import type { LiveReview, LiveReviewsResponse } from '@shark/shared';
import type { AppConfig } from '../config';
import { HttpError } from '../lib/errors';

/** The parts of a Places API (New) Place we ask for. */
interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    publishTime?: string;
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
}

const FIELD_MASK = 'rating,userRatingCount,reviews';

/**
 * Reads the business's live Google rating and reviews from the Places API (New).
 * Nothing is stored: Google's terms don't allow saving review content, so every call asks
 * Google. Google returns at most 5 reviews, ordered by relevance (no "newest" option).
 */
export class GoogleReviewsService {
  constructor(private readonly cfg: AppConfig['google']) {}

  get configured(): boolean {
    return Boolean(this.cfg.placesApiKey);
  }

  /** Live rating and reviews, or null when no API key is set up. */
  async get(): Promise<LiveReviewsResponse | null> {
    if (!this.cfg.placesApiKey) return null;
    const base = this.cfg.placesApiUrl ?? 'https://places.googleapis.com/v1';
    const res = await fetch(`${base}/places/${encodeURIComponent(this.cfg.placeId)}?languageCode=en`, {
      headers: { 'X-Goog-Api-Key': this.cfg.placesApiKey, 'X-Goog-FieldMask': FIELD_MASK },
    });
    if (!res.ok) {
      // Includes quota exhaustion (429) once the daily limit is reached; the site then keeps its own reviews.
      console.error(`[reviews] Google Places ${res.status}: ${(await res.text()).slice(0, 300)}`);
      throw new HttpError(502, 'REVIEWS_UNAVAILABLE', 'Live reviews are unavailable right now.');
    }
    const place = (await res.json()) as PlacesResponse;
    const reviews: LiveReview[] = (place.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName?.trim() ?? '',
        authorUrl: r.authorAttribution?.uri ?? '',
        authorPhoto: r.authorAttribution?.photoUri ?? '',
        rating: Math.round(r.rating ?? 0),
        text: (r.originalText?.text ?? r.text?.text ?? '').trim(),
        relativeTime: r.relativePublishTimeDescription ?? '',
        publishTime: r.publishTime ?? '',
        mapsUrl: r.googleMapsUri ?? '',
      }))
      // Only written reviews with an author can be shown with the required attribution.
      .filter((r) => r.author && r.text && r.rating >= 1);
    return { rating: place.rating ?? 0, count: place.userRatingCount ?? 0, reviews };
  }
}
