import { SmartAxios } from "./smartAxios";

(async () => {
  const api = new SmartAxios({
    baseURL: "https://jsonplaceholder.typicode.com",
    maxRetries: 3,
    retryDelay: 1000,
  });

  try {
    // This should work
    const ok = await api.get("/posts/1");
    console.log(ok.data);

    // This will fail (endpoint doesn't exist)
    const fail = await api.get("/bad-endpoint");
    console.log(fail.data);
  } catch (err) {
    console.error("Final error:", (err as any).message);
  }
})();
