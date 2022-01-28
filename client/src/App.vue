<template>
  <Nav :key="$route.fullPath" />
  <router-view></router-view>
</template>

<style></style>

<script setup>
  import Nav from './components/Nav.vue'
</script>
