import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Receipt as ReceiptIcon, CreditCard, Percent, Copy } from 'lucide-react';
import { Receipt as ReceiptType } from '@/types/pos';
import { toast } from 'sonner';

interface ManualItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ManualInvoiceProps {
  onCreateInvoice: (receipt: ReceiptType) => void;
  formatPrice: (price: number) => string;
  receipts: ReceiptType[];
}

export const ManualInvoice = ({ onCreateInvoice, formatPrice, receipts }: ManualInvoiceProps) => {
  const [items, setItems] = useState<ManualItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    isPhotocopy: false
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');

  const photocopyTypes = [
    'Fotocopy',
    'Fotocopy Bufalo', 
    'Fotocopy Buku',
    'Fotocopy A3'
  ];

  const addItem = () => {
    if (!currentItem.name || currentItem.quantity <= 0) {
      toast.error('Nama barang dan jumlah harus diisi!');
      return;
    }

    let finalPrice = 0;
    let finalUnitPrice = 0;

    if (currentItem.isPhotocopy) {
      // For photocopy, use total price directly
      if (currentItem.totalPrice <= 0) {
        toast.error('Total harga fotocopy harus diisi!');
        return;
      }
      finalPrice = currentItem.totalPrice;
      finalUnitPrice = currentItem.totalPrice / currentItem.quantity;
    } else {
      // For regular items, use unit price
      if (currentItem.unitPrice <= 0) {
        toast.error('Harga satuan harus diisi!');
        return;
      }
      finalUnitPrice = currentItem.unitPrice;
      finalPrice = currentItem.quantity * currentItem.unitPrice;
    }

    const newItem: ManualItem = {
      id: Date.now().toString(),
      name: currentItem.name,
      quantity: currentItem.quantity,
      unitPrice: finalUnitPrice,
      total: finalPrice
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({ 
      name: '', 
      quantity: 0, 
      unitPrice: 0, 
      totalPrice: 0, 
      isPhotocopy: false 
    });
  };

  const selectPhotocopyType = (type: string) => {
    setCurrentItem(prev => ({
      ...prev,
      name: type,
      isPhotocopy: true,
      unitPrice: 0,
      totalPrice: 0
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return;
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discountType === 'percent' 
    ? Math.round(subtotal * (discount / 100))
    : discount;
  const total = Math.max(0, subtotal - discountAmount);

  const handleCreateInvoice = () => {
    if (items.length === 0) {
      toast.error('Tambahkan minimal satu item!');
      return;
    }

    // Generate invoice ID
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const dateStr = `${day}${month}${year}`;
    const counter = receipts.length + 1;
    const invoiceId = `MANUAL-${counter}${dateStr}`;

    // Convert manual items to cart items format
    const cartItems = items.map(item => ({
      product: {
        id: item.id,
        name: item.name,
        costPrice: 0, // No cost price for manual items
        sellPrice: item.unitPrice,
        stock: 0,
        category: 'Manual',
        isPhotocopy: false
      },
      quantity: item.quantity,
      finalPrice: item.unitPrice
    }));

    const receipt: ReceiptType = {
      id: invoiceId,
      items: cartItems,
      subtotal,
      discount: discountAmount,
      total,
      profit: total, // All manual invoice income is profit since no cost
      timestamp: new Date(),
      paymentMethod
    };

    onCreateInvoice(receipt);
    
    // Reset form
    setItems([]);
    setCurrentItem({ 
      name: '', 
      quantity: 0, 
      unitPrice: 0, 
      totalPrice: 0, 
      isPhotocopy: false 
    });
    setDiscount(0);
    setPaymentMethod('cash');
    
    toast.success(`Nota manual ${invoiceId} berhasil dibuat!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Item Form */}
      <div className="lg:col-span-2">
        <Card className="pos-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5" />
              Nota Manual - Input Barang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photocopy Quick Select */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Pilih Cepat Fotocopy:
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {photocopyTypes.map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => selectPhotocopyType(type)}
                    className="text-xs"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="itemName">Nama Barang</Label>
                <Input
                  id="itemName"
                  placeholder="Masukkan nama barang..."
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem(prev => ({ 
                    ...prev, 
                    name: e.target.value,
                    isPhotocopy: photocopyTypes.includes(e.target.value)
                  }))}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={currentItem.quantity || ''}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: Number(e.target.value) || 0 }))}
                />
              </div>
              <div>
                {currentItem.isPhotocopy ? (
                  <>
                    <Label htmlFor="totalPrice">Total Harga</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentItem.totalPrice || ''}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, totalPrice: Number(e.target.value) || 0 }))}
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                  </>
                ) : (
                  <>
                    <Label htmlFor="unitPrice">Harga Satuan</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentItem.unitPrice || ''}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, unitPrice: Number(e.target.value) || 0 }))}
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {currentItem.isPhotocopy ? (
                  <>Total: {formatPrice(currentItem.totalPrice)}</>
                ) : (
                  <>Total: {formatPrice(currentItem.quantity * currentItem.unitPrice)}</>
                )}
                {currentItem.isPhotocopy && (
                  <div className="text-xs text-primary">
                    Mode Fotocopy - Input total harga langsung
                  </div>
                )}
              </div>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        {items.length > 0 && (
          <Card className="pos-card mt-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Daftar Item</span>
                <Badge variant="secondary">{items.length} item</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {item.name}
                        {photocopyTypes.includes(item.name) && (
                          <Badge variant="secondary" className="text-xs">
                            <Copy className="w-3 h-3 mr-1" />
                            Fotocopy
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          +
                        </Button>
                      </div>
                      <div className="font-semibold min-w-[80px] text-right">
                        {formatPrice(item.total)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invoice Summary */}
      <div>
        <Card className="pos-card">
          <CardHeader>
            <CardTitle>Ringkasan Nota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="debit">Kartu Debit</SelectItem>
                  <SelectItem value="credit">Kartu Kredit</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Diskon
              </Label>
              <div className="flex gap-2">
                <Select value={discountType} onValueChange={(value: 'amount' | 'percent') => setDiscountType(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">Rp</SelectItem>
                    <SelectItem value="percent">%</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  min="0"
                  max={discountType === 'percent' ? 100 : subtotal}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Diskon:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleCreateInvoice}
              disabled={items.length === 0}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Buat Nota Manual
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              Nota manual akan tercatat di laporan penjualan hari ini
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};