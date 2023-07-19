async function convertDocToBuffer(bufferData, name) {
    return new Promise((resolve, reject) => {
      const document = {
        name: name,
        buffer: bufferData
      };
      resolve(document);
    });
  }
module.exports={convertDocToBuffer}