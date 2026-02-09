/**
 * Frontend event tracking. Console-based for now; replace sendEvent
 * with GA gtag(), Mixpanel track(), etc. when integrating.
 */

export type TrackProperties = Record<string, string | number | boolean | string[] | undefined>;

export function track(event: string, properties?: TrackProperties): void {
  const payload = { event, ...properties, timestamp: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    console.log('[Track]', event, payload);
  }
  // Later: sendEvent(event, properties);
}
