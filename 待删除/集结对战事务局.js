const context = "Backlog99\nHow: how11\nWhere: 主界面_商城_集结对战事务局_道具_道具名称\nWhat: 活动名";

// 使用正则表达式来匹配 Where: 之后，第二个 _ 之后直到 What: 之前的文本
const match = context.match(/Where:\s*[^_]+_[^_]+_([^_]+)(?:_[^_]*)*\s*What:/);

// 如果找到了匹配项，则获取这些文本
const where2 = match ? match[1] : "";

console.log(where2);  // 输出：集结对战事务局