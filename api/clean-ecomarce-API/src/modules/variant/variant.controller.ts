import { Request, Response } from 'express';
import { VariantService } from './variant.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

const service = new VariantService();

// ─── Option Types ─────────────────────────────────────────────────────────────

/** PUT /products/:id/options */
export const setOptionTypes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { optionTypes } = req.body as { optionTypes?: unknown };

  if (!Array.isArray(optionTypes)) {
    throw new ApiError(400, 'optionTypes must be an array');
  }

  for (const ot of optionTypes) {
    if (typeof ot !== 'object' || !ot || typeof (ot as any).name !== 'string' || !Array.isArray((ot as any).values)) {
      throw new ApiError(400, 'Each optionType must have { name: string, values: string[] }');
    }
  }

  const result = await service.setOptionTypes(id, optionTypes as any);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Option types saved and variants reconciled'));
});

// ─── Variants (product-scoped) ────────────────────────────────────────────────

/** GET /products/:id/variants */
export const getVariantsByProduct = asyncHandler(async (req: Request, res: Response) => {
  const variants = await service.getVariants(req.params.id);
  return res.status(200).json(new ApiResponse(200, variants, 'Variants retrieved'));
});

/** PUT /products/:id/variants/bulk */
export const bulkUpdateVariants = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { variants } = req.body as { variants?: unknown };

  if (!Array.isArray(variants)) {
    throw new ApiError(400, 'variants must be an array');
  }

  const result = await service.bulkUpdateVariants(id, variants as any);
  return res.status(200).json(new ApiResponse(200, result, 'Variants updated'));
});

// ─── Variants (individual) ────────────────────────────────────────────────────

/** GET /variants/:variantId */
export const getVariant = asyncHandler(async (req: Request, res: Response) => {
  const variant = await service.getVariant(req.params.variantId);
  return res.status(200).json(new ApiResponse(200, variant, 'Variant retrieved'));
});

/** PUT /variants/:variantId */
export const updateVariant = asyncHandler(async (req: Request, res: Response) => {
  const variant = await service.updateVariant(req.params.variantId, req.body);
  return res.status(200).json(new ApiResponse(200, variant, 'Variant updated'));
});

/** DELETE /variants/:variantId */
export const deleteVariant = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteVariant(req.params.variantId);
  return res.status(200).json(new ApiResponse(200, null, 'Variant deleted'));
});
