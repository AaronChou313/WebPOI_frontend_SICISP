import axios from 'axios'
import { ApiResponseTemplate, PoiDataTemplate } from './responseTemplate.js'

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

/**
 * 根据名称搜索 POI
 */
export const getPoiByName = async (name) => {
  return requestWrapper(`${API_BASE_URL}/poi/search/name/${name}`)
}

/**
 * 根据省份搜索 POI
 */
export const getPoiByProvince = async (province) => {
  return requestWrapper(`${API_BASE_URL}/provinces?names=${provinces.join(',')}`)
}

/**
 * 根据边界范围搜索 POI
 */
export const getPoiByCoords = async (bounds) => {
  return requestWrapper(`${API_BASE_URL}/poi/search/coords?bounds=${JSON.stringify(bounds)}`)
}

/**
 * 根据中心点和半径搜索 POI
 */
export const getPoiByRadius = async (center, radius) => {
  return requestWrapper(`${API_BASE_URL}/poi/search/radius?center=${JSON.stringify(center)}&radius=${radius}`)
}