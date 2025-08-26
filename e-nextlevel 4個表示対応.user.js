// ==UserScript==
// @name         e-nextlevel 4個表示対応
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  e-nextlevelの求人リストを4個表示対応にする
// @author       You
// @match        https://www.e-nextlevel.jp/work/list*
// @match        https://www.e-nextlevel.jp/work/long-list*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log('e-nextlevel 4個表示対応 Userscript starting...');

    // CSSを挿入
    function injectCSS() {
        const css = `
            /* 4個表示対応のレスポンシブグリッド */
            .my-list__jobs {
                display: grid !important;
                gap: 16px !important;
                padding: 20px !important;
            }
            
            @media (max-width: 480px) {
                .my-list__jobs { grid-template-columns: 1fr !important; gap: 12px !important; }
            }
            @media (min-width: 481px) and (max-width: 768px) {
                .my-list__jobs { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
            }
            @media (min-width: 769px) and (max-width: 900px) {
                .my-list__jobs { grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; }
            }
            @media (min-width: 901px) {
                .my-list__jobs { grid-template-columns: repeat(4, 1fr) !important; gap: 18px !important; }
            }
            @media (min-width: 1400px) {
                .my-list__jobs { max-width: 1200px !important; margin: 0 auto !important; gap: 20px !important; }
            }
            
            .my-list__jobs--item {
                background: #fff !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 8px !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                overflow: hidden !important;
            }
            .my-list__jobs--item:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }
            .my-list__jobs--item img {
                width: 100% !important;
                height: auto !important;
                max-height: 120px !important;
                object-fit: cover !important;
            }
        `;

        if (!document.getElementById("nextlevel-grid-styles")) {
            const style = document.createElement("style");
            style.id = "nextlevel-grid-styles";
            style.textContent = css;
            document.head.appendChild(style);
            console.log("CSS injected successfully");
        }
    }

    // 求人コンテナを見つけてクラスを適用
    function findAndApplyGrid() {
        const jobLinks = document.querySelectorAll('a[href*="/work/detail/"]');
        console.log('Found job links:', jobLinks.length);

        if (jobLinks.length === 0) {
            setTimeout(findAndApplyGrid, 1000);
            return;
        }

        let container = jobLinks[0];
        while (container && container !== document.body) {
            const childLinks = container.querySelectorAll('a[href*="/work/detail/"]');
            if (childLinks.length >= Math.min(jobLinks.length * 0.8, 4)) {
                break;
            }
            container = container.parentElement;
        }

        if (container && container !== document.body) {
            container.classList.add('my-list__jobs');
            const children = container.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].querySelector('a[href*="/work/detail/"]')) {
                    children[i].classList.add('my-list__jobs--item');
                }
            }
            console.log('Applied classes to', children.length, 'items');
        }
    }

    function init() {
        console.log('Initializing...');
        injectCSS();
        setTimeout(findAndApplyGrid, 500);

        const observer = new MutationObserver(() => {
            if (!document.querySelector('.my-list__jobs')) {
                findAndApplyGrid();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('resize', () => {
            console.log('Resized:', window.innerWidth, window.innerHeight);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
