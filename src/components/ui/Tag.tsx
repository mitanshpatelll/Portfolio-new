import type { Tag as TagData } from '@/content/profile';
import { brands, type Brand } from './brands';
import styles from './Tag.module.css';

/** Brand logos in a single colour (the text colour), to keep the page calm. */
export function BrandIcon({ brand, size = 12 }: { brand: Brand; size?: number }) {
  const { path } = brands[brand];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ flex: 'none' }}
    >
      <path d={path} />
    </svg>
  );
}

export function Tag({ tag }: { tag: TagData }) {
  return (
    <span className={styles.tag}>
      {tag.brand && <BrandIcon brand={tag.brand} />}
      {tag.label}
    </span>
  );
}

export function TagList({ tags }: { tags: TagData[] }) {
  return (
    <ul className={styles.list}>
      {tags.map((tag) => (
        <li key={tag.label}>
          <Tag tag={tag} />
        </li>
      ))}
    </ul>
  );
}
