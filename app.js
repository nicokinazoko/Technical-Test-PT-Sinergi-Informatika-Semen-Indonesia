// import functionalities
import {
  ReadPDFLocal,
  ConvertJSONFromPDF,
  ReadDataFromJSON,
  GeneratePDF,
} from './BE/utilities/processPDF.js';


// read PDF file
const fileNameJSON = await ReadPDFLocal('./BE/file/Soal 2.pdf');

// convert result read PDF to JSON
const convertedJSON = await ConvertJSONFromPDF(fileNameJSON);

// convert JSON to populate data for template HTML
const preparedJSON = await ReadDataFromJSON(convertedJSON);

// generate PDF based on JSON given
const pdfGenerated = await GeneratePDF(preparedJSON);
