import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {


    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    login(email: string, password: string) {
        return this.http.post<any>('/api/login', { email, password });
    }

    setSession(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
        }
    }

    getCurrentUser() {
        if (!isPlatformBrowser(this.platformId)) return null;

        const token = localStorage.getItem('token');
        if (!token) return null;

        return JSON.parse(atob(token));
    }

    isLoggedIn(): boolean {
        if (!isPlatformBrowser(this.platformId)) return false;

        const token = localStorage.getItem('token');
        return !!token;
    }

    getRole(): string | null {
        const user = this.getCurrentUser();
        return user?.role || null;
    }
}
