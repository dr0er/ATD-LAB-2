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
    const topBirthDates = await db
      .collection(collectionName)
      .aggregate([
        {
          $group: {
            _id: "$birth_date",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 3 },
      ])
      .toArray();
    await fs.writeFile("wynik_9.json", JSON.stringify(topBirthDates, null, 2));
    console.log("Wynik zapisano do pliku wynik_9.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
