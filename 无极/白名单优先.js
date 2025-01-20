const blacklist = flowState.blacklist;
const whitelist = flowState.whitelist || [];
const originStr = String(state.origin || '').trim();// 检查是否包含任何黑名单中的词语

// 检查是否包含任何白名单中的完整词语
const containsWhitelistWord = whitelist.some(word => originStr.includes(word));

// 如果包含白名单词语，则忽略黑名单检查，直接认为不是敏感内容
const sensitiveResult = !containsWhitelistWord && blacklist.some(word => originStr.includes(word));

return sensitiveResult