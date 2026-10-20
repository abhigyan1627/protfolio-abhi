// Build-time environment values. Only non-secret values belong here: anything prefixed with VITE_
// is bundled into the public JavaScript that visitors download.

// Optional HTTPS endpoint that receives enquiry-form submissions. When empty, the form falls back
// to a WhatsApp handoff and never claims that a submission was delivered.
export const enquiryEndpoint = (import.meta.env.VITE_ENQUIRY_FORM_ENDPOINT ?? '').trim()
