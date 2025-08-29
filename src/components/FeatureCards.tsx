import { Card, CardContent } from "@/components/ui/card";
import HaloRing from "@/components/HaloRing";

const features = [
  {
    title: "Cosmic Energy",
    description: "Harness the power of infinite cosmic energy flowing through dimensional halos.",
    icon: "✨"
  },
  {
    title: "Dimensional Portals", 
    description: "Access parallel dimensions through stabilized halo gateways.",
    icon: "🌀"
  },
  {
    title: "Quantum Resonance",
    description: "Achieve perfect harmony with universal quantum frequencies.",
    icon: "⚛️"
  }
];

const FeatureCards = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 halo-text">
            Unlock the Power
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the extraordinary capabilities that await within the halo dimension.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card group hover:halo-glow transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <HaloRing size="md" animated={false} />
                </div>
                
                <div className="text-4xl mb-4">{feature.icon}</div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-10 right-10 opacity-20">
        <HaloRing size="lg" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-15">
        <HaloRing size="xl" />
      </div>
    </section>
  );
};

export default FeatureCards;