export const state = () => {
  return {
    rooms: [],
    currRoomMembers: [],
    currRoomMessages: []
  };
};

export const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms;
  },
  setMembers(state, members) {
    state.currRoomMembers = members;
  },
  setMessages(state, messages) {
    state.currRoomMessages = messages;
  }
};

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
  myRooms(state) {
    return state.rooms;
  },
  members(state) {
    return state.members;
  }
};

export const actions = {
  async getMembers({ commit }, roomId) {
    const members = await this.$axios.$get("members/room/" + roomId);
    commit("setMembers", members);
  }
};
