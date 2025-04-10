<template>
  <v-card class="mx-auto" :max-width="maxWidth" hover>
    <v-img
      class="align-end text-white"
      :height="imgHeight"
      :src="imgSrc"
      cover
    >
      <v-card-title>{{ title }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">{{ subtitle }}</v-card-subtitle>

    <v-card-text>
      <div>{{ primaryText }}</div>
      <div>{{ secondaryText }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn :color="buttonColor" :text="shareButtonText"></v-btn>
      <v-btn :color="buttonColor" :text="exploreButtonText"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
defineProps({
  maxWidth: {
    type: Number,
    default: 400
  },
  imgHeight: {
    type: Number,
    default: 200
  },
  imgSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  primaryText: {
    type: String,
    default: ''
  },
  secondaryText: {
    type: String,
    default: ''
  },
  buttonColor: {
    type: String,
    default: 'orange'
  },
  shareButtonText: {
    type: String,
    default: 'Share'
  },
  exploreButtonText: {
    type: String,
    default: 'Explore'
  }
});
</script>
