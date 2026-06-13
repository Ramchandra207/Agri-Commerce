import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/enquiry")({
  head: () => pageMeta("Bulk Enquiry — AgriCommerce", "Request wholesale pricing or partnership."),
  component: EnquiryPage,
});

function EnquiryPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Business Enquiries</h1>
          <p className="mt-2 text-muted-foreground">Get wholesale pricing or partner with us.</p>
        </div>
      </section>
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <Tabs defaultValue="bulk">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bulk">Bulk Enquiry</TabsTrigger>
            <TabsTrigger value="general">General Enquiry</TabsTrigger>
          </TabsList>
          <TabsContent value="bulk"><BulkForm /></TabsContent>
          <TabsContent value="general"><GeneralForm /></TabsContent>
        </Tabs>
      </section>
      <SiteFooter />
    </div>
  );
}

function BulkForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ company_name: "", contact_person: "", email: "", phone: "", quantity: "", message: "" });
  const [products, setProducts] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      type: "bulk",
      ...form,
      products: products.split(",").map((p) => ({ name: p.trim() })).filter((p) => p.name),
    });
    setSubmitting(false);
    if (error) return toast.error("Failed to submit");
    toast.success("Bulk enquiry received. We'll respond within 24 hours.");
    setForm({ company_name: "", contact_person: "", email: "", phone: "", quantity: "", message: "" });
    setProducts("");
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Company name *</Label><Input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
        <div><Label>Contact person *</Label><Input required value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
        <div><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Products needed *</Label><Input required value={products} onChange={(e) => setProducts(e.target.value)} placeholder="e.g. Tomato seeds, Urea, Neem oil" /></div>
        <div className="sm:col-span-2"><Label>Total quantity / requirement</Label><Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 5000 kg / monthly" /></div>
        <div className="sm:col-span-2"><Label>Business requirement</Label><Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting…" : "Submit Bulk Enquiry"}</Button>
    </form>
  );
}

function GeneralForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ company_name: "", contact_person: "", email: "", phone: "", message: "" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({ type: "general", ...form });
    setSubmitting(false);
    if (error) return toast.error("Failed to submit");
    toast.success("Enquiry received. We'll be in touch soon.");
    setForm({ company_name: "", contact_person: "", email: "", phone: "", message: "" });
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Company name</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
        <div><Label>Contact person *</Label><Input required value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
        <div><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Message *</Label><Textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting…" : "Send Message"}</Button>
    </form>
  );
}