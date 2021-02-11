import { Readable } from 'stream';
import csvParse from 'csv-parse';

class ImportContactsService {
  async run(contactFileStream: Readable): Promise<void> {
    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = contactFileStream.pipe(parsers);
    
    parseCSV.on('data', line => )
  }
}

export default ImportContactsService;
