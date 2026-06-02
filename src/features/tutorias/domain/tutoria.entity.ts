export interface Tutoria {
  id: string;
  title: string;
  subject: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
  maxStudents: number;
  enrolledCount: number;
  status: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  createdAt: string;
}
