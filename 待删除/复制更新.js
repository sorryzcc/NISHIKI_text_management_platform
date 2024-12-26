async () => {
  // ... 其他代码 ...  


  inGameKeyStr = source.formData.InGameKey + '_' + source.formData.ID + '_001';


  const { body } = await source.$requests.update({
    query: {
      id: source.formData['_id'],
    },
    body: {
      ...source.formData, // 假设你需要提交整个formData，但修改InGameKey  
      InGameKey: inGameKeyStr // 使用新的InGameKey字符串  
    }
  });

  // ... 处理接口返回结果 ...  
}