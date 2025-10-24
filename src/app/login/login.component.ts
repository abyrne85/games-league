import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-login',
    imports: [FormsModule, InputTextModule, ButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private _authService = inject(AuthService);
    private _router = inject(Router);
    password: string = '';

    onSubmit(): void {
        this._authService.login(this.password).subscribe((response) => {
            if (response.success) {
                this._authService.setAuthenticated(true);
                this._router.navigate(['/home']);
            }
        });
    }
}
