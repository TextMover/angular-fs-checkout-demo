import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FloatingCartComponent } from './floating-cart/floating-cart.component';
import { FastSpringService } from './fastspring.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FloatingCartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FastSpring Checkout';
  constructor(private fastSpringService: FastSpringService) {}
  ngOnInit() {
    this.fastSpringService.initFastSpring();  // Ensure FastSpring loads at startup
  }
}
