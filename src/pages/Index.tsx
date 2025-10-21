import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link2, Copy, ExternalLink, Loader2, Facebook, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [clickedLinks, setClickedLinks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSocialDialog(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSocialClick = (index: number, url: string) => {
    setClickedLinks(prev => new Set(prev).add(index));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const canProceed = clickedLinks.size > 0;

  const socialLinks = [
    { name: "Facebook Personal", url: "https://www.facebook.com/profile.php?id=61578723591744", icon: Facebook },
    { name: "Facebook Pixorax", url: "https://www.facebook.com/pixoraxofficial", icon: Facebook },
    { name: "X Personal", url: "https://x.com/md_fuad_ahmed?t=0yEsNMRFWmLTeV3fbnkOpw&s=09", icon: Twitter },
    { name: "X Pixorax", url: "https://x.com/PixoraX?t=NJXmP_2XUmpIudfOeDtd0Q&s=09", icon: Twitter },
  ];

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://is.gd/create.php?format=json&url=${encodeURIComponent(originalUrl)}`
      );
      const data = await response.json();

      if (data.shorturl) {
        setShortUrl(data.shorturl);
        toast.success("Short link created!");
      } else {
        toast.error(data.errormessage || "Failed to create short link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Social Media Dialog */}
      <Dialog open={showSocialDialog} onOpenChange={(open) => canProceed && setShowSocialDialog(open)}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => !canProceed && e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Follow Us on Social Media</DialogTitle>
            <DialogDescription className="text-center">
              Click at least one link below to continue
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {socialLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => handleSocialClick(index, social.url)}
                className={`flex items-center gap-3 p-4 rounded-lg border hover:bg-primary/5 hover:border-primary/50 transition-all group ${
                  clickedLinks.has(index) ? 'bg-primary/10 border-primary/50' : ''
                }`}
              >
                <social.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">{social.name}</span>
                <ExternalLink className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100" />
              </button>
            ))}
          </div>
          <Button 
            onClick={() => setShowSocialDialog(false)} 
            disabled={!canProceed}
            className="w-full"
          >
            {canProceed ? 'Continue' : 'Click at least one link to continue'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Link2 className="h-4 w-4" />
              Free & Simple
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Shorten Your
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Links Instantly
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Create short links in seconds. No sign up required.
            </p>

            {/* URL Shortener Form */}
            <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col gap-4">
                <Input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                  className="text-base"
                />
                
                <Button 
                  onClick={shortenUrl} 
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Shorten URL
                    </>
                  )}
                </Button>

                {shortUrl && (
                  <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Your short link:</p>
                    <div className="flex items-center gap-2">
                      <Input
                        value={shortUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        asChild
                      >
                        <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            Links are temporary and will be cleared on page reload
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
