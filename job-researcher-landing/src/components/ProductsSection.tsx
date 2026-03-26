import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Zap, Download, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ElementType;
  tag?: string;
  tagColor?: "yellow" | "red";
  includes?: string[];
}

const products: Product[] = [
  {
    id: "job-researcher-skill",
    name: "Job Researcher Skill",
    description: "Complete OpenClaw skill with 5 automation scripts. Scrape jobs, detect ghost listings, research companies, and track applications—all locally.",
    price: 29,
    originalPrice: 49,
    icon: Zap,
    tag: "Best Seller",
    tagColor: "yellow",
    includes: [
      "scrape-job.js — LinkedIn/Indeed scraper",
      "detect-ghost.js — Ghost job analyzer",
      "scrape-company.js — Company researcher",
      "job-tracker.js — Application CRM",
      "generate-report.js — Weekly digests",
    ],
  },
  {
    id: "strategy-guide",
    name: "The Automated Job Search Guide",
    description: "Complete strategy guide: ghost job detection, company research playbook, follow-up templates, and weekly rituals that get offers.",
    price: 19,
    icon: BookOpen,
    includes: [
      "Ghost job red flag checklist",
      "Company research framework",
      "Follow-up email templates",
      "Weekly ritual system",
      "Metrics tracking guide",
    ],
  },
  {
    id: "complete-bundle",
    name: "Complete Bundle",
    description: "Everything you need: the full automation skill + the strategy guide. The complete system for serious job seekers.",
    price: 39,
    originalPrice: 48,
    icon: FileText,
    tag: "Best Value",
    tagColor: "red",
    includes: [
      "All 5 automation scripts",
      "Complete strategy guide",
      "Email delivery within 24h",
      "Free updates",
      "30-day guarantee",
    ],
  },
];

const ProductCard = ({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card border border-border rounded-xl p-6 flex flex-col hover:-translate-y-1 hover:glow-border-red transition-all duration-300"
    >
      {product.tag && (
        <span
          className={`absolute -top-2.5 right-4 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            product.tagColor === "red"
              ? "bg-crab-red text-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {product.tag}
        </span>
      )}

      <product.icon
        className={`mb-4 ${product.tagColor === "red" ? "text-crab-red" : "text-primary"}`}
        size={26}
      />

      <h3 className="text-base font-bold mb-2 leading-tight">{product.name}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {product.description}
      </p>

      {product.includes && (
        <ul className="space-y-1 mb-5 text-xs text-muted-foreground">
          {product.includes.map((item) => (
            <li key={item} className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
        <Button
          size="sm"
          className="font-semibold gap-1.5 text-xs"
          onClick={() => onAdd(product)}
        >
          <ShoppingCart size={14} /> Add
        </Button>
      </div>
    </motion.div>
  );
};

const ProductsSection = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<Product[]>([]);

  const handleAdd = (product: Product) => {
    if (cart.find((p) => p.id === product.id)) {
      toast({ title: "Already in cart", description: `${product.name} is already added.` });
      return;
    }
    setCart((prev) => [...prev, product]);
    toast({ title: "Added to cart!", description: `${product.name} — $${product.price}` });
  };

  const cartTotal = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <section id="products" className="py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-crab-red/5 rounded-full blur-[180px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            Choose Your Package
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4">
            Get the system
          </h2>
          <p className="text-muted-foreground max-w-xl text-base md:text-lg">
            The automation skill does the work. The guide teaches the strategy. Together, they're unstoppable.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🔒 Secure checkout · 📧 Email delivery within 24h · 💯 30-day money-back guarantee</p>
        </div>

        {/* Floating Cart Bar */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl glow-border-yellow"
          >
            <div className="text-sm">
              <span className="text-muted-foreground">{cart.length} item{cart.length > 1 ? "s" : ""}</span>
              <span className="font-extrabold text-lg ml-3">${cartTotal}</span>
            </div>
            <Button className="font-semibold gap-2">
              Checkout <ArrowRight size={16} />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
