import { Receipt as ReceiptType } from '@/types/pos';

export const formatThermalReceipt = (receipt: ReceiptType, formatPrice: (price: number) => string, paperWidth: number = 32): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // ESC/POS Commands untuk thermal printer
  const ESC = '\x1B';
  const GS = '\x1D';
  const INIT = ESC + '@';  // Initialize printer
  const BOLD_ON = ESC + 'E\x01';
  const BOLD_OFF = ESC + 'E\x00';
  const CENTER = ESC + 'a\x01';
  const LEFT = ESC + 'a\x00';
  const RIGHT = ESC + 'a\x02';
  const DOUBLE_HEIGHT = ESC + '!\x10';
  const NORMAL_SIZE = ESC + '!\x00';
  const CUT = GS + 'V\x42\x00';
  const LINE_FEED = '\n';
  
  // Format harga
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Helper untuk membuat garis
  const makeLine = (char: string = '=') => char.repeat(paperWidth);
  const makeDashedLine = () => '-'.repeat(paperWidth);
  
  // Helper untuk text dengan padding
  const padRight = (text: string, totalWidth: number) => {
    return text + ' '.repeat(Math.max(0, totalWidth - text.length));
  };
  
  const justifyText = (left: string, right: string, totalWidth: number) => {
    const availableSpace = totalWidth - left.length - right.length;
    return left + ' '.repeat(Math.max(1, availableSpace)) + right;
  };

  // Header toko
  let receipt_text = INIT + CENTER + DOUBLE_HEIGHT + BOLD_ON;
  receipt_text += 'TOKO ANJAR' + LINE_FEED;
  receipt_text += 'FOTOCOPY & ATK' + LINE_FEED;
  receipt_text += NORMAL_SIZE + BOLD_OFF;
  receipt_text += makeLine() + LINE_FEED;
  receipt_text += 'Jl. Raya Gajah - Dempet' + LINE_FEED;
  receipt_text += '(Depan Koramil Gajah)' + LINE_FEED;
  receipt_text += 'Telp/WA: 0895630183347' + LINE_FEED;
  receipt_text += makeLine() + LINE_FEED + LINE_FEED;

  // Header struk
  receipt_text += BOLD_ON + 'STRUK PENJUALAN' + BOLD_OFF + LINE_FEED;
  receipt_text += makeLine() + LINE_FEED;
  receipt_text += LEFT;
  receipt_text += justifyText('Invoice:', receipt.id, paperWidth) + LINE_FEED;
  receipt_text += justifyText('Tanggal:', formatDate(receipt.timestamp), paperWidth) + LINE_FEED;
  receipt_text += makeDashedLine() + LINE_FEED;

  // Items
  receipt.items.forEach(item => {
    const price = item.finalPrice || item.product.sellPrice;
    const total = price * item.quantity;
    const itemName = item.product.name;
    
    // Nama item (bold)
    receipt_text += BOLD_ON + itemName + BOLD_OFF + LINE_FEED;
    
    // Qty x Price = Total
    const qtyPrice = `${item.quantity} x Rp${formatAmount(price)}`;
    const totalPrice = `Rp${formatAmount(total)}`;
    receipt_text += justifyText(qtyPrice, totalPrice, paperWidth) + LINE_FEED;
    receipt_text += LINE_FEED; // Extra space between items
  });

  // Total section
  receipt_text += makeDashedLine() + LINE_FEED;
  receipt_text += justifyText('Subtotal:', `Rp${formatAmount(receipt.subtotal)}`, paperWidth) + LINE_FEED;
  
  if (receipt.discount > 0) {
    receipt_text += justifyText('Diskon:', `Rp${formatAmount(receipt.discount)}`, paperWidth) + LINE_FEED;
  }
  
  receipt_text += makeLine() + LINE_FEED;
  receipt_text += BOLD_ON + justifyText('TOTAL:', `Rp${formatAmount(receipt.total)}`, paperWidth) + BOLD_OFF + LINE_FEED;
  receipt_text += makeLine() + LINE_FEED + LINE_FEED;

  // Payment method
  receipt_text += justifyText('Metode:', (receipt.paymentMethod?.toUpperCase() || 'CASH'), paperWidth) + LINE_FEED + LINE_FEED;

  // Footer
  receipt_text += CENTER + BOLD_ON;
  receipt_text += 'TERIMA KASIH' + LINE_FEED;
  receipt_text += 'ATAS KUNJUNGAN ANDA!' + LINE_FEED + LINE_FEED;
  receipt_text += BOLD_OFF;
  receipt_text += 'Semoga Hari Anda' + LINE_FEED;
  receipt_text += 'Menyenangkan' + LINE_FEED;
  receipt_text += makeLine() + LINE_FEED + LINE_FEED + LINE_FEED;

  // Cut paper
  receipt_text += CUT;

  return receipt_text;
};

