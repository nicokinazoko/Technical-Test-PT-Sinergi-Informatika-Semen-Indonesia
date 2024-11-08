const fs = await import('fs');

import PDFParser from 'pdf2json';

import moment from 'moment';
import puppeteer from 'puppeteer';
import path from 'path';
import { parse } from 'path';

async function ReadPDFLocal(filePath) {
  try {
    const fileName = 'pdfData.json';
    if (filePath) {
      const pdfParser = new PDFParser();

      // Create a Promise to handle asynchronous PDF parsing and file writing
      return new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataError', (err) => {
          console.error('Error parsing PDF:', err.parserError);
          reject(err);
        });

        pdfParser.on('pdfParser_dataReady', (pdfData) => {
          try {
            // Writing the parsed data to a JSON file
            fs.writeFileSync(fileName, JSON.stringify(pdfData));
            console.log('File written successfully');
            resolve(fileName); // Resolve the promise with the file name
          } catch (err) {
            console.error('Error writing file:', err);
            reject(err);
          }
        });

        // Load and parse the PDF file
        pdfParser.loadPDF(filePath);
      });
    }

    return fileName;
  } catch (error) {
    console.error('There was an error occured', error);
  }
}

async function ConvertJSONFromPDF(json) {
  const convertedJSON = [];
  if (json && Object.keys(json)) {
    const dataFromJson = fs.readFileSync(json, 'utf8');
    if (dataFromJson) {
      const parseJSON = JSON.parse(dataFromJson);

      if (
        parseJSON &&
        parseJSON.Pages &&
        parseJSON.Pages.length &&
        parseJSON.Pages[0].Texts &&
        parseJSON.Pages[0].Texts.length
      ) {
        parseJSON.Pages[0].Texts.forEach((element, index) => {
          element.R[0].T;
          convertedJSON.push({
            value:
              element && element.R && element.R.length && element.R[0].T
                ? decodeURIComponent(element.R[0].T)
                : '',
            index,
          });
        });
      }
    }
  }

  return convertedJSON;
}

async function ReadDataFromJSON(convertedJSON) {
  const preparedJSON = [];
  if (convertedJSON && convertedJSON.length) {
    /* Section populate data to new JSON */

    // section H
    const nomorPemotonganPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 146,
      endIndex: 156,
      code: 'H1',
    });

    const statusPembetulan = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 156,
      code: 'H2',
    });

    const nomorPembetulan = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 158,
      code: 'H2',
    });

    const statusPembatalan = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'H3',
    });

    const statusPphFinal = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'H4',
    });

    const statusPPHTidaKfinal = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 157,
      code: 'H5',
    });

    // section A
    const npwpDipotong = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 19,
      endIndex: 35,
      code: 'A1',
    });

    const nikWajibPajakDipotong = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'A2',
    });

    const namaWajibPajakDipotong = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 38,
      code: 'A3',
    });

    // section B
    const masaPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 159,
      code: 'B1',
    });

    const kodeObjekPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 160,
      code: 'B2',
    });
    const dasarPengenaanPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 161,
      code: 'B3',
    });
    const statusDikenakanTarifLebihTinggi = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B4',
    });

    const tarifPersentase = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 162,
      code: 'B5',
    });

    const pphDipungut = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 163,
      code: 'B6',
    });

    const dokumenReferensi = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B7',
    });

    const noFakturPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 73,
      code: 'B8',
    });

    const tanggalFakturPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 74,
      endIndex: 82,
      isDate: true,
      code: 'B8',
    });

    const nomorSKB = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B9',
    });

    const nomorPphDTP = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B10',
    });

    const nomorPphTransaksi = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B11',
    });
    const nomorPphDipotongFasilitas = await ProcessPopulateData({
      arrayData: convertedJSON,
      code: 'B12',
    });

    // section C
    const npwpPemungut = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 99,
      endIndex: 114,
      code: 'C1',
    });

    const namaWajibPajakPemotong = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 117,
      code: 'C2',
    });

    const tanggalPemotong = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 124,
      endIndex: 132,
      isDate: true,
      code: 'C3',
    });

    const namaPenandaTangan = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 135,
      code: 'C4',
    });

    const jenisPernyataanWajibPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 165,
      code: 'C5',
    });

    const statusPernyataanWajibPajak = await ProcessPopulateData({
      arrayData: convertedJSON,
      startIndex: 166,
      code: 'C5',
    });

    /* End section populate data to new JSON */

    /* Start section push data to new JSON */

    // section H
    preparedJSON.push(nomorPemotonganPajak);
    preparedJSON.push({
      code: 'H2',
      value: `${statusPembetulan.value} Pembetulan ke-${nomorPembetulan.value}`,
    });

    preparedJSON.push(statusPembatalan);
    preparedJSON.push(statusPphFinal);
    preparedJSON.push(statusPPHTidaKfinal);

    // section A
    preparedJSON.push(npwpDipotong);
    preparedJSON.push(nikWajibPajakDipotong);
    preparedJSON.push(namaWajibPajakDipotong);

    // section B
    preparedJSON.push(masaPajak);
    preparedJSON.push(kodeObjekPajak);
    preparedJSON.push(dasarPengenaanPajak);
    preparedJSON.push(statusDikenakanTarifLebihTinggi);
    preparedJSON.push(tarifPersentase);

    preparedJSON.push(pphDipungut);
    preparedJSON.push(dokumenReferensi);

    preparedJSON.push({
      code: 'B8',
      value: `${noFakturPajak.value} ${tanggalFakturPajak.value}`,
    });

    preparedJSON.push(nomorSKB);
    preparedJSON.push(nomorPphDTP);
    preparedJSON.push(nomorPphTransaksi);
    preparedJSON.push(nomorPphDipotongFasilitas);

    // section C
    preparedJSON.push(npwpPemungut);

    preparedJSON.push(namaWajibPajakPemotong);
    preparedJSON.push(tanggalPemotong);
    preparedJSON.push(namaPenandaTangan);
    preparedJSON.push({
      code: 'C5',
      value: `${statusPernyataanWajibPajak.value} - ${jenisPernyataanWajibPajak.value} `,
    });

    /* End section push data to new JSON */
  }

  console.log(preparedJSON);

  return preparedJSON;
}

