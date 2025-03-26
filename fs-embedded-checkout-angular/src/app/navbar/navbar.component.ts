// navbar.component.ts
import { Component } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { FastSpringService } from '../fastspring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterModule, RouterLink],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  data: any = {};

  constructor(private FastSpringService: FastSpringService, private router: Router) {
      this.FastSpringService.data.subscribe((data) => {
        this.data = data;
      });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }


}
