import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Skill Only",
    price: "$29",
    period: "one-time",
    description: "The automation",
    features: [
      "5 automation scripts",
      "LinkedIn/Indeed scraping",
      "Ghost job detection",
      "Company research",
      "Application tracker",
      "Weekly reports",
    ],
    highlighted: false,
  },
  {
    name: "Complete Bundle",
    price: "$39",
    period: "one-time",
    description: "Most popular",
    features: [
      "Everything in Skill Only",
      "Strategy guide (30+ pages)",
      "Ghost job checklist",
      "Follow-up templates",
      "Email delivery 24h",
      "Free updates",
    ],
    highlighted: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-crab-red/5 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">Simple Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One-time purchase
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            No subscriptions. No hidden fees. Buy once, use forever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "bg-card border-crab-red/40 glow-border-red"
                  : "bg-card border-border"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-crab-red text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}
              <p className="text-sm text-muted-foreground mb-1">{plan.description}</p>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={16} className={plan.highlighted ? "text-crab-red mt-0.5" : "text-primary mt-0.5"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full font-semibold ${plan.highlighted ? "" : ""}`}
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          🔒 Secure checkout · 30-day money-back guarantee
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
