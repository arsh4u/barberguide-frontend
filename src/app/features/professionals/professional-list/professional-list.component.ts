import {Component, OnInit} from '@angular/core';
import {finalize, Observable, tap} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {ProfessionalService} from '../professional.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-professional-list',
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './professional-list.component.html',
  styleUrl: './professional-list.component.scss'
})
export class ProfessionalListComponent implements OnInit {
  public professionals$!: Observable<User[]>;
  public isLoading = false;

  constructor(
    private store: Store,
    private professionalService: ProfessionalService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.professionals$ = this.professionalService.getProfessionals().pipe(
      finalize(() => {
        this.isLoading = false;
        console.log('--- Professionals loaded ---');
      })
    );
  }
}
