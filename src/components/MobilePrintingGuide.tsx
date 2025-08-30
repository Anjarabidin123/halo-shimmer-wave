import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Share, Printer, CheckCircle } from 'lucide-react';

export const MobilePrintingGuide = () => {
  return (
    <Card className="pos-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Mode Mobile - Cetak Thermal
          <Badge variant="secondary" className="ml-2">
            Mobile App
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Printer className="h-4 w-4" />
          <AlertDescription>
            Anda sedang menggunakan aplikasi mobile. Fitur cetak akan terhubung dengan aplikasi printer thermal di HP Anda.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Share className="h-4 w-4" />
            Cara Cetak di Mobile:
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                1
              </div>
              <span>Pastikan aplikasi printer thermal sudah terinstall di HP (misal: Bluetooth Thermal Printer, POS Printer, dll)</span>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                2
              </div>
              <span>Saat klik "Cetak", pilih aplikasi printer dari menu share</span>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                3
              </div>
              <span>Aplikasi printer akan otomatis format dan cetak nota</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Aplikasi Printer yang Direkomendasikan:
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Bluetooth Thermal Printer</div>
            <div>• POS Thermal Printer</div>
            <div>• Epson iPrint</div>
            <div>• StarPRNT</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};