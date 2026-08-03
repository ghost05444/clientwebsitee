"use client";

import { useState } from "react";
import { Link } from "./Link";
import { WhatsAppIcon } from "./Header";
import { useQueryParam } from "@/lib/useQueryParam";
import { site, whatsappHref } from "@/lib/site";

/**
 * Enquiry form.
 *
 * Submissions go to Netlify Forms — no backend, no third-party script, and the
 * enquiry lands in the Netlify dashboard with email notifications. WhatsApp
 * stays as a one-tap alternative because that is how this trade actually buys.
 *
 * Netlify discovers forms by parsing the deployed HTML at build time, so this
 * component must prerender as real markup (see `useQueryParam` for why we avoid
 * `useSearchParams` here) and must carry `data-netlify` + a `form-name` field.
 */

export const FORM_NAME = "enquiry";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  company: "",
  product: "",
  quantity: "",
  message: "",
};

export function EnquiryForm() {
  const paramProduct = useQueryParam("product");

  const [values, setValues] = useState(EMPTY);
  const [productEdited, setProductEdited] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // A ?product= deep link prefills the field until the user edits it — derived,
  // so there is no effect and no hydration mismatch.
  const productValue = productEdited ? values.product : (paramProduct ?? "");

  const validate = (v: typeof values): Errors => {
    const e: Errors = {};

    if (!v.name.trim()) e.name = "Please enter your name.";
    else if (v.name.trim().length < 2) e.name = "That name looks too short.";

    if (!v.phone.trim()) e.phone = "We need a phone number to reach you.";
    else if (!PHONE_RE.test(v.phone.replace(/[\s-]/g, "")))
      e.phone = "Enter a valid 10-digit Indian mobile number.";

    // Email is optional, but must be valid if provided.
    if (v.email.trim() && !EMAIL_RE.test(v.email.trim()))
      e.email = "That email address doesn't look right.";

    if (!v.message.trim()) e.message = "Tell us what you need.";
    else if (v.message.trim().length < 10)
      e.message = "Please add a little more detail.";

    return e;
  };

  const setField = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (field === "product") setProductEdited(true);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  /** Human-readable enquiry body, used for the WhatsApp handoff. */
  const compose = () => {
    const lines = [
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
    ];
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    if (values.company.trim()) lines.push(`Company: ${values.company.trim()}`);
    if (productValue.trim()) lines.push(`Product: ${productValue.trim()}`);
    if (values.quantity.trim()) lines.push(`Quantity: ${values.quantity.trim()}`);
    lines.push("", "Requirement:", values.message.trim());
    return lines.join("\n");
  };

  /** Returns false and surfaces errors when the form is not ready to send. */
  const gate = () => {
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, message: true });

    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return false;
    }
    return true;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending" || !gate()) return;

    setStatus("sending");

    // Netlify accepts the standard urlencoded form POST at any path on the site.
    const body = new URLSearchParams({
      "form-name": FORM_NAME,
      ...values,
      product: productValue,
    });

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const sendWhatsApp = () => {
    if (!gate()) return;
    window.open(whatsappHref(compose()), "_blank", "noopener,noreferrer");
  };

  /* ---------------- Success ---------------- */
  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        <h3 className="mt-4 text-xl font-bold text-ink-900">Enquiry received.</h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          Thanks {values.name.trim().split(" ")[0] || "for getting in touch"} — we&apos;ll
          come back to you on {values.phone.trim()}, usually the same working day.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <a
            href={whatsappHref(compose())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon />
            Also send on WhatsApp
          </a>

          <Link href="/products" className="btn-secondary">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="company-website"
      noValidate
      onSubmit={submit}
      className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-7"
    >
      {/* Netlify needs this in the POST body to route the submission. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Do not fill this in
          <input name="company-website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <h2 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
        Send us your requirement
      </h2>
      <p className="mt-1.5 text-sm text-ink-600">
        Fields marked <span className="text-brand-600">*</span> are required. We reply
        the same working day.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label="Your name"
          required
          value={values.name}
          error={touched.name ? errors.name : undefined}
          onChange={(v) => setField("name", v)}
          onBlur={() => blur("name")}
          autoComplete="name"
        />

        <Field
          id="phone"
          label="Phone / WhatsApp"
          required
          type="tel"
          inputMode="tel"
          placeholder="98765 43210"
          value={values.phone}
          error={touched.phone ? errors.phone : undefined}
          onChange={(v) => setField("phone", v)}
          onBlur={() => blur("phone")}
          autoComplete="tel"
        />

        <Field
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={(v) => setField("email", v)}
          onBlur={() => blur("email")}
          autoComplete="email"
        />

        <Field
          id="company"
          label="Company / site"
          value={values.company}
          onChange={(v) => setField("company", v)}
          onBlur={() => blur("company")}
          autoComplete="organization"
        />

        <Field
          id="product"
          label="Product of interest"
          value={productValue}
          onChange={(v) => setField("product", v)}
          onBlur={() => blur("product")}
        />

        <Field
          id="quantity"
          label="Quantity"
          placeholder="e.g. 50 pcs"
          value={values.quantity}
          onChange={(v) => setField("quantity", v)}
          onBlur={() => blur("quantity")}
        />

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-semibold text-ink-800">
            What do you need? <span className="text-brand-600">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => setField("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? "message-error" : undefined}
            placeholder="Tell us the hazard, sizes, standard required and delivery location."
            className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-ink-900 outline-none transition-colors placeholder:text-ink-400 ${
              touched.message && errors.message
                ? "border-brand-500 focus:border-brand-600"
                : "border-ink-200 focus:border-brand-500"
            }`}
            style={{ fontSize: "16px" }}
          />

          {touched.message && errors.message && (
            <p id="message-error" role="alert" className="mt-1.5 text-sm text-brand-700">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-lg bg-brand-50 px-3 py-2.5 text-sm text-brand-700">
          Something went wrong sending that. Please try WhatsApp below, or email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>

        <button type="button" onClick={sendWhatsApp} className="btn-whatsapp w-full">
          <WhatsAppIcon />
          Send on WhatsApp
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        We use your details only to respond to this enquiry. No spam, no lists.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>

      <input
        id={id}
        /* name is what Netlify records the field as. */
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-ink-900 outline-none transition-colors placeholder:text-ink-400 ${
          error ? "border-brand-500 focus:border-brand-600" : "border-ink-200 focus:border-brand-500"
        }`}
        /* 16px avoids the iOS zoom-on-focus jump. */
        style={{ fontSize: "16px" }}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-brand-700">
          {error}
        </p>
      )}
    </div>
  );
}
