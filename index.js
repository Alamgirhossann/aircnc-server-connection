const express = require('express');
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var cors = require('cors')
const { ObjectId } = require('mongodb').ObjectID;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s5oej.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 4000;

app.get('/', (req, res) => {
  res.send('Hello World! I am runing')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const hotelCollection = client.db(`${process.env.DB_NAME}`).collection("hotel");
  const paymentCollection = client.db(`${process.env.DB_NAME}`).collection("payment");

  app.get('/hotels/:id', (req, res)=>{
    hotelCollection.find({id: req.params.id})
    .toArray((err, document)=>{
      res.send(document[0])
    })
  })
  
  
  app.get('/hotel', (req, res) => {
    hotelCollection.find({})
      .toArray((error, documents) => {
        res.send(documents)
      })
  })

  app.post('/payment', (req,res)=>{
    const payment = req.body;
    console.log(payment);
    paymentCollection.insertOne(payment)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })


  console.log('database connected');
});




app.listen(process.env.PORT || port)
