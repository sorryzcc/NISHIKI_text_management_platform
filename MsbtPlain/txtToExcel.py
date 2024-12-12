import pandas as pd

# 假设所有txt文件都在同一目录下，并且以.txt结尾
txt_files = ['MsbtPlain_chs.txt', 'MsbtPlain_cht.txt']  # 真实路径替换这些占位符
excel_writer = pd.ExcelWriter('output.xlsx', engine='openpyxl')

for file in txt_files:
    # 创建一个空的字典来存储键值对
    data_dict = {}
    
    # 尝试使用'utf-8'编码打开文件，如果有问题则尝试其他编码
    try:
        with open(file, 'r', encoding='utf-8') as f:
            for line in f:
                # 忽略空白行和注释行（如果有的话）
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                # 使用split方法分割每行的键和值
                if '=' in line:
                    key, value = line.split('=', 1)  # 只分割第一次出现的等号
                    data_dict[key.strip()] = value.strip()
    except UnicodeDecodeError:
        print(f"Failed to read {file} with utf-8. Trying another encoding...")
        with open(file, 'r', encoding='gbk') as f:  # 或者根据实际情况选择其他编码
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                if '=' in line:
                    key, value = line.split('=', 1)
                    data_dict[key.strip()] = value.strip()

    # 将字典转换为DataFrame
    df = pd.DataFrame(list(data_dict.items()), columns=['Key', 'Value'])
    
    # 使用文件名作为sheet名称
    sheet_name = file.replace('.txt', '')[:31]  # Excel表单名称最长31个字符
    
    # 写入Excel文件
    df.to_excel(excel_writer, sheet_name=sheet_name, index=False)

# 关闭Excel写入器，确保所有数据都被保存
excel_writer.close()