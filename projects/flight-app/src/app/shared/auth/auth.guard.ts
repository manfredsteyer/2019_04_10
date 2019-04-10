import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return Math.random() < 0.5;

        return this.router.createUrlTree(['/home', { needsLogin: true }])

        // this.router.navigate(['/home']);
        // return false;
    }
}