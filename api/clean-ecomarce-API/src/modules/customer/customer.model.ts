export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
