<template>
  <section>
    <!-- HEADER -->
    <div class="">
      <span class="is-size-3">{{ selectedRoom.name }} </span>
      <MembersModal :members="members" />
      <button v-on:click="leaveRoom">
        <b-icon icon="exit-run" class="buttons"> </b-icon>
      </button>
    </div>
    <!-- MESSAGES -->
    <div style="height:500px; overflow: scroll;">
      <section v-if="dataLoaded">
        <template v-if="!messagesWithUsers.length">
          No messages!
        </template>
        <template v-else>
          <Message
            v-for="(msg, index) in messagesWithUsers"
            :key="index"
            :msg="msg"
          />
        </template>
      </section>
      <template v-else>
        <LoadingMessage />
      </template>
    </div>
    <!-- SEND MSG -->
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input "
          type="text"
          ref="chatbar"
          placeholder="Your message..."
          v-on:keyup.enter="onSendMessage"
        />
      </div>
      <div class="control">
        <a class="button is-info">
          <b-icon icon="send" size="is-small"> </b-icon>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["selectedRoom", "dataLoaded", "members", "messagesWithUsers"]
};
</script>
