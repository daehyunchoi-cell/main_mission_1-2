import { CONTENT_MAX, CONTENT_MIN, NAME_MAX, REGIONS } from './constants';

/**
 * 리뷰 폼 값을 검증한다.
 * 반환값은 { 필드명: 오류문구 } 형태이며, 오류가 없으면 빈 객체.
 */
export function validateReview(values) {
  const errors = {};
  const name = values.name.trim();
  const content = values.content.trim();

  if (!name) {
    errors.name = '가게명을 입력해 주세요.';
  } else if (name.length > NAME_MAX) {
    errors.name = `가게명은 ${NAME_MAX}자 이내로 입력해 주세요.`;
  }

  if (!values.region) {
    errors.region = '지역을 선택해 주세요.';
  } else if (!REGIONS.includes(values.region)) {
    errors.region = '목록에 있는 지역을 선택해 주세요.';
  }

  if (!values.rating) {
    errors.rating = '평점을 선택해 주세요.';
  }

  if (!content) {
    errors.content = '후기를 입력해 주세요.';
  } else if (content.length < CONTENT_MIN) {
    errors.content = `후기는 ${CONTENT_MIN}자 이상 입력해 주세요.`;
  } else if (content.length > CONTENT_MAX) {
    errors.content = `후기는 ${CONTENT_MAX}자 이내로 입력해 주세요.`;
  }

  return errors;
}