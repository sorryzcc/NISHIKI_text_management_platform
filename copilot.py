import pandas as pd

# 读取Excel文件
file_path = '01表导入模板.xlsx'  # 替换为你的Excel文件路径
df = pd.read_excel(file_path)

# 获取A列(ID列)并处理非数值情况
id_list = pd.to_numeric(df['ID'], errors='coerce').dropna().astype(int).tolist()

# 寻找不连续的ID
discontinuous_ids = [id_list[i] for i in range(1, len(id_list)) if id_list[i] != id_list[i-1] + 1]

# 输出不连续的ID
print("不连续的ID有：", discontinuous_ids)