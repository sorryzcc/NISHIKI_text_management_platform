async () => {

    let createData = source.formData;
    createData.SubKey = source.formData.InGameKey
    createData.InGameKey = state.key1 + '_' + state.key2 + '_' + state.key3 + '_' + state.key4 + '_' + state.key5;
  
  
    const Where = `${[state.where1, state.where2, state.where3, state.where4, state.where5].filter(Boolean).join('_')}`;
    createData.Context = `\n${state.textSceneInformation1}${state.textSceneInformation2}\nHow: ${state.how}\nWhere: ${Where}\nWhat: ${state.what}\n`;
  
    // 调用update接口
    const { body } = await source.$requests.update({
      query: {
        id: source.formData['_id'],
      },
      body: { ...createData, TextChangeTag: '变更' }
    });
  
  
    if (body.code === 0) {
      if (typeof body.data === 'object') {
        source.formData = body.data;
      }
      $tips.success({
        content: '变更成功'
      })
    } else {
      $tips.error({
        content: body.message
      })
    }
    return body;
  
  }