async (postData) => {
  // 确保 postData.Sheet1 存在并且是一个数组
  if (!Array.isArray(postData.Sheet1)) {
    console.error("Expected postData.Sheet1 to be an array, but got:", typeof postData.Sheet1);
    throw new Error("Invalid input data type for Sheet1");
  }

  // 假设表头是第二行的数据
  const headers = postData.Sheet1[1]; // 获取第二行作为表头

  // 将二维数组转换为对象列表，从第三行开始（即索引2开始），同时过滤掉空行
  const records = postData.Sheet1.slice(2).map(row => {
    let record = {};
    row.forEach((value, index) => {
      // 使用第二行的值（headers[index]）作为键
      record[headers[index]] = value !== undefined ? value : null; // 如果Excel单元格为空，则设置为null或其他默认值
    });
    return record;
  }).filter(record => Object.values(record).some(value => value !== null && value !== '')); // 过滤掉所有值都为空的记录

  // 定义需要选取的所有字段，确保它们对应于数据库表中的字段
  const fieldsToInclude = [
    'ID', '文本变动信息', 'SubKey', '文本负责人', '客户端读取的key',
    '原文', 'MsKey', 'MsSource', '文本状态', 'MsStatus', '版本信息',
    '文本所属区域', '文本所属平台', '文本场景信息', 'Style', 'Note', 'KeyAttributes', 'Branch'
  ];

  const createPromises = records.map(async (item) => {
    // 使用$utils.pick选择特定字段，确保只包含指定的字段，并映射中文字段名到英文字段名
    const filteredData = $utils.pick(item, fieldsToInclude);

    // 示例：手动映射中文字段名到英文字段名
    const mappedData = {
      ID: filteredData['ID'],
      TextChangeTag: filteredData['文本变动信息'],
      SubKey: filteredData['SubKey'],
      PO: filteredData['文本负责人'],
      InGameKey: filteredData['客户端读取的key'],
      Origin: filteredData['原文'],
      MsKey: filteredData['MsKey'],
      MsSource: filteredData['MsSource'],
      Used: filteredData['文本状态'],
      MsStatus: filteredData['MsStatus'],
      Version: filteredData['版本信息'],
      Region: filteredData['文本所属区域'],
      Platform: filteredData['文本所属平台'],
      Context: filteredData['文本场景信息'],
      Style: filteredData['Style'],
      Note: filteredData['Note'],
      KeyAttributes: filteredData['KeyAttributes'],
      Branch: filteredData['Branch']
    };

    // 调用create接口
    const { body } = await source.$requests.create({
      body: mappedData,
    });

    // 处理接口的返回结果...
    if (body.code === 0 && typeof body.data === 'object') {
      const index = source.listData.findIndex(existingItem => existingItem.ID === item.ID);

      if (index !== -1) {
        source.listData.splice(index, 1, body.data);
      } else {
        source.listData.push(body.data);
      }

      $tips.success({
        content: `创建成功`,
      });
    } else {
      $tips.error({
        content: body.message || `创建失败，请检查输入的数据: ID=${item.ID}`,
      });
    }

    return body;
  });

  const results = await Promise.all(createPromises);

  return results;
}