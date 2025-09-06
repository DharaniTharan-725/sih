import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Shield, Users, QrCode, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/agricultural-hero.jpg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Leaf,
      title: "Farm to Table Tracking",
      description: "Complete transparency from farmer to consumer with blockchain-verified records"
    },
    {
      icon: Shield,
      title: "Fraud Prevention",
      description: "Immutable records ensure authenticity and prevent supply chain manipulation"
    },
    {
      icon: Users,
      title: "Multi-Stakeholder Platform",
      description: "Dedicated dashboards for farmers, retailers, and consumers with role-based access"
    },
    {
      icon: QrCode,
      title: "QR Code Verification",
      description: "Instant product verification through QR code scanning and blockchain lookup"
    }
  ];

  const benefits = [
    "Transparent pricing ensures fair compensation for farmers",
    "Quality verification at every step of the supply chain", 
    "Reduced food fraud and counterfeit products",
    "Consumer trust through complete product history",
    "Efficient supply chain management and tracking"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
          <Button variant="hero" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Blockchain-Powered
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Agricultural Transparency
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Track your produce from farm to table with complete transparency, ensuring fair pricing and authentic quality for all stakeholders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
              Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Revolutionary Supply Chain Transparency
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our blockchain-based platform ensures every product's journey is recorded, verified, and transparent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-agricultural transition-all duration-300">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Why Choose AgriChain?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    <p className="text-lg text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-card p-8 rounded-lg border border-border shadow-card">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Get Started Today</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of farmers, retailers, and consumers creating a transparent agricultural supply chain.
              </p>
              <Button variant="hero" size="lg" className="w-full" onClick={() => navigate("/login")}>
                Join AgriChain Platform
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">AgriChain</span>
          </div>
          <p className="text-muted-foreground">
            Building trust through transparency in agricultural supply chains
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;