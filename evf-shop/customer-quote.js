const quoteParams = new URLSearchParams(location.search);
const packageChoice = PRODUCTS.find(product => product.slug === quoteParams.get('package'));
const useBuild = quoteParams.has('build');
const isProtection = quoteParams.has('protection');
const needsDesignHelp = quoteParams.has('help');
const build = getBuild();
const protection = window.EliteBuild?.get().protection;
const protectionNames = {plyLining:'Ply lining', flooring:'Flooring', cargoBarrier:'Cargo barrier'};
const protectionExtras = Object.entries(protectionNames)
  .filter(([key]) => protection?.[key]?.selected)
  .map(([key, name]) => ({name, details:protection[key].finish}));

const drawer = useBuild ? build.base : null;
const includeBuildExtras = useBuild || (packageChoice && packageChoice.slug === build.base?.key);
const details = {
  package: packageChoice?.name || (isProtection ? 'Van protection' : undefined),
  quoted_package_price_aud: packageChoice?.price,
  drawer_system: drawer && {name:drawer.name, price_aud:drawer.price, spec:drawer.desc, config:drawer.config},
  extras: isProtection ? protectionExtras : includeBuildExtras
    ? build.addons.map(extra => ({name:extra.name, details:extra.desc || extra.description, config:extra.config}))
    : [],
  special_requests: needsDesignHelp ? 'Customer would like help designing a fitout.' : undefined
};
const title = document.getElementById('quote-title');
const back = document.getElementById('quote-back');
if (isProtection) {
  title.textContent = 'Get a van protection quote';
  back.textContent = '← Van protection options';
  back.href = '/protection.html#protection-options-title';
} else if (needsDesignHelp) {
  title.textContent = 'Let’s design your fitout';
} else if (packageChoice) {
  back.textContent = '← ' + packageChoice.name;
  back.href = path(packageChoice.slug);
} else if (useBuild) {
  back.textContent = '← Edit your build';
  back.href = '/fitouts.html#build-summary';
}
const selection = document.getElementById('quote-selection');
const selectedItems = [details.package || drawer?.name, ...details.extras.map(extra =>
  isProtection && extra.details ? extra.name + ' (' + extra.details + ')' : extra.name
)].filter(Boolean);
if (selectedItems.length) {
  selection.textContent = selectedItems.join(' · ');
  selection.hidden = false;
}

const fulfilment = document.getElementById('quote-supply');
const formPanel = document.getElementById('quote-form-panel');
const previewForm = document.getElementById('quote-preview-template');
const isReviewDeployment = location.hostname.endsWith('-elite-van-fitouts.vercel.app')
  && location.hostname !== 'elitevanfitouts-com-au-elite-van-fitouts.vercel.app';
if (isReviewDeployment) {
  formPanel.append(previewForm.content.cloneNode(true));
  formPanel.querySelector('form').addEventListener('submit', event => event.preventDefault());
}

function renderQuoteForm() {
  if (isReviewDeployment) {
    const mode = fulfilment.value;
    formPanel.querySelector('[data-preview-delivery]').hidden = mode !== 'delivery';
    formPanel.querySelector('[data-preview-route]').textContent = mode === 'delivery' ? 'Delivery enquiry' : 'Workshop enquiry';
    return;
  }
  showSecureEnquiry(formPanel, {
    ...details,
    fulfilment: fulfilment.selectedOptions[0].textContent,
    compact: true
  });
}
fulfilment.addEventListener('change', renderQuoteForm);
renderQuoteForm();
