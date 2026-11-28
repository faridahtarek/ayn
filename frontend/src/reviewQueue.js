// Ayn: the company's proofs, each paired with its funding (use case 5)
// Used by the review pages, the header badge and the quick jump

// Each proof with the funding of its farm (the funding holds the whole farm,
// so the page gets the farmer, the kit cost and the reward together).
// The proof's farm is an _id; the funding's farm is the whole farm (populate)
export function pairProofs(reviews, fundings) {
  const pairs = [];
  reviews.forEach((proof) => {
    const funding = fundings.find((f) => f.farm && f.farm._id === proof.farm);
    // A withdrawn funding has no farm left to review: skip it
    if (funding) pairs.push({ proof, funding });
  });
  return pairs;
}

// Only the proofs still waiting for the company: the review queue, in order
export function waitingQueue(reviews, fundings) {
  return pairProofs(reviews, fundings).filter((p) => p.proof.status === "pending");
}

// The feddans the company has switched to drip: its confirmed farms only
export function feddansSwitched(fundings) {
  let total = 0;
  fundings.forEach((f) => {
    if (f.farm && f.farm.status === "confirmed") total += f.farm.feddans;
  });
  // Math.round(x * 10) / 10 rounds to one decimal
  return Math.round(total * 10) / 10;
}
