import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDbService } from '../services/mock-db.service';
import { User } from '../models/user.model';

export function mockBackendInterceptor(
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> {

    const db = inject(MockDbService);
    const { url, method, body } = req;

    // LOGIN
    if (url.endsWith('/api/login') && method == 'POST') {
        const users = db.getUsers();

        const user = users.find(
            (u: User) => u.email == body.email && u.password == body.password
        );

        if (!user) {
            return throwError(() => new Error('Invalid email or password'));
        }

        const token = btoa(
            JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                password: user.password,
            })
        );

        return of(
            new HttpResponse({
                status: 200,
                body: {
                    token,
                },
            })
        ).pipe(delay(500));
    }

    return next(req);
}
