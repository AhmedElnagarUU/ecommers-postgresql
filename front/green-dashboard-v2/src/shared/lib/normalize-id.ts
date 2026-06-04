/** Map Prisma `id` to legacy `_id` used across dashboard UI. */
export function withLegacyId<T extends Record<string, unknown>>(
  item: T & { id?: string; _id?: string }
): T & { _id: string; id: string } {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id };
}

export function mapWithLegacyId<T extends Record<string, unknown>>(
  items: (T & { id?: string; _id?: string })[]
): (T & { _id: string; id: string })[] {
  return items.map(withLegacyId);
}
