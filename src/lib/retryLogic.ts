// utils/retryLogic.ts
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000,
  multiplier = 2
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    console.log(`Operasi gagal, mencoba kembali. Sisa percobaan: ${retries}`);
    await wait(delay);
    
    return retryOperation(
      operation,
      retries - 1,
      delay * multiplier
    );
  }
};