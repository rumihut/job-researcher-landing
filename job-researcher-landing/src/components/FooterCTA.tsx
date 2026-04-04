import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FooterCTA = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-crab-red/8 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to automate
            <br />
            <span className="text-crab-red text-glow-red">your workflow?</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Discover OpenClaw skills that handle the repetitive work.
            Browse the collection starting at $15.
          </p>
          <Button
            size="lg"
            className="font-semibold gap-2 text-base"
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get the Bundle <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>

      <footer className="container mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 Job Researcher Skill by Hatched Pixel. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a>
        </div>
      </footer>
    </section>
  );
};

export default FooterCTA;
