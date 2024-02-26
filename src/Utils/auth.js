export function isAuthenticated() {
  // Here, replace with your logic.
  // For this example, let's assume you store a token in localStorage when the user is logged in.
  return !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'));
}
