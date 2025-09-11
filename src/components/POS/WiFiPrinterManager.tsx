import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Wifi, Printer, Search, Settings, FileText, Zap } from 'lucide-react';

interface WiFiPrinter {
  id: string;
  name: string;
  ip: string;
  model: string;
  status: 'online' | 'offline' | 'busy';
  paperSizes: string[];
  features: string[];
}

interface PrintSettings {
  paperSize: string;
  quality: 'draft' | 'normal' | 'high';
  darkness: number;
  copies: number;
  duplex: boolean;
  collate: boolean;
}

interface WiFiPrinterManagerProps {
  onPrint: (printerId: string, settings: PrintSettings, document: File) => Promise<boolean>;
}

export const WiFiPrinterManager = ({ onPrint }: WiFiPrinterManagerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredPrinters, setDiscoveredPrinters] = useState<WiFiPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<WiFiPrinter | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    paperSize: 'A4',
    quality: 'normal',
    darkness: 50,
    copies: 1,
    duplex: false,
    collate: false
  });

  // Mock printer discovery - in real implementation, this would scan network
  const scanForPrinters = async () => {
    setIsScanning(true);
    toast({
      title: "Mencari Printer WiFi",
      description: "Scanning jaringan untuk printer yang tersedia...",
    });

    try {
      // Simulate network scanning delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock discovered printers
      const mockPrinters: WiFiPrinter[] = [
        {
          id: 'canon-mg3600-001',
          name: 'Canon PIXMA MG3600',
          ip: '192.168.1.105',
          model: 'MG3600 Series',
          status: 'online',
          paperSizes: ['A4', 'A5', 'Letter', 'Legal'],
          features: ['Duplex', 'Color', 'High Quality']
        },
        {
          id: 'epson-l3210-002',
          name: 'Epson L3210',
          ip: '192.168.1.108',
          model: 'L3210 Series',
          status: 'online',
          paperSizes: ['A4', 'A5', 'Letter'],
          features: ['High Quality', 'Fast Print']
        },
        {
          id: 'hp-laserjet-003',
          name: 'HP LaserJet Pro',
          ip: '192.168.1.112',
          model: 'LaserJet Pro M404',
          status: 'busy',
          paperSizes: ['A4', 'A5', 'Letter', 'Legal'],
          features: ['Duplex', 'High Speed', 'Toner Save']
        }
      ];

      setDiscoveredPrinters(mockPrinters);
      toast({
        title: "Scan Selesai",
        description: `Ditemukan ${mockPrinters.length} printer WiFi`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal scan printer. Pastikan perangkat terhubung WiFi yang sama.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setDocument(file);
        toast({
          title: "File Dipilih",
          description: `${file.name} siap untuk dicetak`,
        });
      } else {
        toast({
          title: "Format Tidak Didukung",
          description: "Hanya file PDF dan gambar yang didukung",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrint = async () => {
    if (!selectedPrinter || !document) {
      toast({
        title: "Error",
        description: "Pilih printer dan file terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await onPrint(selectedPrinter.id, printSettings, document);
      if (success) {
        toast({
          title: "Print Berhasil",
          description: `Dokumen dikirim ke ${selectedPrinter.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Print Gagal",
        description: "Gagal mengirim dokumen ke printer",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Auto scan on component mount
    scanForPrinters();
  }, []);

  return (
    <div className="space-y-4">
      {/* WiFi Printer Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            WiFi Printer Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={scanForPrinters} 
            disabled={isScanning}
            className="w-full"
            variant="outline"
          >
            {isScanning ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Scanning Network...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Scan Ulang Printer WiFi
              </>
            )}
          </Button>

          {discoveredPrinters.length > 0 && (
            <div className="space-y-2">
              <Label>Printer Ditemukan:</Label>
              {discoveredPrinters.map((printer) => (
                <Card 
                  key={printer.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPrinter?.id === printer.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPrinter(printer)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Printer className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{printer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {printer.model} • {printer.ip}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={printer.status === 'online' ? 'default' : 
                                printer.status === 'busy' ? 'secondary' : 'destructive'}
                      >
                        {printer.status === 'online' ? 'Siap' : 
                         printer.status === 'busy' ? 'Sibuk' : 'Offline'}
                      </Badge>
                    </div>
                    {printer.features.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {printer.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Pilih Dokumen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
            />
            {document && (
              <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{document.name}</span>
                <Badge variant="outline">{(document.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Print Settings */}
      {selectedPrinter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Pengaturan Cetak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paper Size */}
            <div className="space-y-2">
              <Label>Ukuran Kertas</Label>
              <Select value={printSettings.paperSize} onValueChange={(value) => 
                setPrintSettings(prev => ({ ...prev, paperSize: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedPrinter.paperSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Print Quality */}
            <div className="space-y-2">
              <Label>Kualitas Cetak</Label>
              <Select value={printSettings.quality} onValueChange={(value: 'draft' | 'normal' | 'high') => 
                setPrintSettings(prev => ({ ...prev, quality: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Cepat)</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Quality (Lambat)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Darkness/Intensity */}
            <div className="space-y-3">
              <Label>Kehitaman Tulisan: {printSettings.darkness}%</Label>
              <Slider
                value={[printSettings.darkness]}
                onValueChange={(value) => setPrintSettings(prev => ({ ...prev, darkness: value[0] }))}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tipis</span>
                <span>Tebal</span>
              </div>
            </div>

            <Separator />

            {/* Advanced Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="duplex">Cetak Bolak-Balik</Label>
                <Switch
                  id="duplex"
                  checked={printSettings.duplex}
                  onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, duplex: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="collate">Susun Berurutan</Label>
                <Switch
                  id="collate"
                  checked={printSettings.collate}
                  onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, collate: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Print Button */}
      {selectedPrinter && document && (
        <Button 
          onClick={handlePrint}
          className="w-full"
          size="lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Cetak ke {selectedPrinter.name}
        </Button>
      )}
    </div>
  );
};