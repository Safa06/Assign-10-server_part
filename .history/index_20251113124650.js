const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;

const admin = require("firebase-admin");

const serviceAccount = require('./serviceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://health_tracker_db:A8gSEvETOaH84Gua@cluster0.2pjciaj.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


//for sdk
const middleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(' ');

  if(req.headers.authorization )
  next();

}
async function run() {
  try {
    await client.connect();

    const db = client.db("assign-10");
    const modelCollection = db.collection("all_habits");

    //   Task-1- show latest 6 featured items card
    // latest 6 data
    // get
    // find

    app.get("/6_habits", async (req, res) => {
      const result = await modelCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      console.log(result);
      res.send(result);
    });

    // Task-2- take data in public health page
    // 1. find (all/many data),
    //  2. findOne(particular 1 ta data)
    app.get("/all_habits", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    // Task - 3 : mongoDBte data pathanor way/post method 2 ta-
    //  1. insertOne - one data sent
    //  2. insertMany - many data sent

    app.post("/all_habits", async (req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await modelCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });



    //Task - 4: to update data in mongoDB, ways are 2 -
    //1. updateOne
    // 2. updateMany
    //PUT

    app.put("/update-habit/:id", middleware,async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      // console.log(id)
      // console.log(data)
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await modelCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });


    //Task- 5: MyHabit page
    app.get("/my-habit", verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await modelCollection
        .find({ created_by: email })
        .toArray();
      res.send(result);
    });








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
