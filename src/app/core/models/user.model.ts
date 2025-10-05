export interface User {
  id: number;
  name: string;
  email: string;
  role: 'cliente' | 'profissional';
}
