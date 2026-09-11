import { useCallback, useEffect, useState } from 'react';
import { fetchReviews } from '../lib/reviews';

/**
 * 리뷰 목록을 불러오는 커스텀 훅.
 * status: 'loading' | 'success' | 'error'
 */
export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await fetchReviews();
      setReviews(data);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { reviews, status, errorMessage, reload: load };
}