import pandas as pd

def read_all_lines(file_path, encoding='utf-8'):
    """读取文件中的所有行，并返回一个列表"""
    lines = []
    with open(file_path, 'r', encoding=encoding, errors='replace') as file:
        for line in file:
            lines.append(line.strip())
    return lines

def parse_key_value_pairs(lines):
    """解析键值对，并返回一个包含键值对的列表"""
    data = []
    for line in lines:
        if not line or line.startswith('#'):  # 忽略空行和注释行
            continue
        
        parts = line.split('=', 1)  # 只分割第一次出现的等号
        if len(parts) == 2:
            key, value = parts
            data.append([key.strip(), value.strip()])
        else:
            print(f"Warning: Line does not contain '=': {line}")
    
    return data

# 文件路径
file_path = 'MsbtPlain_chs.txt'

# 尝试使用'utf-8'编码打开文件，如果有问题则尝试其他编码
try:
    lines = read_all_lines(file_path, encoding='utf-8')
except UnicodeDecodeError:
    print("Failed to read with utf-8. Trying gbk...")
    lines = read_all_lines(file_path, encoding='gbk')

# 解析键值对
data = parse_key_value_pairs(lines)

# 创建DataFrame
df = pd.DataFrame(data, columns=['Key', 'Value'])

# 写入Excel文件
output_excel = 'output.xlsx'
with pd.ExcelWriter(output_excel, engine='openpyxl') as writer:
    df.to_excel(writer, sheet_name='Sheet1', index=False)

print(f"All data has been written to {output_excel}. Total rows: {len(data)}")

# 验证总行数是否正确
if len(data) != 26990:
    print(f"Warning: Expected 26990 rows, but got {len(data)} rows.")