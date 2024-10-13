export const logout = () => {
  // Remove token and any other user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('authorization');
  localStorage.removeItem('userRole');

  // Optionally redirect the user to the login page or home page
  window.location.href = '/auth/login'; // or you can use history.push('/login') in React Router v5
};