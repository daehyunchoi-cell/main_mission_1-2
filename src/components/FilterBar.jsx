import styles from './FilterBar.module.css';

function FilterBar({ options = [], value, onChange, ariaLabel = '필터' }) {
  return (
    <div className={styles.bar} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.chip} ${option.value === value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;