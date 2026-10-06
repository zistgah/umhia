/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/**
 * Physical motion authorization.
 * Live acquisition consent is separate from test-mode fixtures.
 * A stop or revoke overrides any automatic command.
 */
export function createAuth() {
  const grants = new Map();
  return {
    grant({ deviceId, sessionId, ms = 15 * 60 * 1000, now = Date.now() }) {
      const rec = { deviceId, sessionId, grantedAt: now, expiresAt: now + ms, revoked: false, stopped: false };
      grants.set(deviceId, rec);
      return rec;
    },
    revoke(deviceId) {
      const rec = grants.get(deviceId);
      if (rec) rec.revoked = true;
      return rec || null;
    },
    stop(deviceId) {
      const rec = grants.get(deviceId);
      if (rec) rec.stopped = true;
      return { deviceId, stopped: true, precedence: "manual-override" };
    },
    canMove(deviceId, sessionId, now = Date.now()) {
      const rec = grants.get(deviceId);
      if (!rec) return { ok: false, reason: "no-authorization" };
      if (rec.stopped) return { ok: false, reason: "manual-stop" };
      if (rec.revoked) return { ok: false, reason: "revoked" };
      if (rec.sessionId !== sessionId) return { ok: false, reason: "session-mismatch" };
      if (now > rec.expiresAt) return { ok: false, reason: "expired" };
      return { ok: true, reason: "authorized" };
    }
  };
}

export function acquisitionGate({ live = false, testMode = false, consent = false }) {
  if (testMode && !live) return { open: true, reason: "test-mode" };
  if (live && !consent) return { open: false, reason: "consent-required" };
  return { open: true, reason: consent ? "consent-recorded" : "not-live" };
}
