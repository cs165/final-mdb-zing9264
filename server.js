const bodyParser = require('body-parser');
const express = require('express');
const exphbs  = require('express-handlebars');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

Date.prototype.toLocaleDateString = function () {
    var d = new Date();
    return d.getFullYear()+ "/" + (d.getMonth() + 1)   + "/" +d.getDate() ;
};


let db = null;
let diarycollection=null;
let entrycollection=null;
async function main() {
  const DATABASE_NAME = 'cs193x-db';
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  diarycollection = db.collection('diaries');
  entrycollection=  db.collection('entries');
  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};


main();

////////////////////////////////////////////////////////////////////////////////

// TODO(you): Add at least 1 GET route and 1 POST route.
function onGetMain(req, res) {
    res.render('index');
}
app.get('/', onGetMain);


async function onCreatNewDiary(req, res) {
    let date= new Date();
    const DiaryId = new ObjectID().toString();
    console.log(DiaryId);
    console.log(typeof DiaryId);
    const diarycollection = db.collection('diaries');
    const entrycollection=  db.collection('entries');
    const response = await diarycollection.insertOne({ _id: ObjectID(DiaryId),DiaryId :DiaryId });
    const entry = await entrycollection.insertOne({ DiaryId: DiaryId,Date: date.toLocaleDateString(),Content:'foo'});

    console.log(response);
    console.log(entry);
    res.json({ "DiaryId": DiaryId, "status": 200 } );
}
app.get('/creatNewDiary', onCreatNewDiary);


async function onLinkEntry(req,res){
    const DiaryId= req.params.diaryID;
    const collection = db.collection('entries');
    console.log("find one");
    const where={
        DiaryId:DiaryId,
        Date:'2019/6/15'
    };
    const response = await collection.findOne(where);
    console.log(response);
    res.render('diary',{ "Content": "ass"+response.Content } );
}
app.get('/id/:diaryID', onLinkEntry);


async function onSaveDiary(req,res){
    const contents = req.body.Dbcontents;
    const date = req.body.Dbdate;
    const DiaryId = req.body.DiaryId;
    const collection = db.collection('entries');
    const where={
        DiaryId:DiaryId,
        Date:date
    };
    console.log(req.body);
    const newvalues = {
        DiaryId:DiaryId,
        Date:date,
        Content:contents
    };
    const params = {
        upsert: true
    };
    const response = await collection.updateOne(where,newvalues,params);

    res.json({ "Content": response.Content, "status": 200 } );

}
app.post('/save', jsonParser,onSaveDiary)

async function onchangedate(req,res){
    const date = req.body.date;
    const DiaryId = req.body.DiaryId;
    const collection = db.collection('entries');
    console.log("find all");
    const where={
        DiaryId:DiaryId,
        Date:date
    };
    const response = await collection.find(where);
    console.log(response);
    res.render('diary',{ "date-view":date,"Content": response.Content } );
}
app.post('/getinfo', jsonParser,onchangedate)
