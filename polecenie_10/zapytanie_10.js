const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const uri = "mongodb://localhost:27017";
// tworze nowego klienta
const client = new MongoClient(uri);

async function main() {
  try {
    // lacze sie z baza danych
    await client.connect();
    const dbName = "ATD2";
    const db = client.db(dbName);
    const collectionName = "zad2";

    // QUERY BEDACE ROZWIAZANIEM PODPUNKTU
    const avgWeightInRange = await db
      .collection(collectionName)
      .aggregate([
        {
          $match: {
            birth_date: {
              $gte: "1990-01-01T00:00:00Z",
              $lte: "2000-12-31T23:59:59Z",
            },
          },
        },
        {
          $group: {
            _id: null,
            avgWeight: { $avg: "$weight" },
          },
        },
      ])
      .toArray();

    await fs.writeFile(
      "wynik_10.json",
      JSON.stringify(avgWeightInRange, null, 2)
    );
    console.log("Wynik zapisano do pliku wynik_10.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
