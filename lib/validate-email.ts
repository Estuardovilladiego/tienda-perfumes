const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function esEmailValido(email: string) {
  return EMAIL_REGEX.test(normalizarEmail(email));
}
