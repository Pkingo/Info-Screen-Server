import mongodb, { MongoClient } from "mongodb";
import assert from "assert";
import { dbName, url } from "./config";

MongoClient.connect(url, (err, client) => {
    assert.equal(null, null);
    console.log("Connected successdully to server");

    const db  = client.db(dbName);
    client.close();
});