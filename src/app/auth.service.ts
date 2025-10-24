import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private readonly AUTH_KEY = 'games_auth';

    constructor(private http: HttpClient) {
        // Check if user is already authenticated on service initialization
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        const isAuth = localStorage.getItem(this.AUTH_KEY) === 'true';
        this.isAuthenticatedSubject.next(isAuth);
    }

    login(password: string): Observable<{ success: boolean; message: string }> {
        return this.http.post<{ success: boolean; message: string }>('/api/login', { password });
    }

    setAuthenticated(isAuth: boolean): void {
        if (isAuth) {
            localStorage.setItem(this.AUTH_KEY, 'true');
        } else {
            localStorage.removeItem(this.AUTH_KEY);
        }
        this.isAuthenticatedSubject.next(isAuth);
    }

    logout(): void {
        this.setAuthenticated(false);
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
