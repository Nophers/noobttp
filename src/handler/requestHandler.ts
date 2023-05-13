import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestHandlerOptions, DebugLevel } from "./types";

/**
 * A class representing a request handler that sends HTTP requests using Axios.
 */
export class RequestHandler {
  /**
   * The Axios client instance used to make HTTP requests.
   *
   * @private
   */
  private readonly client: AxiosInstance;

  /**
   * Object containing request and response interceptors.
   *
   * @private
   */
  private readonly interceptors = {
    request: null as any,
    response: null as any,
  };

  /**
   * Creates a new `RequestHandler`.
   *
   * @param options - An object containing configuration options for the request handler.
   */
  constructor(private readonly options: IRequestHandlerOptions) {
    // Set default options for the Axios client.
    const defaultOptions: AxiosRequestConfig = {
      headers: this.options.headers ?? {},
      params: this.options.queryParams ?? {},
      responseType: this.options.responseType,
      maxContentLength: this.options.maxContentLength,
      timeout: this.options.timeout,
      maxBodyLength: this.options.maxBodyLength,
      withCredentials: this.options.withCredentials,
      validateStatus: this.options.validateStatus,
    };

    // If an API key is provided, add it to the Authorization header.
    if (this.options.apiKey) {
      defaultOptions.headers![
        "Authorization"
      ] = `Bearer ${this.options.apiKey}`;
    }

    // Create the Axios client instance.
    this.client = axios.create({ ...defaultOptions });

    // Add request interceptor to log debug information.
    this.interceptors.request = this.client.interceptors.request.use(
      (config) => {
        if (
          typeof this.options.debug !== "undefined" &&
          this.options.debug >= DebugLevel.SOFT
        ) {
          console.log(`Sending request to ${this.options.url}`);
        }

        return config;
      }
    );

    // Add response interceptor to log debug information.
    this.interceptors.response = this.client.interceptors.response.use(
      (response) => {
        if (this.options.debug && this.options.debug >= DebugLevel.MEDIUM) {
          console.log(
            `[RequestHandler] Interceptor: Received response from ${this.options.url}:`,
            response
          );
        }

        return response;
      },
      (error) => {
        const errorMessage = `An error occurred while sending request to ${this.options.url}: ${error.message}`;

        throw new Error(errorMessage);
      }
    );
  }

  /**
   * Sends an HTTP request using Axios.
   *
   * @returns A Promise that resolves with the HTTP response.
   */
  public async sendRequest<T = any>(): Promise<AxiosResponse<T>> {
    try {
      const response = await this.client.request<T>({
        url: this.options.url,
        method: this.options.mode,
        headers: this.options.headers ?? {},
        params: this.options.queryParams ?? {},
        data: this.options.body,
        responseType: this.options.responseType,
        maxContentLength: this.options.maxContentLength,
        timeout: this.options.timeout,
        maxBodyLength: this.options.maxBodyLength,
        withCredentials: this.options.withCredentials,
        validateStatus: this.options.validateStatus,
      });

      if (this.options.debug && this.options.debug >= DebugLevel.MEDIUM) {
        console.log(
          `[RequestHandler] Received response from ${this.options.url}:`,
          response
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage = `An error occurred while sending request to ${this.options.url}: ${error.message}`;

      throw new Error(errorMessage);
    }
  }

  /**
   * Removes all request and response interceptors added to the Axios client instance.
   */
  public removeInterceptors(): void {
    try {
      this.client.interceptors.request.eject(this.interceptors.request);
      this.client.interceptors.response.eject(this.interceptors.response);
    } catch (error: any) {
      console.error(`Error removing interceptors: ${error.message}`);
    }
  }
}
