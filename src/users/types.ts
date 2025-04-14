export type Role = "USER" | "ADMIN";

export type User = {
  id?: string;
  name: string;
  password: string;
  email: string;
  role: Role;
};
