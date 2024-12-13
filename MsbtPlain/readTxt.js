const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 文件路径
const filePath = path.join(__dirname, 'MsbtPlain_chs.txt');
const outputFilePath = path.join(__dirname, 'output.xlsx');

// 创建一个空的工作簿和工作表
const workbook = XLSX.utils.book_new();
const worksheetData = [['Key', 'Value']]; // 表头

// 用于存储所有键值对的数组
let keyValuePairs = [];

// 使用可读流读取文件
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

// 临时变量，用于处理跨块的行分割问题
let remaining = '';

readStream.on('data', chunk => {
    // 将剩余部分与当前块合并，并按行分割
    let lines = (remaining + chunk).split('\n');
    remaining = lines.pop(); // 最后一行可能是不完整的，保存下来用于下一次处理

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue; // 忽略空行和注释行
        
        const parts = line.split('=', 2); // 只分割第一次出现的等号
        if (parts.length === 2) {
            const [key, value] = parts.map(part => part.trim());
            keyValuePairs.push([key, value]);
            console.log(`Added key-value pair: ${key} -> ${value}`); // 调试信息
        } else {
            console.warn(`Line does not contain '=' or has more than one '=': ${line}`);
        }
    }
});

readStream.on('end', () => {
    // 处理最后剩余的部分
    if (remaining) {
        remaining = remaining.trim();
        if (remaining && !remaining.startsWith('#')) {
            const parts = remaining.split('=', 2);
            if (parts.length === 2) {
                const [key, value] = parts.map(part => part.trim());
                keyValuePairs.push([key, value]);
                console.log(`Added final key-value pair: ${key} -> ${value}`); // 调试信息
            } else {
                console.warn(`Remaining line does not contain '=' or has more than one '=': ${remaining}`);
            }
        }
    }

    // 将所有键值对添加到工作表数据中
    worksheetData.push(...keyValuePairs);

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 写入文件
    XLSX.writeFile(workbook, outputFilePath);
    
    console.log(`Finished reading the file and saved to ${outputFilePath}. Total rows: ${keyValuePairs.length + 1}`); // 加1是因为表头
});

readStream.on('error', err => {
    console.error('Error reading file:', err);
});