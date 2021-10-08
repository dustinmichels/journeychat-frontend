const api = {
  getRoomMembers: async function(axios, roomId) {
    const reponse = await axios.get("members/room/" + roomId);
    return reponse.data;
  },
  getRoomMessages: async function(axios, roomId) {
    const response = await axios.get(
      `messages/room/${roomId}/?skip=0&limit=100`
    );
    return response.data;
  }
};

export { api };
