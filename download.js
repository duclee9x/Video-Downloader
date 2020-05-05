const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jsonPath = __dirname + '/tmp/';

const download = async (file) => {
  if (path.extname(file) == '.json') {
    let rawdata = fs.readFileSync(jsonPath + file);
    let data = JSON.parse(rawdata);
    const url = data.sources.filter((el) => el.container == 'MP4')[0].src;
    const fileName = path.basename(file).replace('.json', '.mp4');
    const outputVideoPath = jsonPath + fileName;
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    await response.data.pipe(fs.createWriteStream(outputVideoPath));
  }
};
const asyncLog = async (item) => {
  await download(item);
};
const downloadVideo = async (array) => {
  for (let i = 0; i < array.length; i += 1) {
    await asyncLog(array[i]);
    console.log('Done Video' + i);
  }
};
fs.readdir(jsonPath, (err, files) => {
  downloadVideo(files);
});
