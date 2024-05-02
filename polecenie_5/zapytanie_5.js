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
    const bmiByNationality = await db
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
            _id: "$nationality",
            avgBMI: { $avg: "$bmi" },
            minBMI: { $min: "$bmi" },
            maxBMI: { $max: "$bmi" },
          },
        },
      ])
      .toArray();
    await fs.writeFile(
      "wynik_5.json",
      JSON.stringify(bmiByNationality, null, 2)
    );
    console.log("Wynik zapisano do pliku wynik_5.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
