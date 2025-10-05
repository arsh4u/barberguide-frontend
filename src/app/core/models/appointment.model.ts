export interface Appointment {
  id?: number;
  professional_id: number;
  client_id: number;
  service_id: number;
  start_time: string;
  end_time?: string;
}
