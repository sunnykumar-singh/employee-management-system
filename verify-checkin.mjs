import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0', timeout: 60000 });
await page.type('input[type="email"], input[name="email"]', 'employee@company.com');
await page.type('input[type="password"], input[name="password"]', 'Employee@123');
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }), page.click('button[type="submit"]')]);
await page.goto('http://localhost:5173/employee/attendance', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction(() => document.body.innerText.includes('Check In'));
const employeeUi = await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button')).map((b) => b.textContent.trim());
  const checkIn = buttons.find((t) => t.includes('Check In'));
  const checkOut = buttons.find((t) => t.includes('Check Out'));
  const checkInBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Check In'));
  const checkOutBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Check Out'));
  return {
    hasCheckIn: !!checkIn,
    hasCheckOut: !!checkOut,
    checkInDisabled: checkInBtn?.disabled ?? null,
    checkOutDisabled: checkOutBtn?.disabled ?? null,
    table: document.body.innerText.includes('Attendance Records'),
  };
});
// Admin should not show check-in buttons
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0', timeout: 60000 });
// clear storage by logging out via evaluate
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0', timeout: 60000 });
await page.type('input[type="email"], input[name="email"]', 'admin@company.com');
await page.type('input[type="password"], input[name="password"]', 'Admin@123');
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }), page.click('button[type="submit"]')]);
await page.goto('http://localhost:5173/admin/attendance', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction(() => document.body.innerText.includes('Attendance'));
const adminUi = await page.evaluate(() => ({
  hasCheckIn: document.body.innerText.includes('Check In'),
  hasCheckOut: document.body.innerText.includes('Check Out'),
  hasExport: document.body.innerText.includes('Export Excel'),
}));
console.log(JSON.stringify({ employeeUi, adminUi, errors }, null, 2));
await browser.close();
