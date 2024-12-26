const data = {
    ClientText: {
      formData: {
        InGameKey: "key1_key2_key3",
        Context: "Backlog99\nHow: how11\nWhere: 主界面_商城_集结对战事务局_道具_道具名称\nWhat: 活动名"
      }
    }
  };
  
  const InGameKey = data.ClientText.formData.InGameKey;
  const context = data.ClientText.formData.Context;
  
  // 提取 InGameKey 的各个部分
  state.key1 = InGameKey.split('_')[0] || '';
  state.key2 = InGameKey.split('_')[1] || '';
  state.key3 = InGameKey.split('_')[2] || '';
  
  // 提取 Where: 之后，What: 之前的文本
  const whereMatch = context.match(/Where:\s*(.*?)\s*What:/);
  const whereParts = whereMatch ? whereMatch[1].split('_') : [];
  
  // 提取 Where: 之后的部分
  state.where1 = whereParts[0] || '';
  state.where2 = whereParts[1] || '';
  state.where3 = whereParts[2] || '';
  state.where4 = whereParts[3] || '';
  state.where5 = whereParts[4] || '';
  
  // 提取 What: 之后的部分
  const whatMatch = context.match(/What:\s*(.*)/);
  state.what = whatMatch ? whatMatch[1] : '';
  
  // 提取 How: 之后的部分
  const howMatch = context.match(/How:\s*(.*)/);
  state.how = howMatch ? howMatch[1] : '';
  
  // 提取场景信息
  const textSceneInformation1Match = context.match(/^\s*(Backlog|Mcat|JIRA)/);
  state.textSceneInformation1 = textSceneInformation1Match ? textSceneInformation1Match[1] : '';
  
  const textSceneInformation2Match = context.match(/(Backlog|Mcat|JIRA)(\d+)(?=\s*How:)/);
  state.textSceneInformation2 = textSceneInformation2Match ? textSceneInformation2Match[2] : '';
  
  console.log(state);