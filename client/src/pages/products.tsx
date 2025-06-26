import Navigation from "@/components/navigation";
import Products from "@/components/products";
import Footer from "@/components/footer";

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <Products />
      <Footer />
    </div>
  );
}
