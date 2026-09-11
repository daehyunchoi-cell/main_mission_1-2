import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import RatingInput from './RatingInput';
import Button from './Button';
import { CONTENT_MAX, NAME_MAX, REGIONS } from '../lib/constants';
import { validateReview } from '../lib/validateReview';
import styles from './ReviewForm.module.css';

const EMPTY_VALUES = { name: '', region: '', rating: 0, content: '' };

function ReviewForm({
  initialValues = EMPTY_VALUES,
  submitLabel = '저장',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // 필드 하나의 값을 바꾼다. 이미 오류가 떠 있던 필드는 오류를 지운다.
  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    const nextErrors = validateReview(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.querySelector(`#review-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: values.name.trim(),
        region: values.region,
        rating: values.rating,
        content: values.content.trim(),
      });
    } catch (error) {
      setServerError(error.message || '저장에 실패했습니다. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError && (
        <p className={styles.serverError} role="alert">
          {serverError}
        </p>
      )}

      <Input
        id="review-name"
        label="가게명"
        required
        maxLength={NAME_MAX}
        value={values.name}
        error={errors.name}
        placeholder="예: 을지면옥"
        onChange={(event) => setField('name', event.target.value)}
      />

      <Select
        id="review-region"
        label="지역"
        required
        options={REGIONS}
        placeholder="지역을 선택하세요"
        value={values.region}
        error={errors.region}
        onChange={(event) => setField('region', event.target.value)}
      />

      <RatingInput
        id="review-rating"
        label="평점"
        required
        value={values.rating}
        error={errors.rating}
        onChange={(score) => setField('rating', score)}
      />

      <Textarea
        id="review-content"
        label="후기"
        required
        maxLength={CONTENT_MAX}
        value={values.content}
        error={errors.content}
        hint="10자 이상 작성해 주세요."
        placeholder="무엇이 좋았는지, 무엇을 주문했는지 적어 보세요."
        onChange={(event) => setField('content', event.target.value)}
      />

      <div className={styles.actions}>
        <Button type="submit" loading={submitting}>
          {submitting ? '저장 중...' : submitLabel}
        </Button>

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;