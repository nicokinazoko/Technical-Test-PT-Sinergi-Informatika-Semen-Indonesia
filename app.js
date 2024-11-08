import {
  ReadPDFLocal,
  ConvertJSONFromPDF,
  ReadDataFromJSON,
  GeneratePDF,
} from './BE/utilities/processPDF.js';

const fileNameJSON = await ReadPDFLocal('./BE/file/Soal 2.pdf');
const convertedJSON = await ConvertJSONFromPDF(fileNameJSON);
const preparedJSON = await ReadDataFromJSON(convertedJSON);
const pdfGenerated = await GeneratePDF(preparedJSON);
