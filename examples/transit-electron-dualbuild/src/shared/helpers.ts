export function toNumber(input?: string) {
  if (!input) return 0;
  const chunks = input.split(' ');
  if (!chunks[0]) return 0;
  return Number(chunks[0]);
}

export const ProviderHasPin = (providerId:string) => {
    switch (providerId)
    {
        case 'Metro':
            return true
        default:
            return false;
    }
}

export const REGEX = {
  NULL_WHITESPACE: /^\s*$/
}
