import pandas as pd
from googletrans import Translator

# 初始化翻译器
translator = Translator()

# 确认文件路径准确无误，若与脚本在同一目录下，可直接使用文件名
input_file_path = r'C:\Users\v_jinlqi\Desktop\PreData\文本申请表.xlsx'  # 使用绝对路径或相对路径
output_file_path = 'translated_excel_file.xlsx'  # 输出的Excel文件路径

try:
    # 加载Excel文件
    df = pd.read_excel(input_file_path)
except FileNotFoundError:
    print(f"无法找到文件: {input_file_path}. 请检查文件路径是否正确。")
    exit(1)

# 检查'Context(文本场景信息)'列是否存在
if 'Context(文本场景信息)' in df.columns:
    # 翻译'Context(文本场景信息)'列下的每个单元格
    df['Context(文本场景信息)'] = df['Context(文本场景信息)'].apply(lambda x: translator.translate(str(x), dest='ja').text)
else:
    print("指定的'Context(文本场景信息)'列不存在于Excel文件中。")
    exit(1)

# 将翻译后的数据写入新的Excel文件
df.to_excel(output_file_path, index=False)

print(f"翻译完成，已保存到 {output_file_path}")