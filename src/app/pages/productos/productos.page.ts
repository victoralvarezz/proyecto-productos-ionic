import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';

import {
  Product,
  ProductsResponse
} from '../../models/product.model';

import {
  ProductService
} from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class ProductosPage implements OnInit {

  private productService = inject(ProductService);

  private changeDetector =
    inject(ChangeDetectorRef);

  products: Product[] = [];

  total = 0;
  loading = false;
  error = '';

  pageSize = 10;
  skip = 0;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;
    this.error = '';

    this.productService
      .getProducts(this.pageSize, this.skip)
      .subscribe({

        next: (response: ProductsResponse) => {

          this.products = response.products;
          this.total = response.total;

          this.totalPages = Math.ceil(
            this.total / this.pageSize
          );

          this.loading = false;

          this.changeDetector.markForCheck();
        },

        error: (error) => {

          console.error(error);

          this.error =
            'No se han podido cargar los productos.';

          this.loading = false;

          this.changeDetector.markForCheck();
        }

      });
  }

  nextPage(): void {

    if (this.skip + this.pageSize < this.total) {

      this.skip += this.pageSize;
      this.currentPage++;

      this.loadProducts();
    }
  }

  previousPage(): void {

    if (this.skip >= this.pageSize) {

      this.skip -= this.pageSize;
      this.currentPage--;

      this.loadProducts();
    }
  }

  getStockValue(product: Product): number {

    const totalSinDescuento =
      product.stock * product.price;

    const descuento =
      totalSinDescuento *
      (product.discountPercentage / 100);

    return totalSinDescuento - descuento;
  }
}
