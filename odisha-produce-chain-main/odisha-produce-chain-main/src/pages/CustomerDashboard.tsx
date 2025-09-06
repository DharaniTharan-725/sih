import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Scan, CheckCircle, Calendar, MapPin, Star, DollarSign, LogOut, User, XCircle, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  productId: string;
  productName: string;
  category: string;
  dateOfManufacture: string;
  time: string;
  place: string;
  qualityRating: string;
  priceForFarmer: number;
  description: string;
  createdAt: string;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [verifiedProduct, setVerifiedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [qrInput, setQrInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Function to verify product from QR code data
  const verifyProduct = async (encryptedCode: string) => {
    setLoading(true);
    setVerificationError(null);
    setShowScanner(false);
    
    try {
      console.log("Verifying product with code:", encryptedCode);
      
      const response = await fetch(`http://localhost:8086/api/products/verify/${encodeURIComponent(encryptedCode)}`);
      const data = await response.json();
      
      console.log("Verification response:", data);
      
      // Handle both response formats
      if (response.ok) {
        if (data.success !== false && data.verified !== false) {
          // Product found and verified
          if (data.product) {
            setVerifiedProduct(data.product);
            toast({
              title: "Product Verified Successfully!",
              description: `Authentic product with ID ${data.product.productId} verified on blockchain.`,
            });
          } else {
            throw new Error("Product data missing from response");
          }
        } else {
          // Product found but verification failed
          throw new Error(data.error || "Product verification failed");
        }
      } else {
        // HTTP error
        throw new Error(data.error || `Server error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.message || "Unknown verification error";
      setVerificationError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle manual QR code input
  const handleManualVerify = () => {
    if (qrInput.trim()) {
      verifyProduct(qrInput.trim());
    } else {
      setVerificationError("Please enter a QR code value");
      toast({
        title: "Input Error",
        description: "Please enter a QR code value",
        variant: "destructive"
      });
    }
  };

  // Function to simulate QR code scanning (for demo purposes)
  const simulateCustomerScan = () => {
    // For demo, let's use a valid format that matches what the backend generates
    const mockEncryptedCode = "QUdSLTg4NGY0Y2N8T3JnYW5pYyBBcHBsZXN8Q2FsaWZvcm5pYSBGYXJtfDE3MzE2MTQ5ODA4OQ==";
    setQrInput(mockEncryptedCode);
    verifyProduct(mockEncryptedCode);
  };

  // Function to handle file upload (QR code image)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageDataUrl = e.target?.result as string;
          // Dynamically import html5-qrcode
          const { Html5Qrcode } = await import('html5-qrcode');
          const qr = new Html5Qrcode("qr-upload-temp");
          qr.scanFile(file, false)
            .then((decodedText: string) => {
              setQrInput(decodedText);
              verifyProduct(decodedText);
            })
            .catch((err: any) => {
              toast({
                title: "QR Code Error",
                description: "Could not decode QR code: " + err,
                variant: "destructive"
              });
            });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        toast({
          title: "QR Code Error",
          description: "Could not process QR code image.",
          variant: "destructive"
        });
      }
    }
  };

  // Function to get quality rating badge color
  const getQualityColor = (rating: string) => {
    switch (rating?.toLowerCase()) {
      case "premium": return "bg-green-100 text-green-800";
      case "excellent": return "bg-blue-100 text-blue-800";
      case "good": return "bg-yellow-100 text-yellow-800";
      case "standard": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
            <span className="text-sm bg-accent/50 text-accent-foreground px-2 py-1 rounded">Customer</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Customer Dashboard</h1>
          <p className="text-muted-foreground">Verify product authenticity and view complete supply chain history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Verification */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Scanner */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Product Verification
                </CardTitle>
                <CardDescription>
                  Scan the QR code on your product to verify its authenticity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <QrCode className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Scan the QR code to verify product authenticity
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={simulateCustomerScan} 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? "Verifying..." : "Simulate QR Scan (Demo)"}
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="qr-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="w-full">
                        Upload QR Code Image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Manual QR Input */}
                <div className="pt-4 border-t">
                  <Label htmlFor="qrInput" className="text-muted-foreground">Or enter QR code manually:</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      id="qrInput"
                      type="text"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="Paste QR code content here"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button 
                      onClick={handleManualVerify} 
                      disabled={loading || !qrInput.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {verificationError && (
              <Card className="bg-destructive/10 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">{verificationError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Details */}
            {verifiedProduct && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Verified Product Details
                  </CardTitle>
                  <CardDescription>
                    Complete product information verified on blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Product Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{verifiedProduct.productName}</h3>
                      <Badge variant="secondary" className="capitalize mt-1">
                        {verifiedProduct.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Product ID</p>
                      <p className="font-mono text-sm">{verifiedProduct.productId}</p>
                    </div>
                  </div>

                  {/* Farm Information */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Farm Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Date of Manufacture</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(verifiedProduct.dateOfManufacture)}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Time</Label>
                        <span>{verifiedProduct.time}</span>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Place</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{verifiedProduct.place}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Quality Rating</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Badge className={getQualityColor(verifiedProduct.qualityRating)}>
                            {verifiedProduct.qualityRating}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Pricing Information</h4>
                    </div>
                    <div className="text-sm">
                      <Label className="text-muted-foreground">Price for Farmer</Label>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        ₹{verifiedProduct.priceForFarmer?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div>
                    <Label className="text-muted-foreground">Product Description</Label>
                    <p className="text-sm mt-1 p-3 bg-muted/20 rounded-md">{verifiedProduct.description}</p>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">✓ Blockchain Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This product's information has been successfully verified on the blockchain. 
                      All details are authentic and tamper-proof.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Customer Info & Tips */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Verification Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Guaranteed product authenticity</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Complete supply chain transparency</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Quality assurance at every step</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Fair pricing verification</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Support for local farmers</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>How to Verify</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center mt-0.5">1</span>
                  <span>Click "Simulate QR Scan" for a demo verification</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center mt-0.5">2</span>
                  <span>View complete product history and verification</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center mt-0.5">3</span>
                  <span>Confirm product authenticity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;