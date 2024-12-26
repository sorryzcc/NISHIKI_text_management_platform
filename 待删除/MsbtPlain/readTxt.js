const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 文件路径
const filePath = path.join(__dirname, 'MsbtPlain_cht.txt');
const outputFilePath = path.join(__dirname, 'MsbtPlain_cht.xlsx');

// 创建一个空的工作簿和工作表
const workbook = XLSX.utils.book_new();
const worksheetData = [['Key', 'Value']]; // 表头

// 用于存储所有键值对的数组
let keyValuePairs = [];

// 最大允许的字符数
const MAX_CHARACTERS = 32767;

// 正则表达式用于匹配键值对，确保键以字母或下划线开头，并且只包含字母、数字和下划线
const keyValuePairRegex = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)/m;

function parseKeyValuePairs(content) {
    let lines = content.split('\n');
    let currentKey = null;
    let currentValue = '';

    for (let line of lines) {
        line = line.trim();

        if (!line || line.startsWith('#')) continue; // 忽略空行和注释行

        // 检查是否为新键值对的开始
        const match = keyValuePairRegex.exec(line);
        if (match) {
            if (currentKey !== null) {
                // 处理并保存当前键值对
                finalizeKeyValuePair(currentKey, currentValue);
            }
            [_, currentKey, currentValue] = match;
        } else {
            // 如果当前行不是以等号开头，则认为是上一行值的延续
            if (currentKey !== null) {
                currentValue += '\n' + line;
            } else {
                console.warn(`Unexpected line format: ${line}`);
            }
        }
    }

    // 处理最后一个键值对
    if (currentKey !== null) {
        finalizeKeyValuePair(currentKey, currentValue);
    }
}

function finalizeKeyValuePair(key, value) {
    // 检查并截断过长的值
    if (value.length > MAX_CHARACTERS) {
        console.warn(`Value for key ${key} is too long and will be truncated.`);
        value = value.slice(0, MAX_CHARACTERS);
    }

    keyValuePairs.push([key.trim(), value.trim()]);
    console.log(`Added key-value pair: ${key} -> ${value}`); // 调试信息
}

// 一次性读取整个文件内容
try {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    parseKeyValuePairs(content);

    // 将所有键值对添加到工作表数据中
    worksheetData.push(...keyValuePairs);

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 写入文件
    try {
        XLSX.writeFile(workbook, outputFilePath);
        console.log(`Finished reading the file and saved to ${outputFilePath}. Total rows: ${keyValuePairs.length + 1}`); // 加1是因为表头
    } catch (err) {
        console.error('Error writing Excel file:', err);
    }
} catch (err) {
    console.error('Error reading file:', err);
}