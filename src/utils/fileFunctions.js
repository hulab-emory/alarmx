// import SparkMD5 from "spark-md5";

// export function fileHash(chunks) {
//   return new Promise((resolve) => {
//     const spark = new SparkMD5();
//     function _read(i) {
//       if (i >= chunks.length) {
//         resolve(spark.end());
//         return;
//       }
//       const blob = chunks[i];
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const bytes = e.target.result;
//         spark.append(bytes);
//         _read(i + 1);
//       };
//       reader.readAsArrayBuffer(blob);
//     }

//     _read(0);
//   });
// }


exports.createChunks = (file, chunkSize) => {
  const res = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    res.push(file.slice(i, i + chunkSize));
  }

  return res;
}

exports.readFile = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => {
      res(reader.result)
    }
    reader.onerror = rej
    reader.readAsText(file)
  })
}

exports.readPDF = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result)
    reader.onerror = rej
    reader.readAsArrayBuffer(file)
  })
}

