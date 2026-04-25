'use client';

function hasWindow() {
  return typeof window !== 'undefined';
}

export function readLocalStorage(key: string) {
  if (!hasWindow()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string) {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLocalStorage(key: string) {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function safeLocalStorageRemove(key: string) {
  return removeLocalStorage(key);
}

export function readSessionStorage(key: string) {
  if (!hasWindow()) {
    return null;
  }

  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSessionStorage(key: string, value: string) {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeSessionStorageRemove(key: string) {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function dispatchBrowserEvent(name: string, detail?: Record<string, unknown>) {
  if (!hasWindow()) {
    return;
  }

  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {
    // Ignore browsers that block synthetic events in restricted modes.
  }
}
