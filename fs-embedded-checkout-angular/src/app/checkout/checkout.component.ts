import { Component, OnInit, OnDestroy } from '@angular/core';
import { FastSpringService } from '../fastspring.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  selectedProducts:any[] = [];
  crossSale: any = null;
  isTestMode = false;

  constructor(private fastSpringService: FastSpringService) {}

  ngOnInit() {
    // Load products from service
    this.fastSpringService.products.subscribe((products) => {
      this.selectedProducts = products.filter((product: any) => product.selected);
      this.crossSale = products.find((product: any) => product.path === 'fxlab-subscription') || null;
    });

    // Load FastSpring checkout
    if ((window as any).fastspring) {
      (window as any).fastspring.builder.checkout();
    }

    // Listen for FastSpring webhook
    (window as any).dataPopupWebhookReceived = (orderReference: any) => {
      if (orderReference) {
        console.log('OrderReference ID:', orderReference.id);
        (window as any).fastspring.builder.reset();
        setTimeout(() => window.location.reload(), 5000);
      }
    };
  }

  switchStorefront() {
    this.fastSpringService.toggleStorefront();
  }

  get isCrossSaleEligible() {
    return !this.selectedProducts.some(product => product.path === 'fxlab-subscription');
  }

  removeProduct(path: string) {
    (window as any).fastspring.builder.remove(path);
    this.selectedProducts = this.selectedProducts.filter(product => product.path !== path);
  }

  addProduct(path: string) {
    (window as any).fastspring.builder.add(path);
  }

  ngOnDestroy() {
    delete (window as any).dataPopupWebhookReceived;
  }
}
