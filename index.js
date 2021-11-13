const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.maqeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("assignment12");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders")

        // GET PRODUCTS API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET SINGLE PRODUCT API
        app.get('/products/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // GET USER ORDER DETAILS
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const id = req.query.id;
            const query = { email: email, id: id }
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // POST ORDERS API
        app.post('/orders', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        // ORDERS DELETE API
        app.delete('/orders', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})