(function () {
    'use strict';

    const STORAGE_KEY = 'elite_build_manifest';
    const LEGACY_CART_KEY = 'elite_build_cart';

    const DEFAULT_MANIFEST = {
        version: 2,
        fitout: {
            configured: false,
            systemType: 'Drawer System',
            pkg: 'Essential',
            maxModules: 0,
            finish: '12mm Hex (Base)',
            addons: {
                'Crate Shelves': 0,
                'Toolbox Shelves': 0,
                'Organiser Shelves': 0,
                'Silicone Holder': 0
            }
        },
        protection: {
            plyLining: { selected: false, finish: 'Hex Ply' },
            flooring: { selected: false, finish: 'Hex Ply' },
            cargoBarrier: { selected: false, finish: 'Hex Ply' }
        },
        extras: [],
        updatedAt: null
    };

    const PROTECTION_LABELS = {
        plyLining: 'Ply Lining',
        flooring: 'Flooring',
        cargoBarrier: 'Cargo Barrier'
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function normaliseManifest(raw) {
        const next = clone(DEFAULT_MANIFEST);

        if (raw && raw.version === 2) {
            next.fitout = {
                ...next.fitout,
                ...(raw.fitout || {}),
                addons: {
                    ...next.fitout.addons,
                    ...((raw.fitout && raw.fitout.addons) || {})
                }
            };
            Object.keys(next.protection).forEach((key) => {
                next.protection[key] = {
                    ...next.protection[key],
                    ...((raw.protection && raw.protection[key]) || {})
                };
            });
            next.extras = Array.isArray(raw.extras) ? raw.extras : [];
            next.updatedAt = raw.updatedAt || null;
        } else if (raw && raw.systemType) {
            // Migrate the original fitouts.html manifest without losing a saved build.
            next.fitout = {
                ...next.fitout,
                configured: true,
                systemType: raw.systemType,
                pkg: raw.pkg || next.fitout.pkg,
                maxModules: Number.isFinite(raw.maxModules) ? raw.maxModules : next.fitout.maxModules,
                finish: raw.finish || next.fitout.finish,
                addons: { ...next.fitout.addons, ...(raw.addons || {}) }
            };
        }

        const legacyCart = safeParse(localStorage.getItem(LEGACY_CART_KEY), []);
        if (Array.isArray(legacyCart)) {
            next.extras = [...new Set([...next.extras, ...legacyCart.filter(Boolean)])];
        }

        next.version = 2;
        return next;
    }

    function read() {
        return normaliseManifest(safeParse(localStorage.getItem(STORAGE_KEY), null));
    }

    function write(manifest) {
        const next = normaliseManifest(manifest);
        next.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('elite-build-updated', { detail: clone(next) }));
        render();
        return clone(next);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function selectedModules(fitout) {
        return Object.entries(fitout.addons || {})
            .filter(([, quantity]) => Number(quantity) > 0)
            .map(([name, quantity]) => `${quantity}x ${name}`);
    }

    function getSelectedProtection(manifest) {
        return Object.entries(manifest.protection || {})
            .filter(([, item]) => item && item.selected)
            .map(([key, item]) => ({ key, label: PROTECTION_LABELS[key], finish: item.finish }));
    }

    function buildCount(manifest) {
        return (manifest.fitout && manifest.fitout.configured ? 1 : 0)
            + getSelectedProtection(manifest).length
            + (manifest.extras || []).length;
    }

    function injectStyles() {
        if (document.getElementById('elite-build-tracker-styles')) return;
        const style = document.createElement('style');
        style.id = 'elite-build-tracker-styles';
        style.textContent = `
            #elite-build-tracker {
                position: fixed; right: 24px; bottom: 24px; z-index: 120;
                width: min(380px, calc(100vw - 32px)); color: #fff;
                background: rgba(5, 5, 5, 0.97); border: 1px solid #22c55e;
                border-radius: 12px; overflow: hidden; box-shadow: 0 18px 55px rgba(0,0,0,.55), 0 0 28px rgba(34,197,94,.2);
                font-family: Inter, Arial, sans-serif;
            }
            #elite-build-tracker.is-minimised { width: auto; }
            #elite-build-tracker.is-minimised .elite-tracker-body { display: none; }
            .elite-tracker-head {
                width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 18px;
                padding: 13px 16px; border: 0; color: #fff; background: #0d0d0d; cursor: pointer;
                font: 800 11px/1.2 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .08em;
            }
            .elite-tracker-head-main { display: flex; align-items: center; gap: 9px; white-space: nowrap; }
            .elite-tracker-pulse { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 10px #22c55e; }
            .elite-tracker-toggle { color: #4ade80; white-space: nowrap; }
            .elite-tracker-body { padding: 14px; border-top: 1px solid #202020; max-height: min(62vh, 520px); overflow-y: auto; }
            .elite-tracker-section { padding: 12px; border: 1px solid #242424; border-radius: 9px; background: #0a0a0a; margin-bottom: 9px; }
            .elite-tracker-section-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 7px; }
            .elite-tracker-kicker { color: #22c55e; font: 800 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
            .elite-tracker-edit { color: #9ca3af; font: 700 9px/1.2 'JetBrains Mono', monospace; text-decoration: none; text-transform: uppercase; }
            .elite-tracker-edit:hover { color: #4ade80; }
            .elite-tracker-title { color: #fff; font-size: 13px; font-weight: 800; line-height: 1.35; }
            .elite-tracker-meta { color: #8b8b8b; margin-top: 3px; font: 500 10px/1.45 'JetBrains Mono', monospace; }
            .elite-tracker-empty { color: #6b7280; font: 500 10px/1.45 'JetBrains Mono', monospace; }
            .elite-tracker-row { padding: 7px 0; border-top: 1px solid #1d1d1d; }
            .elite-tracker-row:first-of-type { border-top: 0; padding-top: 1px; }
            .elite-tracker-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
            .elite-tracker-actions a {
                min-height: 40px; display: flex; align-items: center; justify-content: center; padding: 9px;
                border-radius: 7px; text-decoration: none; text-align: center;
                font: 800 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .05em; text-transform: uppercase;
            }
            .elite-tracker-actions a:first-child { color: #050505; background: #22c55e; border: 1px solid #22c55e; }
            .elite-tracker-actions a:last-child { color: #fff; background: #111; border: 1px solid #333; }
            @media (max-width: 640px) {
                #elite-build-tracker { right: 16px; bottom: 16px; }
                #elite-build-tracker.is-minimised { max-width: calc(100vw - 32px); }
                .elite-tracker-head { padding: 12px 14px; }
            }
        `;
        document.head.appendChild(style);
    }

    function mount() {
        if (document.getElementById('elite-build-tracker')) return;
        injectStyles();
        const tracker = document.createElement('aside');
        tracker.id = 'elite-build-tracker';
        tracker.className = 'is-minimised';
        tracker.setAttribute('aria-label', 'Your saved Elite build');
        tracker.innerHTML = `
            <button class="elite-tracker-head" type="button" aria-expanded="false">
                <span class="elite-tracker-head-main"><span class="elite-tracker-pulse"></span>Your Build (<span id="elite-tracker-count">0</span>)</span>
                <span class="elite-tracker-toggle">[+] Expand</span>
            </button>
            <div class="elite-tracker-body" id="elite-tracker-body"></div>
        `;
        tracker.querySelector('.elite-tracker-head').addEventListener('click', toggle);
        document.body.appendChild(tracker);
        render();
    }

    function toggle(forceOpen) {
        const tracker = document.getElementById('elite-build-tracker');
        if (!tracker) return;
        const shouldOpen = typeof forceOpen === 'boolean'
            ? forceOpen
            : tracker.classList.contains('is-minimised');
        tracker.classList.toggle('is-minimised', !shouldOpen);
        const button = tracker.querySelector('.elite-tracker-head');
        button.setAttribute('aria-expanded', String(shouldOpen));
        tracker.querySelector('.elite-tracker-toggle').textContent = shouldOpen ? '[-] Minimise' : '[+] Expand';
    }

    function render() {
        const tracker = document.getElementById('elite-build-tracker');
        if (!tracker) return;
        const manifest = read();
        const fitout = manifest.fitout;
        const protection = getSelectedProtection(manifest);
        const modules = selectedModules(fitout);
        const count = buildCount(manifest);

        tracker.querySelector('#elite-tracker-count').textContent = count;
        const fitoutHtml = fitout.configured
            ? `<div class="elite-tracker-title">${escapeHtml(fitout.systemType)} · ${escapeHtml(fitout.pkg)}</div>
               <div class="elite-tracker-meta">${escapeHtml(fitout.finish)}${modules.length ? `<br>${escapeHtml(modules.join(', '))}` : ''}</div>`
            : '<div class="elite-tracker-empty">No fitout configuration saved yet.</div>';

        const protectionHtml = protection.length
            ? protection.map((item) => `<div class="elite-tracker-row"><div class="elite-tracker-title">${escapeHtml(item.label)}</div><div class="elite-tracker-meta">${escapeHtml(item.finish)}</div></div>`).join('')
            : '<div class="elite-tracker-empty">No protection options selected yet.</div>';

        const extrasHtml = manifest.extras.length
            ? `<div class="elite-tracker-section">
                   <div class="elite-tracker-section-head"><span class="elite-tracker-kicker">Other interests</span></div>
                   ${manifest.extras.map((item) => `<div class="elite-tracker-row"><div class="elite-tracker-title">${escapeHtml(item)}</div></div>`).join('')}
               </div>`
            : '';

        tracker.querySelector('#elite-tracker-body').innerHTML = `
            <div class="elite-tracker-section">
                <div class="elite-tracker-section-head"><span class="elite-tracker-kicker">Fitout system</span><a class="elite-tracker-edit" href="fitouts.html">Edit →</a></div>
                ${fitoutHtml}
            </div>
            <div class="elite-tracker-section">
                <div class="elite-tracker-section-head"><span class="elite-tracker-kicker">Protection</span><a class="elite-tracker-edit" href="protection.html">Edit →</a></div>
                ${protectionHtml}
            </div>
            ${extrasHtml}
            <div class="elite-tracker-actions">
                <a href="fitouts.html">Configure Fitout</a>
                <a href="protection.html">Add Protection</a>
            </div>
        `;
    }

    const api = {
        get: () => clone(read()),
        save: (manifest) => write(manifest),
        setFitout: (fitout) => {
            const manifest = read();
            manifest.fitout = {
                ...manifest.fitout,
                ...clone(fitout),
                configured: fitout.configured !== false,
                addons: { ...manifest.fitout.addons, ...((fitout && fitout.addons) || {}) }
            };
            return write(manifest);
        },
        setProtection: (protection) => {
            const manifest = read();
            Object.keys(manifest.protection).forEach((key) => {
                if (protection && protection[key]) {
                    manifest.protection[key] = { ...manifest.protection[key], ...clone(protection[key]) };
                }
            });
            return write(manifest);
        },
        addExtra: (itemName) => {
            const manifest = read();
            if (itemName && !manifest.extras.includes(itemName)) manifest.extras.push(itemName);
            const saved = write(manifest);
            toggle(true);
            return saved;
        },
        render,
        toggle
    };

    window.EliteBuild = api;
    // Preserve the homepage's original action-button API while using the shared manifest.
    window.addToBuild = (itemName) => api.addExtra(itemName);
    window.toggleBuildDrawer = () => api.toggle();
    window.passCartToForm = () => sessionStorage.setItem('elite_quote_summary', JSON.stringify(api.get()));

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
