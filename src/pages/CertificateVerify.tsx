import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, CheckCircle, XCircle, ArrowLeft, Award, Calendar, User, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiUrl } from "@/services/api";

interface CertificateData {
  certId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  verified: boolean;
}

const CertificateVerify = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get("cert") || "");
  const [result, setResult] = useState<CertificateData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const certFromUrl = searchParams.get("cert");
    if (certFromUrl) {
      setCertificateId(certFromUrl);
      lookupCertificate(certFromUrl);
    }
  }, []);

  const lookupCertificate = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setSearched(true);
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch(apiUrl(`/api/certificates/lookup/${encodeURIComponent(trimmed)}/`));
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      if (data?.success && data?.certId) {
        setResult(data as CertificateData);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => lookupCertificate(certificateId);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">Certificate Verification</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a certificate ID to verify its authenticity and view details.
            </p>
          </div>

          {/* Search Input */}
          <Card className="bg-card/30 backdrop-blur-lg border-white/[0.08] mb-8">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  value={certificateId}
                  onChange={(e) => {
                    setCertificateId(e.target.value);
                    if (searched) { setSearched(false); setResult(null); setNotFound(false); }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. a1b2c3d4e5f6g7h8"
                  className="bg-background/50 border-white/[0.1] text-foreground placeholder:text-muted-foreground"
                  maxLength={30}
                />
                <Button onClick={handleVerify} disabled={!certificateId.trim() || loading} className="shrink-0 gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-3">Looking up certificate...</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <Card className="bg-card/30 backdrop-blur-lg border-white/[0.08] animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">Certificate Details</CardTitle>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border text-secondary bg-secondary/10 border-secondary/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Certificate ID</p>
                      <p className="text-sm font-mono text-foreground">{result.certId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Recipient</p>
                      <p className="text-sm text-foreground">{result.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Course</p>
                      <p className="text-sm text-foreground">{result.courseName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Issued On</p>
                      <p className="text-sm text-foreground">{new Date(result.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {notFound && !loading && (
            <Card className="bg-card/30 backdrop-blur-lg border-destructive/20 animate-fade-in">
              <CardContent className="p-6 text-center">
                <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-1">Certificate Not Found</h3>
                <p className="text-sm text-muted-foreground">
                  No certificate matches the ID <span className="font-mono text-foreground">"{certificateId.trim()}"</span>. Please check and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CertificateVerify;
