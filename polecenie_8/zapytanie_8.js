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
    const totalCreditForR = await db
      .collection(collectionName)
      .aggregate([
        {
          $match: {
            last_name: { $regex: /^R/i },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $sum: "$credit.balance" } },
          },
        },
      ])
      .toArray();

    await fs.writeFile(
      "wynik_8.json",
      JSON.stringify(totalCreditForR, null, 2)
    );
    console.log("Wynik zapisano do pliku wynik_8.json");
  } finally {
    // zamykam polaczenie
    await client.close();
  }
}

// wywoluje funkcje main
main().catch(console.error);
