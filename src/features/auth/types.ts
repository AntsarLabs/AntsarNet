export interface AuthMessageResponse {
  key: string;
  message: string;
  hash: string;
  exp_time: number;
}

export interface AuthUser {
  id: string;
  username: string;
  emoji: string;
  public_key: string;
  bio?: string;
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  publicKey: string | null;
  privateKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (passCard: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}


export interface AuthFormProps {
  switchToAuthType: (type: 'login' | 'register') => void;
}
