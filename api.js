const api = {
  getRooms: async (axios, roomId, limit = 100) => {
    let response = await axios.get(`messages/room/${roomId}/?limit=${limit}`);
    return response.data;
  },
  getMembers: async (axios, roomId) => {
    let response = await axios.get("members/room/" + roomId);
    return response.data;
  }
};

export { api };
