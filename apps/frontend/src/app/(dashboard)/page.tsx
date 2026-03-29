import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o root para o dashboard
  redirect('/dashboard');
}
