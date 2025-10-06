import {User} from '../../../core/models/user.model';
import {createFeature, createReducer, on} from '@ngrx/store';
import {ProfessionalsActions} from './professionals.actions';

export interface ProfessionalsState {
  professionals: User[];
  loading: boolean;
  error: any;
}

export const initialState: ProfessionalsState = {
  professionals: [],
  loading: false,
  error: null,
};

export const professionalsFeature = createFeature({
  name: 'professionals',
  reducer: createReducer(
    initialState,
    on(ProfessionalsActions.loadProfessionals,
      (state) => ({...state, loading: true})),

    on(ProfessionalsActions.loadProfessionalsSuccess,
      (state, {professionals}) =>
        ({...state, professionals, loading: false})),

    on(ProfessionalsActions.loadProfessionalsError,
      (state, {error}) => ({...state, error, loading: false}))
  )
});

export const {
  selectProfessionals,
  selectLoading,
  selectError
} = professionalsFeature;
