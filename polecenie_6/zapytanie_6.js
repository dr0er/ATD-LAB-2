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
    const cityWithHighestBMI = await db
      .collection(collectionName)
      .aggregate([
        {
          $addFields: {
            bmi: {
              $divide: [
                "$weight",
                { $pow: [{ $divide: ["$height", 100] }, 2] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$location.city",
            avgBMI: { $avg: "$bmi" },
          },
        },
        {
          $sort: { avgBMI: -1 },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            avgBMI: 1,
          },
        },
      ])
      .toArray();

    await fs.writeFile(
      "wynik_6.json",
      JSON.stringify(cityWithHighestBMI, null, 2)
    );
    console.log("Wynik zapisano do pliku wynik_6.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
