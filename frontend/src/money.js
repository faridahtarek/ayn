// Ayn: how money is written on the company's pages (use case 3)
// toLocaleString() adds the thousands commas: 29000 becomes "29,000"
export function egp(amount) {
  return `EGP ${Number(amount).toLocaleString("en-US")}`;
}
