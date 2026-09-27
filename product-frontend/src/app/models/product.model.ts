export const categories = ['Computação', 'Periféricos', 'Escritório'] as const;
export type Category = typeof categories[number];
export interface ProductInput {
  name: string;
  description: string;
  category: Category;
  price: number;
  stock: number;
}
export interface Product extends ProductInput {
  id: number;
  createdAt: string;
}
