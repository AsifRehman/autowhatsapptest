const { chromium } = require('playwright');

(async () => {
    // Launch the browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to WhatsApp Web
    await page.goto('https://web.whatsapp.com');

    // Wait for the QR code to be scanned
    console.log('Please scan the QR code with your phone to log in to WhatsApp Web.');
    let contactName = "";
    let message = "";
    //------------------------------------------------------------START SELECT AND SEND MESSAGE--------------------------------------------------------------------------------------
    await page.waitForSelector('p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', { timeout: 0 });

    // Search for the contact you want to message
    contactName = 'Rizwan Nazam Bawa';
    await page.fill('div.x1hx0egp p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', contactName);
    await page.keyboard.press('Enter');

    // Wait for the chat to open
    await page.waitForSelector(`span[title="${contactName}"]`);
    
    // Type the message
    message = 'Hello, this is an automated message from whatsapp for testing!. so don\'t worry.';
    await page.type('div._ak1l p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', message);

    // Press Enter to send the message
    await page.keyboard.press('Enter');
    //------------------------------------------------------------START SELECT AND SEND MESSAGE--------------------------------------------------------------------------------------

    //------------------------------------------------------------START SELECT AND SEND MESSAGE--------------------------------------------------------------------------------------
    await page.waitForSelector('p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', { timeout: 0 });

    // Search for the contact you want to message
    contactName = 'Asi';
    await page.fill('div.x1hx0egp p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', contactName);
    await page.keyboard.press('Enter');

    // Wait for the chat to open
    await page.waitForSelector(`span[title="${contactName}"]`);
    
    // Type the message
    message = 'Hello, this is an automated message from whatsapp for testing!';
    await page.type('div._ak1l p.selectable-text.copyable-text.x15bjb6t.x1n2onr6', message);

    // Press Enter to send the message
    await page.keyboard.press('Enter');
    //------------------------------------------------------------START SELECT AND SEND MESSAGE--------------------------------------------------------------------------------------


    console.log('Message sent!');

    // Optionally, close the browser
    // await browser.close();
})();
