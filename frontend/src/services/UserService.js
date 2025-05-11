const API_BASE_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return handleResponse(response);
    } catch (error) {
      console.error('UserService.getAllUsers error:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('UserService.createUser error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?id=${userId}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      throw error;
    }
  }
};