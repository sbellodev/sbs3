const API_BASE_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

export const tournamentService = {
  getAllTournaments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments`);
      return handleResponse(response);
    } catch (error) {
      console.error('TournamentService.getAllTournaments error:', error);
      throw error;
    }
  },

  createTournament: async (tournamentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tournamentData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('TournamentService.createTournament error:', error);
      throw error;
    }
  },

  deleteTournament: async (tournamentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments?id=${tournamentId}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('TournamentService.deleteTournament error:', error);
      throw error;
    }
  }
};