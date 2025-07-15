import axios from 'axios';

const REGISTER_URL = 'http://localhost:8080/api/auth/register';

export const register = async (data) => {
  try {
    const response = await axios.post(REGISTER_URL, data);
    return { success: true, message: response.data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Registration failed.',
    };
  }
}; 