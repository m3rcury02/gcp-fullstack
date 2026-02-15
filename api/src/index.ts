import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp();
const db = admin.firestore();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/tasks", async (_req, res) => {
    const snap = await db.collection("tasks").orderBy("createdAt", "desc").limit(50).get();
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const { title } = req.body ?? {};
    if (typeof title !== "string" || title.trim().length < 2) {
        return res.status(400).json({ error: "title must be at least 2 chars" });
    }

    const docRef = await db.collection("tasks").add({
        title: title.trim(),
        done: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => console.log(`API running on ${port}`));