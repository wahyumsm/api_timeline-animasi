const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "apitimelineanimasi",
  password: "wahyu123",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("terkoneksi dengan postgree sql "))
  .catch((err) => {
    console.log("koneksi bermasalah error ", err);
  });

module.exports = client;
