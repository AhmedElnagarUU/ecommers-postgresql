'use client';

import { useState, useEffect } from 'react';
import { CategoryList } from '@/components/dashboard/categories/CategoryList';
import { CategoryForm } from '@/components/dashboard/categories/CategoryForm';
import { categoryService, Category, CreateCategoryDTO } from '@/api/category.api';
import { useToast } from '@/hooks/useToast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c._id !== categoryId));
      success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      error('Failed to delete category');
    }
  };

  const handleSubmit = async (data: CreateCategoryDTO) => {
    setFormLoading(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory._id, {
          _id: editingCategory._id,
          ...data
        });
        setCategories(categories.map(c => c._id === editingCategory._id ? updated : c));
        success('Category updated successfully');
      } else {
        const created = await categoryService.createCategory(data);
        setCategories([created, ...categories]);
        success('Category created successfully');
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving category:', err);
      error('Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-mintlify-text">Categories</h1>
            <p className="text-mintlify-text-secondary">
              Manage your product categories
            </p>
          </div>
        </div>

        {/* Main Content */}
        {showForm ? (
          <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
            <CategoryForm
              initialData={editingCategory || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={formLoading}
            />
          </div>
        ) : (
          <CategoryList
            categories={categories}
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