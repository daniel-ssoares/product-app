import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Product, categories } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { apiErrorMessage } from '../../services/api-error';

@Component({
  selector: 'app-product-list', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private service = inject(ProductService);
  products: Product[] = [];
  categories = categories;
  query = '';
  category = '';
  loading = false;
  deleting = false;
  error: string | null = null;
  pendingDelete: Product | null = null;
  get filteredProducts() {
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = normalize(this.query.trim());
    return this.products.filter(p => (!this.category || p.category === this.category)
      && normalize(p.name + ' ' + p.description).includes(query));
  }
  get totalUnits() { return this.products.reduce((sum, p) => sum + p.stock, 0); }
  get stockValue() { return this.products.reduce((sum, p) => sum + p.price * p.stock, 0); }
  get lowStock() { return this.products.filter(p => p.stock <= 5).length; }
  ngOnInit() { this.loadProducts(); }
  loadProducts() {
    this.loading = true;
    this.error = null;
    this.service.getAllProducts().pipe(finalize(() => this.loading = false)).subscribe({
      next: products => this.products = products,
      error: error => this.error = apiErrorMessage(error)
    });
  }
  confirmDelete() {
    if (!this.pendingDelete || this.deleting) return;
    const id = this.pendingDelete.id;
    this.deleting = true;
    this.error = null;
    this.service.deleteProduct(id).pipe(finalize(() => this.deleting = false)).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.pendingDelete = null;
      },
      error: error => { this.error = apiErrorMessage(error); this.pendingDelete = null; }
    });
  }
}
