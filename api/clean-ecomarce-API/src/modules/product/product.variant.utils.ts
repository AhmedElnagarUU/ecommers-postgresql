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
    (g) => g.name?.trim() && g.options?.some((o) => o?.trim())
  );

  if (!validGroups.length) return [];

  return validGroups.reduce<Record<string, string>[]>(
    (acc, group) => {
      const options = group.options.map((o) => o.trim()).filter(Boolean);
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

export function selectionsMatch(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  return buildCombinationKey(a) === buildCombinationKey(b);
}

export function normalizeSelections(
  selections: Record<string, string> | Map<string, string> | undefined
): Record<string, string> {
  if (!selections) return {};
  if (selections instanceof Map) {
    return Object.fromEntries(selections.entries());
  }
  return { ...selections };
}

export function findCombination(
  combinations: VariantCombination[] | undefined,
  selections: Record<string, string>
): VariantCombination | undefined {
  const key = buildCombinationKey(selections);
  return combinations?.find(
    (combo) => buildCombinationKey(normalizeSelections(combo.selections as any)) === key
  );
}

export function mergeCombinationUpdates(
  synced: VariantCombination[],
  incoming: VariantCombination[],
  useVariantStock: boolean,
  useVariantPricing: boolean
): VariantCombination[] {
  const incomingByKey = new Map(
    incoming.map((combo) => [
      buildCombinationKey(normalizeSelections(combo.selections as any)),
      combo,
    ])
  );

  return synced.map((combo) => {
    const incomingCombo = incomingByKey.get(buildCombinationKey(combo.selections));
    if (!incomingCombo) return combo;

    const merged: VariantCombination = { selections: combo.selections };
    if (useVariantStock && incomingCombo.stock !== undefined) {
      merged.stock = Number(incomingCombo.stock);
    } else if (combo.stock !== undefined) {
      merged.stock = combo.stock;
    }
    if (useVariantPricing && incomingCombo.price !== undefined) {
      merged.price = Number(incomingCombo.price);
    } else if (combo.price !== undefined) {
      merged.price = combo.price;
    }
    return merged;
  });
}
