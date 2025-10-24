import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    public router = inject(Router);
    public authService = inject(AuthService);

    ngOnInit(): void {
        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (!isAuthenticated) {
                this.router.navigate(['/login']);
            }
        });
    }
}
