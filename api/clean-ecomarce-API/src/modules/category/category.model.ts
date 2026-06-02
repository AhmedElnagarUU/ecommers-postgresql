export interface ICategory {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  parentId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
