export const simulateDelay = <T>(data: T, delayMs: number = 400): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};
