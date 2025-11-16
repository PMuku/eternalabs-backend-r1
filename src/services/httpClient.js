import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function httpGetWithRetry(url, options = {}, maxRetries = 4) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      attempt++;

      if (attempt > maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = (200 * Math.pow(2, attempt)) + Math.random() * 100;
      console.log(`Retry attempt ${attempt} for ${url} after ${delay}ms`);

      await sleep(delay);
    }
  }
}
