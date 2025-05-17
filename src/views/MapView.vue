<template>
  <div class="map-view">
    <MapComponent />
  </div>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'

export default {
  name: 'MapView',
  components: {
    MapComponent
  }
}
</script>

<style>
.map-view {
  width: 100%;
  height: 100vh;
}
</style>