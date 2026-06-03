import { storeApi } from '@/lib/services';

export const productsApi = {
  getProducts: storeApi.getProducts,
  getProduct: storeApi.getProduct,
  getCategories: storeApi.getCategories,
};
