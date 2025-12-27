import React from "react";
import { 
  Mail, Twitter, Linkedin, Github, ArrowRight, Sparkles, 
  Brain, Zap, Globe, Shield, TrendingUp 
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import LightRays from "@/components/ui/Lightrays";

// --- Utility Helper ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- UI Components ---
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    // Metallic Orange Primary
    default: "bg-[#FF8C42] text-black hover:bg-[#FF8C42]/90 shadow-[0_0_15px_rgba(255,140,66,0.3)]",
    // Outline with Metallic Orange
    outline: "border border-[#FF8C42]/50 bg-transparent text-[#FF8C42] hover:bg-[#FF8C42]/10",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-md px-8 text-base font-semibold",
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

const Card = ({ className, ...props }) => (
  <div className={cn("rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-xl backdrop-blur-sm", className)} {...props} />
);

// --- Page Sections ---

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#FF8C42] flex items-center justify-center shadow-[0_0_10px_rgba(255,140,66,0.5)]">
            <Mail className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">mailto</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-zinc-400 hover:text-[#FF8C42] transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-[#FF8C42] transition-colors">How it Works</a>
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-[#FF8C42] transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
          <Button size="sm">LogIn</Button>
        </div>
      </div>
    </header>
  );
}

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 bg-black">
        {/* LightRays Container */}
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#FF8C42" // Changed to metallic orange to match theme
          raysSpeed={1.0}
          lightSpread={2.8}
          rayLength={5.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.01}
          distortion={0.01}
          className="custom-rays"
        />
      </div>

      <div className="container mx-auto max-w-6xl text-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Gemini AI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl">
            Transform X Profiles into <span className="text-[#FF8C42]">Personalized Emails</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Generate highly customized emails by analyzing X (Twitter) profiles with AI. Perfect for outreach, sales, and networking at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button size="lg">
              Start Crafting Emails <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">Watch Demo</Button>
          </div>
          <div className="pt-12 w-full">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,1)]">
              <div className="bg-zinc-800/50 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs text-zinc-500 ml-2">app.mailcraft.ai</span>
              </div>
              <div className="p-4 md:p-8 bg-black">
                <div className="w-full aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-700">
                  <img src="/api/placeholder/800/450" alt="Interface" className="w-full rounded-lg opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { value: "10x", label: "Higher response rate", company: "vs generic emails" },
    { value: "5min", label: "Average time saved", company: "per email" },
    { value: "94%", label: "Personalization score", company: "with AI analysis" },
    { value: "50K+", label: "Emails generated", company: "this month" },
  ];
  return (
    <section className="py-20 px-4 border-y border-zinc-800 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="text-4xl md:text-5xl font-bold text-[#FF8C42] mb-2">{stat.value}</div>
              <div className="text-base text-zinc-100 mb-1">{stat.label}</div>
              <div className="text-sm text-zinc-500">{stat.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    { icon: Twitter, title: "X Profile Analysis", description: "Deep analysis of tweets, interests, and engagement patterns to understand your recipient." },
    { icon: Brain, title: "Gemini AI Powered", description: "Leverage Google's advanced AI to generate contextually relevant and personalized content." },
    { icon: Zap, title: "Instant Generation", description: "Create personalized emails in seconds, not hours." },
    { icon: Globe, title: "Multi-Language Support", description: "Generate emails in any language based on the recipient's profile preferences." },
    { icon: Shield, title: "Privacy First", description: "Only public profile data is analyzed. Your data remains private." },
    { icon: TrendingUp, title: "Higher Conversion", description: "Personalized emails see up to 10x higher response rates." },
  ];
  return (
    <section id="features" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Metallic-powered personalization that actually works.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:border-[#FF8C42]/50 transition-all hover:shadow-[0_0_20px_rgba(255,140,66,0.1)] group">
              <div className="h-12 w-12 rounded-lg bg-[#FF8C42]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-[#FF8C42]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Enter X Handle", description: "Simply paste the X handle of your target recipient." },
    { number: "02", title: "AI Analysis", description: "Gemini AI analyzes their profile and interests in real-time." },
    { number: "03", title: "Customize Context", description: "Provide your goal, tone, and key points." },
    { number: "04", title: "Get Your Email", description: "Receive a perfectly crafted, personalized email ready to send." },
  ];
  return (
    <section id="how-it-works" className="py-24 px-4 bg-zinc-950">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How it works</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Four simple steps to create emails that get responses</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 relative overflow-hidden bg-zinc-900 border-zinc-800">
              <div className="text-6xl font-black text-[#FF8C42]/5 absolute top-4 right-4">{step.number}</div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-[#FF8C42]/20 p-8 md:p-12 text-center shadow-[0_0_50px_rgba(255,140,66,0.05)]">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to transform your outreach?</h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">Join professionals using mailto to create personalized emails that actually get responses.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">Schedule Demo</Button>
          </div>
          <p className="text-sm text-zinc-500 mt-6">No credit card required · 14-day free trial</p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 px-4 bg-black text-zinc-100">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#FF8C42] flex items-center justify-center">
                <Mail className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold">mailto</span>
            </div>
            <p className="text-sm text-zinc-500">AI-powered email personalization using X profiles and Gemini.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-white">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#features" className="hover:text-[#FF8C42]">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#FF8C42]">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-[#FF8C42]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#FF8C42]">Terms</a></li>
            </ul>
          </div>
          <div className="flex gap-4">
            <Twitter className="h-5 w-5 text-zinc-500 hover:text-[#FF8C42] cursor-pointer" />
            <Linkedin className="h-5 w-5 text-zinc-500 hover:text-[#FF8C42] cursor-pointer" />
            <Github className="h-5 w-5 text-zinc-500 hover:text-[#FF8C42] cursor-pointer" />
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          © 2025 mailto. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export const LandingPage =() => {
  return (
    <div className="min-h-screen bg-black selection:bg-[#FF8C42]/30 selection:text-[#FF8C42]">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}