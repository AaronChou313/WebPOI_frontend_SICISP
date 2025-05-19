<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
    <div class="search-panel">
      <h3>景点搜索</h3>
      <div class="search-group">
        <label>按景点名称搜索:</label>
        <input v-model="searchKeyword" @keyup.enter="performKeywordSearch" placeholder="景点名称">
        <button @click="performKeywordSearch">查询</button>
      </div>
      <!-- 原有的按省份查询 -->
      <div class="search-group">
        <label>按省份搜索:</label>
        <select v-model="searchProvince">
          <option value="">--请选择省份--</option>
          <option v-for="province in provinces" :key="province">{{ province }}</option>
        </select>
        <button @click="searchByProvince">查询全部</button>
        <button @click="searchProvinceWithPhotos">仅含图片</button>
        <button @click="searchProvinceNoPhotos">不含图片</button>
      </div>
      <div class="search-group">
        <button @click="startDrawBbox">框选矩形区域搜索</button>
        <button @click="startDrawCircle">圆形区域搜索</button>
      </div>
      <div v-if="selectedPoi" class="poi-details-modal">
        <h4>景点详情</h4>
        <p><strong>名称：</strong>{{ selectedPoi.name }}</p>
        <p><strong>省份：</strong>{{ selectedPoi.province }}</p>
        <p><strong>地址：</strong>{{ selectedPoi.detail }}</p>
        <p><strong>等级：</strong>{{ selectedPoi.level }}</p>
        <!-- 图片展示 -->
        <div v-if="selectedPoi.photos && selectedPoi.photos.length > 0" class="photo-gallery">
          <button class="nav-btn prev" @click="prevPhoto">&#10094;</button>
          <img :src="currentPhotoUrl" alt="景点图片" class="gallery-img">
          <button class="nav-btn next" @click="nextPhoto">&#10095;</button>
        </div>
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
import { ref, onMounted, computed } from 'vue'
import {
  initMap,
  addPoiMarkers,
  mapInstance,
  startDrawBbox,
  startDrawCircle,
} from '../services/map'
import {
  searchByKeyword,
  getPoiByProvince,
  getPoiByProvinceWithPhotos,
  getPoiByProvinceNoPhotos,
  getPoiByBbox,
  getPoiByNearby,
} from '../services/api'

export default {
  name: 'MapComponent',
  setup() {
    const mapContainer = ref(null)
    const searchProvince = ref('')
    const results = ref([])
    const searchKeyword = ref('')
    const selectedPoi = ref(null)
    const photoIndex = ref(0)

    const currentPhotoUrl = computed(() => {
      if (!selectedPoi.value || !selectedPoi.value.photos || selectedPoi.value.photos.length === 0) {
        return ''
      }
      return selectedPoi.value.photos[photoIndex.value]
    })

    const prevPhoto = () => {
      if (selectedPoi.value.photos.length <= 1) return
      photoIndex.value = (photoIndex.value - 1 + selectedPoi.value.photos.length) % selectedPoi.value.photos.length
    }

    const nextPhoto = () => {
      if (selectedPoi.value.photos.length <= 1) return
      photoIndex.value = (photoIndex.value + 1) % selectedPoi.value.photos.length
    }
    
    // 省份列表（模拟数据）
    const provinces = ref(['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'])

    onMounted(async () => {
      await initMap(mapContainer.value);

      if (!window.__eventListenersAdded__) {
        window.addEventListener('bbox-selected', handleBboxSearch);
        window.addEventListener('circle-selected', handleCircleSearch);
        window.__eventListenersAdded__ = true;
      }
    });

    // 处理API响应
    const handleApiResponse = (result, onSuccess) => {
      if (result.code === 1000 && result.data) {
        // 将每个 POI 的 lng/lat 转换为 number 类型
        const processedData = result.data.map(poi => ({
          ...poi,
          lng: parseFloat(poi.lng),
          lat: parseFloat(poi.lat),
          photos: poi.photo_urls || []
        }))

        onSuccess(processedData)
        addPoiMarkers(processedData)
        console.log('POI 数据:', processedData)
      } else {
        alert(`Error: ${result.message}\n帮助: ${result.help || '无'}`)
      }
    }

    // 根据名称关键词模糊搜索
    const performKeywordSearch = async () => {
      if (!searchKeyword.value.trim()) return

      const result = await searchByKeyword(searchKeyword.value)
      handleApiResponse(result, (data) => {
        results.value = data.slice(0, 20) // 只展示前20条结果
      })
    }

    // 根据省份搜索
    const searchByProvince = async () => {
      if (!searchProvince.value.trim()) return

      const result = await getPoiByProvince(searchProvince.value)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const searchProvinceWithPhotos = async () => {
      if (!searchProvince.value.trim()) return
      const result = await getPoiByProvinceWithPhotos(searchProvince.value)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const searchProvinceNoPhotos = async () => {
      if (!searchProvince.value.trim()) return
      const result = await getPoiByProvinceNoPhotos(searchProvince.value)
      handleApiResponse(result, (data) => {
        results.value = data
      })
    }

    const centerAndShowPoi = (poi) => {
      console.log("currentPOI: ",selectedPoi)
      mapInstance.setCenter([poi.lng, poi.lat])
      mapInstance.setZoom(15)
      selectedPoi.value = poi
    }

    const handleBboxSearch = async (event) => {
      const { lng1, lat1, lng2, lat2 } = event.detail;
      const result = await getPoiByBbox(lng1, lat1, lng2, lat2);
      handleApiResponse(result, data => {
        results.value = data;
        addPoiMarkers(data);
      });
    };

    const handleCircleSearch = async (event) => {
      const { lng, lat, radius } = event.detail;
      const result = await getPoiByNearby(lng, lat, radius);
      handleApiResponse(result, data => {
        results.value = data;
        addPoiMarkers(data);
      });
    };

    return {
      mapContainer,
      searchKeyword,
      searchProvince,
      results,
      provinces,
      performKeywordSearch,
      searchByProvince,
      searchProvinceWithPhotos,
      searchProvinceNoPhotos,
      centerAndShowPoi,
      selectedPoi,
      startDrawBbox,
      startDrawCircle,
      currentPhotoUrl,
      prevPhoto,
      nextPhoto,
      photoIndex
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

.search-panel h3 {
  text-align: center;
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

.poi-details-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
}

.photo-gallery {
  position: relative;
  width: 100%;
  margin-top: 10px;
  text-align: center;
}

.gallery-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  object-fit: contain;
  background-color: #f0f0f0;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  z-index: 1;
}

.prev {
  left: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.next {
  right: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
