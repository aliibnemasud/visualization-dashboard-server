const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('visualization Dashboard Server is Running......')
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER_NAME }:${process.env.DB_PASS}@visualization-dashboard.aatcaul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    
    try {
        await client.connect();
        const businessDataCollection = client.db('visualization-dashboard').collection('businessdata');
         // Load all data

         app.get('/businessdata', async (req, res) => {                        
            const query = {};
            const cursor = businessDataCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
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