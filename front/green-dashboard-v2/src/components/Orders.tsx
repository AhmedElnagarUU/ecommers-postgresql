import { useState, useEffect } from 'react';
import { productService, Product } from '@/api/product.api';
import { orderService, CreateOrderDTO, OrderItem } from '@/api/api';
import { findCombination } from '@/utils/variant.utils';

export default function Orders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<OrderItem[]>([]);
  const [variantPickerProduct, setVariantPickerProduct] = useState<Product | null>(null);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateOrderDTO>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    items: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const resolveVariantPrice = (product: Product, selections: Record<string, string>) => {
    if (product.hasVariants && product.useVariantPricing) {
      const combo = findCombination(product.variantCombinations, selections);
      if (combo?.price !== undefined) return combo.price;
    }
    return product.price;
  };

  const addProductToOrder = (product: Product, selections: Record<string, string> = {}) => {
    const variantKey = JSON.stringify(selections);
    const price = resolveVariantPrice(product, selections);
    const existingItem = selectedProducts.find(
      (item) => item.productId === product._id && JSON.stringify(item.selectedVariants || {}) === variantKey
    );

    if (existingItem) {
      setSelectedProducts((prev) =>
        prev.map((item) =>
          item.productId === product._id && JSON.stringify(item.selectedVariants || {}) === variantKey
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
      return;
    }

    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        price,
        quantity: 1,
        total: price,
        selectedVariants: Object.keys(selections).length ? selections : undefined,
      },
    ]);
  };

  const handleProductSelect = (product: Product) => {
    if (product.hasVariants && product.variantGroups?.length) {
      const initialSelections: Record<string, string> = {};
      product.variantGroups.forEach((group) => {
        if (group.options[0]) {
          initialSelections[group.name] = group.options[0];
        }
      });
      setVariantSelections(initialSelections);
      setVariantPickerProduct(product);
      return;
    }

    addProductToOrder(product);
  };

  const confirmVariantSelection = () => {
    if (!variantPickerProduct) return;
    addProductToOrder(variantPickerProduct, variantSelections);
    setVariantPickerProduct(null);
    setVariantSelections({});
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateOrderDTO] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        items: selectedProducts.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariants: item.selectedVariants,
        })),
      };
      await orderService.createOrder(orderData);
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        items: []
      });
      setSelectedProducts([]);
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">Create New Order</h1>
      
      {variantPickerProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Choose variants for {variantPickerProduct.name}
            </h3>
            {variantPickerProduct.variantGroups?.map((group) => (
              <div key={group.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{group.name}</label>
                <select
                  value={variantSelections[group.name] || ''}
                  onChange={(e) =>
                    setVariantSelections((prev) => ({ ...prev, [group.name]: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {group.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setVariantPickerProduct(null)}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmVariantSelection}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white"
              >
                Add to order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Available Products</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map(product => (
              <div key={product._id} className="border border-indigo-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="font-medium text-lg text-gray-800">{product.name}</p>
                <p className="text-indigo-600 font-semibold">Price: ${product.price}</p>
                <p className="text-gray-600">
                  {product.hasVariants ? 'Has variants' : `Stock: ${product.stock}`}
                </p>
                <button
                  onClick={() => handleProductSelect(product)}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors w-full"
                >
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Order Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Customer Phone</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-indigo-800 mb-3">Shipping Address</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="shippingAddress.street"
                  value={formData.shippingAddress.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="shippingAddress.state"
                  value={formData.shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="shippingAddress.zipCode"
                  value={formData.shippingAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-indigo-800 mb-3">Selected Products</h3>
              {selectedProducts.map(item => (
                <div key={item.productId} className="border border-indigo-100 p-4 rounded-lg mb-3 bg-white shadow-sm">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  {item.selectedVariants && (
                    <p className="text-sm text-gray-600">
                      {Object.entries(item.selectedVariants)
                        .map(([name, value]) => `${name}: ${value}`)
                        .join(', ')}
                    </p>
                  )}
                  <p className="text-indigo-600">Price: ${item.price}</p>
                  <div className="flex items-center gap-3 my-2">
                    <label className="text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                      className="w-24 border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="font-semibold text-indigo-700">Total: ${item.total}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedProducts.length === 0}
            >
              Create Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}