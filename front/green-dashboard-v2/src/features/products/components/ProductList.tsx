'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '../api/product.api';
import type { Product } from '../types';
import { Edit, Trash, Search, Plus, Layers } from 'lucide-react';
import { categoryService } from '@/features/categories/api/category.api';
import { ProductImage } from './ProductImage';
import { getDisplayableImageUrls } from '@/shared/lib/product-image';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function ProductList({ products, onEdit, onDelete, onAdd, isLoading }: ProductListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getCategories();
        const categoryNames = fetchedCategories.map(cat => cat.name);
        setCategories(categoryNames);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);

  const allCategories = ['all', ...categories];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : -order;
    });

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete._id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-mintlify-hover/30 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mintlify-text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            {allCategories.map(category => (
              <option key={category} value={category} className='bg-gray-900 border-none transition-all duration-300 ease-in-out text-[#E6E8EA] hover:bg-[#1A2433]'>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
            className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg hover:bg-mintlify-hover/50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-mintlify-accent hover:bg-mintlify-accent-dark 
              text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="grid gap-4">
        {filteredProducts.map(product => {
          const displayImages = getDisplayableImageUrls(product.imageUrls, product.images);
          return (
          <div
            key={product._id}
            className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-4 
              border border-mintlify-accent/10 hover:border-mintlify-accent/20
              transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 rounded-lg bg-mintlify-hover/30 overflow-hidden">
                {displayImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                    {displayImages.slice(0, 4).map((imageUrl: string, index: number) => (
                      <div key={index} className="relative w-full h-14 rounded overflow-hidden">
                        <ProductImage
                          src={imageUrl}
                          alt={`${product.name} - ${index + 1}`}
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {displayImages.length > 4 && (
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                        +{displayImages.length - 4}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-mintlify-text-secondary">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-mintlify-text">{product.name}</h3>
                <p className="text-sm text-mintlify-text-secondary">{product.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-mintlify-text-secondary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock > 10
                      ? 'bg-mintlify-accent/10 text-mintlify-accent'
                      : product.stock > 0
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.stock} in stock
                  </span>
                  <span className="text-sm px-2 py-1 rounded-full bg-mintlify-accent/10 text-mintlify-accent">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  title="Manage Variants"
                  onClick={() => router.push(`/dashboard/products/${product._id}/edit`)}
                  className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                    hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                >
                  <Layers className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                    hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="p-2 text-mintlify-text-secondary hover:text-red-400 
                    hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-mintlify-text-secondary">No products found</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
} 