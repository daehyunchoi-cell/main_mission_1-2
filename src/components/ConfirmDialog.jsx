import { useEffect } from 'react';
import Button from './Button';
import styles from './ConfirmDialog.module.css';

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  loading = false,
  onConfirm,
  onCancel,
}) {
  // 모달이 열려 있는 동안 Esc로 닫을 수 있게 한다.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.title} id="confirm-title">
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            취소
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;