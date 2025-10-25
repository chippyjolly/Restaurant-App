const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to your backend API URL

export const getMenu = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
