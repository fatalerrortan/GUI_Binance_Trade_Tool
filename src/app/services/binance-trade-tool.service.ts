import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders(
//     {'Content-Type': 'multipart/form-data'},
//   )
// }

@Injectable({
  providedIn: 'root'
})

export class BinanceTradeToolService {

  constructor(private http:HttpClient) { }

  run(api_url: string, formData: object) { 
    api_url += 'app'
    return this.http.post(api_url, formData, {responseType: 'text'}).pipe(
      // retry(3),
      catchError(this.handleError)
    )
  }

  stop(api_url: string): Observable<any> {
    api_url += 'stop'
    return this.http.get(api_url, {responseType: 'text'}).pipe(
      // retry(3),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
