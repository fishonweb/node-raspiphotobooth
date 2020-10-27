<template>
  <img :src="picture" />
</template>

<script>

export default {
  name: 'Preview-picture',
  props: {
    picture: String,
  },
};
</script>
