const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

//database uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rv6z4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to the database');
        const database = client.db("dotOnline");
        const userCollection = database.collection("users");

        app.post('/users', async( req,res)=>{
            //console.log(req.body);
            const user = req.body;
            const insertedUser = await userCollection.insertOne(user);
            console.log(insertedUser);
            res.json(insertedUser);
            //resizeBy.json(insertedUser);
        });

        app.get('/users', async (req, res) => {
            const allUsers = await userCollection.find({}).toArray();
            res.json(allUsers);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email};
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const updatedUser = await userCollection.updateOne(filter, updateDoc, options);
            res.json(updatedUser);
        });


        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
             const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {

                $set: updatedUser
            };
            const result = await userCollection.updateOne(filter, updateDoc)
            console.log('updating user', id);
            res.json(result);

        })


        app.delete('/users/:usrId', async (req, res) => {
            const usrId = req.params.usrId;
            const query = { _id: ObjectId(usrId) };
            const deletedUser = await userCollection.deleteOne(query);
            console.log(deletedUser);

            console.log('deleteing user with id', usrId);

            res.json(deletedUser);
        });




    }finally{
        //await client.close();
    }
}
run().catch(console.dir);



// app.get('/users', (req, res) => {
//     res.send('Dot Online Server is Running');
// });

app.listen(port, () => {
    console.log('Dot Online Server is running on port', port);
});