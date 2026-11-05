const EVF_FORM_ID='o0oXdsC9oE4Ywv3u710U';
const EVF_FORM_BASE='https://links.elitebrandscaling.com/widget/form/'+EVF_FORM_ID;
function showSecureEnquiry(node,details){
 const summary=JSON.stringify(details);
 node.textContent='';
 node.classList.remove('hidden');
 const heading=document.createElement('h3');heading.textContent='Complete your secure enquiry';heading.className='secure-title';node.appendChild(heading);
 const p=document.createElement('p');p.className='secure-note';p.textContent='Your fitout choices are shown below. Complete the secure GoHighLevel form to send your enquiry. A quote is not confirmed until our team reviews it.';node.appendChild(p);
 const pre=document.createElement('pre');pre.textContent=summary;pre.className='quote-summary-code';node.appendChild(pre);
 const actions=document.createElement('div');actions.className='secure-actions';node.appendChild(actions);
 const copy=document.createElement('button');copy.type='button';copy.textContent='COPY BUILD DETAILS';copy.className='btn btn-outline';actions.appendChild(copy);
 copy.addEventListener('click',()=>{if(navigator.clipboard?.writeText){navigator.clipboard.writeText(summary).then(()=>copy.textContent='COPIED ✓').catch(()=>fallbackCopy(summary));}else fallbackCopy(summary);});
 const url=new URL(EVF_FORM_BASE);url.searchParams.set('package_selection',summary.slice(0,3000));url.searchParams.set('utm_source','elite-van-fitouts');url.searchParams.set('utm_medium','website');
 if(details.fulfilment)url.searchParams.set('supply_method',details.fulfilment);
 if(details.vehicle?.make)url.searchParams.set('vehicle_make',details.vehicle.make);
 if(details.vehicle?.year)url.searchParams.set('vehicle_year',String(details.vehicle.year));
 const external=document.createElement('a');external.href=url.href;external.target='_blank';external.rel='noopener noreferrer';external.className='secure-link';external.textContent='Form not loading? Open secure enquiry in a new tab ↗';actions.appendChild(external);
 const status=document.createElement('p');status.className='secure-note';status.textContent='You may need to complete a security check. If your full build details do not appear automatically in the form, paste the copied build details into its message field.';node.appendChild(status);
 const f=document.createElement('iframe');f.id='inline-'+EVF_FORM_ID;f.title='Elite Van Fitouts secure enquiry form';f.src=url.href;f.loading='lazy';f.style.cssText='display:block;width:100%;min-height:1100px;border:0;border-radius:10px;background:white;margin-top:16px';f.setAttribute('data-form-id',EVF_FORM_ID);f.setAttribute('data-layout',"{'id':'INLINE'}");f.setAttribute('data-trigger-type','alwaysShow');f.setAttribute('data-activation-type','alwaysActivated');f.setAttribute('data-deactivation-type','neverDeactivate');f.setAttribute('data-form-name','Elite Van Fitouts Online Shop Enquiry');f.setAttribute('data-height','1100');f.setAttribute('data-layout-iframe-id','inline-'+EVF_FORM_ID);node.appendChild(f);
 if(!document.getElementById('evf-ghl-embed-script')){const s=document.createElement('script');s.id='evf-ghl-embed-script';s.src='https://links.elitebrandscaling.com/js/form_embed.js';s.async=true;document.body.appendChild(s);}
 node.scrollIntoView({behavior:'smooth',block:'start'});
}
function fallbackCopy(s){const el=document.createElement('textarea');el.value=s;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch(e){}el.remove();}