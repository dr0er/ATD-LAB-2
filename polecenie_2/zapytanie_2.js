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
    const avgAgeByOccupation = await db
      .collection(collectionName)
      .aggregate([
        {
          $group: {
            _id: "$job",
            avgAge: {
              $avg: {
                $divide: [
                  { $subtract: [new Date(), { $toDate: "$birth_date" }] },
                  1000 * 60 * 60 * 24 * 365,
                ],
              },
            },
          },
        },
        { $sort: { avgAge: 1 } },
      ])
      .toArray();
    await fs.writeFile(
      "wynik_2.json",
      JSON.stringify(avgAgeByOccupation, null, 2)
    );
    console.log("Wynik zapisano do pliku wynik_2.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
