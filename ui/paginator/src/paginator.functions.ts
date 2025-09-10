export function getChunk(
  pageIndex: number,
  numberOfVisiblePages: number
): number {
  return Math.floor(pageIndex / numberOfVisiblePages);
}

export function generateRange(
  pageIndex: number,
  numberOfVisiblePages: number,
  numberOfPages: number
): number[] {
  const chunk = getChunk(pageIndex, numberOfVisiblePages);
  const first = chunk * numberOfVisiblePages;
  const last = Math.min(first + numberOfVisiblePages, numberOfPages);

  return Array.from({ length: last - first }, (v, k) => k + first);
}
