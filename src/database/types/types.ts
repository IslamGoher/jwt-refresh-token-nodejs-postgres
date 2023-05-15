export interface UserType {
  user_id?: number;
  name?: string;
  email?: string;
  password?: string;
}

export interface RefreshTokenType {
  user_id?: number;
  token?: string;
  expire_date?: Date;
}
