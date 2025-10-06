import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ProfessionalService} from '../professional.service';
import {ProfessionalsActions} from './professionals.actions';
import {catchError, exhaustMap, map, of} from 'rxjs';

@Injectable()
export class ProfessionalsEffects {
  private actions$ = inject(Actions);
  private professionalService = inject(ProfessionalService);

  loadProfessionals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProfessionalsActions.loadProfessionals),
      exhaustMap(() =>
        this.professionalService.getProfessionals().pipe(
          map(professionals => ProfessionalsActions.loadProfessionalsSuccess({professionals})),
          catchError((error) => of(ProfessionalsActions.loadProfessionalsError({error})))
        ))
    );
  });
}
