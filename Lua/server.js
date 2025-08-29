import express from "express";
import oracledb from "oracledb";
import path from "path";

const app = express();
app.use(express.json());

const walletPath = path.join(process.cwd(), "Wallet_videogamelua144"); // carpeta descomprimida

const dbConfig = {
  user: "ADMIN",
  password: "McAURA1442103.",
  connectString: "videogamelua144_high",
  walletLocation: "/Users/astrocony/Desktop/AstroCony/Wallet_VideoGameLua144",
};

app.post("/add-player", async (req, res) => {
  const { name, avatar,hearts,birds } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `INSERT INTO players (name) VALUES (:name)`,
      [name],
      { autoCommit: true }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error DB:", err);
    res.sendStatus(500);
  } finally {
    if (conn) await conn.close();
  }
});

app.listen(3000, () =>
  console.log("✅ Backend running on http://localhost:3000")
);
