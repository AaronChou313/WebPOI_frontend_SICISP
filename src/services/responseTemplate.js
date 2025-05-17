// responseTemplate.js
export const PoiDataTemplate = {
  site_id: 0,
  name: '',
  province: '',
  level: '',
  lng: 0.0,
  lat: 0.0,
  address: '',
  detail: '',
  photo_count: 0,
  photos: []
};

export const ApiResponseTemplate = {
  status: 200,
  code: 1000,
  message: 'OK',
  help: null,
  data: [PoiDataTemplate]
};