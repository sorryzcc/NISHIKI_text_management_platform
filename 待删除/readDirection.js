const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 文件夹路径和输出文件路径
const folderPath = path.join(__dirname, 'MsbtPlain'); // 存放txt文件的文件夹路径
const outputFilePath = path.join(__dirname, 'output.xlsx'); // 输出Excel文件路径

// 创建一个空的工作簿
const workbook = XLSX.utils.book_new();

// 正则表达式用于匹配键值对，确保键以字母或下划线开头，并且只包含字母、数字和下划线
const keyValuePairRegex = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)/m;

// 最大允许的字符数
const MAX_CHARACTERS = 32767;

function parseKeyValuePairs(content) {
    let lines = content.split('\n');
    let currentKey = null;
    let currentValue = '';
    let keyValuePairs = [];

    for (let line of lines) {
        line = line.trim();

        if (!line || line.startsWith('#')) continue; // 忽略空行和注释行

        // 检查是否为新键值对的开始
        const match = keyValuePairRegex.exec(line);
        if (match) {
            if (currentKey !== null) {
                // 处理并保存当前键值对
                finalizeKeyValuePair(keyValuePairs, currentKey, currentValue);
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
        finalizeKeyValuePair(keyValuePairs, currentKey, currentValue);
    }

    return keyValuePairs;
}

function finalizeKeyValuePair(keyValuePairs, key, value) {
    // 检查并截断过长的值
    if (value.length > MAX_CHARACTERS) {
        console.warn(`Value for key ${key} is too long and will be truncated.`);
        value = value.slice(0, MAX_CHARACTERS);
    }

    keyValuePairs.push([key.trim(), value.trim()]);
    console.log(`Added key-value pair: ${key} -> ${value}`); // 调试信息
}

function processFile(filePath, fileName) {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        const keyValuePairs = parseKeyValuePairs(content);

        // 创建工作表数据
        const worksheetData = [['Key', 'Value']].concat(keyValuePairs);

        // 创建工作表
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // 将工作表添加到工作簿
        const sheetName = path.basename(fileName, '.txt'); // 使用文件名作为Sheet名称
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        console.log(`Processed file: ${fileName}. Added to sheet: ${sheetName}`);
    } catch (err) {
        console.error(`Error processing file ${fileName}:`, err);
    }
}

// 遍历文件夹中的所有.txt文件
try {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.txt') {
            const filePath = path.join(folderPath, file);
            processFile(filePath, file);
        }
    });

    // 写入文件
    try {
        XLSX.writeFile(workbook, outputFilePath);
        console.log(`Finished processing all files and saved to ${outputFilePath}.`);
    } catch (err) {
        console.error('Error writing Excel file:', err);
    }
} catch (err) {
    console.error('Error reading directory:', err);
}