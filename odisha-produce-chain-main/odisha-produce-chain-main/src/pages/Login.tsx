import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, User, Store, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roles = [
    {
      id: "farmer",
      name: "Farmer",
      icon: Leaf,
      description: "Register products and manage your farm's supply chain",
      color: "farmer",
      route: "/farmer-dashboard"
    },
    {
      id: "retailer", 
      name: "Retailer",
      icon: Store,
      description: "Update product information and manage retail operations",
      color: "retail",
      route: "/retailer-dashboard"
    },
    {
      id: "customer",
      name: "Customer",
      icon: ShoppingCart,
      description: "Verify product authenticity and view supply chain history",
      color: "scan",
      route: "/customer-dashboard"
    }
  ];

  const handleLogin = () => {
    // For demo purposes, directly navigate to the appropriate dashboard
    const role = roles.find(r => r.id === selectedRole);
    if (role) {
      navigate(role.route);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AgriChain</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Choose your role and sign in to continue</p>
        </div>

        <Card className="bg-gradient-card border-border shadow-agricultural">
          <CardHeader>
            <CardTitle className="text-center">Select Your Role</CardTitle>
            <CardDescription className="text-center">
              Different roles have different access levels and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={setSelectedRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                {roles.map((role) => (
                  <TabsTrigger key={role.id} value={role.id}>
                    <role.icon className="h-4 w-4" />
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {roles.map((role) => (
                <TabsContent key={role.id} value={role.id} className="mt-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <role.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                variant={selectedRole === "farmer" ? "farmer" : selectedRole === "retailer" ? "retail" : "scan"}
                className="w-full"
                onClick={handleLogin}
              >
                Sign In as {roles.find(r => r.id === selectedRole)?.name}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button className="text-primary hover:underline">
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;