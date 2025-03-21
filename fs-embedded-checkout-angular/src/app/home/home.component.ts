import { Component, OnInit } from '@angular/core';
import { FastSpringService } from '../fastspring.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products:any[] = [];
  loading = true;

  constructor(private fastSpringService: FastSpringService) {}

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.products = this.fastSpringService?.products['value'] ?? []; // Get the latest value
      console.log('Is Array:', Array.isArray(this.products));
      this.loading = false;
      console.log('Products after loading:', this.products);
    }, 2000);
  }


  resetCart() {
    if ((window as any).fastspring?.builder) {
      (window as any).fastspring.builder.reset();
    } else {
      console.error('FastSpring is not loaded.');
    }
  }

  buyProduct(path: string) {
    const newProduct = { path, quantity: 1 };
    const payload = { products: [newProduct] };

    if ((window as any).fastspring?.builder) {
      (window as any).fastspring.builder.push(payload);
    } else {
      console.error('FastSpring is not loaded.');
    }
  }
}
