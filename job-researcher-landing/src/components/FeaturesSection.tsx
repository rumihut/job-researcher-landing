import { motion } from "framer-motion";
import { Search, Shield, Building2, ClipboardList, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Job Scraping",
    description: "Extract full job details from LinkedIn and Indeed automatically—title, salary, requirements, and posting date.",
    iconColor: "text-primary",
  },
  {
    icon: Shield,
    title: "Ghost Job Detection",
    description: "AI analysis spots fake listings before you waste time. Red flags: stale postings, no salary, generic descriptions.",
    iconColor: "text-crab-red",
  },
  {
    icon: Building2,
    title: "Company Research",
    description: "Get intel on size, funding, recent news, and Glassdoor ratings. Know if they're growing or laying off.",
    iconColor: "text-primary",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description: "JSON-based CRM for your job search. Status history, follow-up reminders, and company research caching.",
    iconColor: "text-crab-red",
  },
  {
    icon: BarChart3,
    title: "Weekly Reports",
    description: "Automated digests show pipeline health, response rates, and action items. Never lose track of applications.",
    iconColor: "text-primary",
  },
  {
    icon: Clock,
    title: "Follow-up Reminders",
    description: "Smart alerts at 3, 7, and 14 days. Know exactly when to follow up without being pushy.",
    iconColor: "text-crab-red",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            What You Get
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4">
            Your complete job search system
          </h2>
          <p className="text-muted-foreground max-w-xl text-base md:text-lg">
            Everything you need to research, track, and land the right job—without wasting time on ghost listings.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-xl p-8 hover:-translate-y-1 hover:glow-border-red transition-all duration-300"
            >
              <feature.icon className={`${feature.iconColor} mb-4`} size={28} />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
