export function formatAddress(
  address: string,
  start: number,
  end: number,
  end2: number
) {
  if (!address) return null;
  return (
    address.substring(start, end) +
    "..." +
    address.substring(address.length - end2)
  );
}
