const express = require('express');
const sendWhatsAppMessage = require('./sendMessage');
const app = express();

app.use(express.json());

app.post('/send-message', async (req, res) => {
    const { contactName, message } = req.body;
    try {
        await sendWhatsAppMessage(contactName, message);
        res.status(200).send('Message sent!');
    } catch (error) {
        res.status(500).send('Failed to send message.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
