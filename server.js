const bodyParser = require('body-parser');
const express = require('express');
const exphbs  = require('express-handlebars');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

const title= [
    "List the things that make you feel powerful.",
    "What is something that made you laugh today?",
    "List the movies that you want to watch.",
    "List the things that make you feel peaceful.",
    "List your greatest comforts.",
    "What is something that brightens your day?",
    "List three things you accomplished today.",
    "What is something you look forward to every day?",
    "What is a game that you like to play?",
    "What is your Sunday ritual?",
    "List the most memorable moments of this month so far.",
    "List some things you want to do outdoors.",
    "If you could live anywhere you wanted, where would you live?",
    "List what you would spend a million dollars on, just for you.",
    "When do you feel most energized?",
    "List the things that make you feel excited.",
    "List your favorite snacks or treats.",
    "What has you busy this week?",
    "List the people you admire.",
    "List the happiest moments of your year so far.",
    "What hobby would you like to pick up?",
    "List the ways you love to have fun.",
    "Describe something you learned today",
    "List something fun you did or will do today.",
    "What is your dream job?",
    "List the things that inspire you.",
    "List something you did today that you are proud of.",
    "Find a quote that you like and write it down here.",
    "List something you should ignore.",
    "Talk about something you are excited about next month.",
    "List three traits you would like others to see in you."
];

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
}


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

    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/1/'+i,Content:'2019/1/'+i});
    }
    for(let i=1;i<29;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/2/'+i,Content:'2019/2/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/3/'+i,Content:'2019/3/'+i});
    }
    for(let i=1;i<31;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/4/'+i,Content: '2019/4/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/5/'+i,Content:'2019/5/'+i});
    }
    for(let i=1;i<31;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/6/'+i,Content: '2019/6/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/7/'+i,Content:'2019/7/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/8/'+i,Content:'2019/8/'+i});
    }
    for(let i=1;i<31;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/9/'+i,Content:'2019/9/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/10/'+i,Content:'2019/10/'+i});
    }
    for(let i=1;i<31;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/11/'+i,Content:'2019/11/'+i});
    }
    for(let i=1;i<32;i++){
        await entrycollection.insertOne({ DiaryId: DiaryId,Date: '2019/12/'+i,Content:'2019/12/'+i});
    }

    console.log(response);

    res.json({ "DiaryId": DiaryId, "status": 200 } );
}
app.get('/creatNewDiary', onCreatNewDiary);



async function onLinkEntry(req,res){
    let date= new Date();
    const DiaryId= req.params.diaryID;
    const collection = db.collection('entries');
    console.log("find one");
    const where={
        DiaryId:DiaryId,
        Date:date.toLocaleDateString()
    };
    const response = await collection.findOne(where);
    console.log(response);
    res.render('diary',{ "date-view":date.toLocaleDateString(),"title-view":title[date.toLocaleDateString().split('/')[2]-1], "Content": response.Content } );
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
app.post('/save', jsonParser,onSaveDiary);

async function onchangedate(req,res){
    const date = req.body.Dbdate;
    const DiaryId = req.body.DiaryId;
    const collection = db.collection('entries');
    console.log("onchangedate");
    console.log("date:"+date);
    const where={
        DiaryId:DiaryId,
        Date:date
    };
    const response = await collection.findOne(where);
    console.log(response);
    res.json({ "date-view":date,"title":title[date.split('/')[2]-1],"Content": response.Content } );
}
app.post('/getinfo', jsonParser,onchangedate);
