const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

const getFilePath = (fileName) => path.join(DATA_DIR, `${fileName}.json`);

exports.readJson = async (fileName) => {
  const data = await fs.readFile(getFilePath(fileName), 'utf8');
  return JSON.parse(data);
};

exports.writeJson = async (fileName, content) => {
  await fs.writeFile(getFilePath(fileName), JSON.stringify(content, null, 2));
};