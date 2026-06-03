'use client';

import React, { useState } from 'react';
import { Category } from '@/features/categories/api/category.api';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import { Edit, Trash, Search, Plus, Tag } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function CategoryList({ categories, onEdit, onDelete, onAdd, isLoading }: CategoryListProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'name' ? a[sortBy] : new Date(a[sortBy]).getTime();
      const bValue = sortBy === 'name' ? b[sortBy] : new Date(b[sortBy]).getTime();
      const order = sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : -order;
    });

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
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
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt')}
            className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Date</option>
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
            Add Category
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="grid gap-4">
        {filteredCategories.map(category => (
          <div
            key={category._id}
            className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-4 
              border border-mintlify-accent/10 hover:border-mintlify-accent/20
              transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-mintlify-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-mintlify-text">{category.name}</h3>
                <p className="text-sm text-mintlify-text-secondary">{category.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    category.status === 'active'
                      ? 'bg-mintlify-accent/10 text-mintlify-accent'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {category.status}
                  </span>
                  <span className="text-sm text-mintlify-text-secondary">
                    Created {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                    hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="p-2 text-mintlify-text-secondary hover:text-red-400 
                    hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-mintlify-text-secondary">No categories found</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
} 