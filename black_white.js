const blacklist = flowState.blacklist;
const whitelist = flowState.whitelist || [];


// 确保 state.origin 是字符串，并对其进行敏感词和白名单检查
const originStr = String(state.origin || '').trim();// 检查是否包含任何黑名单中的词语
const containsBlackWord = [...blacklist].some(word => originStr.includes(word));// 检查是否完全等于白名单中的任何一个词语
const exactlyMatchesWhitelistWord = [...whitelist].some(word => originStr === word);// 如果包含黑名单且不完全等于白名单词语，则返回 true
const sensitiveResult = containsBlackWord && !exactlyMatchesWhitelistWord;
return sensitiveResult;