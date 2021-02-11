import { Readable } from 'stream';
import csvParse from 'csv-parse';

import Tag from '../schemas/Tag';

import Contact from '../schemas/Contact';

class ImportContactsService {
  async run(contactFileStream: Readable, tags: string[]): Promise<void> {
    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = contactFileStream.pipe(parsers);
    
    const existTags: any = await Tag.find({
      title: {
        $in: tags,
      },
    });

    const existentTagsTitles = existTags.map(tag => tag.title);

    const tagsData = tags.map(tag => ({
      title: tag
    }));

    const createdTags = await Tag.create(tagsData);
    const tagsIds = createdTags.map(tag => tag.id);

    parseCSV.on('data', line => {
      const [email] = line;

      Contact.create({ email, tags: tagsIds });
    });
  }
}

export default ImportContactsService;
