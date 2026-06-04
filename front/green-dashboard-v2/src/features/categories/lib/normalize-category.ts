import { withLegacyId } from '@/shared/lib/normalize-id';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export function normalizeCategory(raw: Record<string, unknown>): Category {
  const base = withLegacyId(raw);
  const statusFromApi =
    raw.isActive === false || raw.isActive === 'false' ? 'inactive' : 'active';

  return {
    ...base,
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    slug: String(raw.slug ?? ''),
    status: statusFromApi,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

export function normalizeCategories(raw: Record<string, unknown>[]): Category[] {
  return raw.map(normalizeCategory);
}

export function categoryToApiPayload(
  dto: CreateCategoryDTO | Omit<UpdateCategoryDTO, '_id'>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: dto.name,
    description: dto.description,
  };
  if (dto.status !== undefined) {
    payload.isActive = dto.status === 'active';
  }
  return payload;
}
