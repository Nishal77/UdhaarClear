/**
 * Keyword-based classification of a buyer's free-text WhatsApp reply into
 * promise / dispute / ignore (product.md §6.3, §7 item 12). Deliberately
 * not an LLM call — a fixed keyword list is enough to route the two intents
 * that matter (capture a promise, flag a dispute) without new infra cost.
 * ponytail: keyword match, not NLU. Swap for an LLM classifier if false
 * negatives on "ignore" (missed promises/disputes) show up in practice.
 */
export type ReplyIntent = 'promise' | 'dispute' | 'ignore'

const DISPUTE_WORDS = [
  'wrong', 'dispute', 'incorrect', 'not correct', 'already paid', 'galat',
  'quality', 'damage', 'damaged', 'shortage', 'mismatch', 'not received',
  'return', 'refund', 'complaint',
]

const PROMISE_WORDS = [
  'will pay', 'pay by', 'pay after', 'pay next', 'pay soon', 'promise',
  'kal', 'jaldi', 'clear kar', 'clear by', 'next week', 'next month',
  'diwali', 'by friday', 'by monday', 'this week', 'this month',
]

export function classifyReply(text: string): ReplyIntent {
  const t = text.toLowerCase()
  if (DISPUTE_WORDS.some((w) => t.includes(w))) return 'dispute'
  if (PROMISE_WORDS.some((w) => t.includes(w))) return 'promise'
  return 'ignore'
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.assert(classifyReply('I will pay by next week') === 'promise', 'promise detect failed')
  console.assert(classifyReply('This invoice is wrong, quality issue') === 'dispute', 'dispute detect failed')
  console.assert(classifyReply('ok') === 'ignore', 'ignore fallback failed')
  console.log('reply-classifier self-check passed')
}
