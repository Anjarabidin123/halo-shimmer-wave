import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

interface PrintOptions {
  text: string;
  title?: string;
}

export class MobileThermalPrinter {
  static async isAvailable(): Promise<boolean> {
    return Capacitor.isNativePlatform();
  }

  static async print(options: PrintOptions): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        throw new Error('Mobile printing only available on native platforms');
      }

      // Create a formatted text receipt that thermal printer apps can understand
      const formattedText = this.formatForThermalPrint(options.text);
      
      // Use Capacitor Share API to share with thermal printer apps
      await Share.share({
        title: options.title || 'Print Receipt',
        text: formattedText,
        dialogTitle: 'Pilih Aplikasi Printer',
      });

    } catch (error) {
      console.error('Mobile printing error:', error);
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

// Check if running on mobile
export const isMobile = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Mobile-specific utilities
export const getMobilePlatform = (): string => {
  return Capacitor.getPlatform();
};