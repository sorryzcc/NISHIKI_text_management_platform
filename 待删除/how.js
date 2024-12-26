const data = {
  ClientText: {
    formData: {
      InGameKey: "key1_key2_key3",
      Context: "Backlog99\nHow:c88ab \nWhere: 主界面_商城_集结对战事务局_道具_道具名称\nWhat: 活动名"
    }
  }
};


const context = data.ClientText.formData.Context;


const howMatch = context.match(/How:\s*(.*?)\s*Where:/);
const how = howMatch ? howMatch[1].trim() : '';



console.log(how);