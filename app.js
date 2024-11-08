const fs = await import('fs');

import PDFParser from 'pdf2json';

import moment from 'moment';
import puppeteer from 'puppeteer';

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
        /* Section populate data to new JSON */

        // section H
        const nomorPemotonganPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 146,
          endIndex: 156,
          code: 'H1',
        });

        const statusPembetulan = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 156,
          code: 'H2',
        });

        const nomorPembetulan = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 158,
          code: 'H2',
        });

        const statusPembatalan = await processPopulateData({
          arrayData: parseJSON,
          code: 'H3',
        });

        const statusPphFinal = await processPopulateData({
          arrayData: parseJSON,
          code: 'H4',
        });

        const statusPPHTidaKfinal = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 157,
          code: 'H5',
        });

        // section A
        const npwpDipotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 19,
          endIndex: 35,
          code: 'A1',
        });

        const nikWajibPajakDipotong = await processPopulateData({
          arrayData: parseJSON,
          code: 'A2',
        });

        const namaWajibPajakDipotong = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 38,
          code: 'A3',
        });

        // section B
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
        const statusDikenakanTarifLebihTinggi = await processPopulateData({
          arrayData: parseJSON,
          code: 'B4',
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

        const dokumenReferensi = await processPopulateData({
          arrayData: parseJSON,
          code: 'B7',
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

        const nomorSKB = await processPopulateData({
          arrayData: parseJSON,
          code: 'B9',
        });

        const nomorPphDTP = await processPopulateData({
          arrayData: parseJSON,
          code: 'B10',
        });

        const nomorPphTransaksi = await processPopulateData({
          arrayData: parseJSON,
          code: 'B11',
        });
        const nomorPphDipotongFasilitas = await processPopulateData({
          arrayData: parseJSON,
          code: 'B12',
        });

        // section C
        const npwpPemungut = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 99,
          endIndex: 114,
          code: 'C1',
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

        const namaPenandaTangan = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 135,
          code: 'C4',
        });

        const jenisPernyataanWajibPajak = await processPopulateData({
          arrayData: parseJSON,
          startIndex: 165,
          code: 'C5',
        });

        const statusPernyataanWajibPajak = await processPopulateData({
          arrayData: parseJSON,
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
    }
  }

  console.log(preparedJSON);

  await generatePDF(preparedJSON);

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
    const groupsBasedOnCode = json.reduce((acc, data) => {
      const group = data.code[0]; // Get first character ('H', 'A', 'B', 'C')
    
      // Check if the group exists, otherwise initialize an empty array
      if (!acc[group]) {
        acc[group] = [];
      }
    
      // Push the data item into the corresponding group
      acc[group].push(data);
      
      return acc;
    }, {});
    
    console.log(groupsBasedOnCode);
    

    // for (let group in groupedData) {
    //   let groupItems = groupedData[group];

    //   if (group === 'H') {
    //     // For H group, each item goes to a new line
    //     groupItems.forEach((item) => {
    //       htmlContent += `<li>${item.code}: ${item.value || 'N/A'}</li>`;
    //     });
    //   } else {
    //     // For A, B, C groups, join items in a single line
    //     let groupText = `${group}:`;
    //     groupItems.forEach((item, index) => {
    //       groupText += ` ${item.code}: ${item.value || 'N/A'}`;
    //       if (index !== groupItems.length - 1) {
    //         groupText += ' -'; // Add separator only if not the last item
    //       }
    //     });
    //     htmlContent += `<li>${groupText}</li>`;
    //   }
    // }

    // for (const datafromJSON of json) {
    //   let counterData;
    //   if (datafromJSON.code.includes('H')) {
    //     htmlContent += `
    //     <tr>
    //     <td>
    //     ${datafromJSON.code} : </td>
    //     <td>${datafromJSON.value}
    //     </td>
    //     </tr>`;
    //   } else {
    //     htmlContent += `
    //     <tr>
    //     <td>
    //     ${datafromJSON.code} : </td>
    //     <td>${datafromJSON.value}
    //     </td>
    //     </tr>`;

    //   }
    //   // await page.setContent(`<h1>${dataFromJson.value}</h1>`);
    //   // await page.setContent('<h1>Hello, World!</h1>');
    //   console.log(json);
    // }

    // if (json && json.length) {
    //   // Group the data by their prefixes (H, A, B, C)
    //   const groupedData = json.reduce((acc, item) => {
    //     const prefix = item.code[0]; // Get the first letter (H, A, B, C)
    //     if (!acc[prefix]) {
    //       acc[prefix] = [];
    //     }
    //     acc[prefix].push(item);
    //     return acc;
    //   }, {});

    //   // Loop through each group (H, A, B, C)
    //   for (const group in groupedData) {
    //     let groupItems = groupedData[group];

    //     // For H group, each item will go on a new line
    //     if (group === 'H') {
    //       groupItems.forEach((item) => {
    //         htmlContent += `
    //         <tr>
    //           <td>${item.code}:</td>
    //           <td>${item.value || 'N/A'}</td>
    //         </tr>`;
    //       });
    //     } else {
    //       // For A, B, and C groups, concatenate values with ' - ' separator
    //       let groupText = groupItems
    //         .map((item) => `${item.code}: ${item.value || 'N/A'}`)
    //         .join(' - ');

    //       htmlContent += `
    //       <tr>
    //         <td>${group}:</td>
    //         <td>${groupText}</td>
    //       </tr>`;
    //     }
    //   }
    // }

    for (const groupCode in groupsBasedOnCode) {
      if (groupCode === 'H') {
        let groupItems = groupsBasedOnCode[groupCode];
        groupItems.forEach((groupItem) => {
          htmlContent += `
            <tr>
              <td>${groupItem.code} : </td>
              <td>${groupItem.value}</td>
            </tr>
          `;
        });
      } else {
      }
    }
    htmlContent += `</table></body></html>`;

    return htmlContent;
  }

  htmlContent += `</table></body></html>`;

  return htmlContent;
}

// async function createPDFFromJSON(json) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   for (const dataFromJson of json) {
//     await page.setContent(`<h1>${dataFromJson.value}</h1>`);
//     // await page.setContent('<h1>Hello, World!</h1>');
//     console.log(dataFromJson);
//   }
//   // await page.setContent('<h1>Hello, World!</h1>');
//   await page.pdf({
//     path: './BE/file/fileupload/document.pdf',
//     format: 'A4',
//   });

//   await browser.close();
// }

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent('<h1>Hello, World!</h1>');
//   await page.pdf({
//     path: './BE/file/fileupload/document.pdf',
//     format: 'A4',
//   });
// })();

// Function to generate PDF
async function generatePDF(json) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = await GeneratePDFHTML(json); // Generate HTML content
  await page.setContent(html); // Set content on the page
  await page.pdf({ path: 'output.pdf', format: 'A4' }); // Generate PDF

  await browser.close();
}
