'use client';

import { useDevice } from '@/components/device/DeviceProvider';
import { Icon } from '@/components/ui/Icon';
import styles from './Site.module.css';

export function CopyEmail({ email }: { email: string }) {
  const { showToast } = useDevice();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied.');
    } catch {
      showToast(email);
    }
  };

  return (
    <button type="button" className={styles.copy} onClick={copy} aria-label={`Copy ${email}`}>
      <Icon name="copy" />
    </button>
  );
}
