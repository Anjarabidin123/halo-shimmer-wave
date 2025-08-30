import { MobileThermalPrinter, isMobile } from './mobile-thermal-printer';

// Type declarations for Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: any): Promise<BluetoothDevice>;
    };
  }
  
  interface BluetoothDevice {
    gatt?: BluetoothRemoteGATT;
  }
  
  interface BluetoothRemoteGATT {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): Promise<void>;
  }
  
  interface BluetoothRemoteGATTServer {
    getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>;
  }
  
  interface BluetoothRemoteGATTService {
    uuid: string;
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
  }
  
  interface BluetoothRemoteGATTCharacteristic {
    uuid: string;
    properties: {
      write: boolean;
      writeWithoutResponse: boolean;
    };
    writeValue(value: ArrayBuffer): Promise<void>;
  }
}

export class ThermalPrinter {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async connect(): Promise<boolean> {
    try {
      // If running on mobile, use mobile printing
      if (isMobile()) {
        return await MobileThermalPrinter.isAvailable();
      }

      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported');
      }

      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Generic thermal printer service
          { namePrefix: 'MTP-' }, // Common thermal printer prefix
          { namePrefix: 'POS-' },
          { namePrefix: 'EPSON' },
          { namePrefix: 'STAR' },
        ],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4ae5-8fa9-9fafd205e455']
      });

      if (!this.device.gatt) {
        throw new Error('GATT not available');
      }

      const server = await this.device.gatt.connect();
      console.log('Connected to Bluetooth printer');

      // Try common service UUIDs
      const services = await server.getPrimaryServices();
      console.log('Available services:', services);

      for (const service of services) {
        try {
          const characteristics = await service.getCharacteristics();
          for (const char of characteristics) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              this.characteristic = char;
              console.log('Found writable characteristic:', char.uuid);
              return true;
            }
          }
        } catch (e) {
          console.log('Error getting characteristics for service:', service.uuid);
        }
      }

      throw new Error('No writable characteristic found');
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      return false;
    }
  }

  async print(text: string): Promise<boolean> {
    try {
      // If running on mobile, use mobile printing
      if (isMobile()) {
        await MobileThermalPrinter.printReceipt(text);
        return true;
      }

      if (!this.characteristic) {
        const connected = await this.connect();
        if (!connected) return false;
      }
      // ESC/POS commands for thermal printing
      const ESC = '\x1B';
      const GS = '\x1D';
      
      // Initialize printer
      let commands = ESC + '@'; // Initialize
      commands += ESC + 'a' + '\x01'; // Center align
      
      // Add the text content
      commands += text;
      
      // Cut paper and eject
      commands += '\n\n\n';
      commands += GS + 'V' + '\x42' + '\x00'; // Partial cut
      
      const encoder = new TextEncoder();
      const data = encoder.encode(commands);
      
      if (this.characteristic) {
        // Split data into chunks of 512 bytes or less
        const chunkSize = 512;
        const chunks: Uint8Array[] = [];
        
        for (let i = 0; i < data.length; i += chunkSize) {
          chunks.push(data.slice(i, i + chunkSize));
        }
        
        // Send each chunk with a small delay
        for (const chunk of chunks) {
          await this.characteristic.writeValue(chunk);
          // Small delay between chunks to ensure proper transmission
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        console.log(`Print command sent successfully in ${chunks.length} chunks`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to print:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device && this.device.gatt?.connected) {
      await this.device.gatt.disconnect();
      console.log('Disconnected from printer');
    }
    this.device = null;
    this.characteristic = null;
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false;
  }
}

export const thermalPrinter = new ThermalPrinter();