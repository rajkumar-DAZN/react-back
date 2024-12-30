// const express = require("express");

// const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
// const { DynamoDB } = require("@aws-sdk/client-dynamodb");
// const AWS = require("aws-sdk");
// // Set the region
// // JS SDK v3 does not support global configuration.
// // Codemod has attempted to pass values to each service client in this file.
// // You may need to update clients outside of this file, if they use global config.
// AWS.config.update({
//   region: "ap-south-1",
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const dynamoDB = new AWS.DynamoDB.DocumentClient(); //from(new DynamoDB({ region: "eu-north-1" }));
// const TABLE_NAME = "UsersData"; // Change to your DynamoDB table name

// // ...
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Get all users
// app.get("/api/users", async (req, res) => {
//   const params = {
//     TableName: TABLE_NAME,
//   };

//   try {
//     console.log("getting data");
//     const data = await dynamoDB.scan(params);
//     res.json(data.Items);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new user
// app.post("/api/users", async (req, res) => {
//   const newUser = req.body;
//   const params = {
//     TableName: TABLE_NAME,
//     Item: newUser,
//   };

//   try {
//     await dynamoDB.put(params);
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a user
// app.put("/api/users/:id", async (req, res) => {
//   const { id } = req.params;
//   const params = {
//     TableName: TABLE_NAME,
//     Key: { id }, // Assuming 'id' is the primary key
//     UpdateExpression:
//       "set #name = :name, #email = :email, #viewerID = :viewerID",
//     ExpressionAttributeNames: {
//       "#name": "name",
//       "#email": "email",
//       "#viewerID": "viewerID",
//     },
//     ExpressionAttributeValues: {
//       ":name": req.body.name,
//       ":email": req.body.email,
//       ":viewerID": req.body.viewerID,
//     },
//     ReturnValues: "UPDATED_NEW",
//   };

//   try {
//     const updatedUser = await dynamoDB.update(params);
//     res.json(updatedUser.Attributes);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a user
// app.delete("/api/users/:id", async (req, res) => {
//   const { id } = req.params;
//   const params = {
//     TableName: TABLE_NAME,
//     Key: { id },
//   };

//   try {
//     await dynamoDB.delete(params);
//     res.sendStatus(204);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

AWS.config.update({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAU72LF755DHIGAU4D",
  secretAccessKey:
    process.env.AWS_ECRET_ACCESS_KEY ||
    "UZyYMNMDhJOSxQ1PylW4zk9KhR6XgRK5p4pnjOyZ",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Data"; // Change to your DynamoDB table name

// Routes

// Get all users
app.get("/api/users", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();

    res.json(data.Items);
  } catch (err) {
    console.log("Error while ", err);
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
    Key: { ViewerId: id }, // Update this to match your table's primary key schema
    UpdateExpression: "set #Email = :Email , #Name = :Name",
    ExpressionAttributeNames: {
      "#Email": "Email",
      "#Name": "Name",
    },
    ExpressionAttributeValues: {
      ":Email": req.body?.Email,
      ":Name": req.body?.Name,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const updatedUser = await dynamoDB.update(params).promise();
    res.json(updatedUser.Attributes);
  } catch (err) {
    console.error("DynamoDB Update Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      ViewerId: id,
    },
  };
  try {
    await dynamoDB.delete(params).promise();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
