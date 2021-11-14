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
        const reviewsCollection = database.collection("reviews")
        const usersCollection = database.collection("users")

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
        // GET ORDER API
        app.get('/orders/allOrder', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET REVIEW API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // GET ADMIN API
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin });
        });

        // POST ORDERS API
        app.post('/orders', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        // POST REVIEW API
        app.post('/reviews', async (req, res) => {
            const result = await reviewsCollection.insertOne(req.body);
            res.send(result);
        })

        // POST REVIEW API
        app.post('/users', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
        })

        // POST ADD PRODUCT API
        app.post('/products', async (req, res) => {
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
        })

        // UPDATE USER AS ADMIN API
        app.put('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        // UPDATE ORDER STATUS API
        app.put('/orders', async (req, res) => {
            const order = req.body;
            const query = { _id: ObjectId(req.query.id) }
            const updateDoc = {
                $set: { status: order.status }
            }
            const result = await ordersCollection.updateOne(query, updateDoc);
            res.send(result);
        })


        // ORDERS DELETE API
        app.delete('/orders', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })
        // PRODUCT DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
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