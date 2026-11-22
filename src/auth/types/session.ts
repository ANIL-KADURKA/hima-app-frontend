export type AuthenticatedUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
};

export type TokenResponse = {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  session_id: string;
  user: AuthenticatedUser;
};

export type AuthSession = TokenResponse & {
  expires_at: number;
};
