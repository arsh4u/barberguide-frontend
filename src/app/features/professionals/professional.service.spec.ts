import {TestBed} from '@angular/core/testing';
import {User} from '../../core/models/user.model';

import {ProfessionalService} from './professional.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../../environments/environments';
import {Appointment} from '../../core/models/appointment.model';
import {provideHttpClient} from '@angular/common/http';

describe('ProfessionalService', () => {
  let service: ProfessionalService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProfessionalService,
      ]
    });
    service = TestBed.inject(ProfessionalService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garante que não há requisições pendtende após cada teste
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste para o método getProfessionals()
  it('should fecth all professionals', () => {
    const mockProfessionals: User[] = [
      {id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'}
    ];

    service.getProfessionals().subscribe(professionals => {
      expect(professionals.length).toBe(1);
      expect(professionals).toEqual(mockProfessionals);
    });

    // Espera uma requisição para a URL correta e com o método GET
    const req = httpTestingController.expectOne(`${apiUrl}/professionals`);
    expect(req.request.method).toBe('GET');

    // Simula a resposta da API com os dados mockados
    req.flush(mockProfessionals);
  });

  // Teste para o método getProfessionalById
  it('should fecth a professional by id', () => {
    const mockProfessional: User = {id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'};

    service.getProfessionalById(1).subscribe(professional => {
      expect(professional).toEqual(mockProfessional);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/professionals/1`);
    expect(req.request.method).toBe('GET');

    // Simula a resposta da api com os dados mockados
    req.flush(mockProfessional);
  });

  // Teste para método getAvailability
  it('should fecth availability by professionalId and date', () => {
    const mockAvailability: { available_times: string[] } = {available_times: ['10:00', '11:00', '12:00']};
    const mockProfessionalId = 1;
    const mockDate = '2021-01-01';

    service.getAvailability(mockProfessionalId, mockDate).subscribe(availability => {
      console.info(availability)
      expect(availability.available_times.length).toBe(3)
      expect(availability).toEqual(mockAvailability);
    });

    const req = httpTestingController
      .expectOne(`${apiUrl}/professionals/${mockProfessionalId}/availability?date=${mockDate}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAvailability);
  });

  // Teste para método createAppointment
  it('should create an appointment', () => {
    const mockAppointment: Appointment = {
      id: 1,
      client_id: 2,
      professional_id: 1,
      service_id: 1,
      start_time: '2025-10-06 10:00:00',
      end_time: '2025-10-06 11:00:00'
    };

    service.createAppointment(mockAppointment).subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/appointments`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAppointment);
  });
});
