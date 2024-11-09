// import libraries
const fs = await import('fs');
import PDFParser from 'pdf2json';
import moment from 'moment';
import puppeteer from 'puppeteer';

/**
 * Function for read pdf local from folder
 * @param {string} filePath - directory PDF file path
 * returns {string} fileName - file name of created JSON file from read PDF
 */
async function ReadPDFLocal(filePath) {
  try {
    // define file name
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

            // Resolve the promise with the file name
            resolve(fileName);
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
    // throw error
    throw new Error('Error when read PDF file', error.stack);
  }
}

/**
 * Function for convert JSON from PDF for readibility when populate data
 * @param {string} json - JSON from result read data PDF
 * returns {array} convertedJSON - array created JSON file from PDF that already mapped to only display text and current index elements
 */
async function ConvertJSONFromPDF(json) {
  try {
    const convertedJSON = [];
    if (json && Object.keys(json)) {
      // read file json from parameter
      // const dataFromJson = fs.readFileSync(json, 'utf8');
      const dataFromJson = fs.readFileSync(json);
      if (dataFromJson) {
        // parse JSON into object
        const parseJSON = JSON.parse(dataFromJson);

        // if data in texts is exist
        if (
          parseJSON &&
          parseJSON.Pages &&
          parseJSON.Pages.length &&
          parseJSON.Pages[0].Texts &&
          parseJSON.Pages[0].Texts.length
        ) {
          // loop per each texts and store data to JSON
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

    // unlink file json to clean up
    fs.unlinkSync(json);

    // return converted json
    return convertedJSON;
  } catch (error) {
    // throw error
    throw new Error('Error when convert JSON from PDF', error.stack);
  }
}

/**
 * Function for read data from JSON and populate data for HTML
 * @param {string} convertedJSON - JSON from result convert data JSON from read PDF
 * returns {array} preparedJSON - array created JSON file that already mapped to only code and text
 */
async function ReadDataFromJSON(convertedJSON) {
  try {
    const preparedJSON = [];
    if (convertedJSON && convertedJSON.length) {
      // Section populate data to new JSON

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

      // section A
      const npwpDipotong = await ProcessPopulateData({
        arrayData: convertedJSON,
        startIndex: 19,
        endIndex: 34,
        code: 'A1',
      });

      const codeA4 = await ProcessPopulateData({
        arrayData: convertedJSON,
        code: 'A4',
      });

      // section B
      const masaPajak = await ProcessPopulateData({
        arrayData: convertedJSON,
        startIndex: 159,
        code: 'B1',
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

      // End section populate data to new JSON

      // Start section push data to new JSON
      // section H
      preparedJSON.push(nomorPemotonganPajak);
      preparedJSON.push({
        code: 'H2',
        value: `${statusPembetulan.value} Pembetulan ke-${nomorPembetulan.value}`,
      });

      // section A
      preparedJSON.push(npwpDipotong);
      preparedJSON.push(codeA4);

      // section B
      preparedJSON.push(masaPajak);
      preparedJSON.push(nomorPphDipotongFasilitas);

      // section C
      preparedJSON.push(npwpPemungut);
      preparedJSON.push({
        code: 'C5',
        value: `${statusPernyataanWajibPajak.value} - ${jenisPernyataanWajibPajak.value} `,
      });

      // End section push data to new JSON
    }

    // return prepared JSON
    return preparedJSON;
  } catch (error) {
    // throw error
    throw new Error('Error when read data from JSON', error.stack);
  }
}

/**
 * Function for populate data based on input
 * @param {array} arrayData - array based for get data
 * @param {number} startIndex - start index for get data in array
 * @param {number} endIndex - last index for get data in array
 * @param {Boolean} isDate - if true, then data will be converted with date format
 * @param {string} code - data code for populate in HTML
 * returns {object} populatedData - object filled with code and value
 */
async function ProcessPopulateData({
  arrayData,
  startIndex,
  endIndex,
  isDate = false,
  code,
}) {
  try {
    // define object with default value
    let populatedData = {
      code,
      value: '',
    };
    if (arrayData && arrayData.length) {
      // if code is A1, then populate the data
      // in this case, when read from PDF, it different from PDF, need to remap the value
      if (!isDate && startIndex >= 0 && !endIndex) {
        // if parameter only pass for start index, then populate value with data from value in array
        populatedData.value =
          arrayData[startIndex] && arrayData[startIndex].value
            ? arrayData[startIndex].value
            : '';
      } else if (startIndex && endIndex) {
        // if pass parameter start index and end index
        // get data array from start index to end index
        const arraySliced = arrayData.slice(startIndex, endIndex);

        // combine the sliced array into string
        const arrayJoined =
          arraySliced && arraySliced.length
            ? arraySliced.map((array) => array.value).join('')
            : '';

        // if code is A1, then ue different approach
        if (code === 'A1') {
          // currently populate data with rearrange value manually from array
          populatedData.value =
            arraySliced[3].value +
            arraySliced[1].value +
            arraySliced[12].value +
            arraySliced[7].value +
            arraySliced[0].value +
            arraySliced[13].value +
            arraySliced[4].value +
            arraySliced[10].value +
            arraySliced[2].value +
            arraySliced[5].value +
            arraySliced[6].value +
            arraySliced[8].value +
            arraySliced[9].value +
            arraySliced[11].value +
            arraySliced[14].value;
        } else {
          if (isDate) {
            // if paramter date is used
            // format string to use format date
            const arrayFormattedDate =
              arrayJoined && arrayJoined.length
                ? moment(arrayJoined, 'DDMMYYYY').format('DD/MM/YYYY')
                : '';

            // populate value with string formatted date
            populatedData.value = arrayFormattedDate;
          } else {
            // if not date, then set value with joined array string
            populatedData.value = arrayJoined;
          }
        }
      }
    }

    // return populated data
    return populatedData;
  } catch (error) {
    // throw error
    throw new Error('Error when populate data JSON', error.stack);
  }
}

/**
 * Function for generate PDF HTML based on JSON data
 * @param {array} json - array for populate data to HTML
 * returns {string} htmlContent - string contains html content listed with data from JSON
 */
async function GeneratePDFHTML(json) {
  try {
    // define start html content
    let htmlContent = `<html><body><table>`;

    if (json && json.length) {
      // loop per each data
      for (const [index, datafromJSON] of json.entries()) {
        // if code include H, then set table go to next line for each column
        if (datafromJSON.code.includes('H')) {
          htmlContent += `
          <tr>
          <td>
          ${datafromJSON.code} : </td>
          <td>${datafromJSON.value}
          </td>
          </tr>`;
        } else {
          if (index % 2 === 0) {
            // if index is odd number, then not close the tag row
            htmlContent += `
            <tr>
              <td> ${datafromJSON.code} : </td>
              <td>${datafromJSON.value} </td>`;
          } else {
            // if index is even number, then close the tag row
            htmlContent += `
              <td>${datafromJSON.code} : </td>
              <td>${datafromJSON.value} </td>
            </tr>`;
          }
        }
      }

      // close the html content
      htmlContent += `</table></body></html>`;

      // return html content
      return htmlContent;
    }

    // unlink json to clean up
    fs.unlinkSync(json);

    // return html content
    return htmlContent;
  } catch (error) {
    // throw error
    throw new Error('Error when generate PDF HTML', error.stack);
  }
}

/**
 * Function for generate PDF to output PDF file based on JSON data
 * @param {array} json - array for populate data to HTML
 */
async function GeneratePDF(json) {
  try {
    const fileName = `PDF-Output.pdf`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Generate HTML content
    const html = await GeneratePDFHTML(json);

    // Set content on the page
    await page.setContent(html);

    // Generate PDF
    await page.pdf({ path: fileName, format: 'A4' });

    await browser.close();
    console.log('Process Create PDF done, file name : ' + fileName);
  } catch (error) {
    // throw error
    throw new Error('Error when generate PDF', error.stack);
  }
}

export { ReadPDFLocal, ConvertJSONFromPDF, ReadDataFromJSON, GeneratePDF };
