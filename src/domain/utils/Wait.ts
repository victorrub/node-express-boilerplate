export default async function Wait(seconds: number = 1): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
