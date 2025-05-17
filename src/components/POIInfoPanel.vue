<template>
  <div class="poi-info-panel" v-if="selectedPoi">
    <div class="panel-header">
      <h3>{{ selectedPoi.name }}</h3>
      <button class="close-btn" @click="closePanel">×</button>
    </div>
    <div class="panel-content">
      <div class="poi-image-container">
        <img
          :src="selectedPoi.imageUrl"
          :alt="selectedPoi.name"
          class="poi-image"
        />
      </div>
      <div class="poi-details">
        <p class="detail-item">
          <span class="label">位置:</span>
          <span class="value">{{ selectedPoi.fullAddress }}</span>
        </p>
        <p class="detail-item">
          <span class="label">电话:</span>
          <span class="value">{{ selectedPoi.phone }}</span>
        </p>
        <p class="detail-item">
          <span class="label">开放时间:</span>
          <span class="value">{{ selectedPoi.openingHours }}</span>
        </p>
        <p class="detail-item">
          <span class="label">门票:</span>
          <span class="value">{{ selectedPoi.ticketInfo }}</span>
        </p>
        <p class="detail-item">
          <span class="label">简介:</span>
          <span class="value">{{ selectedPoi.description }}</span>
        </p>
        <div class="poi-actions">
          <button class="action-btn" @click="viewOnMap">
            在地图上查看
          </button>
          <button class="action-btn" @click="getDirections">
            查看路线
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'POIInfoPanel',
  props: {
    poi: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const selectedPoi = ref(props.poi)

    // 监听 poi 属性的变化
    watch(
      () => props.poi,
      (newPoi) => {
        selectedPoi.value = newPoi
      }
    )

    const closePanel = () => {
      emit('close')
    }

    const viewOnMap = () => {
      emit('viewOnMap', selectedPoi.value)
    }

    const getDirections = () => {
      emit('getDirections', selectedPoi.value)
    }

    return {
      selectedPoi,
      closePanel,
      viewOnMap,
      getDirections
    }
  }
}
</script>

<style scoped>
.poi-info-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 350px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #42b983;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.panel-content {
  padding: 15px;
}

.poi-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
  border-radius: 5px;
}

.poi-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poi-details {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 10px;
  line-height: 1.5;
}

.label {
  font-weight: bold;
  margin-right: 8px;
}

.poi-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #3a9170;
}
</style>