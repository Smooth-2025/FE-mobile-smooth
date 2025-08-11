import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

//응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    return Promise.reject(error);
  }
);

// Alert Test API - @RequestParam 방식으로 수정
export const alertTestApi = {
  // 사고 알림 테스트
  testAccident: (userId: string, latitude: number, longitude: number, accidentId?: string) => {
    const params = new URLSearchParams({
      userId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    
    if (accidentId) {
      params.append('accidentId', accidentId);
    }
    
    return api.post(`/api/test/accident?${params.toString()}`, null);
  },

  // 장애물 알림 테스트
  testObstacle: (userId: string, latitude: number, longitude: number) => {
    const params = new URLSearchParams({
      userId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    
    return api.post(`/api/test/obstacle?${params.toString()}`, null);
  },

  // 포트홀 알림 테스트
  testPothole: (userId: string, latitude: number, longitude: number) => {
    const params = new URLSearchParams({
      userId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    
    return api.post(`/api/test/pothole?${params.toString()}`, null);
  },

  // 간단한 메시지 전송 테스트
  sendSimpleMessage: (userId: string, message?: string) => {
    const params = new URLSearchParams({
      userId,
    });
    
    if (message) {
      params.append('message', message);
    }
    
    return api.post(`/api/test/simple-message?${params.toString()}`, null);
  },

  // WebSocket 연결 상태 확인
  checkConnectionStatus: (userId: string) => {
    return api.get(`/api/test/connection-status/${userId}`);
  },

  // Redis 위치 데이터 확인
  checkLocation: (key: string) => {
    return api.get(`/api/test/location/${key}`);
  },
};

export default api;
