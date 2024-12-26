const context = "Backlog99\nHow: how11\nWhere: 主界面_商城_集结对战事务局_道具_道具名称\nWhat: 活动名";

// 提取“道具名称”
const match4 = context.match(/Where:\s*[^_]+_[^_]+_[^_]+_[^_]+_([^_]+)\s*What:/);
const where4 = match4 ? match4[1] : "";
console.log(where4);  // 输出：道具名称