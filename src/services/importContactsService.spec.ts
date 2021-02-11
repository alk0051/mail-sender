import mongoose from 'mongoose';
import { Readable } from 'stream';

import ImportContactsService from './importContactsService';

import Contact from '../schemas/Contact';
import Tag from '../schemas/Tag';

describe('Import', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }
    
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await Tag.deleteMany({});
  });

  it('shoud be able to import new contact', async () => {
    const contactFileStream = Readable.from([
      'alanlimadecampos@gmail.com\n',
      'alanbertani@yandex.com\n',
      'alanlimadecampos1@gmail.com\n'
    ]);

    const importContacts = new ImportContactsService();

    await importContacts.run(contactFileStream, ['Students', 'Class A']);

    const createdTags = await Tag.find({});

    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
    ]);

    const createdTagsIds = createdTags.map(tag => tag._id);

    const createdContacts = await Contact.find({});

    expect(createdContacts).toEqual([
      expect.objectContaining({
        email: 'alanlimadecampos@gmail.com',
        tags: createdTagsIds,
      }),
      expect.objectContaining({
        email: 'alanbertani@yandex.com',
        tags: createdTagsIds,
      }),
      expect.objectContaining({
        email: 'alanlimadecampos1@gmail.com',
        tags: createdTagsIds,
      }),
    ]);
  });
});