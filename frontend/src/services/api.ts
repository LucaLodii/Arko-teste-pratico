import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message =
        data?.message || data?.error || `Erro na requisição (${status})`;
      return Promise.reject(new Error(message));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo limite excedido. Tente novamente.'));
    }
    return Promise.reject(
      new Error(error.message || 'Erro de conexão. Verifique sua rede.')
    );
  }
);
