export function chunk(arr, chunkSize) {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
}

export function sumMarketValue(objects) {
  return objects.reduce((s, h) => s + h.marketValue, 0);
}

export function formatCurrency(value) {
  return value.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
}
