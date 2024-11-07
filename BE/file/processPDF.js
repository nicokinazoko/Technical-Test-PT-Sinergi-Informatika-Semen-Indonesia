const fs = require('fs');

const pdf = require('pdf-parse');
const PDFParser = require('pdf2json');

async function readPDFFromFolder(filePath) {
  try {
    if (filePath) {
      const pdfParser = new PDFParser();

      if (pdfParser) {
        pdfParser.on('pdfParser_dataError', (err) =>
          console.error(err.parserError)
        );
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
          fs.writeFileSync('pdfData.json', JSON.stringify(pdfData));
        });

        // Load and parse the PDF file
        pdfParser.loadPDF(filePath);
      }
    }
  } catch (error) {
    console.error('There was an error occured', error);
  }
}

readPDF('./BE/file/Soal 2.pdf');

async function readDataFromJSON(json) {}
