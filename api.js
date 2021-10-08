export default {
  getRoomMembers: async function($axios, roomId) {
    return await $axios.$get("members/room/" + roomId);
  },
  getRoomMessages: async function($axios, roomId) {
    return await $axios.$get(`messages/room/${roomId}/?skip=0&limit=100`);
  },
  getJoinedRooms: async function($axios) {
    return await $axios.$get("rooms/joined/");
  },
  leaveRoom: async function($axios, roomId) {
    return await $axios.$put("actions/leave/" + roomId);
  },
  joinRoom: async function($axios, roomId) {
    return await $axios.$put("actions/join/" + roomId);
  },
  createRoom: async function($axios, roomName, isPrivate) {
    return await $axios.$post("rooms/", {
      name: roomName,
      is_private: isPrivate
    });
  }
};
