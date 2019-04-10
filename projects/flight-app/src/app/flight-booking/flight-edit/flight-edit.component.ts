import { Component, OnInit, EventEmitter } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CanComponentDeactivate } from '../../shared/exit/exit.guard';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnInit, CanComponentDeactivate {
  
  id: string;
  showDetails: string;
  showWarning = false;
  sender: Observer<boolean>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p['id'];
      this.showDetails = p['showDetails'];
    });
  }

  decide(decision: boolean) {
    this.showWarning = false;
    this.sender.next(decision);
    this.sender.complete();
  }

  canDeactivate(): Observable<boolean> {
    
    this.showWarning = true;
    return new Observable(sender => {
      this.sender = sender;
    });

  }

}
