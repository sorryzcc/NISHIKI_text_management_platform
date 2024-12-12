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
    
    // 封装一个批量请求的方法
    const batchUpdate = async (batchData) => {
      const promises = batchData.map(async (product) => {
        let res
        try {
          res = await objApi.create(product);
          if (res.code !== 200) { 
            throw new Error('create fail'+res.error)
          }
          res.data.InGameKey = product.InGameKey + res.data.ID + "_" + '001'
          res = await objApi.update(res.data.ID, res.data);
  
        } catch (e) {
          // 网络或程序中断报错
          result.push({ status: 'error', message: e.message, data: product})
        }
        if (res.code === 200) {
          // 更新成功
          result.push({ status: 'success' })
        } else {
          // 更新失败 记录错误码和错误消息
          result.push({ status: 'failed', code: res.code, message: res.error, res })
        }
      })
      // 等待所有请求完成
      await Promise.all(promises)
    }
  
    // body 是前端post过来的数据，格式为Array<object>
    const { body } = context;
  
    // 每次更新的并发数目
    const batchSize = 40;
    // 获取更新的总次数
    const totalBatches = Math.ceil(body.length / batchSize);
  
    for (let i = 0; i < totalBatches; i++) {
      // 取出前面 batchSize个需要更新的数据
      const batchData = body.splice(0, batchSize);
      await batchUpdate(batchData);
    }
  
    return result;
  }