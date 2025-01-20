const blacklist = ['参赛证'];
const whitelist = ['集结参赛证'];
const originStr = '这是可变更宝可梦集结参赛证卡面的道具。购买后可以在宝可梦一览界面中变更想要显示的卡面。';

// 检查是否包含任何白名单中的完整词语
const containsWhitelistWord = whitelist.some(word => originStr.includes(word));

// 如果包含白名单词语，则忽略黑名单检查，直接认为不是敏感内容
const result = !containsWhitelistWord && blacklist.some(word => originStr.includes(word));

console.log(result); // 应该输出: false