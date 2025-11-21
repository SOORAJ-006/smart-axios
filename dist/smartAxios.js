"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartAxios = void 0;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
class SmartAxios {
    constructor(config) {
        this.client = axios_1.default.create(config);
        this.maxRetries = config?.maxRetries ?? 3;
        this.retryDelay = config?.retryDelay ?? 500;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async request(config) {
        const start = Date.now();
        let attempt = 0;
        while (attempt <= this.maxRetries) {
            attempt++;
            try {
                console.log(chalk_1.default.blue(`[HTTP Attempt ${attempt}] → ${config.method?.toUpperCase()} ${config.url}`));
                const response = await this.client.request(config);
                const duration = Date.now() - start;
                console.log(chalk_1.default.green(`[${response.status}] ${config.url} (${duration}ms)`));
                return response;
            }
            catch (error) {
                const duration = Date.now() - start;
                // If it's the last attempt — throw the error
                if (attempt > this.maxRetries) {
                    console.log(chalk_1.default.red(`[Failed after ${attempt - 1} retries] ${config.url} (${duration}ms)`));
                    throw error;
                }
                // Only retry on network or 5xx errors
                const status = error?.response?.status;
                const isRetryable = !status || (status >= 500 && status < 600);
                if (isRetryable) {
                    console.log(chalk_1.default.yellow(`[Retry #${attempt}] ${config.url} after ${this.retryDelay}ms`));
                    await this.sleep(this.retryDelay);
                }
                else {
                    // Non-retryable error (like 400, 401)
                    console.log(chalk_1.default.red(`[Non-retryable error: ${status}] ${config.url}`));
                    throw error;
                }
            }
        }
        // should never reach here
        throw new Error("Unexpected retry loop exit");
    }
    // Helper Methods
    get(url, config) {
        return this.request({ ...config, method: "GET", url });
    }
    post(url, data, config) {
        return this.request({ ...config, method: "POST", url, data });
    }
    put(url, data, config) {
        return this.request({ ...config, method: "PUT", url, data });
    }
    delete(url, config) {
        return this.request({ ...config, method: "DELETE", url });
    }
}
exports.SmartAxios = SmartAxios;
