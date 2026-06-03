export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  _id: string;
}
