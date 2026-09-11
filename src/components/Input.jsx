import Field, { fieldStyles as styles } from './Field';

function Input({ id, label, error, hint, required, ...rest }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </Field>
  );
}

export default Input;