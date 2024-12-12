const keys= ['ID','TextChangeTag '];

const valuesSql = body.map(item => {
  
  //  _escape 防sql注入
  const itemValues = keys.map(key => _escape(item[key])).join(',')
  return `(${itemValues})`
  
}).join(',')

return valuesSql;
