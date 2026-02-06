/**
 * Network State Module
 *
 * Simple module-level state to simulate offline mode.
 * Used by API service to throw network errors when offline mode is enabled.
 */

let isOfflineMode = false;

export function setOfflineMode(enabled: boolean): void {
  isOfflineMode = enabled;
}

export function getIsOfflineMode(): boolean {
  return isOfflineMode;
}

export class OfflineError extends Error {
  constructor() {
    super('No internet connection. Please check your network and try again.');
    this.name = 'OfflineError';
  }
}
