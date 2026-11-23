import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoogleReviewsService } from './google-reviews.service';

const cfg = { placesApiKey: 'key123', placeId: 'ChIJtest' };

function mockGoogle(body: unknown, status = 200) {
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
    }),
  );
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe('GoogleReviewsService', () => {
  it('returns null (and calls nobody) when no API key is set up', async () => {
    const calls = mockGoogle({});
    expect(await new GoogleReviewsService({ placeId: 'x' }).get()).toBeNull();
    expect(calls).toHaveLength(0);
  });

  it('asks Google for only the rating, count and reviews, with the key in a header', async () => {
    const calls = mockGoogle({ rating: 5, userRatingCount: 19, reviews: [] });
    await new GoogleReviewsService(cfg).get();
    expect(calls[0]!.url).toBe('https://places.googleapis.com/v1/places/ChIJtest?languageCode=en');
    expect(calls[0]!.init?.headers).toEqual({ 'X-Goog-Api-Key': 'key123', 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' });
  });

  it('maps reviews with the attribution Google requires, and skips star-only ones', async () => {
    mockGoogle({
      rating: 4.9,
      userRatingCount: 20,
      reviews: [
        {
          rating: 5,
          text: { text: 'Translated' },
          originalText: { text: 'Passed first time!' },
          relativePublishTimeDescription: '2 days ago',
          publishTime: '2026-11-21T10:00:00Z',
          googleMapsUri: 'https://maps.google.com/review/1',
          authorAttribution: { displayName: 'New Learner', uri: 'https://maps.google.com/contrib/1', photoUri: 'https://lh3.googleusercontent.com/a/x' },
        },
        { rating: 5, authorAttribution: { displayName: 'Stars Only' } },
      ],
    });
    const out = await new GoogleReviewsService(cfg).get();
    expect(out).toEqual({
      rating: 4.9,
      count: 20,
      reviews: [
        {
          author: 'New Learner',
          authorUrl: 'https://maps.google.com/contrib/1',
          authorPhoto: 'https://lh3.googleusercontent.com/a/x',
          rating: 5,
          text: 'Passed first time!',
          relativeTime: '2 days ago',
          publishTime: '2026-11-21T10:00:00Z',
          mapsUrl: 'https://maps.google.com/review/1',
        },
      ],
    });
  });

  it('reports Google errors (e.g. the daily limit) as a 502 without leaking details', async () => {
    mockGoogle('quota exceeded', 429);
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(new GoogleReviewsService(cfg).get()).rejects.toMatchObject({ status: 502, code: 'REVIEWS_UNAVAILABLE' });
    expect(err).toHaveBeenCalled();
  });
});
