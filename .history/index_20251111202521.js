const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;

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

async function run() {
  try {
    await client.connect();

    const db = client.db("assign-10");
    const modelCollection = db.collection("all_habits");

      
    //   Task-1- show latest 6 featured items card
    //latest 6 data
    // get
    // find

    app.get("/latest-models", async (req, res) => {
      const result = await modelCollection
        .find()
        .sort({ created_at: "desc" })
        .limit(6)
        .toArray();

      console.log(result);

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
