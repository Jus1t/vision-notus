import axios from 'axios';

const loginUser = async (username, password) => {
  try {
    const response = await axios.post('/login', { username, password });
    const token = response.data.token;
    // Store token in localStorage or sessionStorage
    localStorage.setItem('jwtToken', token);
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};
export default loginUser;