import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import chalk from "chalk";

export interface SmartAxiosConfig extends AxiosRequestConfig {
  maxRetries?: number; // how many times to retry
  retryDelay?: number; // milliseconds between retries
}

export class SmartAxios {

  private client: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

constructor(config?: SmartAxiosConfig) {
  this.client = axios.create(config);
  this.maxRetries = config?.maxRetries ?? 3;
  this.retryDelay = config?.retryDelay ?? 500;
}


  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve , ms))
  }

  async request<T = any>(config: SmartAxiosConfig): Promise<AxiosResponse<T>> {
    const start = Date.now();
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        console.log(
          chalk.blue(`[HTTP Attempt ${attempt}] → ${config.method?.toUpperCase()} ${config.url}`)
        );
        const response = await this.client.request<T>(config);
        const duration = Date.now() - start;
        console.log(
          chalk.green(`[${response.status}] ${config.url} (${duration}ms)`)
        );
        return response;
      } catch (error: any) {
        const duration = Date.now() - start;

        // If it's the last attempt — throw the error
        if (attempt > this.maxRetries) {
          console.log(
            chalk.red(`[Failed after ${attempt - 1} retries] ${config.url} (${duration}ms)`)
          );
          throw error;
        }

        // Only retry on network or 5xx errors
        const status = error?.response?.status;
        const isRetryable =
          !status || (status >= 500 && status < 600);

        if (isRetryable) {
          console.log(
            chalk.yellow(`[Retry #${attempt}] ${config.url} after ${this.retryDelay}ms`)
          );
          await this.sleep(this.retryDelay);
        } else {
          // Non-retryable error (like 400, 401)
          console.log(
            chalk.red(`[Non-retryable error: ${status}] ${config.url}`)
          );
          throw error;
        }
      }
    }

    // should never reach here
    throw new Error("Unexpected retry loop exit");
  }

  // 🧩 Helper Methods
  get<T = any>(url: string, config?: SmartAxiosConfig) {
    return this.request<T>({ ...config, method: "GET", url });
  }

  post<T = any>(url: string, data?: any, config?: SmartAxiosConfig) {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  put<T = any>(url: string, data?: any, config?: SmartAxiosConfig) {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  delete<T = any>(url: string, config?: SmartAxiosConfig) {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}