const express = require("express");
const client = require("./koneksi");
const app = express();

const port = 5000;

app.use(express.json());

// LIHAT DATA DATA KARYAWAN
app.get("/lihatdatatimeline", (req, res) => {
  client.query("SELECT * FROM timeline", (err, result) => {
    if (err) {
      console.log("error di eksekusi:", err);
      res.status(500).json({ message: "internal server error" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// // untuk tambah data data karyawan
app.post("/tambahdatatimeline", async (req, res) => {
  try {
    const { status, project, tugas, tanggalmulai, catatan, hasilakhir } =
      req.body;
    const query =
      "INSERT INTO timeline(status,project,tugas,tanggalmulai,tanggalselesai,catatan,hasilakhir) VALUES ($1,$2,$3,$4,$5,$6,$7) ";

    await client.query(query, [
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
    ]);
    res.status(201).json({ message: "data berhasil di tambahkan" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
});
// // untuk ubah data data karyawan

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

    const values = [
      status,
      project,
      tugas,
      tanggalmulai,
      tanggalselesai,
      catatan,
      hasilakhir,
      id,
    ];
    await client.query(query, values);

    res.status(200).json({ message: "Data berhasil diubah" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/hapusdatatimeline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM timeline WHERE id = $1";
    await client.query(query, [id]);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`ini adalah port nya yang berjalan ${port}`);
});
