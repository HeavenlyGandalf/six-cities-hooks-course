import {useReducer, useRef} from 'react';
import {sendReview} from '../../services/review-api';
import {EMPTY_REVIEW_DRAFT, isReviewDraft, isReviewTextValid, isReviewValid} from '../../utils/review';
import {getReviewDraftKey} from '../../utils/storage-keys';
import {usePersistentState} from '../use-persistent-state/use-persistent-state';
import {initialReviewFormState, reviewFormReducer} from './review-form-reducer';

export interface ReviewFormControls {
  rating: number | null;
  text: string;
  // Оценка и длина текста в пределах: Submit можно нажать.
  isValid: boolean;
  // Отзыв отправляется: форма заблокирована.
  isSubmitting: boolean;
  // Последняя отправка не удалась: оценка и текст остались в форме.
  isError: boolean;
  // Показать ошибку длины: поле уже покидали, текст не пустой и не проходит проверку.
  hasTextError: boolean;
  changeRating: (rating: number) => void;
  changeText: (text: string) => void;
  blurText: () => void;
  submit: () => void;
}

// Форма отзыва к предложению offerId. Оценка и текст - черновик в localStorage (H6),
// статус отправки - конечный автомат на useReducer (review-form-reducer.ts).
export function useReviewForm(offerId: string): ReviewFormControls {
  const [draft, setDraft, removeDraft] = usePersistentState(
    getReviewDraftKey(offerId),
    EMPTY_REVIEW_DRAFT,
    isReviewDraft,
  );
  const [state, dispatch] = useReducer(reviewFormReducer, initialReviewFormState);
  // dispatch применится только к следующему рендеру, поэтому два Submit в одном такте
  // видят один и тот же status. ref меняется сразу и не даёт отправить отзыв дважды.
  const isSendingRef = useRef(false);

  const {rating, text} = draft;
  const isValid = isReviewValid(rating, text);

  const changeRating = (nextRating: number) => {
    if (isSendingRef.current) {
      return;
    }
    setDraft({...draft, rating: nextRating});
    dispatch({type: 'edit'});
  };

  const changeText = (nextText: string) => {
    if (isSendingRef.current) {
      return;
    }
    setDraft({...draft, text: nextText});
    dispatch({type: 'edit'});
  };

  const blurText = () => {
    dispatch({type: 'blurText'});
  };

  const submit = () => {
    // rating === null уже входит в !isValid, проверка нужна TypeScript, чтобы сузить тип.
    if (isSendingRef.current || rating === null || !isValid) {
      return;
    }
    isSendingRef.current = true;
    dispatch({type: 'submit'});

    sendReview(offerId, {rating, text: text.trim()})
      .then(
        () => {
          removeDraft();
          dispatch({type: 'succeed'});
        },
        () => {
          dispatch({type: 'fail'});
        },
      )
      .finally(() => {
        isSendingRef.current = false;
      });
  };

  return {
    rating,
    text,
    isValid,
    isSubmitting: state.status === 'submitting',
    isError: state.status === 'error',
    hasTextError: state.isTextTouched && text !== '' && !isReviewTextValid(text),
    changeRating,
    changeText,
    blurText,
    submit,
  };
}
