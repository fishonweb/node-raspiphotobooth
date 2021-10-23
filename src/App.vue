<template>
  <v-app>
     <v-app-bar v-if="displayHeader" app>
      <h1>{{ currentRouteName }}</h1>
    </v-app-bar>
    <v-main>
    <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    displayHeader() {
      console.log(this.$route);
      return this.$route.meta.displayHeader;
    },
  },
};
</script>
