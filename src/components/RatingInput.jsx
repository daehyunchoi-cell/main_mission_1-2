import Field from './Field';
import styles from './RatingInput.module.css';

const SCORES = [1, 2, 3, 4, 5];
const LABELS = {
  1: '별로예요',
  2: '아쉬워요',
  3: '괜찮아요',
  4: '좋아요',
  5: '최고예요',
};

function RatingInput({ id, label = '평점', value = 0, onChange, error, required }) {
  return (
    <Field id={id} label={label} error={error} required={required}>
      <div className={styles.wrap} role="group" aria-label="평점 선택">
        {SCORES.map((score) => (
          <button
            key={score}
            type="button"
            className={`${styles.star} ${score <= value ? styles.filled : ''}`}
            onClick={() => onChange(score)}
            aria-label={`${score}점`}
            aria-pressed={score === value}
          >
            ★
          </button>
        ))}
        {value > 0 && <span className={styles.caption}>{LABELS[value]}</span>}
      </div>
    </Field>
  );
}

export default RatingInput;