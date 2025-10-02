import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {ProfessionalService} from '../professional.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-professional-detail',
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NgForOf
  ],
  templateUrl: './professional-detail.component.html',
  styleUrl: './professional-detail.component.scss'
})
export class ProfessionalDetailComponent implements OnInit {
  professional$!: Observable<User>;
  availability$!: Observable<{ available_times: string[] }>;
  selectedDate: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private professionalService: ProfessionalService
  ) {
    // Define a data de hoje como padrão no formato AAAA-MM-DD
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    // Pegamos o 'id' da URL
    const professionalId = this.activatedRoute.snapshot.params['id'];

    // Se o ID existir, chamamos o serviço
    if (professionalId) {
      this.professional$ = this.professionalService.getProfessionalById(professionalId);
      this.loadAvailability(professionalId);// Carrega a disponibilidade para a data de hoje
    }
  }

  // Método para carregar a disponibilidade
  loadAvailability(professionalId: number): void {
    this.availability$ = this.professionalService.getAvailability(professionalId, this.selectedDate);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    const professionalId = this.activatedRoute.snapshot.params['id'];
    if (professionalId) {
      this.loadAvailability(professionalId);
    }
  }
}
