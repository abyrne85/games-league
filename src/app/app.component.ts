import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public router = inject(Router);

  private _primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this._primengConfig.ripple = true;
  }

  clickBtn() {
    console.log('Button clicked');
  }
}
