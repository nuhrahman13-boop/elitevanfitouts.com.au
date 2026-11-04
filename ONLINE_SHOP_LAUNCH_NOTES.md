# Elite Van Fitouts Online Shop — Launch checklist

This branch is a **review build**. Do not merge or publish until the tests below pass.

## Customer experience
- Homepage's former "Other Services" navigation and third feature tile now take customers to `shop.html`.
- Customer chooses a vehicle, reviews products, or configures a custom drawer/shelf system.
- Customer opens **Your Quote** and reviews individual products, quantities, measurements, notes, and an **indicative** subtotal.
- **Continue to Your Details** opens the existing secure **WEB - Fitout Config.** GoHighLevel form.
- The product and custom-build summary is sent as the `package_selection` URL parameter, matching the existing `quote.html` approach.
- No card collection, order capture, or booking takes place on this page. Elite reviews the fitment, final price (including tax where applicable), scope and likely completion date; only then a quote/deposit/booking can happen.

## GoHighLevel configuration: outstanding
The current form ID is `DHGvcQD4xgCfwCbG0Cqm` (WEB - Fitout Config.).
The online opportunity pipeline already exists: `EVF | Online Quote Requests`.
The website sends the UTM source `Elite Online Shop` and a summary that begins `ELITE VAN FITOUTS — ONLINE SHOP QUOTE REQUEST`.

Before launch, configure and TEST a **Form Submitted** workflow in GHL for online shop enquiries, with a source or `package_selection` filter:
1. Create/upsert an opportunity in `EVF | Online Quote Requests` → `New Website Request`, retaining the contact and full build notes.
2. Notify an internal reviewer to validate fitment, dimensions, GST and pricing. Do not auto-send a final estimate from an indicative subtotal.
3. On approval, send the formal estimate. The customer should accept the quote and pay 30% to become eligible for a workshop booking.
4. Both online and in-house opportunities must book against **the same active and tested workshop schedule**. Validate multi-day production capacity manually before a date is offered, until actual capacity reservations are implemented.
5. Do not send any automated messages to real customers during tests.

**Blocker:** The connected GHL workflow API reports `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION` for this Elite sub-account. GHL workflow construction must therefore be completed inside its UI; source tagging via the website by itself does not create an online pipeline opportunity.

**Other limitation:** The existing quote-form embed is live and should be reviewed to confirm that the GHL field `package_selection` accepts the complete prefill and keeps it in the CRM. This implementation sends an actual GHL form, but the GHL form submission and routing have NOT been tested end-to-end.

## Regression tests
1. Test the shop at mobile widths (~375px) and desktop; cart, configurators, product detail pages and search/filter should all work.
2. Select a Toyota HiAce (correct year/door type) and a compatible window guard. Confirm unsupported van models do not show window guards.
3. Configure custom drawers and shelving, add to quote, adjust quantities, then check the exact dimensions and selected sections in the quote summary and GHL form prefill.
4. Change the vehicle: confirm previously selected incompatible items are cleared.
5. Open the secure form and test with a **dummy contact** only. Verify every line and custom measurement is saved to the GHL contact/opportunity; do not send live quotes.
6. Submit via the normal existing quote page to ensure its current conversion tracking and manifest are not affected.
7. Verify a test in-house job and a test online job cannot reserve the same limited workshop production window. This protection is **not yet implemented**, and drop-off appointment limits alone do not protect multi-day workshop work.
8. Check the homepage, About, Fitouts and Protection menus link to `shop.html` in the deployment preview.
9. Confirm production deploy source (the connected Vercel account visible to ChatGPT does not list a deployment for this GitHub repository) before merging or publishing.

## Existing assets intentionally untouched
- `quote.html` and its existing GHL embed and tracking
- GHL's live $300-deposit estimate template (requires separate 30% version)
- GHL's existing internal booking calendar
- All customer and opportunity records
