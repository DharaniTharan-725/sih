import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FarmerDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [productId, setProductId] = useState("");
  
  const [productData, setProductData] = useState({
    productName: "",
    dateOfManufacture: "",
    time: "",
    place: "",
    qualityRating: "",
    priceForFarmer: "",
    productId: "",
    description: "",
    category: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const registerProduct = async () => {
    setLoading(true);
    try {
      console.log("Sending product data:", productData);
      
      const response = await fetch('http://localhost:8086/api/products/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productData.productName,
          category: productData.category,
          dateOfManufacture: productData.dateOfManufacture,
          time: productData.time,
          place: productData.place,
          qualityRating: productData.qualityRating,
          priceForFarmer: parseFloat(productData.priceForFarmer),
          description: productData.description,
          productId: productData.productId || undefined
        })
      });

      let data;
      try {
        data = await response.json();
        console.log("Response from server:", data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Server did not return valid JSON. Please check backend.");
      }

      if (response.ok && data && data.qrCode && data.product) {
        setQrCode(data.qrCode);
        setProductId(data.product.productId);
        toast({
          title: "Product Registered Successfully!",
          description: `Product ${data.product.productId} has been added to the blockchain.`,
        });
      } else {
        throw new Error((data && data.error) || 'Failed to register product');
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setProductData({
      productName: "",
      dateOfManufacture: "",
      time: "",
      place: "",
      qualityRating: "",
      priceForFarmer: "",
      productId: "",
      description: "",
      category: ""
    });
    setQrCode(null);
    setProductId("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Register Product</CardTitle>
          <CardDescription>Enter product details to register and generate QR code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); registerProduct(); }}>
            <div>
              <Label>Product Name</Label>
              <Input value={productData.productName} onChange={e => handleInputChange("productName", e.target.value)} required />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={productData.category} onChange={e => handleInputChange("category", e.target.value)} required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Date of Manufacture</Label>
                <Input type="date" value={productData.dateOfManufacture} onChange={e => handleInputChange("dateOfManufacture", e.target.value)} required />
              </div>
              <div className="flex-1">
                <Label>Time</Label>
                <Input type="time" value={productData.time} onChange={e => handleInputChange("time", e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Place</Label>
              <Input value={productData.place} onChange={e => handleInputChange("place", e.target.value)} required />
            </div>
            <div>
              <Label>Quality Rating</Label>
              <Input value={productData.qualityRating} onChange={e => handleInputChange("qualityRating", e.target.value)} required />
            </div>
            <div>
              <Label>Price for Farmer</Label>
              <Input type="number" value={productData.priceForFarmer} onChange={e => handleInputChange("priceForFarmer", e.target.value)} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={productData.description} onChange={e => handleInputChange("description", e.target.value)} required />
            </div>
            <div>
              <Label>Product ID (optional)</Label>
              <Input value={productData.productId} onChange={e => handleInputChange("productId", e.target.value)} />
            </div>
            <div className="flex gap-4 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Register on Blockchain
                  </>
                )}
              </Button>
              <Button type="button" onClick={resetForm}>
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {qrCode && (
        <div className="mt-6 w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Product QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Product ID: {productId}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;