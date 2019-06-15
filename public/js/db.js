

const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'eng-dict';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

let db = null;
let collection = null;

async function main() {
    db = await MongoClient.connect(MONGO_URL);
    collection = db.collection('words');

    console.log('Insert word:');
    await insertWord('hello', 'a greeting');
    console.log();

    console.log('Print word:');
    await printWord('hello');
    console.log();

    console.log('Update and print word:');
    await updateWord('hello', 'a welcoming greeting');
    await printWord('hello');
    console.log();

    console.log("Update word, and insert if doesn't exist:");
    await upsertWord('spoon', 'a food shovel');
    await upsertWord('spoon', 'metal thing used to dig food');
    await upsertWord('clock', 'a device to tell time');
    console.log();

    console.log('Print all words:');
    await printAllWordsCursor();
    console.log();

    console.log('Delete all words:');
    await deleteAllWords();
    await printAllWords();

    db.close();
}

main();

// Callback verison of the above code:
// MongoClient.connect(MONGO_URL, function (err, database) {
//   db = database;
//   insertWord('hello', 'a greeting');
//   printDefinition('hello');
// });

////////////////////////////////////////////////////////////////////////////////

// Database helper functions

function insertWordCallback(word, definition) {
    const doc = {
        word: word,
        definition: definition
    };
    // Callback version of insertOne.
    collection.insertOne(doc, function (err, result) {
        console.log(`Document id: ${result.insertedId}`);
    });
}

async function insertWord(word, definition) {
    const doc = {
        word: word,
        definition: definition
    };
    // Promise version of insertOne.
    const result = await collection.insertOne(doc);
    console.log(`Document id: ${result.insertedId}`);
}

async function printWord(word) {
    const queryDoc = {
        word: word
    };
    const response = await collection.findOne(queryDoc);
    console.log(`Word: ${response.word}, definition: ${response.definition}`);
}

async function updateWord(word, definition) {
    const query = {
        word: word
    };
    const newEntry = {
        word: word,
        definition: definition
    };
    const response = await collection.update(query, newEntry);
}

// Update word, or insert it if it doesn't exist.
async function upsertWord(word, definition) {
    const query = {
        word: word
    };
    const newEntry = {
        word: word,
        definition: definition
    };
    const params = {
        upsert: true
    };
    const response = await collection.update(query, newEntry, params);
}

async function deleteWord(word) {
    const query = {
        word: word
    };
    const response = await collection.deleteOne(query);
    console.log(`Number deleted: ${response.deletedCount}`);
}

async function deleteAllWords() {
    const response = await collection.deleteMany();
    console.log(`Number deleted: ${response.deletedCount}`);
}

async function printAllWords() {
    const results = await collection.find().toArray();
    for (const result of results) {
        console.log(`Word: ${result.word}, definition: ${result.definition}`);
    }
}

// This function is the same as the above, but uses the cursor directly.
async function printAllWordsCursor() {
    const cursor = await collection.find();
    while (await cursor.hasNext()) {
        const result = await cursor.next();
        console.log(`Word: ${result.word}, definition: ${result.definition}`);
    }
}