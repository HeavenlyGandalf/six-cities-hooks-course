export interface Host {
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

export type AuthInfo = Host & {
  email: string;
  token: string;
};
