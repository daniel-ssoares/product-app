import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Category, categories } from '../../models/product.model';
import { apiErrorMessage } from '../../services/api-error';

@Component({
  selector: 'app-product-form', standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  categories = categories;
  productId: number | null = null;
  loading = false;
  saving = false;
  loadFailed = false;
  error: string | null = null;
  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(500)]],
    category: ['Computação' as Category, Validators.required],
    price: [0, [Validators.required, Validators.min(0.01), Validators.max(999999999.99)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.max(2147483647), Validators.pattern(/^\d+$/)]]
  });
  get isEditMode() { return this.productId !== null; }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) return;
    this.productId = Number(id);
    if (!Number.isInteger(this.productId) || this.productId <= 0) {
      this.error = 'O identificador do item é inválido.';
      this.loadFailed = true;
      return;
    }
    this.loading = true;
    this.productForm.disable();
    this.service.getProductById(this.productId).pipe(finalize(() => this.loading = false)).subscribe({
      next: product => { this.productForm.patchValue(product); this.productForm.enable(); },
      error: error => { this.error = apiErrorMessage(error); this.loadFailed = true; }
    });
  }
  fieldError(field: keyof typeof this.productForm.controls): string | null {
    const control = this.productForm.controls[field];
    if (!control.touched) return null;
    if (control.hasError('required')) return 'Preencha este campo.';
    if (control.hasError('maxlength')) return 'O texto excede o limite de caracteres.';
    if (control.hasError('pattern')) return field === 'stock' ? 'Informe uma quantidade inteira.' : 'Informe um texto válido.';
    if (control.hasError('min')) return field === 'price' ? 'O preço deve ser maior que zero.' : 'A quantidade não pode ser negativa.';
    if (control.hasError('max')) return 'O valor excede o limite permitido.';
    return null;
  }
  onSubmit() {
    if (this.loading || this.saving || this.loadFailed) return;
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const value = this.productForm.getRawValue();
    const product = { ...value, name: value.name.trim(), description: value.description.trim() };
    this.saving = true;
    this.error = null;
    this.productForm.disable();
    const operation = this.productId === null
      ? this.service.createProduct(product) : this.service.updateProduct(this.productId, product);
    operation.pipe(finalize(() => { this.saving = false; this.productForm.enable(); })).subscribe({
      next: () => void this.router.navigate(['/products']),
      error: error => this.error = apiErrorMessage(error)
    });
  }
}
