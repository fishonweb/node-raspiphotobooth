<template>
  <v-form v-model="valid">
    <v-container>
      <h2>Change your preferences</h2>
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="title"
            label="Photobooth Title"
            placeholder="Photobooth"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="time"
            type="number"
            label="Time before new picture (in ms)"
            placeholder="3000"
            step="1000"
            max="10000"
            min="1000"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <v-btn color="primary" v-on:click="submit">
            Valid
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  data() {
    return {
      data: {},
      time: null,
      title: null,
    };
  },
  beforeMount() {
    this.getParams();
  },
  methods: {
    async getParams() {
      const { data } = await axios.get('http://localhost:3009/api/getparams');
      this.time = data && data.time ? data.time : null;
      this.title = data && data.title ? data.title : null;
    },
    submit() {
      axios
        .post('http://localhost:3009/api/params', { title: this.title, time: this.time });
    },
  },
};
</script>
