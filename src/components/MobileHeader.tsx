import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, Globe } from 'lucide-react';
import { isMobile, getMobilePlatform } from '@/lib/mobile-thermal-printer';

export const MobileHeader = () => {
  if (!isMobile()) return null;

  const platform = getMobilePlatform();
  const isWebMobile = platform === 'web-mobile';

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isWebMobile ? (
            <Globe className="h-4 w-4 text-primary" />
          ) : (
            <Smartphone className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium text-primary">
            {isWebMobile ? 'Mode Mobile Browser' : 'Mode Mobile App'}
          </span>
          <Badge variant="secondary" className="text-xs">
            {platform.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-3 w-3" />
          <span>
            {isWebMobile ? 'Web Share Ready' : 'Printer Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};