export const formatPrintReceipt = (receipt: ReceiptType, formatPrice: (price: number) => string): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format harga
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Struk Penjualan</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #000;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
      }
    }
    
    body {
      font-family: 'Arial', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background: white;
      color: #000;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      border: 2px solid #000;
    }
    
    .center { 
      text-align: center; 
      margin-bottom: 20px;
    }
    
    .bold { 
      font-weight: bold; 
    }
    
    .header-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    
    .header-subtitle {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .address {
      font-size: 18px;
      margin-bottom: 30px;
    }
    
    .invoice-title {
      font-size: 22px;
      font-weight: bold;
      margin: 30px 0 20px 0;
    }
    
    .invoice-info {
      font-size: 18px;
      margin-bottom: 30px;
    }
    
    .line { 
      border-top: 2px solid #000; 
      margin: 20px 0; 
    }
    
    .dashed-line {
      border-top: 2px dashed #000;
      margin: 20px 0;
    }
    
    .flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 18px;
    }
    
    .item-section {
      margin: 30px 0;
    }
    
    .item-row {
      margin-bottom: 20px;
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
    }
    
    .item-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .item-details {
      font-size: 18px;
      color: #666;
    }
    
    .item-total {
      font-size: 20px;
      font-weight: bold;
      text-align: right;
    }
    
    .total-section {
      border-top: 3px solid #000;
      padding-top: 20px;
      margin-top: 30px;
      font-size: 20px;
    }
    
    .grand-total {
      font-size: 26px;
      font-weight: bold;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #000;
    }
    
    .footer {
      margin-top: 40px;
      font-size: 18px;
    }
    
    .thank-you {
      font-size: 22px;
      font-weight: bold;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="center">
      <div class="header-title">TOKO ANJAR</div>
      <div class="header-subtitle">FOTOCOPY & ATK</div>
      
      <div class="address">
        Jl. Raya Gajah - Dempet<br>
        (Depan Koramil Gajah)<br>
        Telp/WA: 0895630183347
      </div>
    </div>
    
    <div class="line"></div>
    
    <div class="center">
      <div class="invoice-title">STRUK PENJUALAN</div>
      
      <div class="invoice-info">
        <div class="flex">
          <span>Invoice:</span>
          <span class="bold">${receipt.id}</span>
        </div>
        
        <div class="flex">
          <span>Tanggal:</span>
          <span class="bold">${formatDate(receipt.timestamp)}</span>
        </div>
      </div>
    </div>
    
    <div class="dashed-line"></div>
    
    <div class="item-section">
      ${receipt.items.map(item => {
        const price = item.finalPrice || item.product.sellPrice;
        const total = price * item.quantity;
        return `
        <div class="item-row">
          <div class="item-name">${item.product.name}</div>
          <div class="flex">
            <div class="item-details">
              ${item.quantity} x Rp ${formatAmount(price)}
            </div>
            <div class="item-total">
              Rp ${formatAmount(total)}
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>
    
    <div class="total-section">
      <div class="flex">
        <span>Subtotal:</span>
        <span class="bold">Rp ${formatAmount(receipt.subtotal)}</span>
      </div>
      
      ${receipt.discount > 0 ? `
      <div class="flex" style="color: #dc2626;">
        <span>Diskon:</span>
        <span class="bold">-Rp ${formatAmount(receipt.discount)}</span>
      </div>
      ` : ''}
      
      <div class="grand-total">
        <div class="flex">
          <span>TOTAL:</span>
          <span>Rp ${formatAmount(receipt.total)}</span>
        </div>
      </div>
    </div>
    
    <div class="dashed-line"></div>
    
    <div class="footer">
      <div class="flex">
        <span>Metode Pembayaran:</span>
        <span class="bold">${receipt.paymentMethod?.toUpperCase() || 'CASH'}</span>
      </div>
    </div>
    
    <div class="center thank-you">
      TERIMA KASIH<br>
      ATAS KUNJUNGAN ANDA!<br><br>
      <div style="font-size: 20px;">
        Semoga Hari Anda Menyenangkan
      </div>
    </div>
  </div>
</body>
</html>
    `;
};