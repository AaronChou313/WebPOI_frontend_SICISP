let mapInstance = null
let polygonTool = null
let circleTool = null
let markers = []

export { mapInstance, polygonTool, circleTool }

export const initMap = (containerId) => {
  // 加载高德地图脚本
  return new Promise((resolve) => {
    if (window.AMap) {
      initMapInstance(containerId)
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${import.meta.env.VITE_AMAP_KEY}&callback=init`
    script.async = true
    document.head.appendChild(script)

    window.init = () => {
      initMapInstance(containerId)
      resolve()
    }
  })
}

const initMapInstance = (containerId) => {
  mapInstance = new window.AMap.Map(containerId, {
    center: [116.397428, 39.90923], // 默认北京
    zoom: 5
  })

  polygonTool = new window.AMap.PolygonTool({
    fillOpacity: 0.3
  })

  circleTool = new window.AMap.CircleTool({
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 1,
    fillOpacity: 0.3
  })

  // 点击标记显示信息窗
  mapInstance.on('click', function(e) {
    if (e.target && e.target.getExtData && e.target.getExtData().type === 'poi') {
      const poi = e.target.getExtData().data
      showInfoWindow(mapInstance, e.lnglat, poi)
    }
  })
}

export const addPoiMarkers = (poiData) => {
  // 清除旧标记
  markers.forEach(marker => mapInstance.remove(marker))
  markers = []

  // 添加新标记
  poiData.forEach(poi => {
    const marker = new window.AMap.Marker({
      position: [poi.lng, poi.lat],
      title: poi.name,
      extData: { type: 'poi', data: poi }
    })
    markers.push(marker)
    mapInstance.add(marker)
  })
}

export const addPolygonSearchListener = (callback) => {
  polygonTool.polygon({
    fillOpacity: 0.3,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 1,
    cursor: 'crosshair'
  }, function(polygon) {
    const bounds = polygon.getBounds()
    callback(bounds)
  })

  return polygonTool
}

export const addCircleSearchListener = (callback) => {
  circleTool.circle({
    center: mapInstance.getCenter(),
    radius: 1000,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 1,
    fillOpacity: 0.3
  }, function(circle) {
    const center = circle.getCenter()
    const radius = circle.getRadius()
    callback(center, radius)
  })

  return circleTool
}

const showInfoWindow = (map, position, poi) => {
  const infoWindow = new window.AMap.InfoWindow({
    content: `
      <div class="poi-info-window">
        <h3>${poi.name}</h3>
        <p>位置: ${poi.province} ${poi.city} ${poi.district}</p>
        <p>电话: ${poi.phone}</p>
        ${poi.imageUrl ? `<img src="${poi.imageUrl}" alt="${poi.name}" style="width:100px; height:100px; margin-top:10px;">` : ''}
      </div>
    `
  })
  infoWindow.open(map, position)
}