<template>
  <div>
    <v-carousel
      cycle
      height="100vh"
      hide-delimiter-background
      show-arrows-on-hover
      v-if="!overlay">
      <v-carousel-item v-for="(picture, i) in pictures" :key="i">
        <v-sheet height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <v-img :src="`${picturesURL}/${picture}`" ratio="16/9" />
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <PreviewPicture v-bind:picture="`${picturesURL}/${preview}`" v-if="preview"/>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="120"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import PreviewPicture from '@/components/Preview-picture.vue';

export default {
  name: 'Photobooth',
  components: {
    PreviewPicture,
  },
  data: () => ({
    overlay: false,
    preview: null,
    picturesURL: `${process.env.VUE_APP_PHOTOBOOTH_URL}/photobooth`,
    pictures: null,
  }),
  mounted() {
    const socket = io(process.env.VUE_APP_PHOTOBOOTH_URL);

    socket.on('start', () => {
      this.overlay = true;
    });

    socket.on('welcome', () => {
      this.overlay = true;
    });

    socket.on('photobooth', (pic) => {
      this.preview = pic;
      setTimeout(() => {
        this.preview = null;
      }, 2000);
    });

    socket.on('random', (pics) => {
      console.log('socket random', pics);
      this.pictures = pics;
    });

    axios
      .get(`${process.env.VUE_APP_PHOTOBOOTH_URL}/pictures`)
      .then((response) => (this.pictures = response.data));
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/main.sass'
</style>
