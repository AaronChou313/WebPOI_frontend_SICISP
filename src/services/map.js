let mapInstance = null;
let markers = [];
let drawingMode = 'none'; // none / bbox / circle
let clickPoints = [];
let bboxPolygon = null;   // 当前绘制的矩形
let circleOverlay = null; // 当前绘制的圆形

// 初始化地图脚本并创建地图实例
export const initMap = (containerId) => {
  return new Promise((resolve) => {
    if (window.AMap) {
      initMapInstance(containerId);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${import.meta.env.VITE_AMAP_KEY}&callback=init`;
    script.async = true;
    document.head.appendChild(script);

    window.init = () => {
      initMapInstance(containerId);
      resolve();
    };
  });
};

// 实际创建地图实例的方法
const initMapInstance = (containerId) => {
  mapInstance = new window.AMap.Map(containerId, {
    center: [116.397428, 39.90923],
    zoom: 5,
  });

  // 绑定地图点击事件用于绘图
  mapInstance.on('click', function (e) {
    if (drawingMode === 'none') return;

    const { lng, lat } = e.lnglat;

    if (drawingMode === 'bbox') {
      clickPoints.push({ lng, lat });
      console.log(`已选择第 ${clickPoints.length} 个点`);

      // 添加标记点
      const marker = new window.AMap.Marker({
        position: [lng, lat],
        title: `点 ${clickPoints.length}`,
        label: { content: `点 ${clickPoints.length}` },
      });
      markers.push(marker);
      mapInstance.add(marker);

      if (clickPoints.length === 2) {
        const [p1, p2] = clickPoints;

        // 绘制矩形
        const path = [
          [p1.lng, p1.lat],
          [p1.lng, p2.lat],
          [p2.lng, p2.lat],
          [p2.lng, p1.lat],
        ];

        bboxPolygon = new window.AMap.Polygon({
          path,
          strokeColor: "#0070FF",
          strokeWeight: 2,
          fillColor: "#1791fc",
          fillOpacity: 0.1
        });

        mapInstance.add(bboxPolygon);

        window.dispatchEvent(new CustomEvent('bbox-selected', {
          detail: { lng1: p1.lng, lat1: p1.lat, lng2: p2.lng, lat2: p2.lat }
        }));
        drawingMode = 'none';
      }
    }

    if (drawingMode === 'circle') {
      if (clickPoints.length === 0) {
        // 第一次点击：设置圆心
        const { lng, lat } = e.lnglat;
        clickPoints.push({ lng, lat });

        // 添加圆心标记
        const marker = new window.AMap.Marker({
          position: [lng, lat],
          title: '圆心',
          label: { content: '圆心' },
        });
        markers.push(marker);
        mapInstance.add(marker);

        console.log('请选择圆上的一点');
      } else if (clickPoints.length === 1) {
        // 第二次点击：设置圆上一点，计算半径
        const center = clickPoints[0];
        const { lng, lat } = e.lnglat;

        // 计算两点之间距离（单位：米）
        const radius = Math.sqrt(
          Math.pow((lng - center.lng) * 111319.486, 2) +
          Math.pow((lat - center.lat) * 110574.273, 2)
        );

        const MAX_RADIUS = 50000; // 最大 50km
        const finalRadius = Math.min(radius, MAX_RADIUS); // 限制最大半径

        window.dispatchEvent(new CustomEvent('circle-selected', {
          detail: { lng: center.lng, lat: center.lat, radius: parseFloat(finalRadius.toFixed(2)) }
        }));

        // 绘制圆形
        circleOverlay = new window.AMap.Circle({
          center: [center.lng, center.lat],
          radius: radius,
          strokeColor: "#0070FF",
          strokeWeight: 2,
          fillColor: "#1791fc",
          fillOpacity: 0.1
        });

        mapInstance.add(circleOverlay);

        drawingMode = 'none';
        clickPoints = [];
      }
    }
  });
};

// 清除所有标记
export const clearMarkers = () => {
  if (mapInstance && markers.length) {
    markers.forEach(marker => mapInstance.remove(marker));
    markers = [];
  }
};

// 添加 POI 标记
export const addPoiMarkers = (poiData) => {
  clearMarkers();

  if (!Array.isArray(poiData)) return;

  poiData.forEach(poi => {
    const marker = new window.AMap.Marker({
      position: [parseFloat(poi.lng), parseFloat(poi.lat)],
      title: poi.name,
      extData: { type: 'poi', data: poi },
    });

    markers.push(marker);
    mapInstance.add(marker);
  });

  console.log('Markers added:', markers.length);
};

export const startDrawBbox = () => {
  clearDrawings();
  drawingMode = 'bbox';
  clickPoints = [];
  console.log('请在地图上点击两个点以定义矩形区域');
};

export const startDrawCircle = () => {
  clearDrawings();
  drawingMode = 'circle';
  clickPoints = [];
  console.log('请在地图上点击一点作为圆心');
};

// 清除所有绘图图形
export const clearDrawings = () => {
  if (!mapInstance) return;

  if (bboxPolygon) {
    mapInstance.remove(bboxPolygon);
    bboxPolygon = null;
  }

  if (circleOverlay) {
    mapInstance.remove(circleOverlay);
    circleOverlay = null;
  }

  drawingMode = 'none';
  clickPoints = [];
};

export { mapInstance };