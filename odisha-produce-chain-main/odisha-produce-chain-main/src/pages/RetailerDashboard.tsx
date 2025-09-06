import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Store, Scan, Package, Edit, LogOut, Calendar, MapPin, Star, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [retailerData, setRetailerData] = useState({
    retailPrice: "",
    retailerQuality: "",
    retailerLocation: "",
    additionalNotes: ""
  });

  // Mock function to simulate QR code scanning
  const simulateQRScan = () => {
    // Simulate scanning a product that was created by farmer
    const mockProduct = {
      productId: "AGR-1703520000000",
      productName: "Organic Tomatoes",
      category: "vegetables",
      dateOfManufacture: "2024-01-15",
      time: "08:30",
      place: "Green Valley Farm, Maharashtra",
      qualityRating: "premium",
      priceForFarmer: "45.00",
      description: "Fresh organic tomatoes grown using sustainable farming practices",
      farmerAddress: "0x742d35cc6ab...8bcc",
      blockHash: "0xabc12345",
      status: "Farmer Registered",
      timestamp: "2024-01-15T08:30:00.000Z"
    };
    
    setScannedProduct(mockProduct);
    toast({
      title: "QR Code Scanned Successfully!",
      description: `Product ${mockProduct.productId} details loaded.`,
    });
  };

  const updateProductInfo = () => {
    if (!scannedProduct) return;

    // Update the product with retailer information
    const updatedProduct = {
      ...scannedProduct,
      retailPrice: retailerData.retailPrice,
      retailerQuality: retailerData.retailerQuality,
      retailerLocation: retailerData.retailerLocation,
      additionalNotes: retailerData.additionalNotes,
      retailerAddress: "0x8bcc35ab6cc...742d",
      retailerTimestamp: new Date().toISOString(),
      status: "Retailer Updated"
    };

    // Store updated product
    localStorage.setItem(`product_${scannedProduct.productId}`, JSON.stringify(updatedProduct));
    
    toast({
      title: "Product Updated Successfully!",
      description: "Retailer information has been added to the blockchain.",
    });

    // Reset form
    setRetailerData({
      retailPrice: "",
      retailerQuality: "",
      retailerLocation: "",
      additionalNotes: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
            <span className="text-sm bg-warning/10 text-warning px-2 py-1 rounded">Retailer</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Retailer Dashboard</h1>
          <p className="text-muted-foreground">Scan products and update retail information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Scanner & Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Scanner */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>
                  Scan product QR codes to view and update information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Scan className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Position the QR code within the frame to scan
                  </p>
                  <Button variant="retail" onClick={simulateQRScan}>
                    Simulate QR Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scanned Product Details */}
            {scannedProduct && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                  <CardDescription>
                    Original farmer data (Read-only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Product Name</Label>
                      <p className="font-semibold">{scannedProduct.productName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <Badge variant="secondary" className="capitalize">
                        {scannedProduct.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Harvest Date</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{scannedProduct.dateOfManufacture} at {scannedProduct.time}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Farm Location</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{scannedProduct.place}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Farmer Quality Rating</Label>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="capitalize">{scannedProduct.qualityRating}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Farmer Price</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{scannedProduct.priceForFarmer}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm">{scannedProduct.description}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Blockchain Status</Label>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      {scannedProduct.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Retailer Update Form */}
            {scannedProduct && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Update Retail Information
                  </CardTitle>
                  <CardDescription>
                    Add your retail data to the supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retailPrice">Retail Price (₹) *</Label>
                      <Input
                        id="retailPrice"
                        type="number"
                        placeholder="0.00"
                        value={retailerData.retailPrice}
                        onChange={(e) => setRetailerData(prev => ({ ...prev, retailPrice: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retailerQuality">Updated Quality Rating</Label>
                      <Select 
                        value={retailerData.retailerQuality} 
                        onValueChange={(value) => setRetailerData(prev => ({ ...prev, retailerQuality: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Verify quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premium">Premium (A+)</SelectItem>
                          <SelectItem value="excellent">Excellent (A)</SelectItem>
                          <SelectItem value="good">Good (B+)</SelectItem>
                          <SelectItem value="standard">Standard (B)</SelectItem>
                          <SelectItem value="poor">Poor (C)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retailerLocation">Store Location *</Label>
                    <Input
                      id="retailerLocation"
                      placeholder="e.g., Fresh Market, Mumbai"
                      value={retailerData.retailerLocation}
                      onChange={(e) => setRetailerData(prev => ({ ...prev, retailerLocation: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Input
                      id="additionalNotes"
                      placeholder="Storage conditions, handling notes..."
                      value={retailerData.additionalNotes}
                      onChange={(e) => setRetailerData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    />
                  </div>

                  <Button variant="retail" onClick={updateProductInfo} className="w-full">
                    Update Product Information
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Retailer Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Your Store Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Products Processed</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monthly Revenue</span>
                  <span className="font-semibold">₹2,34,560</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold">4.6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quality Score</span>
                  <Badge variant="outline" className="bg-success/10 text-success">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">Updated Organic Carrots</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-muted-foreground">Scanned Fresh Spinach</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">Updated Apple Batch #123</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;