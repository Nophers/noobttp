export enum DebugLevel {
  SOFT,
  MEDIUM,
  HARD,
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export interface IRequestHandlerOptions {
  url: string;
  headers?: Record<string, any>;
  queryParams?: Record<string, any>;
  apiKey?: string;
  mode: HttpMethod;
  debug?: DebugLevel;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  maxContentLength?: number;
  timeout?: number;
  maxBodyLength?: number;
  validateStatus?: (status: number) => boolean;
  withCredentials?: boolean;
  body?: Record<string, any> | FormData;
}
