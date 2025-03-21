import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  await import("./db/startAndSeedMemoryDB");
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hotels/:id", async (req: Request, res: Response) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");
  const { id } = req.params;
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();

    const hotelsCollection = db.collection("hotels");
    if (!id) {
      return res.status(400).send("Id is required");
    }
    const oId = new ObjectId(id);
    const hotel = await hotelsCollection.findOne({ _id: oId });
    res.send(hotel);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  } finally {
    await mongoClient.close();
  }
});

app.get("/cities/:id", async (req: Request, res: Response) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");
  const { id } = req.params;
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();

    const citiesCollection = db.collection("cities");
    if (!id) {
      return res.status(400).send("Id is required");
    }
    const oId = new ObjectId(id);
    const city = await citiesCollection.findOne({ _id: oId });
    res.send(city);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  } finally {
    await mongoClient.close();
  }
});

app.get("/countries/:id", async (req: Request, res: Response) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");
  const { id } = req.params;
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();

    const countriesCollection = db.collection("countries");
    if (!id) {
      return res.status(400).send("Id is required");
    }
    const oId = new ObjectId(id);
    const country = await countriesCollection.findOne({ _id: oId });
    res.send(country);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  } finally {
    await mongoClient.close();
  }
});

app.get("/search", async (req: Request, res: Response) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");
  const { searchTerm, limit, page } = req.query;
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();

    const hotelCollection = db.collection("hotels");
    const citiesCollection = db.collection("cities");
    const countriesCollection = db.collection("countries");

    console.log(
      "Searching for hotels, cities and countries with matching names"
    );

    const regEx = RegExp(`${searchTerm}`, "i");

    const [hotels, cities, countries] = await Promise.all([
      hotelCollection
        .find({
          $or: [{ hotel_name: regEx }, { chain_name: regEx }],
        })
        .toArray(),
      citiesCollection
        .aggregate([
          { $match: { name: regEx } },
          {
            $lookup: {
              from: "hotels",
              localField: "city",
              foreignField: "name",
              as: "hotels",
            },
          },
        ])
        .toArray(),
      countriesCollection
        .aggregate([
          { $match: { country: regEx } },
          {
            $lookup: {
              from: "hotels",
              localField: "country",
              foreignField: "country",
              as: "hotels",
            },
          },
        ])
        .toArray(),
    ]);

    console.log("Successfully found matching resources");

    console.log("Mapping matching country and city hotels into hotels array");
    const allHotels = [cities, countries].reduce(
      (acc, next) => {
        next.forEach((item) => {
          acc = [...acc, ...item.hotels];
          delete item.hotels;
        });

        return acc;
      },
      [...hotels]
    );

    console.log(
      "Successfully mapped hotels from matching countries and cities"
    );

    console.log("Filtering out duplicate hotels");

    const uniqHotelLookup: { [key: string]: boolean } = {};

    const uniqHotels = allHotels.filter((hotel) => {
      if (uniqHotelLookup[hotel._id]) {
        return false;
      }
      uniqHotelLookup[hotel._id] = true;
      return true;
    });

    console.log("Successfully filtered out duplicate hotels");

    console.log("Returning payload");

    res.send({
      hotels: uniqHotels,
      cities,
      countries,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  } finally {
    await mongoClient.close();
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
