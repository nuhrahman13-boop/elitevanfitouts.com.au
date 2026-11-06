/* Elite Van Fitouts — one secure GHL form for each fulfilment route.
 * A quote request does not create an order, booking or Zip payment. */
const EVF_GHL_FORMS = Object.freeze({
  online: {id:'o0oXdsC9oE4Ywv3u710U',name:'online form',height:1269},
  workshop: {id:'DHGvcQD4xgCfwCbG0Cqm',name:'WEB - Fitout Config.',height:951}
});
function evfIsOnlineRoute(value){
  return /online|delivery|deliver|shipp?ing|courier/i.test(String(value||''));
}
function evfSummaryText(details){
  const lines=[];
  const add=(label,value)=>{if(value!==null&&value!==undefined&&String(value).trim())lines.push(label+': '+String(value).trim());};
  const m=details||{};
  add('REQUEST','Fitout quotation only — not a purchase or booking');
  add('PACKAGE / SETUP',m.package||(m.drawer_system&&m.drawer_system.name)||'Custom van fitout');
  const price=m.quoted_package_price_aud||(m.drawer_system&&m.drawer_system.price_aud);
  if(price&&Number.isFinite(Number(price)))add('ADVERTISED PACKAGE PRICE (AUD, subject to final quote)',Number(price).toLocaleString('en-AU'));
  add('SUPPLY OPTION',m.fulfilment||'Not selected');
  if(m.drawer_system){
    add('DRAWER SYSTEM SPECIFICATION',m.drawer_system.spec||'');
    if(m.drawer_system.config)add('DRAWER CONFIGURATION',JSON.stringify(m.drawer_system.config));
  }
  if(Array.isArray(m.extras)&&m.extras.length){
    add('SELECTED EXTRAS',m.extras.map(x=>x.name+(x.details?' ('+x.details+')':'')+(x.config?' '+JSON.stringify(x.config):'')).join('; '));
  }else add('EXTRAS','None selected');
  if(m.special_requests)add('SPECIAL REQUESTS',m.special_requests);
  if(m.customisation)add('CUSTOMISATION',m.customisation);
  add('PAYMENT','Payment options, including Zip where available, discussed after the team confirms the quote');
  return lines.join('\n');
}
function showSecureEnquiry(node,details){
  if(!node)return;
  const online=evfIsOnlineRoute(details&&details.fulfilment);
  const config=online?EVF_GHL_FORMS.online:EVF_GHL_FORMS.workshop;
  const routeName=online?'Online Order — delivery':'Pickup or workshop fitout';
  const summary=evfSummaryText(details);
  const url=new URL('https://links.elitebrandscaling.com/widget/form/'+config.id);
  // Request best-effort pre-fill. Some GHL custom fields may not accept URL parameters.
  url.searchParams.set('package_selection',summary.slice(0,2400));
  url.searchParams.set('supply_method',String(details?.fulfilment||routeName));
  url.searchParams.set('utm_source','elite-van-fitouts');
  url.searchParams.set('utm_medium','website_quote');
  node.replaceChildren();
  node.classList.remove('hidden');
  node.classList.add('evf-ghl-handoff');
  const title=document.createElement('h3');title.className='secure-title';title.textContent='YOUR QUOTE REQUEST · '+routeName;node.appendChild(title);
  const explain=document.createElement('p');explain.className='secure-note';
  explain.textContent='Complete the secure form below to request a quote. Our team will contact you to confirm your van, layout, any extras, availability and final pricing. This does not place an order, reserve a fitting date or charge you.';
  node.appendChild(explain);
  const summaryBox=document.createElement('div');summaryBox.className='evf-ghl-summary';node.appendChild(summaryBox);
  const subtitle=document.createElement('strong');subtitle.textContent='Your selected build';summaryBox.appendChild(subtitle);
  const pre=document.createElement('pre');pre.className='quote-summary-code';pre.textContent=summary;summaryBox.appendChild(pre);
  const copy=document.createElement('button');copy.type='button';copy.className='btn btn-outline evf-ghl-copy';copy.textContent='COPY BUILD DETAILS';summaryBox.appendChild(copy);
  copy.addEventListener('click',async()=>{
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(summary);
      else {const field=document.createElement('textarea');field.value=summary;document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('copy unavailable');}
      copy.textContent='COPIED ✓';
    }catch(e){pre.focus();copy.textContent='SELECT AND COPY DETAILS ABOVE';}
  });
  const guide=document.createElement('p');guide.className='secure-note evf-ghl-guide';
  guide.textContent='Important: check that the “package selection” field in the form contains your correct setup and extras. If it is blank, use Copy Build Details above and paste them there. This ensures we know exactly what you are requesting.';
  node.appendChild(guide);
  const iframe=document.createElement('iframe');
  iframe.id='inline-'+config.id;
  iframe.title=config.name+' — Elite Van Fitouts quote request';
  iframe.src=url.toString();
  iframe.loading='eager';
  iframe.style.cssText='display:block;width:100%;height:'+config.height+'px;min-height:'+config.height+'px;border:0;border-radius:10px;background:#fff;margin-top:14px';
  iframe.setAttribute('data-form-id',config.id);
  iframe.setAttribute('data-form-name',config.name);
  iframe.setAttribute('data-height',String(config.height));
  iframe.setAttribute('data-layout',"{'id':'INLINE'}");
  iframe.setAttribute('data-layout-iframe-id','inline-'+config.id);
  iframe.setAttribute('data-trigger-type','alwaysShow');
  iframe.setAttribute('data-activation-type','alwaysActivated');
  iframe.setAttribute('data-deactivation-type','neverDeactivate');
  iframe.setAttribute('data-cookie-consent','true');
  iframe.setAttribute('data-cookie-consent-provider','auto');
  node.appendChild(iframe);
  const backup=document.createElement('p');backup.className='secure-note';node.appendChild(backup);
  backup.append('Form not displaying? ');
  const link=document.createElement('a');link.href=url.toString();link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open this same secure quote form in a new tab ↗';backup.appendChild(link);
  const final=document.createElement('p');final.className='secure-note evf-ghl-final';
  final.textContent='Zip is optional and can be discussed after your formal quote is reviewed and accepted. No finance application or payment takes place on this page.';
  node.appendChild(final);
  if(!document.getElementById('evf-ghl-embed-script')){
    const script=document.createElement('script');script.id='evf-ghl-embed-script';script.src='https://links.elitebrandscaling.com/js/form_embed.js';script.async=true;document.body.append(script);
  }
  node.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}