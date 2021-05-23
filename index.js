const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqab1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("superMarket").collection("products");
  const orderCollection = client.db("superMarket").collection("orders");

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((error, products) => {
      res.send(products);
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      // console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
    })
    // console.log(newProduct);
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
   
  })

  app.get('/order', (req, res) => {
    // console.log(req.query.email);
    orderCollection.find({email: req.query.email})
    .toArray((error, documents) => {
      res.send(documents);
    })

  })


  app.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    productCollection.deleteOne({_id: objectId(productId)})
    .then(result => {
      res.redirect('/admin/manageProduct')
     
    })
  })
 

 
});


app.listen(port)

