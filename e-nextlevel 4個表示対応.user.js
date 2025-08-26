// ==UserScript==
// @name         e-nextlevel 4個表示対応 (再調整版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  e-nextlevelの求人リストを4個表示にする再調整版
// @author       You
// @match        https://www.e-nextlevel.jp/work/list*
// @match        https://www.e-nextlevel.jp/work/long-list*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log('e-nextlevel 4個表示対応 Userscript starting...');

    // CSSの挿入
    function injectCSS() {
        GM_addStyle(`
            /* グリッドコンテナのスタイル */
            .e-nextlevel-grid-container {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
                gap: 20px !important;
                padding: 20px !important;
                margin-left: auto !important;
                margin-right: auto !important;
                max-width: 1200px !important;
            }

            /* 各求人カードのスタイル */
            .my-list__jobs--item {
                background-color: #fff !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 8px !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                overflow: hidden !important;
                text-decoration: none !important;
                color: inherit !important;
            }

            .my-list__jobs--item:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }

            /* 画像のスタイル調整 */
            .my-list__jobs--item--image {
                position: relative !important;
            }
            .my-list__jobs--item--image--image {
                width: 100% !important;
                height: 120px !important;
                object-fit: cover !important;
            }

            /* お気に入りアイコンのスタイル調整 */
            .job-item__keep-icon {
                position: absolute !important;
                top: 8px !important;
                right: 8px !important;
                z-index: 10 !important;
            }
            .job-item__keep-icon img {
                width: 28px !important;
                height: 28px !important;
                border-radius: 50% !important;
                background-color: rgba(255, 255, 255, 0.8) !important;
            }
        `);
        console.log("CSS injected successfully.");
    }
    
    // グリッドクラスの適用とDOMの監視
    function applyGrid() {
        // 求人カードの親要素を特定
        const firstJobItem = document.querySelector('.my-list__jobs--item');
        if (firstJobItem) {
            let container = firstJobItem.parentElement;
            let foundContainer = false;
            // 複数個のmy-list__jobs--itemを持つ親要素を探す
            while(container && container !== document.body) {
                if (container.querySelectorAll('.my-list__jobs--item').length > 1) {
                    container.classList.add('e-nextlevel-grid-container');
                    foundContainer = true;
                    console.log('Grid container found and class applied.');
                    break;
                }
                container = container.parentElement;
            }
            if (!foundContainer) {
                console.log('Grid container not found. Retrying...');
                setTimeout(applyGrid, 1000);
            }
        }
    }

    // DOMの変更を監視し、動的にロードされる求人にも対応
    const observer = new MutationObserver((mutations, obs) => {
        if (!document.querySelector('.e-nextlevel-grid-container')) {
            applyGrid();
        }
    });

    function init() {
        console.log('Initializing script...');
        injectCSS();
        applyGrid();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
