import { Button } from "@/components/ui/button";
import HaloRing from "@/components/HaloRing";
import heroImage from "@/assets/halo-hero.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-bg">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      
      {/* Floating halo rings */}
      <div className="absolute top-20 left-10 opacity-60">
        <HaloRing size="sm" />
      </div>
      <div className="absolute top-32 right-20 opacity-40">
        <HaloRing size="md" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-50">
        <HaloRing size="lg" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main halo ring */}
        <div className="flex justify-center mb-8">
          <HaloRing size="xl" />
        </div>
        
        {/* Hero text */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 halo-text animate-glow-pulse">
          HALO
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the cosmic beauty of infinite possibilities. 
          Where light meets shadow, and dreams become reality.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cosmic" size="lg" className="animate-float">
            Enter the Halo
          </Button>
          <Button variant="aurora" size="lg" className="animate-float [animation-delay:0.5s]">
            Discover More
          </Button>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default Hero;