import { SiteLayout } from "@/components/layout/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, CheckCircle2, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/use-page-meta";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const STEPS = [
  { number: 1, label: "Project Basics" },
  { number: 2, label: "Property Details" },
  { number: 3, label: "Your Goals" },
  { number: 4, label: "Review & Submit" },
];

const SERVICE_OPTIONS = [
  "Forestry Mulching",
  "Trail Cutting",
  "Hillside Mulching",
  "Brush Hogging",
  "Fence Line Clearing",
  "Invasive Growth Removal",
];

const PROPERTY_TYPES = ["Residential", "Commercial", "Farm", "HOA", "Other"];

const COUNTIES = [
  "Mecklenburg",
  "Union",
  "Cabarrus",
  "Gaston",
  "Iredell",
  "York (SC)",
  "Lancaster (SC)",
  "Other",
];

const AREA_OPTIONS = [
  "Under 1/4 acre",
  "1/4-1/2 acre",
  "1/2-1 acre",
  "1-3 acres",
  "3-5 acres",
  "5+ acres",
];

const TIMELINE_OPTIONS = ["ASAP", "This month", "Next 30-60 days", "Flexible"];

const BUDGET_OPTIONS = [
  "I'm exploring options",
  "I want the best value",
  "I need it done right",
];

const ACCESS_NOTE_OPTIONS = [
  "Narrow gate access",
  "Steep slope",
  "Soft or wet ground",
  "Fencing nearby",
  "Utility lines present",
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  servicesNeeded: string[];
  propertyType: string;
  jobAddress: string;
  county: string;
  approximateArea: string;
  accessNotes: string;
  desiredOutcome: string;
  timeline: string;
  budgetComfort: string;
}

