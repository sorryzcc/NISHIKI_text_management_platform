async () => {
    let createData = source.formData;
    if (state.key5) {
      createData.InGameKey = state.key1 + '_' + state.key2 + '_' + state.key3 + '_' + state.key4 + '_' + state.key5
    } else if (state.key4) {
      createData.InGameKey = state.key1 + '_' + state.key2 + '_' + state.key3 + '_' + state.key4
    } else {
      createData.InGameKey = state.key1 + '_' + state.key2 + '_' + state.key3
    }
  
    const Where = `${[state.where1, state.where2, state.where3, state.where4, state.where5].filter(Boolean).join('_')}`;
    createData.Context = `\n${state.textSceneInformation1}${state.textSceneInformation2}\nHow: ${state.how}\nWhere: ${Where}\nWhat: ${state.what}\n`;
  
    // 调用create接口
    const { body } = await source.$requests.create({
      body: { ...createData, ChangeInfo: '新增' },
      // 只提交某些字段
      // body: $utils.pick(source.formData,['key1','key2']),
      // 某些字段不提交
      // body: $utils.omit(source.formData,['key1','key2']),
    });
  
  
    // 处理接口的返回结果
    if (body.code === 0) {
      // 如果接口有返回数据就进行回写
      if (typeof body.data === 'object') {
        source.formData = body.data;
      }
      $tips.success({
        content: '创建成功'
      })
    } else {
      $tips.error({
        content: body.message
      })
    }
    return body;
  
  }