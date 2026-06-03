'use client';

import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { productService } from './api/product.api';
import type { CreateProductDTO, Product } from './types';
import { useToast } from '@/shared/hooks/useToast';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      error('Failed to delete product');
    }
  };

  const handleSubmit = async (data: CreateProductDTO) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct._id, {
          _id: editingProduct._id,
          ...data,
        });
        setProducts(products.map((p) => (p._id === editingProduct._id ? updated : p)));
        success('Product updated successfully');
      } else {
        const created = await productService.createProduct(data);
        setProducts([created, ...products]);
        success('Product created successfully');
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving product:', err);
      error('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-mintlify-text">Products</h1>
            <p className="text-mintlify-text-secondary">Manage your product inventory</p>
          </div>
        </div>

        {showForm ? (
          <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={formLoading}
            />
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}
