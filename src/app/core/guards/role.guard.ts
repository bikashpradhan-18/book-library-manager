import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export function roleGuard(expectedRole: string): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        const platformId = inject(PLATFORM_ID);

        if (!isPlatformBrowser(platformId)) {
            return true;
        }

        if (auth.getRole() === expectedRole) {
            return true;
        }

        return router.createUrlTree(['/books']);
    };
}
