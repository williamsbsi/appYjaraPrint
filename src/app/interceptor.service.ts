import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {


  constructor(private router: Router, private auth: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error.success === false) {
            this.router.navigate(['login']);
          } else {
            this.router.navigate(['login']);
          }
        }
        return throwError(error);
      }));

  }
}
