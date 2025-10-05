import {Component, OnInit} from '@angular/core';
import {filter, Observable} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {ProfessionalService} from '../professional.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Appointment} from '../../../core/models/appointment.model';
import {ConfirmService} from '../../../core/services/confirm/confirm.service';
import {ToastService} from '../../../core/services/toast/toast.service';

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
    private professionalService: ProfessionalService,
    private confirmService: ConfirmService,
    private toastService: ToastService
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

  onTimeSelected(time: string) {
    const professionalId = this.activatedRoute.snapshot.params['id'];
    if (!professionalId) return;

    const appointmentPayload: Appointment = {
      professional_id: professionalId,
      client_id: 1,
      service_id: 1,
      start_time: `${this.selectedDate} ${time}`
    }

    this.confirmService.confirm({
      title: 'Confirmar agendamento',
      message: `Você tem certeza que deseja agendar para ${new Date(this.selectedDate).toLocaleDateString('pt-BR')} às ${time} com este profissional?`,
      confirmText: 'Sim, agendar',
      cancelText: 'Cancelar'
    }).pipe(
      filter(confirmed => confirmed)
    ).subscribe(() => {
      this.professionalService.createAppointment(appointmentPayload)
        .subscribe({
          next: (appointment) => {
            this.toastService.show(
              `Agendamento realizado com sucesso para ${new Date(appointment.start_time)
                .toLocaleString('pt-BR')}`,
              'success'
            );
            this.loadAvailability(this.activatedRoute.snapshot.params['id'] as number);
          },
          error: (error) => {
            this.toastService.show('Erro ao agendar: ' + error.error.message || 'Tente novamente.', 'error');
          }
        });
    })
  }
}
