import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of, Subject} from 'rxjs';
import {Flight} from '../models/flight';
import { OAuthStorage } from 'angular-oauth2-oidc';




@Injectable()
export class FlightService implements AbstractFlightService {

  flights: Flight[] = [];

  private flightsSubject = new Subject<Flight[]>();
  flights$: Observable<Flight[]> = this.flightsSubject.asObservable();


  baseUrl: string = `http://www.angular.at/api`;
  reqDelay = 1000;

  constructor(
    private oauthService: OAuthStorage,
    private http: HttpClient) {
  }

  load(from: string, to: string, urgent: boolean): void {
    this.find(from, to, urgent)
      .subscribe(
        flights => {
          this.flights = flights;

          this.flightsSubject.next(this.flights);

        },
        err => console.error('Error loading flights', err)
      );
  }

  find(from: string, to: string, urgent: boolean = false): Observable<Flight[]> {

    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl,'error?code=403'].join('/');
    }

    let params = new HttpParams()
      .set('from', from)
      .set('to', to);

    let headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'BEARER ' + this.oauthService.getItem('access_token'));

    const reqObj = {params, headers};
    return this.http.get<Flight[]>(url, reqObj);
    // return of(flights).pipe(delay(this.reqDelay))

  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: null };
    reqObj.params = new HttpParams().set('id', id);
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj);
    // return of(flights[0]).pipe(delay(this.reqDelay))
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

  delay() {
    const ONE_MINUTE = 1000 * 60;

    let oldFlights = this.flights;
    let oldFlight = oldFlights[0];
    let oldDate = new Date(oldFlight.date);

    // Mutable
    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    // oldFlight.date = oldDate.toISOString();

    const newDate = new Date((oldDate.getTime() + 15 * ONE_MINUTE));
    const newFlight: Flight = {...oldFlight, date: newDate.toISOString()};
    const newFlights: Flight[] = [newFlight, ...oldFlights.slice(1)];
    
    this.flights = newFlights;

    this.flightsSubject.next(newFlights);

  }

}


// AbstractFlightService --> FlightService

// providers: [{provide: AbstractFlightService, useClass: FlightService}]

@Injectable({
  providedIn: 'root',
  useClass: FlightService
})
export abstract class AbstractFlightService {
  abstract load(from: string, to: string, urgent: boolean): void;
}