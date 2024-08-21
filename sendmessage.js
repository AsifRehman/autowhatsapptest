const { chromium } = require('playwright');

async function sendWhatsAppMessage(contactName, message) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://web.whatsapp.com');
    console.log('Please scan the QR code with your phone to log in to WhatsApp Web.');

    await page.waitForSelector('div[role="textbox"]', { timeout: 0 });

    await page.fill('input[title="Search or start new chat"]', contactName);
    await page.keyboard.press('Enter');

    await page.waitForSelector(`span[title="${contactName}"]`);
    
    await page.type('div[contenteditable="true"]', message);
    await page.keyboard.press('Enter');

    console.log('Message sent!');
    await browser.close();
}

module.exports = sendWhatsAppMessage;
