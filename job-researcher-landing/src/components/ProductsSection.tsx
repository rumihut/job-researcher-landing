import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Zap, BookOpen, Cpu, Mic, MessageSquare, Target, BarChart3, Layers, Bot, FileText, Briefcase, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ElementType;
  tag?: string;
  tagColor?: "yellow" | "red";
  stripeUrl?: string;
  details?: {
    features: string[];
    requirements: string[];
    includes: string[];
  };
}

const products: Product[] = [
  {
    id: "lead-capture-playbook",
    name: "AI Lead Capture Playbook",
    description: "Build automated funnels that capture and qualify leads 24/7 without manual effort.",
    price: 29,
    originalPrice: 49,
    icon: Target,
    tag: "Bestseller",
    tagColor: "yellow",
  },
  {
    id: "automation-blueprints",
    name: "Automation Blueprints",
    description: "Plug-and-play workflows to connect your tools and eliminate repetitive tasks.",
    price: 39,
    icon: Cpu,
  },
  {
    id: "conversion-scripts",
    name: "Conversion Script Pack",
    description: "Battle-tested scripts for chatbots, SMS follow-ups, and email sequences that close.",
    price: 24,
    icon: MessageSquare,
  },
  {
    id: "voice-ai-guide",
    name: "Voice AI Setup Guide",
    description: "Deploy voice agents that answer calls, qualify leads, and book appointments.",
    price: 34,
    originalPrice: 59,
    icon: Mic,
    tag: "Hot",
    tagColor: "red",
  },
  {
    id: "chatbot-builder",
    name: "Chatbot Builder Kit",
    description: "Train a 24/7 AI chatbot on your business data to handle FAQs and book meetings.",
    price: 29,
    icon: Bot,
  },
  {
    id: "funnel-templates",
    name: "High-Converting Funnels",
    description: "Pre-built funnel templates designed to maximize opt-ins and reduce drop-off.",
    price: 19,
    icon: Layers,
  },
  {
    id: "job-researcher-skill",
    name: "Job Researcher Skill",
    description: "Detect ghost jobs, research companies, and track applications with OpenClaw automation.",
    price: 29,
    originalPrice: 48,
    icon: Briefcase,
    tag: "New",
    tagColor: "yellow",
    stripeUrl: "https://buy.stripe.com/5kQ7sNfbib7acq08Nz4F205",
    details: {
      features: [
        "Scrape LinkedIn/Indeed job postings automatically",
        "Detect ghost jobs with AI scoring (0-100)",
        "Research companies for red flags and layoffs",
        "Track applications with smart reminders",
        "Generate weekly pipeline reports",
      ],
      requirements: [
        "OpenClaw v2.0+",
        "Tandem Browser",
        "Node.js v18+",
      ],
      includes: [
        "5 automation scripts (scrape, analyze, research, track, report)",
        "30+ page strategy guide",
        "Follow-up email templates",
        "Ghost job detection checklist",
        "Email delivery within 24h",
      ],
    },
  },
  {
    id: "analytics-playbook",
    name: "Analytics & Tracking Guide",
    description: "Set up end-to-end analytics to know exactly where your leads come from and convert.",
    price: 22,
    icon: BarChart3,
  },
  {
    id: "sms-marketing",
    name: "SMS Marketing Playbook",
    description: "Automated text-back sequences that re-engage missed calls within seconds.",
    price: 27,
    icon: Zap,
  },
  {
    id: "email-sequences",
    name: "Email Sequence Vault",
    description: "Proven email nurture sequences that warm leads and drive repeat purchases.",
    price: 24,
    icon: FileText,
  },
  {
    id: "ai-content-engine",
    name: "AI Content Engine",
    description: "Generate weeks of social media, blog, and ad content in minutes with AI prompts.",
    price: 34,
    originalPrice: 49,
    icon: BookOpen,
    tag: "New",
    tagColor: "yellow",
  },
];

const ProductCard = ({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative bg-card border border-border rounded-xl p-6 flex flex-col hover:-translate-y-1 hover:glow-border-red transition-all duration-300 cursor-pointer"
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
          <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              Click for details →
            </span>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <product.icon className={`${product.tagColor === "red" ? "text-crab-red" : "text-primary"}`} size={32} />
            <DialogTitle className="text-xl">{product.name}</DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-semibold mb-2">What you get:</p>
            <ul className="space-y-1.5">
              {product.details?.includes ? (
                product.details.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  Complete playbook/guide with step-by-step instructions
                </li>
              )}
            </ul>
          </div>

          {product.details?.features && (
            <div>
              <p className="text-sm font-semibold mb-2">Key features:</p>
              <ul className="space-y-1">
                {product.details.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.details?.requirements && (
            <div>
              <p className="text-sm font-semibold mb-2">Requirements:</p>
              <ul className="space-y-1">
                {product.details.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-crab-red mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">One-time purchase</span>
            </div>
            {product.stripeUrl ? (
              <a 
                href={product.stripeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Buy Now <ArrowRight size={16} />
              </a>
            ) : (
              <Button className="w-full font-semibold gap-2" onClick={() => { onAdd(product); setIsModalOpen(false); }}>
                <ShoppingCart size={16} /> Add to Cart
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
            The Store
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4">
            Grab what you need
          </h2>
          <p className="text-muted-foreground max-w-xl text-base md:text-lg">
            Premium AI playbooks, scripts, and automation guides. Buy one, buy all—each one pays for itself on the first lead you close.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
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
