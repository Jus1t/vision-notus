import axios from 'axios';

const loginUser = async (Email, Password) => {
  try {
    console.log(Email,Password);
    const response = await axios.post('http://localhost:3000/api/login/', { Email, Password });
    console.log(response);
    const token = response.data.accessToken;
    // Store token in localStorage or sessionStorage
    localStorage.setItem('jwtToken', token);
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};
export default loginUser;