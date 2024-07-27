const express = require("express");
const client = require("./koneksi");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/lihatdatatimeline", async (req, res) => {
  try {
    const result = await Promise.race([
      client.query("SELECT * FROM timeline"),
      timeout(5000), // Timeout setelah 5 detik
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// TAMBAH DATA TIMELINE
app.post("/tambahdatatimeline", async (req, res) => {
  try {
    const {
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
    } = req.body;
    const query =
      "INSERT INTO timeline(status, project, tugas, tanggalmulai, tanggalselesai, catatan, hasilakhir) VALUES ($1, $2, $3, $4, $5, $6, $7)";

    await client.query(query, [
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
    ]);
    res.status(201).json({ message: "Data berhasil ditambahkan" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UBAH DATA TIMELINE
app.put("/ubahdatatimeline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
    } = req.body;

    const query = `
      UPDATE timeline 
      SET status = $1, project = $2, tugas = $3, tanggalmulai = $4, tanggalselesai = $5, catatan = $6, hasilakhir = $7 
      WHERE id = $8
    `;

    await client.query(query, [
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
      id,
    ]);
    res.status(200).json({ message: "Data berhasil diubah" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// HAPUS DATA TIMELINE
app.delete("/hapusdatatimeline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM timeline WHERE id = $1";

    await client.query(query, [id]);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
