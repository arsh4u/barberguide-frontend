import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {selectError, selectLoading, selectProfessionals} from '../store/professionals.reducer';
import {ProfessionalsActions} from '../store/professionals.actions';

@Component({
  selector: 'app-professional-list',
  imports: [NgForOf, AsyncPipe, NgIf, RouterLink],
  templateUrl: './professional-list.component.html',
  styleUrl: './professional-list.component.scss'
})
export class ProfessionalListComponent implements OnInit {
  // Get from Store
  public professionals$: Observable<User[]>;
  public isLoading$: Observable<boolean>;
  public error$: Observable<any>;

  constructor(private store: Store) {
    // Init from store
    this.professionals$ = this.store.select(selectProfessionals);
    this.isLoading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    // Dispatch Store
    this.store.dispatch(ProfessionalsActions.loadProfessionals());
  }
}
