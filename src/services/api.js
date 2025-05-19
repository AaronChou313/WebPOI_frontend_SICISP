import axios from 'axios'
import { ApiResponseTemplate } from './responseTemplate.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 深拷贝模板函数
const createTemplateResponse = () => JSON.parse(JSON.stringify(ApiResponseTemplate))

// api.js 内部新增工具函数
const requestWrapper = async (url) => {
  const templateResponse = createTemplateResponse()

  try {
    const response = await axios.get(url)
    templateResponse.status = response.status
    templateResponse.code = response.data.code || 1000
    templateResponse.message = response.data.message || 'OK'
    templateResponse.data = response.data.data || null
    return templateResponse
  } catch (error) {
    console.error('API Error:', error)
    templateResponse.code = 500
    templateResponse.message = 'Service unavailable'
    templateResponse.data = null
    return templateResponse
  }
}

// Sites
export const getPoiById = async (id) => {
  return requestWrapper(`${API_BASE_URL}/sites/${id}`);
}

export const getAllPoiWithPhotos = async () => {
  return requestWrapper(`${API_BASE_URL}/sites/with-photos`);
}

export const getAllPoiNoPhotos = async () => {
  return requestWrapper(`${API_BASE_URL}/sites/no-photos`);
}

// Search
export const searchByKeyword = async (keyword) => {
  return requestWrapper(`${API_BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
}

// Province
export const getPoiByProvinceWithPhotos = async (province) => {
  return requestWrapper(`${API_BASE_URL}/province/${province}/with-photos`);
}

export const getPoiByProvinceNoPhotos = async (province) => {
  return requestWrapper(`${API_BASE_URL}/province/${province}/no-photos`);
}

export const getPoiByProvince = async (province) => {
  return requestWrapper(`${API_BASE_URL}/province/${province}`)
}

// Geo Box
export const getPoiByBbox = async (lng1, lat1, lng2, lat2) => {
  return requestWrapper(`${API_BASE_URL}/bbox?lng1=${lng1}&lat1=${lat1}&lng2=${lng2}&lat2=${lat2}`);
}

// Geo Radius
export const getPoiByNearby = async (lng, lat, radius) => {
  return requestWrapper(`${API_BASE_URL}/nearby?lng=${lng}&lat=${lat}&radius=${radius}`);
}