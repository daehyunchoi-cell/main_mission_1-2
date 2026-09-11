import styles from './Field.module.css';

// 라벨 + 오류 메시지 구조를 한 곳에 모아, 입력 컴포넌트들이 공통으로 쓴다.
function Field({ id, label, error, hint, required, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && <p className={styles.hint}>{hint}</p>
      )}
    </div>
  );
}

export default Field;
export { styles as fieldStyles };