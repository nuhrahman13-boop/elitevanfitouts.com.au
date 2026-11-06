/* Elite Van Fitouts: Zip enquiry messaging and transparent budgeting illustrations.
   No finance approval, financing quote, checkout, or Zip payment API is performed here. */
(function(){
  'use strict';
  const items=typeof PRODUCTS==='undefined'?[]:PRODUCTS;
  if(!items.length)return;
  const amount=n=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const dollars=n=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n);
  const guide=document.body.dataset.product?'../../fitouts.html#zip-payment-options':'#zip-payment-options';
  const weekly=p=>amount(p.price/52);

  // One weekly budget figure is already shown next to the full price.
  document.querySelectorAll('.evf-stage .product-card').forEach((card,i)=>{
    const p=items[i],anchor=card.querySelector('.card-bottom');
    if(!p||!anchor||card.querySelector('.evf-zip-card-link'))return;
    const a=document.createElement('a');a.href=guide;a.className='evf-zip-card-link';
    a.textContent='ZIP PAYMENT OPTIONS (AFTER QUOTE) ↗';
    a.style.cssText='display:block;margin:10px 18px 14px;color:#286e32;font-size:10px;font-weight:900;text-decoration:underline;text-underline-offset:2px;';
    anchor.insertAdjacentElement('afterend',a);
  });
  document.querySelectorAll('[data-zip-finance]').forEach((section,index)=>{
    const termId='evf-zip-term-'+index;
    section.innerHTML=`<div class="evf-zip-inner"><div class="evf-zip-grid">
      <div class="evf-zip-promo"><div class="evf-zip-identity" aria-label="Zip payment enquiries">zip</div><span class="evf-zip-overline">FLEXIBLE PAYMENT ENQUIRIES</span><h2>QUOTE FIRST.<br><em>ZIP AFTER APPROVAL.</em></h2><p>Ask about Zip when you request your Elite Van Fitouts quote. We'll confirm whether Zip is available for your order and guide you through the merchant payment request after your quote is accepted.</p><p class="evf-zip-smalltext">Zip eligibility, available credit, repayment frequency and fees depend on the customer's approved account. This website does not provide credit approval or process Zip transactions.</p><a href="${section.closest('#elite-fitout-products')?'#popular':'fitouts.html#popular'}" class="evf-zip-cta">REQUEST A FITOUT QUOTE ↗</a></div>
      <div class="evf-zip-calculator"><span class="evf-zip-overline">PLAN YOUR BUDGET</span><h3>Compare payment examples</h3><p>Choose a target payoff period to see how much of the listed package price you would need to put aside. These are <strong>mathematical examples only</strong>, not Zip instalment amounts or guaranteed finance terms.</p><div class="evf-zip-control"><label for="${termId}">Illustrative payoff target</label><select id="${termId}" aria-label="Choose budgeting period"><option value="52">12 months (52 weeks)</option><option value="26">6 months (26 weeks)</option></select></div><div class="evf-zip-table-scroll"><table class="evf-zip-table"><thead><tr><th>Fitout package</th><th>Price*</th><th>Per week*</th><th>Per month*</th></tr></thead><tbody data-zip-table></tbody></table></div><p class="evf-zip-legal"><strong>*Budgeting examples only.</strong> Based solely on listed package prices divided by 26 or 52 weeks (or 6 or 12 months). They exclude possible GST adjustments, account fees, establishment charges, interest, delivery, installation or optional extras. They are not Zip repayments or a finance offer. Actual Zip Money purchases use flexible repayments subject to minimum monthly payments and your individual credit agreement. T&amp;Cs, fees, eligibility and credit approval apply.</p></div>
    </div><div class="evf-zip-steps"><div><b>01</b><strong>Choose your setup</strong><span>Review the full package price and real fitout photos.</span></div><div><b>02</b><strong>Request your quote</strong><span>Select your setup and request a formal quote. Tell our team you would like to discuss Zip when we contact you.</span></div><div><b>03</b><strong>Confirm payment options</strong><span>If available and approved, we can arrange the Zip payment request only after you accept your formal quote.</span></div></div></div>`;
    const term=section.querySelector('select'),tbody=section.querySelector('[data-zip-table]');
    const paint=()=>{const weeks=Number(term.value), months=weeks===52?12:6;tbody.innerHTML=items.map(p=>`<tr><th scope="row">${p.name}</th><td>${dollars(p.price)}</td><td><b>${amount(p.price/weeks)}</b></td><td>${amount(p.price/months)}</td></tr>`).join('')};
    term.addEventListener('change',paint);paint();
  });
  const slug=document.body.dataset.product;
  if(slug){
    const item=items.find(x=>x.slug===slug),price=document.querySelector('.product-price');
    if(item&&price&&!document.querySelector('.evf-zip-product')){
      const note=document.createElement('div');note.className='evf-zip-product';
      note.innerHTML=`<div><span class="evf-zip-word">zip</span><b>Ask about flexible payment options</b></div><p>Budget example: <strong>${weekly(item)}/week*</strong> over 52 weeks, excluding fees. <em>Not a Zip repayment offer.</em></p><a href="../../fitouts.html#zip-payment-options">View payment options and important terms ↗</a>`;
      price.insertAdjacentElement('afterend',note);
    }
  }
})();