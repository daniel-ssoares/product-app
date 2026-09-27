import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductInput } from '../models/product.model';

export const PRODUCT_API_URL = new InjectionToken<string>('PRODUCT_API_URL', {
  providedIn: 'root', factory: () => '/api/products'
});

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = inject(PRODUCT_API_URL);
  getAllProducts() { return this.http.get<Product[]>(this.apiUrl); }
  getProductById(id: number) { return this.http.get<Product>(`${this.apiUrl}/${id}`); }
  createProduct(product: ProductInput) { return this.http.post<Product>(this.apiUrl, product); }
  updateProduct(id: number, product: ProductInput) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  deleteProduct(id: number) { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
