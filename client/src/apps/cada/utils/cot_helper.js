function findCommonTokens(objA, objB) {
  const tokensA = objA.tokens.map(t => t.token);
  const tokensB = objB.tokens.map(t => t.token);
  return tokensA.filter(token => tokensB.includes(token));
}

// Function to sort an object's tokens based on common tokens
function sortTokensBasedOnCommon(obj, commonTokens) {
  const sortedTokens = [];
  const remainingTokens = [];

  // Prioritize common tokens while preserving their order
  for (let token of obj.tokens) {
    if (commonTokens.includes(token.token)) {
      sortedTokens.push(token);
    } else {
      remainingTokens.push(token);
    }
  }

  // Update the object's tokens array
  obj.tokens = [...sortedTokens, ...remainingTokens];

  return obj;
}

export function patternSort(pattern1, pattern2) {
  const common = findCommonTokens(pattern1, pattern2);
  const sortedPattern1 = sortTokensBasedOnCommon(pattern1, common);
  const sortedPattern2 = sortTokensBasedOnCommon(pattern2, common);

  return [sortedPattern1, sortedPattern2];
}