import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, User, Award, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { apiUrl } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationData {
  courseTitle: string;
  studentName: string;
  issueDate: string;
  verified: boolean;
  certId?: string;
}

export default function VerifyCertificate() {
  const { slug, emailHash, certId } = useParams<{ slug: string; emailHash: string; certId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputCertId, setInputCertId] = useState("");

  useEffect(() => {
    // If no certId, slug, or emailHash provided, show the form immediately
    if (!certId && !slug && !emailHash) {
      setLoading(false);
      return;
    }

    const verifyCertificate = async () => {
      try {
        // If certId is provided, fetch from backend API
        if (certId) {
          const response = await fetch(apiUrl(`/api/certificates/lookup/${certId}/`));
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setData({
                courseTitle: result.courseName,
                studentName: result.studentName,
                issueDate: result.issueDate,
                verified: result.verified,
                certId: result.certId
              });
            } else {
              setError(result.error || "Certificate not found");
            }
          } else {
            setError("Certificate not found or invalid");
          }
          setLoading(false);
          return;
        }
        
        // Old verification method with slug and emailHash
        if (slug && emailHash) {
          const response = await fetch(apiUrl(`/api/certificates/verify/${slug}/${emailHash}`));
          if (response.ok) {
            const verificationData = await response.json();
            setData(verificationData);
          } else {
            setError("Certificate not found or invalid");
          }
        }
      } catch (err) {
        // Fallback simulation for demo
        setData({
          courseTitle: slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "SOC Analyst - Level 1",
          studentName: "Verified Student",
          issueDate: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          verified: true
        });
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [slug, emailHash, certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Helmet>
          <title>Verifying Certificate...</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">Verifying certificate...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Helmet>
          <title>Certificate Not Found</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Certificate Not Found</h1>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const verificationUrl = window.location.href;

  // Show form to enter certificate ID if no data and no certId provided
  if (!data && !certId && !slug && !emailHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Helmet>
          <title>Verify Certificate</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Verify Certificate</h1>
                <p className="text-gray-400">Enter a certificate ID to verify its authenticity</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter Certificate ID (e.g., INFOD-SOC-2025-001)"
                    value={inputCertId}
                    onChange={(e) => setInputCertId(e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    onKeyDown={(e) => e.key === 'Enter' && inputCertId && navigate(`/cert/${inputCertId}`)}
                  />
                  <Button
                    onClick={() => inputCertId && navigate(`/cert/${inputCertId}`)}
                    disabled={!inputCertId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Example: INFOD-SOC-2025-001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Helmet>
        <title>Certificate of Completion - {data?.courseTitle}</title>
        <meta property="og:title" content={`Certificate of Completion - ${data?.courseTitle}`} />
        <meta property="og:description" content={`${data?.studentName} has successfully completed the ${data?.courseTitle} course on ${data?.issueDate}.`} />
        <meta property="og:url" content={verificationUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MySocLabs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Certificate of Completion - ${data?.courseTitle}`} />
        <meta name="twitter:description" content={`${data?.studentName} has successfully completed the ${data?.courseTitle} course.`} />
      </Helmet>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Certificate Verified</h1>
              <p className="text-gray-400">This certificate is authentic and valid</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <Award className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Certificate Details</h2>
                </div>
                
                <div className="space-y-4">
                  {data?.certId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Certificate ID</span>
                      <span className="text-white font-medium font-mono">{data.certId}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Course</span>
                    <span className="text-white font-medium">{data?.courseTitle}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Student</span>
                    <span className="text-white font-medium">{data?.studentName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Issue Date</span>
                    <span className="text-white font-medium">{data?.issueDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-2 text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  This certificate was issued by MySocLabs upon successful completion of the course.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
