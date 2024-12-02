const str = "\nBacklog777\nHow: 主页面)_点击_线上赛入口，进入赛事列表分页\nWhere: 活动中心右上角_集结队长_亿奥斯商店_道具_道具名称\nWhat: 活动名\n,";

// 使用正则表达式来匹配 Where: 之后，第四个 _ 之后直到 What: 之前的文本
const match = str.match(/Where:.*?_.*?_.*?_.*?_(.*?)\s*What:/);

// 如果找到了匹配项，则获取这些文本
const textAfterFourthUnderscore = match ? match[1] : "";

console.log(textAfterFourthUnderscore);  // 输出：道具名称