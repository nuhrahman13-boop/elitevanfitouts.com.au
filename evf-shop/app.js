
const PRODUCTS=[{"slug": "3-drawer-system", "name": "3 Drawer System", "price": 3500, "image": "3-drawer-system.webp", "desc": "2 rear drawers + 1 passenger-side drawer. Adjustable internal dividers.", "short": "Two drawers opening at the rear of your van, plus one drawer accessible through the passenger sliding door. A durable flat false floor sits above the storage system.", "feature_note": "Simply lift the dividers out by hand and reposition them to suit your tools, parts and equipment. No tools required to rearrange your storage compartments.", "bullets": ["2 drawers accessible from the rear", "1 drawer accessed through the passenger sliding door", "Black hex-textured plywood and a usable false floor", "Black recessed locking latches"], "number": 1, "eyebrow": "REAR + SIDE ACCESS"}, {"slug": "4-drawer-system", "name": "4 Drawer System", "price": 3750, "image": "4-drawer-system.webp", "desc": "2 rear drawers + 1 drawer through each sliding door. Adjustable internal dividers.", "short": "Two large drawers open at the rear of the van. Two additional drawers extend towards the sliding doors — one to the passenger side and one to the driver side — for convenient access from either side.", "feature_note": "Lift the internal dividers out by hand and move them to suit different tools, stock and equipment — no tools needed to rearrange the compartments.", "bullets": ["2 large rear-access drawers", "1 passenger-side sliding-door drawer", "1 driver-side sliding-door drawer", "Black hex-textured plywood and a flat false floor", "Black recessed locking latches with subtle light-blue key centres"], "number": 2, "eyebrow": "ACCESS FROM BOTH SLIDING DOORS"}, {"slug": "triple-rear-drawer-system", "name": "Triple Rear Drawer System", "price": 4100, "image": "triple-rear-drawer-system.webp", "desc": "Three rear-access drawers: one large and two stacked. Custom layouts with one or two sliding-door-access drawers are also available.", "short": "The standard setup has three drawers accessed from the rear: one large drawer alongside two smaller drawers stacked vertically, with a hard-wearing false floor above. Prefer side access? You can also request a customised layout with one or two drawers opening through the sliding door. Vehicle compatibility, final layout and any price difference are confirmed in your quote.", "feature_note": "Sliding-door drawer option: choose a custom configuration with ONE or TWO drawers opening through the sliding door. Mention your preference in the quote customisation notes. We will confirm the layout and price for your van. Drawer dividers can also be repositioned by hand.", "bullets": ["Standard layout: 1 full-height rear-access drawer", "Standard layout: 2 stacked rear-access drawers", "Optional custom layout: 1 or 2 drawers accessible through the sliding door (quoted separately)", "Black hex-textured finish with plywood edge detailing", "Black recessed locking latches with subtle light-blue key accents"], "number": 3, "eyebrow": "THREE REAR-ACCESS DRAWERS"}, {"slug": "pro-package", "name": "Pro Package", "price": 4250, "image": "pro-package.webp", "desc": "3 Drawer System with full-length driver-side shelving mounted on the false floor.", "short": "The same practical three-drawer arrangement as Setup 01, now paired with a full-length shelving unit on the driver side. The shelving sits on top of the false floor so you retain a usable central loading platform.", "feature_note": "Lift out and reposition the drawer dividers by hand to organise your tools and supplies, without needing tools for the adjustment.", "bullets": ["2 divided drawers opening from the rear", "1 drawer accessed through the passenger-side sliding door", "Full-length driver-side shelving mounted on the false floor", "Black recessed lockable latches and durable hex-ply finish", "Flat false floor above the drawer units"], "number": 4, "eyebrow": "DRAWERS + DRIVER-SIDE SHELVING"}, {"slug": "pro-plus-package", "name": "Pro+ Package", "price": 4750, "image": "pro-plus-package.webp", "desc": "All Pro Package features, plus additional left-side shelving fully supported on the false floor.", "short": "Everything in the Pro Package, with an additional shelving unit on the opposite side. Both shelving units sit completely on top of the false floor, with a clear central loading platform.", "feature_note": "Lift out and reposition the drawer dividers by hand to organise your tools and supplies, without needing tools for the adjustment.", "bullets": ["2 divided drawers opening from the rear", "1 drawer accessed through the passenger-side sliding door", "Full-length shelving on the driver side, plus additional shelving on the opposite side — both fully supported by the false floor", "Black recessed lockable latches and durable hex-ply finish", "Flat false floor above the drawer units"], "number": 5, "eyebrow": "DRAWERS + DUAL-SIDE SHELVING"}];
function money(n){return '$'+n.toLocaleString('en-AU');}
function prefix(){return document.body.dataset.prefix||'';}
function path(slug){return prefix()+'packages/'+slug+'.html';}
function card(p){return `<article class="product-card"><a href="${path(p.slug)}" class="card-image" aria-label="View ${p.name}"><img src="${prefix()}assets/${p.image}" alt="${p.name} fitout design illustration" loading="lazy"></a><div class="card-content"><span class="card-no">SETUP ${String(p.number).padStart(2,'0')}</span><a href="${path(p.slug)}"><h3 class="card-name">${p.name}</h3></a><p class="card-description">${p.desc}</p><div class="card-bottom"><div class="evf-price-options"><div class="evf-price-full"><strong class="price">${money(p.price)}</strong><span class="evf-price-or">or</span></div><div class="evf-weekly"><strong>${money(Math.round(p.price/52))}</strong><span>/week*</span></div></div><a class="card-link" href="${path(p.slug)}">VIEW PACKAGE ↗</a></div></div></article>`;}
document.querySelectorAll('[data-render-products]').forEach(el=>el.innerHTML=PRODUCTS.map(card).join(''));
const menu=document.querySelector('.mobile-menu');if(menu){menu.addEventListener('click',()=>{const n=document.querySelector('.nav-links');const opened=n.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));});}
function readyProduct(){const slug=document.body.dataset.product;if(!slug)return;const p=PRODUCTS.find(p=>p.slug===slug);if(!p)return;
document.title=p.name+' | Elite Van Fitouts Melbourne';
document.querySelectorAll('[data-product-name]').forEach(x=>x.textContent=p.name);
document.querySelectorAll('[data-product-price]').forEach(x=>x.textContent=money(p.price));
document.querySelectorAll('[data-product-no]').forEach(x=>x.textContent=String(p.number).padStart(2,'0'));
document.getElementById('product-image').src=prefix()+'assets/'+p.image;
document.getElementById('product-image').alt=p.name+' concept illustration';
document.getElementById('product-eyebrow').textContent=p.eyebrow;
document.getElementById('product-desc').textContent=p.short;
document.getElementById('feature-note').textContent=p.feature_note;
document.getElementById('spec-list').innerHTML=p.bullets.map(t=>'<li>'+t+'</li>').join('');
const select=document.querySelector('#fulfilment');
const shell=document.querySelector('#form-wrap');
const hint=document.querySelector('#choose-hint');
const result=document.querySelector('#form-result');
const legacyForm=document.querySelector('#quote-form');
if(legacyForm)legacyForm.classList.add('hidden'); // GHL now collects details once, directly.
const modes={
  shop:{title:'Built in Shop — Rowville installation',description:'We will contact you about vehicle fitment and a suitable workshop date.'},
  pickup:{title:'Pickup — collect from Rowville',description:'We will confirm the right kit and pickup arrangements in your quote.'},
  delivery:{title:'Online Order — Delivery',description:'Our team will check vehicle compatibility, delivery address and freight in the final quote.'}
};
function showProductQuoteForm(){
 const mode=modes[select.value];
 shell.classList.toggle('hidden',!mode);
 hint.classList.toggle('hidden',!!mode);
 if(!mode){result.replaceChildren();result.classList.add('hidden');return;}
 document.getElementById('route-title').textContent='Request a quote — '+mode.title;
 document.getElementById('route-summary').textContent=mode.description+' No order or payment is placed yet.';
 const chosen=typeof getBuild==='function'?getBuild():{base:null,addons:[]};
 const selectedExtras=chosen.base&&chosen.base.key===p.slug?(chosen.addons||[]):[];
 showSecureEnquiry(result,{
   package:p.name,
   quoted_package_price_aud:p.price,
   fulfilment:mode.title,
   extras:selectedExtras.map(x=>({name:x.name,details:x.desc||'',config:x.config||null}))
 });
}
select.addEventListener('change',showProductQuoteForm);

}
readyProduct();