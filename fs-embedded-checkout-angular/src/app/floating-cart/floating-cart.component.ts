import { Component } from '@angular/core';
import { FastSpringService } from '../fastspring.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-floating-cart',
  imports: [CommonModule],
  templateUrl: './floating-cart.component.html',
  styleUrls: ['./floating-cart.component.css']
})
export class FloatingCartComponent {

  cartData$ :any;

  constructor(private fastSpringService: FastSpringService) {}

  ngOnInit() {
    this.cartData$ = this.fastSpringService.data;
  }

  increaseQuantity(item: any) {
    console.log('Increased quantity:', item);
  }
}
