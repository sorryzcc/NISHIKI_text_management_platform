/**
* @param {context} context
* @param {wApi} wApi
*/
async (context, wApi) => {

    const objApi = context.app.object({
      appId: 'localizationPlatform',
      schemaId: 'ClientText'
    })
  
    const result = [];
  
    const request = async (product) => {
      let res
      try {
        res = await objApi.create(product);
        if (res.code !== 200) {
          throw new Error('create fail' + res.error)
        }
        res.data.InGameKey = product.InGameKey + res.data.ID + "_" + '001'
        res = await objApi.update(res.data.ID, res.data);
  
      } catch (e) {
        // 网络或程序中断报错
        result.push({ status: 'error', message: e.message, data: product })
      }
      if (res.code === 200) {
        // 更新成功
        result.push({ status: 'success' })
      } else {
        // 更新失败 记录错误码和错误消息
        result.push({ status: 'failed', code: res.code, message: res.error, res })
      }
    }
  
    // body 是前端post过来的数据，格式为Array<object>
    const { body } = context;
  
    // 按顺序调用request
    for (let i = 0; i < body.length; i++) {
      await request(body[i]);
    }
  
    return result;
  }