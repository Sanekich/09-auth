export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type UpdateUserData = Partial<Pick<User, "username" | "avatar">>;
