const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('visualization Dashboard Server is Running......')
})


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@visualization-dashboard.aatcaul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        await client.connect();
        const businessDataCollection = client.db('visualization-dashboard').collection('businessdata');
        const formCollection = client.db('visualization-dashboard').collection('formData');
        const userCollection = client.db('visualization-dashboard').collection('users');
        const allUsersCollection = client.db('visualization-dashboard').collection('allUsers');

        // Load all data

        app.get('/businessdata', async (req, res) => {
            const query = {};
            const cursor = businessDataCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        })

        // Posting data for user portal

        app.post('/addFrom', async (req, res) => {
            const formData = req.body;
            console.log()
            const result = await formCollection.insertOne(formData);
            res.send(result);
        })

        // All users

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        })

        // Form Data

        app.get('/formdata', async (req, res) => {
            const query = {};
            const cursor = formCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        })

        // registering user to the database

        /*   app.put('/users/:email', async (req, res) => {
              const email = req.params.email;
              const user = req.body;
              const filter = { email: email };
              const option = { upsert: true };
              const updateUser = {
                  $set: user,
              };
              const result = await usersCollection.updateOne(filter, updateUser, option);
              res.send(result);
          })
   */
        // Posting User to the database

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await allUsersCollection.insertOne(users);
            res.send(result);
        })

        // Get admin
        
        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await allUsersCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        })

        // delete data
        app.delete('/formdata/:id', async(req, res)=> {            
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await formCollection.deleteOne(query);
            res.send(result);
        })


    }

    finally {
        // console.close()
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`visualization Dashboard listening on port ${port}`)
})