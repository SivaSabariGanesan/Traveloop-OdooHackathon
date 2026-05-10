import puppeteer from 'puppeteer';

export const generateInvoicePDF = async (invoice: any): Promise<Buffer> => {
  const subtotal = invoice.items.reduce((s: number, i: any) => s + i.amount, 0);
  const tax = subtotal * 0.05;
  const grand = subtotal + tax;
  const spent = subtotal;
  const remaining = invoice.totalBudget - spent;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #f8fafc; padding: 40px; color: #0f172a; }
    .card { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .logo { width: 56px; height: 56px; background: #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-text { color: #fff; font-size: 22px; font-weight: 700; }
    .trip-name { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 12px; }
    .trip-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: ${invoice.status === 'PAID' ? '#dcfce7' : '#fef3c7'}; color: ${invoice.status === 'PAID' ? '#166534' : '#92400e'}; margin-top: 8px; }
    .budget-box { background: #f8fafc; border-radius: 12px; padding: 20px; min-width: 220px; }
    .budget-title { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 12px; }
    .budget-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
    .budget-row .label { color: #64748b; }
    .budget-total { font-size: 20px; font-weight: 700; color: #0f172a; }
    .red { color: #ef4444; font-weight: 600; }
    .green { color: #10b981; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #475569; }
    th:last-child, td:last-child { text-align: right; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    tr:last-child td { border-bottom: none; }
    .foot-row td { font-size: 13px; color: #64748b; font-weight: 500; }
    .grand-row td { font-size: 15px; font-weight: 700; color: #2563eb; background: #eff6ff; border-radius: 8px; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="logo"><div class="logo-text">T</div></div>
        <div class="trip-name">${invoice.trip?.name ?? 'Trip Invoice'}</div>
        <div class="trip-sub">
          ${invoice.trip?.startDate ? new Date(invoice.trip.startDate).toDateString() : ''}
          ${invoice.trip?.endDate ? '→ ' + new Date(invoice.trip.endDate).toDateString() : ''}
        </div>
        <div class="badge">${invoice.status}</div>
      </div>
      <div class="budget-box">
        <div class="budget-title">Budget Summary</div>
        <div class="budget-row">
          <span class="label">Total Budget</span>
          <span class="budget-total">$${invoice.totalBudget.toLocaleString()}</span>
        </div>
        <div class="budget-row">
          <span class="label">Expenses</span>
          <span class="red">$${spent.toLocaleString()}</span>
        </div>
        <div class="budget-row">
          <span class="label">Remaining</span>
          <span class="green">$${remaining.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Category</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Cost</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map((item: any, i: number) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.category}</td>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitCost.toLocaleString()}</td>
          <td>$${item.amount.toLocaleString()}</td>
        </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr class="foot-row">
          <td colspan="5" style="text-align:right;padding-right:12px">Subtotal</td>
          <td>$${subtotal.toLocaleString()}</td>
        </tr>
        <tr class="foot-row">
          <td colspan="5" style="text-align:right;padding-right:12px">Tax (5%)</td>
          <td>$${tax.toFixed(2)}</td>
        </tr>
        <tr class="grand-row">
          <td colspan="5" style="text-align:right;padding-right:12px">Grand Total</td>
          <td>$${grand.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    <hr class="divider"/>
    <div class="footer">Generated by Travelloop · ${new Date().toDateString()}</div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};
