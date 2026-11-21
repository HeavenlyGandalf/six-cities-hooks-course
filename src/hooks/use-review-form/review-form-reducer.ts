// Состояние отправки формы отзыва - конечный автомат: editing → submitting → success | error.
// Оценка и текст здесь не хранятся: они живут в черновике (usePersistentState, H6).
// Статусы и action-ы - объединения литералов: опечатку в строке поймает TypeScript.
export type ReviewFormStatus = 'editing' | 'submitting' | 'success' | 'error';

export interface ReviewFormState {
  status: ReviewFormStatus;
  // Поле текста покидали хотя бы раз: до этого ошибка длины не показывается.
  isTextTouched: boolean;
}

export interface ReviewFormAction {
  type: 'submit' | 'succeed' | 'fail' | 'edit' | 'blurText';
}

export const initialReviewFormState: ReviewFormState = {
  status: 'editing',
  isTextTouched: false,
};

// Недопустимый переход (например, второй submit во время отправки) возвращает
// тот же объект state: React не перерисовывает компонент, ничего не меняется.
export function reviewFormReducer(state: ReviewFormState, action: ReviewFormAction): ReviewFormState {
  const isSubmitting = state.status === 'submitting';

  switch (action.type) {
    case 'submit':
      return isSubmitting ? state : {...state, status: 'submitting'};
    case 'succeed':
      return isSubmitting ? {status: 'success', isTextTouched: false} : state;
    case 'fail':
      return isSubmitting ? {...state, status: 'error'} : state;
    case 'edit':
      return state.status === 'success' || state.status === 'error'
        ? {...state, status: 'editing'}
        : state;
    case 'blurText':
      return isSubmitting || state.isTextTouched ? state : {...state, isTextTouched: true};
    default: {
      // Новый тип action без своей ветки не скомпилируется: здесь action.type уже never.
      const unhandledType: never = action.type;
      throw new Error(`Unknown review form action: ${String(unhandledType)}`);
    }
  }
}
