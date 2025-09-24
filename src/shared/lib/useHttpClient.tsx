import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuración de Supabase
export const SUPABASE_URL = 'https://qgjjmbyxppvmksvykwbe.supabase.co/rest/v1';
export const SUPABASE_ANON_KEY = 'sb_publishable_yddv5uc0jKxNqXRh5Bbvzw_01LNbkQQ';

export class HttpClient {
  private static instanciaApi: AxiosInstance;
  /**
   *  Obtiene la instancia de Axios
   * @returns Instancia de Axios
   */
  private static obtenerInstanciaAxios(): AxiosInstance {
    if (!HttpClient.instanciaApi) {
      /**
       * Instancia de Axios configurada para Supabase
       */
      HttpClient.instanciaApi = axios.create({
        baseURL: SUPABASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      /**
       * Interceptador de solicitudes simplificado
       */
      HttpClient.instanciaApi.interceptors.request.use(
        (config) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔗 ${config.method?.toUpperCase()} ${config.url}`);
          }
          return config;
        },
        (error: AxiosError) => {
          console.error('❌ Error en request:', error);
          return Promise.reject(error);
        }
      );
      /**
       * Interceptador
       */
      HttpClient.instanciaApi.interceptors.response.use(
        (response) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${response.status} - ${response.config.url}`);
          }
          return response;
        },
        (error: AxiosError) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`❌ ${error.response?.status} - ${error.config?.url}`);
          }
          return Promise.reject(error);
        }
      );
    }
    return HttpClient.instanciaApi;
  }

  /**
   * Realiza una petición GET a la url especificada.
   * @template T tipo de dato que se espera recibir en la respuesta.
   * @param {string} url URL a la que se realizará la petición.
   * @param {AxiosRequestConfig} [config] Configuración adicional de la petición.
   * @returns {Promise<AxiosResponse<T>>} Promesa que se resuelve con la respuesta completa.
   */
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await HttpClient.obtenerInstanciaAxios().get<T>(url, config);
  }

  /**
   * Realiza una petición POST a la url especificada.
   * @template T Tipo de dato que se espera recibir en la respuesta.
   * @param {string} url URL a la que se realizará la petición.
   * @param {unknown} [data] Datos a enviar en el cuerpo de la petición.
   * @param {AxiosRequestConfig} [config] Configuración adicional de la petición.
   * @returns {Promise<AxiosResponse<T>>} Promesa que se resuelve con la respuesta completa.
   */
  static async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await HttpClient.obtenerInstanciaAxios().post<T>(url, data || {}, config);
  }

  /**
   * Realiza una petición PUT a la url especificada.
   * @template T Tipo de dato que se espera recibir en la respuesta.
   * @param {string} url URL a la que se realizará la petición.
   * @param {unknown} data Datos a enviar en el cuerpo de la petición.
   * @param {AxiosRequestConfig} [config] Configuración adicional de la petición.
   * @returns {Promise<AxiosResponse<T>>} Promesa que se resuelve con la respuesta completa.
   */
  static async put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await HttpClient.obtenerInstanciaAxios().put<T>(url, data, config);
  }

  /**
   * Realiza una petición DELETE a la url especificada.
   * @template T Tipo de dato que se espera recibir en la respuesta.
   * @param {string} url URL a la que se realizará la petición.
   * @param {AxiosRequestConfig} [config] Configuración adicional de la petición.
   * @returns {Promise<AxiosResponse<T>>} Promesa que se resuelve con la respuesta completa.
   */
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await HttpClient.obtenerInstanciaAxios().delete<T>(url, config);
  }

  /**
   * Realiza una petición PATCH a la url especificada.
   * @template T Tipo de dato que se espera recibir en la respuesta.
   * @param {string} url URL a la que se realizará la petición.
   * @param {unknown} data Datos a enviar en el cuerpo de la petición.
   * @param {AxiosRequestConfig} [config] Configuración adicional de la petición.
   * @returns {Promise<AxiosResponse<T>>} Promesa que se resuelve con la respuesta completa.
   */
  static async patch<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await HttpClient.obtenerInstanciaAxios().patch<T>(url, data, config);
  }

  /**
   * Método específico para obtener películas de Supabase
   * @template T Tipo de dato que se espera recibir
   * @returns {Promise<AxiosResponse<T>>} Promesa con las películas
   */
  static async getPeliculas<T>(): Promise<AxiosResponse<T>> {
    return await HttpClient.get<T>('/Peliculas');
  }
}
