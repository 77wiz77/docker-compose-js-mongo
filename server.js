import express from 'express';
import mongodb from 'mongodb';

const app = express();
const PORT = 4000;

let start = 0;
const count = () => {
  return (start = start + 1);
};

let id = 0;
const idPlus = () => {
  return (id = id + 1);
};

const clientDB = () => {
  const DB = 'mongodb://mongo:27017/newdock';
  const { MongoClient } = mongodb;
  const client = new MongoClient(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
};

const connectDB = async () => {
  const client = clientDB();
  try {
    await client.connect();
    console.log('created db');
  } catch (err) {
    console.log(err);
  }
};

const DB = () => {
  const client = clientDB();
  const db0 = client.db();
  // console.log(db0);
  return db0;
};

const createCollection = async () => {
  const db1 = DB();
  if (db1.collection('test')) {
    console.log('already exist');
  } else {
    return db1.createCollection('test');
  }
};

const pickCollection = async () => {
  const db2 = DB();
  console.log('list:' + db2.getCollectionInfos());
  return db2.collection('test');
};

const findCollection = async () => {
  const db3 = DB();
  try {
    return db3.collection('test').find();
  } catch (err) {
    console.log(err);
  }
};

const countDB = async () => {
  const db4 = DB();

  await db4.collection('test').insertOne({
    id: idPlus(),
    count: start,
    datetime: new Date(),
    client_info: 'window.navigator.userAgent',
  });
};

app.use('/stat', function (request, response) {
  // count();
  countDB(pickCollection());
  response.send('Текущее значение счетчика + 1 = ' + count());
});

app.use('/about', function (request, response) {
  response.setHeader('Content-type', 'text/html');
  response.send('<h3>Hello, 77wiz77</h3>');
});

app.use('/', async function (request, response) {
  countDB(pickCollection());
  response.send('Текущеее значение счетчика = ' + start);
});

app.listen(PORT, function () {
  console.log('Your node js server is running on PORT:', PORT);
  connectDB();
  createCollection();
});
