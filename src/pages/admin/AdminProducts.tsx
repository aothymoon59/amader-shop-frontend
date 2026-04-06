import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: "$89.99", stock: 45, vendor: "TechStore" },
  { id: 2, name: "Cotton Tee", category: "Fashion", price: "$34.99", stock: 120, vendor: "EcoWear" },
  { id: 3, name: "Smart Speaker", category: "Electronics", price: "$129.99", stock: 30, vendor: "SmartLife" },
  { id: 4, name: "Running Shoes", category: "Sports", price: "$119.99", stock: 67, vendor: "FitGear" },
  { id: 5, name: "Ceramic Vase", category: "Home", price: "$49.99", stock: 88, vendor: "HomeArt" },
];

const AdminProducts = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button variant="hero"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-10" />
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Stock</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3 font-medium">{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-muted-foreground">{p.vendor}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminProducts;
