import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IRequestHandlerOptions, DebugLevel } from "./types";

export class RequestHandler {
  private readonly client: AxiosInstance;
  private readonly interceptors = {
    request: null as any,
    response: null as any,
  };

  constructor(private readonly options: IRequestHandlerOptions) {
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

    if (this.options.apiKey) {
      defaultOptions.headers![
        "Authorization"
      ] = `Bearer ${this.options.apiKey}`;
    }

    this.client = axios.create({ ...defaultOptions });

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

  public removeInterceptors(): void {
    try {
      this.client.interceptors.request.eject(this.interceptors.request);
      this.client.interceptors.response.eject(this.interceptors.response);
    } catch (error: any) {
      console.error(`Error removing interceptors: ${error.message}`);
    }
  }
}
