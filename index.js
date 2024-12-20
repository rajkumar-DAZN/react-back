const express = require("express");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "UsersData"; // Change to your DynamoDB table name

// ...
const app = express();
// Get all users
app.get("/api/users", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
app.post("/api/users", async (req, res) => {
  const newUser = req.body;
  const params = {
    TableName: TABLE_NAME,
    Item: newUser,
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: { id }, // Assuming 'id' is the primary key
    UpdateExpression:
      "set #name = :name, #email = :email, #viewerID = :viewerID",
    ExpressionAttributeNames: {
      "#name": "name",
      "#email": "email",
      "#viewerID": "viewerID",
    },
    ExpressionAttributeValues: {
      ":name": req.body.name,
      ":email": req.body.email,
      ":viewerID": req.body.viewerID,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const updatedUser = await dynamoDB.update(params).promise();
    res.json(updatedUser.Attributes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