async function ProcessPopulateData({
  arrayData,
  startIndex,
  endIndex,
  isDate = false,
  code,
}) {
  let populatedData = {
    code,
    value: '',
  };
  if (arrayData && arrayData.length) {
    if (code === 'A11') {
      // save first
    } else if (!isDate && startIndex >= 0 && !endIndex) {
      populatedData.value = populatedData.value =
        arrayData[startIndex] && arrayData[startIndex].value
          ? arrayData[startIndex].value
          : '';
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

        populatedData.value = arrayFormattedDate;
      } else {
        populatedData.value = arrayJoined;
      }
    }
  }

  return populatedData;
}

async function GeneratePDFHTML(json) {
  let htmlContent = `<html><body><table>`;

  if (json && json.length) {
    for (const [index, datafromJSON] of json.entries()) {
      let counterData;
      if (datafromJSON.code.includes('H')) {
        htmlContent += `
        <tr>
        <td>
        ${datafromJSON.code} : </td>
        <td>${datafromJSON.value}
        </td>
        </tr>`;
      } else {
        if (index % 2 !== 0) {
          htmlContent += `
          <tr>
            <td> ${datafromJSON.code} : </td>
            <td>${datafromJSON.value} </td>`;
        } else {
          htmlContent += `
            <td>${datafromJSON.code} : </td>
            <td>${datafromJSON.value} </td>
          </tr>`;
        }
      }
    }

    htmlContent += `</table></body></html>`;

    return htmlContent;
  }

  htmlContent += `</table></body></html>`;

  return htmlContent;
}

// Function to generate PDF
async function GeneratePDF(json) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = await GeneratePDFHTML(json); // Generate HTML content
  await page.setContent(html); // Set content on the page
  await page.pdf({ path: 'output.pdf', format: 'A4' }); // Generate PDF

  await browser.close();
}

const fileNameJSON = await ReadPDFLocal('./BE/file/Soal 2.pdf');
const convertedJSON = await ConvertJSONFromPDF(fileNameJSON);
const preparedJSON = await ReadDataFromJSON(convertedJSON);
const pdfGenerated = await GeneratePDF(preparedJSON);
