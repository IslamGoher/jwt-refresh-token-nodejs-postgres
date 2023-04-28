export interface UserType {
  userID?: number;
  name?: string;
  email?: string;
  password?: string;
}

export interface RefreshTokenType {
  userID?: number;
  token?: string;
  expireDate?: Date;
}
