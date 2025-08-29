import { cn } from "@/lib/utils";

interface HaloRingProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

const HaloRing = ({ size = "md", className, animated = true }: HaloRingProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer halo ring */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full border-2 border-halo-primary halo-glow",
          animated && "animate-halo-pulse"
        )}
      />
      
      {/* Secondary ring */}
      <div 
        className={cn(
          "absolute inset-2 rounded-full border border-halo-accent/60",
          animated && "animate-halo-rotate"
        )}
        style={{
          boxShadow: "inset 0 0 20px hsl(var(--halo-accent) / 0.3)"
        }}
      />
      
      {/* Inner core */}
      <div 
        className={cn(
          "absolute inset-6 rounded-full bg-gradient-cosmic",
          animated && "animate-float"
        )}
        style={{
          boxShadow: "0 0 30px hsl(var(--halo-primary) / 0.6)"
        }}
      />
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground animate-glow-pulse" />
    </div>
  );
};

export default HaloRing;