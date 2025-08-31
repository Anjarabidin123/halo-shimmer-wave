import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

interface PrintOptions {
  text: string;
  title?: string;
}

export class MobileThermalPrinter {
  static async isAvailable(): Promise<boolean> {
    // Check if running as native app OR if web share API is available on mobile browser
    return Capacitor.isNativePlatform() || (this.isMobileBrowser() && 'share' in navigator);
  }

  static isMobileBrowser(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static async print(options: PrintOptions): Promise<void> {
    try {
      // Create a formatted text receipt that thermal printer apps can understand
      const formattedText = this.formatForThermalPrint(options.text);
      
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Share API for native apps
        await Share.share({
          title: options.title || 'Print Receipt',
          text: formattedText,
          dialogTitle: 'Pilih Aplikasi Printer',
        });
      } else if (this.isMobileBrowser() && 'share' in navigator) {
        // Use Web Share API for mobile browsers
        await navigator.share({
          title: options.title || 'Print Receipt',
          text: formattedText,
        });
      } else {
        // Fallback: copy to clipboard and show instructions
        await navigator.clipboard.writeText(formattedText);
        throw new Error('Nota telah disalin ke clipboard. Buka aplikasi printer thermal dan paste untuk mencetak.');
      }

    } catch (error) {
      console.error('Mobile printing error:', error);
      if (error.message.includes('clipboard')) {
        throw error;
      }
      throw new Error('Gagal mencetak via aplikasi printer. Pastikan aplikasi printer sudah terinstall.');
    }
  }

  private static formatForThermalPrint(text: string): string {
    // Format text for thermal printers with proper spacing and line breaks
    return text
      .replace(/\n/g, '\r\n')  // Use proper line endings for thermal printers
      .replace(/[\u00A0]/g, ' '); // Replace non-breaking spaces
  }

  static async printReceipt(receiptText: string, storeName: string = 'Toko'): Promise<void> {
    const formattedReceipt = `
${storeName}
${'='.repeat(32)}
${receiptText}
${'='.repeat(32)}
Terima kasih atas kunjungan Anda!

-- Cetak via ${storeName} POS --
`;

    await this.print({
      text: formattedReceipt,
      title: 'Cetak Nota - ' + storeName
    });
  }
}

// Check if running on mobile (native app or mobile browser)
export const isMobile = (): boolean => {
  return Capacitor.isNativePlatform() || MobileThermalPrinter.isMobileBrowser();
};

// Mobile-specific utilities
export const getMobilePlatform = (): string => {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform();
  } else if (MobileThermalPrinter.isMobileBrowser()) {
    return 'web-mobile';
  }
  return 'web';
};