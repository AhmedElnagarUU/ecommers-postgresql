import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mintlify-accent/10">
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/10">
            {products.map((product) => (
              <tr key={product._id} 
                className="hover:bg-mintlify-hover/20">
                <td className="px-6 py-4 text-sm font-medium text-mintlify-text">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-mintlify-accent/10 text-mintlify-accent'
                        : product.stock > 0
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEdit?.(product)}
                      className="p-1 rounded-lg text-mintlify-text-secondary hover:text-mintlify-accent hover:bg-mintlify-accent/10"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete?.(product._id)}
                      className="p-1 rounded-lg text-mintlify-text-secondary hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 