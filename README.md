# WebPOI_frontend_SICISP

# WebPOI 前端系统 - 空间智能计算与服务课程实习

这是空间智能计算与服务课程实习项目的前端部分，基于 Vue 3 + Vite + AMap 实现了地图上的 POI（兴趣点）搜索功能，包括名称搜索、省份筛选、矩形区域和圆形区域范围搜索等核心功能。

数据库以及API的获取见[WebPOI_backend_SICISP](https://github.com/AaronChou313/WebPOI_backend_SICISP)后端项目。

## 📸 功能演示

### 1. 名称搜索
输入关键词进行模糊匹配，快速定位景点。

![名称搜索演示](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E5%90%8D%E7%A7%B0%E6%90%9C%E7%B4%A2%E6%BC%94%E7%A4%BA1.gif)


![名称搜索扩展演示](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E5%90%8D%E7%A7%B9%E6%90%9C%E7%B4%A2%E6%BC%94%E7%A4%BA2.gif)

---

### 2. 省份搜索 - 湖北
选择特定省份后，地图上显示该省所有 POI 数据。

![省份搜索-湖北](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E7%9C%81%E4%BB%BD%E6%90%9C%E7%B4%A2-%E6%B9%96%E5%8C%97.gif)

---

### 3. 省份搜索 - 重庆
切换省份时，自动加载对应数据并更新地图标记。

![省份搜索-重庆](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E7%9C%81%E4%BB%BD%E6%90%9C%E7%B4%A2-%E9%87%8D%E5%BA%86.gif)

---

### 4. 矩形区域搜索
通过鼠标点击绘制矩形区域，查询区域内所有 POI。

![矩形区域搜索](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E7%9F%A9%E5%BD%A2%E5%8C%BA%E5%9F%9F%E6%90%9C%E7%B4%A2.gif)

---

### 5. 圆形区域搜索
设置圆心和半径，查询圆形范围内 POI。

![圆形区域搜索](https://github.com/AaronChou313/WebPOI_frontend_SICISP/blob/main/src/assets/%E5%9C%86%E5%BD%A2%E5%8C%BA%E5%9F%9F%E6%90%9C%E7%B4%A2.gif)

---

## 🧩 核心功能列表

- ✅ 地图初始化与交互（AMap）
- ✅ POI 名称关键词搜索
- ✅ 按省份筛选 POI（含图片 / 不含图片 / 全部）
- ✅ 支持矩形框选区域搜索
- ✅ 支持圆形区域搜索
- ✅ POI 详情弹窗展示（含图片轮播）
- ✅ 自动标注搜索结果位置

---

## 🛠️ 技术栈

- **Vue 3**（Composition API）
- **Vite**（构建工具）
- **AMap JS API v2.0**（高德地图 SDK）
- **Axios**（网络请求）
- **SCSS/CSS**（样式管理）

---

## 📦 安装与运行

请确保你已安装 Node.js 和 npm/yarn/pnpm。进入项目目录后执行以下命令：

```bash
npm install
npm run dev
```

---

## 📁 项目结构概览

```
src/
├── assets/              # 静态资源（如图标、图片）
├── components/          # Vue 组件（如地图组件 MapComponent.vue）
├── services/            # 数据请求、地图操作逻辑封装
├── App.vue
├── main.js
└── router.js
```

---

## 📝 后续可拓展方向

- ✅ 图片懒加载 & 放大查看
- ✅ 用户定位与周边推荐
- ✅ 聚合标记优化大规模 POI 展示
- ✅ 支持移动端响应式适配
- ✅ 添加用户收藏、评论等功能模块

---
