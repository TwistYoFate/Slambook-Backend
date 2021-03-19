const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://daymongo:daymongopass1@cluster0.xoiyp.mongodb.net/sample_restaurants?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

var restaurants;
client.connect((err) => {
  var dbUsers = [];
  console.log("Connected successfully to database");

  restaurants = client.db("sample_restaurants").collection("restaurants");

  const cursor = restaurants.find();
  if (cursor.count() == 0) {
    console.log("no data");
  } else {
    cursor.forEach((data) => {
      console.log(data.name);
    });
  }
});

//create a server object:
app.get("/", function (req, res) {
  res.write("Hello World!..."); //write a response to the client
  res.end(); //end the response
});

app.listen(8080, function () {
  console.log("server running on 8080");
}); //the server object listens on port 8080
