<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
    <div class="search-panel">
      <h3>景点搜索</h3>
      <div class="search-group">
        <label>按名称:</label>
        <input v-model="searchName" @keyup.enter="searchByName" placeholder="景点名称">
        <button @click="searchByName">查询</button>
      </div>
      <div class="search-group">
        <label>按省份:</label>
        <select v-model="searchProvince">
          <option value="">--请选择省份--</option>
          <option v-for="province in provinces" :key="province">{{ province }}</option>
        </select>
        <button @click="searchByProvince">查询</button>
      </div>
      <div class="search-group">
        <button @click="initPolygonSearch">地图鼠标拉框搜索</button>
      </div>
      <div class="search-group">
        <button @click="initCircleSearch">中心半径搜索</button>
      </div>
    </div>
    <div class="results-panel">
      <h3>搜索结果 ({{ results.length }})</h3>
      <ul>
        <li v-for="poi in results" :key="poi.id" @click="centerAndShowPoi(poi)">
          {{ poi.name }} ({{ poi.province }} {{ poi.city }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { initMap, addPoiMarkers, addPolygonSearchListener, addCircleSearchListener, mapInstance, polygonTool, circleTool } from '../services/map'
import { getPoiByName, getPoiByProvince, getPoiByCoords, getPoiByRadius } from '../services/api'

let isPolygonSearchActive = false
let isCircleSearchActive = false

export default {
  name: 'MapComponent',
  setup() {
    const mapContainer = ref(null)
    const searchName = ref('')
    const searchProvince = ref('')
    const results = ref([])

    // 省份列表（模拟数据）
    const provinces = ref(['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'])

    let isPolygonSearchActive = false
    let isCircleSearchActive = false

    onMounted(async () => {
      await initMap(mapContainer.value)
    })

    const handleApiResponse = (result, onSuccess) => {
      if (result.code === 1000 && result.data) {
        onSuccess(result.data)
        // mapService.clearPoiMarkers() // 可选：清除旧标记
        addPoiMarkers(data)
      } else {
        alert(`Error: ${result.message}\n帮助: ${result.help || '无'}`)
      }
    }
    const searchByName = async () => {
      if (!searchName.value.trim()) return
      const result = await getPoiByName(searchName.value)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const searchByProvince = async () => {
      if (!searchProvince.value.trim()) return

      const result = await getPoiByProvince(searchProvince.value)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const initPolygonSearch = () => {
      if (isCircleSearchActive) {
        circleTool.close()
        isCircleSearchActive = false
      }

      addPolygonSearchListener((bounds) => {
        searchByCoords(bounds)
      })
      isPolygonSearchActive = true
    }

    const initCircleSearch = () => {
      if (isPolygonSearchActive) {
        polygonTool.close()
        isPolygonSearchActive = false
      }

      addCircleSearchListener((center, radius) => {
        searchByRadius(center, radius)
      })
      isCircleSearchActive = true
    }

    const searchByCoords = async (bounds) => {
      const result = await getPoiByCoords(bounds)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const searchByRadius = async (center, radius) => {
      const result = await getPoiByRadius(center, radius)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const centerAndShowPoi = (poi) => {
      mapInstance.setCenter([poi.lng, poi.lat])
      mapInstance.setZoom(15)
    }

    return {
      mapContainer,
      searchName,
      searchProvince,
      results,
      provinces,
      searchByName,
      searchByProvince,
      initPolygonSearch,
      initCircleSearch,
      centerAndShowPoi
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}

.search-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 300px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.search-group {
  margin-bottom: 15px;
}

.search-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.search-group input,
.search-group select {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-group button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.results-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.results-panel ul {
  list-style: none;
}

.results-panel li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.results-panel li:hover {
  background-color: #f5f5f5;
}
</style>