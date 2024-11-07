const fs = require('fs');

const pdf = require('pdf-parse');
const PDFParser = require('pdf2json');
const moment = require('moment');

// async function readPDF(filePath) {
//   try {
//     if (filePath) {
//       const pdfParser = new PDFParser();

//       if (pdfParser) {
//         pdfParser.on('pdfParser_dataError', (err) =>
//           console.error(err.parserError)
//         );
//         pdfParser.on('pdfParser_dataReady', (pdfData) => {
//           fs.writeFileSync('pdfData.json', JSON.stringify(pdfData));
//         });

//         // Load and parse the PDF file
//         pdfParser.loadPDF(filePath);
//       }
//     }
//   } catch (error) {
//     console.error('There was an error occured', error);
//   }
// }

// readPDF("./BE/file/Soal 2.pdf");

async function readDataFromJSON(json) {
  const preparedJSON = [];
  if (json && Object.keys(json)) {
    const dataFromJson = fs.readFileSync(json, 'utf8');
    if (dataFromJson) {
      const parseJSON = JSON.parse(dataFromJson);

      if (parseJSON && parseJSON.length) {
        const npwpDipotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 19,
          endIndex: 35,
          code: 'A1',
        });
        const nomorPemotonganPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 146,
          endIndex: 156,
          code: 'H1',
        });

        const nikWajibPajakDipotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 36,
          code: 'A2',
        });

        const namaWajibPajakDipotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 38,
          code: 'A3',
        });

        const noFakturPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 73,
          code: 'B8',
        });

        const tanggalFakturPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 74,
          endIndex: 82,
          isDate: true,
          code: 'B8',
        });

        const namaPenandaTangan = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 135,
          code: 'C4',
        });

        const namaWajibPajakPemotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 117,
          code: 'C2',
        });

        const tanggalPemotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 124,
          endIndex: 132,
          isDate: true,
          code: 'C3',
        });

        const masaPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 159,
          code: 'B1',
        });

        const kodeObjekPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 160,
          code: 'B2',
        });
        const dasarPengenaanPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 161,
          code: 'B3',
        });
        const tarifPersentase = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 162,
          code: 'B5',
        });

        const pphDipungut = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 163,
          code: 'B6',
        });

        const npwpPemungut = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 99,
          endIndex: 114,
          code: 'C1',
        });
        // =================================================================

        // section H
        preparedJSON.push(nomorPemotonganPajak);

        // section A
        preparedJSON.push(npwpDipotong);
        preparedJSON.push(nikWajibPajakDipotong);
        preparedJSON.push(namaWajibPajakDipotong);

        // section B
        preparedJSON.push(masaPajak);

        preparedJSON.push(kodeObjekPajak);
        preparedJSON.push(dasarPengenaanPajak);
        preparedJSON.push(tarifPersentase);
        preparedJSON.push(pphDipungut);

        preparedJSON.push({
          code: 'B8',
          value: `${noFakturPajak.value} ${tanggalFakturPajak.value}`,
        });

        // section C
        preparedJSON.push(npwpPemungut);

        preparedJSON.push(namaWajibPajakPemotong);
        preparedJSON.push(tanggalPemotong);
        preparedJSON.push(namaPenandaTangan);
      }
    }
  }

  console.log(preparedJSON);
  return preparedJSON;
}

readDataFromJSON('hasil.json');

async function processPopulateData({
  arrayData,
  startIndex,
  endIndex,
  isDate = false,
  code,
}) {
  let populatedData = {};
  if (arrayData && arrayData.length) {
    if (code === 'A11') {
      // save first
    } else if (!isDate && startIndex >= 0 && !endIndex) {
      populatedData = {
        code: code,
        value:
          arrayData[startIndex] &&
          arrayData[startIndex].value &&
          arrayData[startIndex].value !== ':'
            ? arrayData[startIndex].value
            : '',
      };
    } else if (startIndex && endIndex) {
      const arraySliced = arrayData.slice(startIndex, endIndex);
      const arrayJoined =
        arraySliced && arraySliced.length
          ? arraySliced.map((array) => array.value).join('')
          : '';

      if (isDate) {
        const arrayFormattedDate =
          arrayJoined && arrayJoined.length
            ? moment(arrayJoined, 'DDMMYYYY').format('DD/MM/YYYY')
            : '';

        populatedData = {
          code: code,
          value: arrayFormattedDate,
        };
      } else {
        populatedData = {
          code: code,
          value: arrayJoined,
        };
      }
    }
  }

  return populatedData;
}
