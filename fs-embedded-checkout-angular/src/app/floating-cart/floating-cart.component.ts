import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FastSpringService } from '../fastspring.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-floating-cart',
  imports: [CommonModule, ModalModule],
  templateUrl: './floating-cart.component.html',
  styleUrls: ['./floating-cart.component.css']
})
export class FloatingCartComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  selectedProducts: any[] = [];
  data: any = {};
  showCart = false;

  constructor(private fastSpringService: FastSpringService, private modalService: BsModalService, private router: Router) {}

  ngOnInit(): void {
    this.fastSpringService.products.subscribe((products) => {
      this.selectedProducts = products
        .filter((product: any) => product.selected === true)
        .map((p: any) => ({
          ...p,
          quantity: p.quantity || 1,
        }));
    });

    this.fastSpringService.data.subscribe((data) => {
      this.data = data;
    });
  }

  updateQuantity(product: any, change: number): void {
    this.selectedProducts = this.selectedProducts.map((p) =>
      p.path === product.path ? { ...p, quantity: p.quantity + change } : p
    );

    let mySession = {
      products: this.selectedProducts.map((p) => ({
        path: p.path,
        quantity: p.quantity
      }))
    };

    console.log("Updating cart with:", mySession);
    (window as any).fastspring.builder.push(mySession);

    // Update FastSpringService manually
    this.fastSpringService.products.next([...this.selectedProducts]);
  }

  removeProduct(path: string): void {
    (window as any).fastspring.builder.remove(path);
    this.selectedProducts = this.selectedProducts.filter((p) => p.path !== path);
  }

  resetCart(): void {
    if ((window as any).fastspring?.builder) {
      (window as any).fastspring.builder.reset();
      this.selectedProducts = [];
    }
  }

  checkout(): void {
    this.showCart = false;
    this.router.navigate(['/checkout']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    if (this.modalRef) this.modalRef.hide();
  }
}
