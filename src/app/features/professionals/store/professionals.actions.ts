import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {User} from '../../../core/models/user.model';

export const ProfessionalsActions = createActionGroup({
  source: 'Professionals API',
  events: {
    'Load Professionals': emptyProps(),
    'Load Professionals Success': props<{ professionals: User[] }>(),
    'Load Professionals Error': props<{ error: any }>(),
  }
});
