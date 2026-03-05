import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ALL_COURSES_BUNDLE_SLUG, ALL_COURSES_BUNDLE_PRICE_INR, getCourseBySlug, getCoursePriceInr } from "@/data/courses";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CourseCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(user?.fullName || user?.email?.split("@")[0] || "");
  const [error, setError] = useState<string | null>(null);
  const [displayAmountInr, setDisplayAmountInr] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (slug === ALL_COURSES_BUNDLE_SLUG) {
      setCourse({
        title: "All Courses Bundle",
        difficulty: "easy",
      });
      setDisplayAmountInr(ALL_COURSES_BUNDLE_PRICE_INR);
      setLoading(false);
      return;
    }

    const staticCourse = getCourseBySlug(slug);
    setCourse(staticCourse);
    setDisplayAmountInr(
      staticCourse ? getCoursePriceInr(slug, staticCourse.difficulty) : null,
    );
    setLoading(false);
  }, [slug]);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    if (!slug || !course) return;
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setSubmitting(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
      setSubmitting(false);
      return;
    }

    try {
      // 1) Create order
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/create-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ course_slug: slug, full_name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || `Error: ${res.status} ${res.statusText}`);
        setSubmitting(false);
        return;
      }

      if (typeof data.amount_inr === "number") {
        setDisplayAmountInr(data.amount_inr);
      }

      if (data.free) {
        // Free course: redirect to course page
        navigate(`/courses/${slug}`);
        setSubmitting(false);
        return;
      }

      // Test mode: skip Razorpay and auto-verify
      if (data.test_mode) {
        const verifyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/verify/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            razorpay_order_id: data.order_id,
            razorpay_payment_id: "generic_payment_id",
            razorpay_signature: "generic_signature",
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          setError(verifyData.detail || "Payment verification failed");
          setSubmitting(false);
          return;
        }

        // Success: redirect
        if (slug === ALL_COURSES_BUNDLE_SLUG) {
          navigate("/courses");
        } else {
          navigate(`/courses/${slug}`);
        }
        setSubmitting(false);
        return;
      }

      // 2) Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway");
        setSubmitting(false);
        return;
      }

      // 3) Open Razorpay Checkout
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: course.title,
        description: "Enrollment payment",
        order_id: data.order_id,
        handler: async (response: any) => {
          // 4) Verify payment
          const verifyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/verify/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.detail || "Payment verification failed");
            setSubmitting(false);
            return;
          }

          // Success: redirect to course page (or courses list for bundle)
          if (slug === ALL_COURSES_BUNDLE_SLUG) {
            navigate("/courses");
          } else {
            navigate(`/courses/${slug}`);
          }
        },
        prefill: {
          email: user?.email,
          name: name.trim(),
        },
        theme: {
          color: "#334155",
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/courses/${slug}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to course
          </Button>
          <h1 className="text-3xl font-bold">{course.title}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email (registered)</label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full name</label>
                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                onClick={handlePay}
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${typeof displayAmountInr === "number" ? `₹${displayAmountInr}` : ""}`
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Course</span>
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-medium">
                  {typeof displayAmountInr === "number" ? `₹${displayAmountInr}` : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-lg">
                  {typeof displayAmountInr === "number" ? `₹${displayAmountInr}` : "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CourseCheckout;
