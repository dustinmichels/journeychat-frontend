export const state = () => {
  return {
    rooms: [],
    members: []
  };
};

export const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms;
  },
  setMembers(state, members) {
    state.members = members;
  },
  setAccount(state, account) {
    state.account = account;
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
