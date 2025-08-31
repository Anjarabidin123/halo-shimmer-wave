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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format harga tanpa simbol currency karena kita tulis manual
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return `
      <div style="font-family: monospace; max-width: 300px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>TOKO ANJAR FOTOCOPY & ATK</h2>
          <p>Jl. Raya Gajah - dempet (Depan Koramil Gajah)</p>
          <p>Telp/WA: 0895630183347</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h3>STRUK PENJUALAN</h3>
          <p>${receipt.id}</p>
          <p>${formatDate(receipt.timestamp)}</p>
        </div>
        
        <div style="border-top: 1px dashed #000; margin: 20px 0; padding-top: 10px;">
          ${receipt.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div>
                <div style="font-weight: bold;">${item.product.name}</div>
                <div style="font-size: 12px;">Rp ${formatAmount(item.finalPrice || item.product.sellPrice)} × ${item.quantity}</div>
              </div>
              <div style="font-weight: bold;">
                Rp ${formatAmount((item.finalPrice || item.product.sellPrice) * item.quantity)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="border-top: 1px dashed #000; margin: 20px 0; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>Rp ${formatAmount(receipt.subtotal)}</span>
          </div>
          ${receipt.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #dc2626;">
              <span>Diskon:</span>
              <span>-Rp ${formatAmount(receipt.discount)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
            <span>TOTAL:</span>
            <span>Rp ${formatAmount(receipt.total)}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Semoga Hari Anda Menyenangkan</p>
          <p style="margin-top: 10px;">Kasir: Admin | ${receipt.paymentMethod?.toUpperCase() || 'CASH'}</p>
        </div>
      </div>
    `;
};