export interface VariantGroup {
  name: string;
  options: string[];
}

export interface VariantCombination {
  selections: Record<string, string>;
  stock?: number;
  price?: number;
}

export function buildCombinationKey(selections: Record<string, string>): string {
  return Object.keys(selections)
    .sort()
    .map((key) => `${key}:${selections[key]}`)
    .join('|');
}

export function generateCombinations(groups: VariantGroup[]): Record<string, string>[] {
  const validGroups = groups.filter(
    (group) => group.name.trim() && group.options.some((option) => option.trim())
  );

  if (!validGroups.length) return [];

  return validGroups.reduce<Record<string, string>[]>(
    (acc, group) => {
      const options = group.options.map((option) => option.trim()).filter(Boolean);
      if (!options.length) return acc;

      if (!acc.length) {
        return options.map((option) => ({ [group.name.trim()]: option }));
      }

      return acc.flatMap((combo) =>
        options.map((option) => ({ ...combo, [group.name.trim()]: option }))
      );
    },
    []
  );
}

export function syncVariantCombinations(
  groups: VariantGroup[],
  existing: VariantCombination[] = [],
  useVariantStock: boolean,
  useVariantPricing: boolean
): VariantCombination[] {
  const generated = generateCombinations(groups);
  const existingByKey = new Map(
    existing.map((combo) => [buildCombinationKey(combo.selections), combo])
  );

  return generated.map((selections) => {
    const previous = existingByKey.get(buildCombinationKey(selections));
    const combo: VariantCombination = { selections };

    if (useVariantStock) {
      combo.stock = previous?.stock ?? 0;
    }
    if (useVariantPricing && previous?.price !== undefined) {
      combo.price = previous.price;
    }

    return combo;
  });
}

export function findCombination(
  combinations: VariantCombination[] | undefined,
  selections: Record<string, string>
): VariantCombination | undefined {
  const key = buildCombinationKey(selections);
  return combinations?.find((combo) => buildCombinationKey(combo.selections) === key);
}

export function formatVariantLabel(selections?: Record<string, string>): string {
  if (!selections || !Object.keys(selections).length) return '';
  return Object.entries(selections)
    .map(([name, value]) => `${name}: ${value}`)
    .join(', ');
}
