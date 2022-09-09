import mongoose from "mongoose";
const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("connection successful");
  })
  .catch(() => {
    console.log("connection failed");
  });
