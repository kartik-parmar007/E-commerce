export function formatINR(value) {
  const num = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  } catch (err) {
    // Fallback
    return `₹${num.toFixed(2)}`;
  }
}
