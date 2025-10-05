import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['email@teste.com', [Validators.required]],
      password: ['****', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  login() {
    if (this.form.invalid) {
      alert("Form invalido");
      return;
    }

    const val = this.form.value;
    this.auth.login(val.email, val.password)
      .pipe(tap(user => {
        console.log(user);

        // this.store.dispatch();

        this.router.navigateByUrl('/');
      }))
      .subscribe()
  }
}
