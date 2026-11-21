import {REVIEW_SUBMIT_STUB_DELAY_MS} from '../const';

// Отзыв, готовый к отправке: оценка уже выбрана.
export interface ReviewToSend {
  rating: number;
  text: string;
}

// Заглушка отправки до этапа 7: сервера ещё нет, ответ «успех» приходит через REVIEW_SUBMIT_STUB_DELAY_MS.
// Параметры - те же, что понадобятся настоящему запросу POST /comments/{offerId}.
export function sendReview(_offerId: string, _review: ReviewToSend): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, REVIEW_SUBMIT_STUB_DELAY_MS);
  });
}
