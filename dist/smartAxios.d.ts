import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface SmartAxiosConfig extends AxiosRequestConfig {
    maxRetries?: number;
    retryDelay?: number;
}
export declare class SmartAxios {
    private client;
    private maxRetries;
    private retryDelay;
    constructor(config?: SmartAxiosConfig);
    private sleep;
    request<T = any>(config: SmartAxiosConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: SmartAxiosConfig): Promise<AxiosResponse<T, any, {}>>;
    post<T = any>(url: string, data?: any, config?: SmartAxiosConfig): Promise<AxiosResponse<T, any, {}>>;
    put<T = any>(url: string, data?: any, config?: SmartAxiosConfig): Promise<AxiosResponse<T, any, {}>>;
    delete<T = any>(url: string, config?: SmartAxiosConfig): Promise<AxiosResponse<T, any, {}>>;
}
