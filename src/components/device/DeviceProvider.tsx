'use client';

import type { Transition } from 'motion/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'developer-options';

/** The same choices Android offers for "Animator duration scale". 0 turns animation off. */
export const ANIMATOR_SCALES = [0, 0.5, 1, 1.5, 2, 5, 10] as const;

export function scaleLabel(scale: number): string {
  return scale === 0 ? 'Animation off' : `Animation scale ${scale}x`;
}

type DeveloperSettings = { unlocked: boolean; bounds: boolean; scale: number };
type Toast = { id: number; text: string };
type Dialog = 'animatorScale' | null;

type DeviceContextValue = {
  devUnlocked: boolean;
  bounds: boolean;
  animScale: number;
  setDevUnlocked: (on: boolean) => void;
  setBounds: (on: boolean) => void;
  setAnimScale: (scale: number) => void;
  toast: Toast | null;
  showToast: (text: string) => void;
  dialog: Dialog;
  setDialog: (dialog: Dialog) => void;
  /** A spring whose length follows the animator scale. */
  spring: (seconds: number, bounce?: number) => Transition;
  /** Milliseconds scaled by the animator scale. */
  ms: (base: number) => number;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function useDevice(): DeviceContextValue {
  const value = useContext(DeviceContext);
  if (!value) throw new Error('useDevice must be used inside <DeviceProvider>');
  return value;
}

const LOCKED: DeveloperSettings = { unlocked: false, bounds: false, scale: 1 };

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readSaved(): Partial<DeveloperSettings> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<DeveloperSettings>;
  } catch {
    return {};
  }
}

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DeveloperSettings>(LOCKED);
  const [toast, setToast] = useState<Toast | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // The server can't read localStorage, so saved options are applied after hydration.
  useEffect(() => {
    const saved = readSaved();
    const reduceMotion = prefersReducedMotion();
    if (saved.unlocked) {
      setSettings({
        unlocked: true,
        bounds: Boolean(saved.bounds),
        scale: typeof saved.scale === 'number' ? saved.scale : reduceMotion ? 0 : 1,
      });
    } else if (reduceMotion) {
      setSettings((current) => ({ ...current, scale: 0 }));
    }
  }, []);

  // CSS animations (entrances, ripples) read the scale from --anim.
  useEffect(() => {
    document.documentElement.style.setProperty('--anim', String(settings.scale));
  }, [settings.scale]);

  const update = useCallback((patch: Partial<DeveloperSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage blocked (private mode): the setting lasts for this visit only.
      }
      return next;
    });
  }, []);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const value = useMemo<DeviceContextValue>(
    () => ({
      devUnlocked: settings.unlocked,
      bounds: settings.unlocked && settings.bounds,
      animScale: settings.scale,
      setDevUnlocked: (on) =>
        update(on ? { unlocked: true } : { ...LOCKED, scale: prefersReducedMotion() ? 0 : 1 }),
      setBounds: (on) => update({ bounds: on }),
      setAnimScale: (scale) => update({ scale }),
      toast,
      showToast,
      dialog,
      setDialog,
      spring: (seconds, bounce = 0.12) =>
        settings.scale === 0 ? { duration: 0 } : { type: 'spring', duration: seconds * settings.scale, bounce },
      ms: (base) => base * settings.scale,
    }),
    [settings, toast, dialog, update, showToast],
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}
