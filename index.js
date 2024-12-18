const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://muthugowthamanmca:muthu321@cluster0.ycprf.mongodb.net/bank";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Schema
const newSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    amount: { type: Number, default: 0 }
});

// Model
const Data = mongoose.model('mca', newSchema);

// Routes
app.get('/', (req, res) => {
    res.send('WELCOME TO MONGODB');
});

app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/create', async (req, res) => {
    try {
        const newUser = await Data.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        const updatedUser = await Data.findByIdAndUpdate(req.params.id, { amount: req.body.amount }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedUser = await Data.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
