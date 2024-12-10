{
    // 将需要批量的请求参数填入params中
    // url参数
    query:{
        params: flowState.createRes.body.map(item => item.data.ID).map(id => ({ id: id }))
    },
    // post包体
    body:{
      params:flowState.createRes.body.map(item => {
        const { data } = item;
        const inGameKey = data.InGameKey;
        const id = data.ID;
    
        // 拼接字符串
        const combinedString = `${inGameKey}${id}_001`;
    
        // 返回新对象
        return { InGameKey: combinedString }
    })
    }
  }