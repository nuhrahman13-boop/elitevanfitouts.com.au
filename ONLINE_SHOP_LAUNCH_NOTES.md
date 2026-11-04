## Release status — 4 November 2026

**NOT SAFE TO RELEASE AS FULLY FUNCTIONAL.** The shop now matches the Elite website navigation and footer. A desktop QA run validated make/model/year selection, adding a drawer product, cart and GHL Form 10 rendering. However, an end-to-end test using a reserved dummy contact did **not** produce a confirmed GHL submission: API `/forms/submissions?formId=o0oXdsC9oE4Ywv3u710U` returned zero submissions and contact lookup returned `null`. The form showed a spinner but no confirmed success message; GHL Form 10 has a CAPTCHA. **Do not assume the selected build reaches GHL.**

The existing form also displays delivery address fields for non-delivery selections, a default US-style phone mask, placeholder terms links and generic submit button. Those GHL form-builder changes require an authenticated UI session.

Latest safe preview: `https://elitevanfitouts-com-au-git-feature-onl-397cbb-elite-van-fitouts.vercel.app/shop.html` (protected by Vercel Auth).

**Production launch gate**:
1. In GHL Form 10, fix validation, Australian phone defaults, conditional delivery fields, CAPTCHA and the success acknowledgement.
2. Confirm `package selection` is prefilled from shop URL and persists in the GHL custom contact field, including product quantity and dimensional build options.
3. Submit a manually CAPTCHA-verified dummy enquiry and confirm GHL Form 10 submission, contact data and selected build notes.
4. Confirm online pipeline routing and test that customer communication / automations don't contact real customers.
5. Test mobile viewport and custom shelf/drawer builders, including image/asset loading and quote totals.
6. Only then merge draft PR #7 into the production branch and verify `https://elitevanfitouts.com.au/shop.html` plus homepage navigation and error logs.

No production deploy, merge or customer communications have been made from this release work.

# Elite Van Fitouts Online Shop — Launch checklist

This branch is a **review build**. Do not merge or publish until the tests below pass.

## Customer experience
- Homepage's former "Other Services" navigation and third feature tile now take customers to `shop.html`.
- Customer chooses a vehicle, reviews products, or configures a custom drawer/shelf system.
- Customer opens **Your Quote** and reviews individual products, quantities, measurements, notes, and an **indicative** subtotal.
- **Continue to Your Details** opens the existing secure **WEB - Fitout Config.** GoHighLevel form.
- The product and custom-build summary is sent as the `package_selection` URL parameter, matching the existing `quote.html` approach.
- No card collection, order capture, or booking takes place on this page. Elite reviews the fitment, final price (including tax where applicable), scope and likely completion date; only then a quote/deposit/booking can happen.

## Dedicated Online Shop form / GHL mapping
The shared existing form `WEB - Fitout Config.` is **not suitable** for this workflow. The preview now shows a dedicated, responsive customer form **with submissions deliberately disabled**; it does not send details anywhere.

In GHL, build a new form named `WEB - Online Shop Quote Request`, reusing existing **contact** fields where possible:
- Contact full name, phone, email, company.
- Existing `contact.vehicle_make`, `contact.vehicle_year`, `contact.vehicle_wheelbase` (if required separately).
- Existing `contact.package_selection` (LARGE_TEXT), populated from the product/cart/configurator summary, and `contact.build_specifications` where appropriate.
- Existing `contact.preferred_timeframe`.
- New `contact.online_shop__fulfilment_method` (TEXT).
- New `contact.online_shop__delivery_address` (LARGE_TEXT).
- New `contact.online_shop__delivery_postcode` (TEXT).
- Use the native contact address fields for the customer's *billing/contact address* only, where appropriate. Do not overwrite those with a different ship-to location.

Customer-facing fulfilment choices: **Workshop installation / Collect from Rowville / Request delivery quote**. Show delivery street, suburb, state, postcode only for delivery. Clear delivery details if switching to workshop collection or installation.

Create a GHL form-submitted workflow that adds an opportunity to `EVF | Online Quote Requests` → `New Website Request`, with the complete selected configuration. This requires the GHL UI: the connected form API cannot create forms and workflow API is not enabled in this subaccount. The website form must be connected through a secure server-side endpoint or replaced by the newly created GHL embed **after** the form exists and is tested.

**Do not launch or enable the submit button** until a working integration can store details safely and an end-to-end dummy submission proves the full custom build details, address and source are preserved.

## 30% deposit / booking
Only send a final formal quote after Elite verifies manufacturing requirements, freight, GST and availability. Only after acceptance and a verified **30% deposit** should a customer be offered a date, and all in-house / online production capacity must share a single schedule.

## Regression tests
1. Test the shop at mobile widths (~375px) and desktop; cart, configurators, product detail pages and search/filter should all work.
2. Select a Toyota HiAce (correct year/door type) and a compatible window guard. Confirm unsupported van models do not show window guards.
3. Configure custom drawers and shelving, add to quote, adjust quantities, then check the exact dimensions and selected sections in the quote summary and GHL form prefill.
4. Change the vehicle: confirm previously selected incompatible items are cleared.
5. After creating the new online form and integration, open the secure form and test with a **dummy contact** only. Verify every line and custom measurement is saved to the GHL contact/opportunity; do not send live quotes.
6. Submit via the normal existing quote page to ensure its current conversion tracking and manifest are not affected.
7. Verify a test in-house job and a test online job cannot reserve the same limited workshop production window. This protection is **not yet implemented**, and drop-off appointment limits alone do not protect multi-day workshop work.
8. Check the homepage, About, Fitouts and Protection menus link to `shop.html` in the deployment preview.
9. Confirm production deploy source (the connected Vercel account visible to ChatGPT does not list a deployment for this GitHub repository) before merging or publishing.

## Existing assets intentionally untouched
- `quote.html` and its existing GHL embed and tracking
- GHL's live $300-deposit estimate template (requires separate 30% version)
- GHL's existing internal booking calendar
- All customer and opportunity records
