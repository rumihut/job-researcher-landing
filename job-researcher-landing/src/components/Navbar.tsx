import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="font-heading text-lg font-bold tracking-wider text-foreground">
          🐣 Hatched Pixel + OpenClaw 🦀
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 flex flex-col gap-3">
          <a href="#products" className="text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>Products</a>
          <a href="#faq" className="text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>FAQ</a>
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;
