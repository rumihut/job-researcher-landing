import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What exactly do I get?",
    a: "You get the complete Job Researcher Skill: 5 automation scripts that scrape LinkedIn/Indeed, detect ghost jobs, research companies, track applications, and generate weekly reports. Plus a comprehensive strategy guide with templates and workflows.",
  },
  {
    q: "Do I need technical skills?",
    a: "Basic command line knowledge helps, but every step is documented. If you can run 'node script.js' and follow instructions, you can use this. The skill includes a full setup guide.",
  },
  {
    q: "What are the requirements?",
    a: "OpenClaw (v2.0+), Tandem Browser, and Node.js (v18+). Everything runs locally on your machine—no expensive APIs, no subscriptions, no data mining.",
  },
  {
    q: "Is this a subscription?",
    a: "No. One-time purchase. You get lifetime access to the skill, scripts, and guide. Free updates when we release them.",
  },
  {
    q: "What if it's not for me?",
    a: "30-day money-back guarantee. If you're not satisfied, we'll refund you—no questions asked.",
  },
  {
    q: "How does ghost job detection work?",
    a: "The skill analyzes posting age, salary transparency, description quality, and company signals. It calculates a 'Ghost Score' (0-100). Score < 30 = safe to apply. Score > 60 = probably a waste of time.",
  },
  {
    q: "Can I use this with Indeed?",
    a: "Yes! The scraper works with both LinkedIn and Indeed URLs. Indeed usually has better salary data.",
  },
  {
    q: "Is my data private?",
    a: "100%. Everything runs locally on your machine. Your job applications, company research, and tracker data never leave your computer. The skill doesn't even require internet after initial setup.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-12">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold">Got questions?</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold text-sm md:text-base hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
