import Field, { fieldStyles as styles } from './Field';

function Textarea({ id, label, error, hint, required, value = '', maxLength, ...rest }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        className={`${styles.control} ${styles.textarea} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {maxLength && (
        <span className={styles.counter}>
          {value.length} / {maxLength}
        </span>
      )}
    </Field>
  );
}

export default Textarea;