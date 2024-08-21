const express = require('express');
const path = require('path');
const { chromium } = require('playwright');

const app = express();
const port = 5000;

let browser, context, page;
let isLoggedIn = false;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize WhatsApp
app.post('/initialize', async (req, res) => {
    try {
        if (!isLoggedIn) {
            browser = await chromium.launch({ headless: false });
            context = await browser.newContext();
            page = await context.newPage();
            await page.goto('https://web.whatsapp.com');
            await page.waitForSelector("//*[@id='side']/div[1]/div/div[2]/div[2]/div/div[1]/p", { timeout: 60000 });
            res.send('WhatsApp initialized successfully. You can now send messages.');
            isLoggedIn = true;
        } else {
            res.send('WhatsApp is already initialized.');
        }
    } catch (error) {
        console.error('Error initializing WhatsApp:', error);
        res.status(500).send('Failed to initialize WhatsApp.');
    }
});

// Send WhatsApp message
app.post('/send', async (req, res) => {
    const { contactName, mobileNumber, messageArray } = req.body;

    if (!browser || !page) {
        return res.status(400).send('WhatsApp has not been initialized.');
    }

    try {
        await sendWhatsAppMessage(contactName, mobileNumber, messageArray);
        res.send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Failed to send message.');
    }
});

// Cleanup browser and reset state
app.post('/cleanup', async (req, res) => {
    try {
        if (browser) {
            await browser.close();
            browser = null;
            context = null;
            page = null;
            isLoggedIn = false;
            res.send('Browser cleaned up successfully.');
        } else {
            res.send('No active browser instance to clean up.');
        }
    } catch (error) {
        console.error('Error cleaning up browser:', error);
        res.status(500).send('Failed to clean up browser.');
    }
});

async function sendWhatsAppMessage(contactName, mobileNumber, messageArray) {
    // Ensure page is loaded and ready
    await page.waitForSelector("//*[@id='side']/div[1]/div/div[2]/div[2]/div/div[1]/p");
    await page.click("//*[@id='side']/div[1]/div/div[2]/div[2]/div/div[1]/p");
    await page.waitForTimeout(200);

    // Perform keyboard actions
    await page.keyboard.press('Shift+Home');
    await page.waitForTimeout(200);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(200);

    await page.keyboard.press('Shift+End');
    await page.waitForTimeout(200);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(200);

    // Mobile number formatting and sending
    const Mobile1 = "92" + mobileNumber.slice(1);
    await page.waitForTimeout(100);
    await page.keyboard.type(Mobile1);
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);

    // Sending each line of the message
    for (const msg of messageArray) {
        await page.keyboard.type(msg);
        await page.keyboard.press('Shift+Enter');
        await page.waitForTimeout(100);
    }

    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    console.log('Message sent!');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
