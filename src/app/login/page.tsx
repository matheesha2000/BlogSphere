import { redirect } from 'next/navigation'

export default function LoginRedirect() {
  // Redirect /login to the auth area where the real login page lives
  redirect('/auth/login')
}