export default function Quote() {
  usePageMeta({
    title: "Get a Quote | Clearcut Land Management",
    description: "Request a fast quote for forestry mulching, trail cutting, hillside clearing, brush hogging, fence line clearing, and invasive growth removal in the Charlotte area.",
    canonicalUrl: "/quote",
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [accessChecks, setAccessChecks] = useState<string[]>([]);
  const [otherAccessNote, setOtherAccessNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    servicesNeeded: [],
    propertyType: "",
    jobAddress: "",
    county: "",
    approximateArea: "",
    accessNotes: "",
    desiredOutcome: "",
    timeline: "",
    budgetComfort: "",
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter((s) => s !== service)
        : [...prev.servicesNeeded, service],
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next["servicesNeeded"];
      return next;
    });
  };

  const toggleAccessNote = (note: string) => {
    setAccessChecks((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const buildAccessNotes = () => {
    const parts = [...accessChecks];
    if (otherAccessNote.trim()) parts.push(otherAccessNote.trim());
    return parts.join("; ");
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (formData.servicesNeeded.length === 0) newErrors.servicesNeeded = "Select at least one service";
      if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    }

    if (step === 2) {
      if (!formData.jobAddress.trim()) newErrors.jobAddress = "Job address is required";
      if (!formData.county) newErrors.county = "County is required";
      if (!formData.approximateArea) newErrors.approximateArea = "Approximate area is required";
    }

    if (step === 3) {
      if (!formData.timeline) newErrors.timeline = "Timeline is required";
      if (!formData.budgetComfort) newErrors.budgetComfort = "Budget comfort is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        updateField("accessNotes", buildAccessNotes());
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalAccessNotes = buildAccessNotes();
      const res = await apiRequest("POST", "/api/public/leads", {
        ...formData,
        accessNotes: finalAccessNotes,
        company: honeypot,
      });
      await res.json();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" data-testid="text-confirmation-title">
              Quote Request Submitted
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you, {formData.fullName}. We have received your request and will be in touch soon.
            </p>
            <Card>
              <CardContent className="p-6 sm:p-8 text-left">
                <h2 className="font-semibold text-lg mb-4">What happens next:</h2>
                <ol className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary shrink-0">1.</span>
                    <span>We review your request and call to discuss details within 24 hours.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary shrink-0">2.</span>
                    <span>We schedule a free on-site visit to assess your property.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary shrink-0">3.</span>
                    <span>You receive a detailed written estimate with no obligation.</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
            <Button className="mt-8 gap-2" onClick={() => setLocation("/")} data-testid="button-go-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-quote-title">
              Get a Fast Quote
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              Tell us what you're dealing with — we'll respond quickly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 gap-2" data-testid="step-indicator">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-2 text-sm ${
                      step.number === currentStep
                        ? "text-primary font-semibold"
                        : step.number < currentStep
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold shrink-0 ${
                        step.number === currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.number < currentStep
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                ))}
              </div>

              <Card>
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} data-testid="form-quote">
                    <input
                      type="text"
                      name="company"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="sr-only"
                      tabIndex={-1}
                      autoComplete="off"
                      data-testid="input-honeypot"
                    />

                    {currentStep === 1 && (
                      <div className="space-y-5" data-testid="step-1">
                        <h2 className="text-xl font-semibold mb-4">Project Basics</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => updateField("fullName", e.target.value)}
                              placeholder="John Smith"
                              data-testid="input-full-name"
                            />
                            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateField("phone", e.target.value)}
                              placeholder="(704) 555-0123"
                              data-testid="input-phone"
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="john@example.com"
                            data-testid="input-email"
                          />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Services Needed *</Label>
                          <div className="grid sm:grid-cols-2 gap-3 mt-1">
                            {SERVICE_OPTIONS.map((service) => (
                              <label
                                key={service}
                                className="flex items-center gap-2 cursor-pointer text-sm"
                              >
                                <Checkbox
                                  checked={formData.servicesNeeded.includes(service)}
                                  onCheckedChange={() => toggleService(service)}
                                  data-testid={`checkbox-service-${service.toLowerCase().replace(/[\s/]+/g, "-")}`}
                                />
                                {service}
                              </label>
                            ))}
                          </div>
                          {errors.servicesNeeded && <p className="text-sm text-destructive">{errors.servicesNeeded}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select
                            value={formData.propertyType}
                            onValueChange={(v) => updateField("propertyType", v)}
                          >
                            <SelectTrigger data-testid="select-property-type">
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROPERTY_TYPES.map((pt) => (
                                <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-5" data-testid="step-2">
                        <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                        <div className="space-y-2">
                          <Label htmlFor="jobAddress">Job Address *</Label>
                          <Input
                            id="jobAddress"
                            value={formData.jobAddress}
                            onChange={(e) => updateField("jobAddress", e.target.value)}
                            placeholder="123 Main St, Charlotte, NC 28202"
                            data-testid="input-job-address"
                          />
                          {errors.jobAddress && <p className="text-sm text-destructive">{errors.jobAddress}</p>}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="county">County *</Label>
                            <Select
                              value={formData.county}
                              onValueChange={(v) => updateField("county", v)}
                            >
                              <SelectTrigger data-testid="select-county">
                                <SelectValue placeholder="Select county" />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTIES.map((c) => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.county && <p className="text-sm text-destructive">{errors.county}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="approximateArea">Approximate Area *</Label>
                            <Select
                              value={formData.approximateArea}
                              onValueChange={(v) => updateField("approximateArea", v)}
                            >
                              <SelectTrigger data-testid="select-approximate-area">
                                <SelectValue placeholder="Select area size" />
                              </SelectTrigger>
                              <SelectContent>
                                {AREA_OPTIONS.map((a) => (
                                  <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.approximateArea && <p className="text-sm text-destructive">{errors.approximateArea}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Access Notes</Label>
                          <p className="text-xs text-muted-foreground">Check any that apply to your property.</p>
                          <div className="grid sm:grid-cols-2 gap-3 mt-1">
                            {ACCESS_NOTE_OPTIONS.map((note) => (
                              <label
                                key={note}
                                className="flex items-center gap-2 cursor-pointer text-sm"
                              >
                                <Checkbox
                                  checked={accessChecks.includes(note)}
                                  onCheckedChange={() => toggleAccessNote(note)}
                                  data-testid={`checkbox-access-${note.toLowerCase().replace(/[\s/]+/g, "-")}`}
                                />
                                {note}
                              </label>
                            ))}
                          </div>
                          <div className="mt-3 space-y-1">
                            <Label htmlFor="otherAccessNote">Other access notes</Label>
                            <Input
                              id="otherAccessNote"
                              value={otherAccessNote}
                              onChange={(e) => setOtherAccessNote(e.target.value)}
                              placeholder="Any other access concerns..."
                              data-testid="input-other-access-note"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-5" data-testid="step-3">
                        <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
                        <div className="space-y-2">
                          <Label htmlFor="desiredOutcome">Desired Outcome</Label>
                          <Textarea
                            id="desiredOutcome"
                            value={formData.desiredOutcome}
                            onChange={(e) => updateField("desiredOutcome", e.target.value)}
                            placeholder="Describe what you'd like the property to look like when we're done..."
                            className="min-h-[120px]"
                            data-testid="input-desired-outcome"
                          />
                          <p className="text-xs text-muted-foreground">
                            The more detail you provide, the more accurate our quote will be.
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline *</Label>
                            <Select
                              value={formData.timeline}
                              onValueChange={(v) => updateField("timeline", v)}
                            >
                              <SelectTrigger data-testid="select-timeline">
                                <SelectValue placeholder="When do you need this done?" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIMELINE_OPTIONS.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.timeline && <p className="text-sm text-destructive">{errors.timeline}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="budgetComfort">Budget Comfort *</Label>
                            <Select
                              value={formData.budgetComfort}
                              onValueChange={(v) => updateField("budgetComfort", v)}
                            >
                              <SelectTrigger data-testid="select-budget-comfort">
                                <SelectValue placeholder="How are you thinking about budget?" />
                              </SelectTrigger>
                              <SelectContent>
                                {BUDGET_OPTIONS.map((b) => (
                                  <SelectItem key={b} value={b}>{b}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.budgetComfort && <p className="text-sm text-destructive">{errors.budgetComfort}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-5" data-testid="step-4">
                        <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Please review your information below before submitting.
                        </p>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              Project Basics
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">Name:</span>{" "}
                                <span data-testid="review-full-name">{formData.fullName}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Phone:</span>{" "}
                                <span data-testid="review-phone">{formData.phone}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Email:</span>{" "}
                                <span data-testid="review-email">{formData.email}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Property Type:</span>{" "}
                                <span data-testid="review-property-type">{formData.propertyType}</span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Services:</span>{" "}
                              <span className="flex flex-wrap gap-1 mt-1" data-testid="review-services">
                                {formData.servicesNeeded.map((s) => (
                                  <Badge key={s} variant="secondary" className="no-default-hover-elevate">{s}</Badge>
                                ))}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-4 space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              Property Details
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">Address:</span>{" "}
                                <span data-testid="review-job-address">{formData.jobAddress}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">County:</span>{" "}
                                <span data-testid="review-county">{formData.county}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Area:</span>{" "}
                                <span data-testid="review-approximate-area">{formData.approximateArea}</span>
                              </div>
                            </div>
                            {(accessChecks.length > 0 || otherAccessNote.trim()) && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Access Notes:</span>{" "}
                                <span data-testid="review-access-notes">{buildAccessNotes()}</span>
                              </div>
                            )}
                          </div>

                          <div className="border-t pt-4 space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              Your Goals
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">Timeline:</span>{" "}
                                <span data-testid="review-timeline">{formData.timeline}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Budget:</span>{" "}
                                <span data-testid="review-budget-comfort">{formData.budgetComfort}</span>
                              </div>
                            </div>
                            {formData.desiredOutcome && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Desired Outcome:</span>{" "}
                                <span data-testid="review-desired-outcome">{formData.desiredOutcome}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t flex-wrap">
                      {currentStep > 1 ? (
                        <Button type="button" variant="outline" onClick={goBack} data-testid="button-back">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 4 ? (
                        <Button type="button" onClick={goNext} data-testid="button-next">
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={submitting} className="gap-2" data-testid="button-submit-quote">
                          <Send className="h-4 w-4" />
                          {submitting ? "Submitting..." : "Submit Quote Request"}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-muted-foreground">(951) 316-0826</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-muted-foreground">info@clearcutlandmanagement.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Service Area</div>
                        <div className="text-muted-foreground">Charlotte, NC & 50mi radius</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-muted-foreground">Within 24 hours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
