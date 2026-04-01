/**
 * Client-side rate limiter for authentication operations.
 *
 * This is a defense-in-depth measure — Firebase Auth already has server-side
 * rate limiting (auth/too-many-requests), but adding a client-side check:
 *  - Prevents the UI from hammering Firebase with rapid retries
 *  - Gives immediate feedback without a network round-trip
 *  - Raises the cost of automated credential-stuffing scripts
 *
 * NOTE: Client-side rate limiting is NOT a substitute for server-side controls.
 *       It only makes attacks slightly more expensive for the attacker.
 */

interface RateLimiterOptions {
  /** Max number of attempts in the window */
  maxAttempts: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Lockout duration after exceeding maxAttempts (ms) */
  lockoutMs: number;
}

interface RateLimiterState {
  attempts: number;
  windowStart: number;
  lockedUntil: number | null;
}

const defaultOptions: RateLimiterOptions = {
  maxAttempts: 5,
  windowMs: 60_000,  // 1 minute sliding window
  lockoutMs: 120_000, // 2 minute lockout after 5 failures
};

/**
 * Create a named rate limiter that persists state across calls.
 * Different operations (sign-in, sign-up) should use separate limiters.
 */
export const createAuthRateLimiter = (options: Partial<RateLimiterOptions> = {}) => {
  const config: RateLimiterOptions = { ...defaultOptions, ...options };
  const state: RateLimiterState = {
    attempts: 0,
    windowStart: Date.now(),
    lockedUntil: null,
  };

  const check = (): { allowed: boolean; waitSeconds?: number } => {
    const now = Date.now();

    // Check if still in lockout period
    if (state.lockedUntil !== null && now < state.lockedUntil) {
      const waitSeconds = Math.ceil((state.lockedUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    // If lockout has expired, reset
    if (state.lockedUntil !== null && now >= state.lockedUntil) {
      state.attempts = 0;
      state.windowStart = now;
      state.lockedUntil = null;
    }

    // Slide the window if needed
    if (now - state.windowStart > config.windowMs) {
      state.attempts = 0;
      state.windowStart = now;
    }

    return { allowed: state.attempts < config.maxAttempts };
  };

  const record = (success: boolean) => {
    if (success) {
      // Reset on success
      state.attempts = 0;
      state.lockedUntil = null;
      return;
    }
    state.attempts++;
    if (state.attempts >= config.maxAttempts) {
      state.lockedUntil = Date.now() + config.lockoutMs;
    }
  };

  const getRemainingAttempts = (): number => {
    return Math.max(0, config.maxAttempts - state.attempts);
  };

  return { check, record, getRemainingAttempts };
};

// Pre-built limiters for the auth flows
export const emailSignInLimiter = createAuthRateLimiter({ maxAttempts: 5, windowMs: 60_000, lockoutMs: 120_000 });
export const emailSignUpLimiter = createAuthRateLimiter({ maxAttempts: 3, windowMs: 300_000, lockoutMs: 600_000 });
export const googleSignInLimiter = createAuthRateLimiter({ maxAttempts: 10, windowMs: 60_000, lockoutMs: 60_000 });
