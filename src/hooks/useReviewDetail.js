import { useCallback, useEffect, useState } from 'react';
import { fetchReviewById } from '../lib/reviews';

/**
 * 단일 리뷰를 불러오는 커스텀 훅.
 * status: 'loading' | 'success' | 'error' | 'notfound'
 */
export function useReviewDetail(id) {
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await fetchReviewById(id);

      if (!data) {
        setStatus('notfound');
        return;
      }

      setReview(data);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { review, status, errorMessage, reload: load };
}