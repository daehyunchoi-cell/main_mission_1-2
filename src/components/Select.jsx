import Field, { fieldStyles as styles } from './Field';

function Select({ id, label, error, hint, required, options = [], placeholder, ...rest }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

export default Select;