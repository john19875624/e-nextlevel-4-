// ==UserScript==
// @name         e-nextlevel 4個表示対応 (最終調整版)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  e-nextlevelの求人リストを4個表示にする最終調整版
// @author       You
// @match        https://www.e-nextlevel.jp/work/list*
// @match        https://www.e-nextlevel.jp/work/long-list*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log('e-nextlevel 4個表示対応 Userscript starting...');

    // -------------------------------------------------------------
    // CSSを挿入
    // -------------------------------------------------------------
    function injectCSS() {
        GM_addStyle(`
            /* 親コンテナのスタイル */
            .p-list-work__jobs-container {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
                gap: 20px !important;
            }
            
            /* 各求人カードのスタイル */
            .my-list__jobs--item {
                border-radius: 8px !important;
                border: 1px solid #e0e0e0 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                overflow: hidden !important;
                background-color: #fff !important;
                text-decoration: none !important; /* リンクの下線を非表示に */
                color: inherit !important; /* テキストの色を親から継承 */
                box-sizing: border-box !important;
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

            /* アイコンのスタイル調整（位置を絶対配置にする） */
            .my-list__jobs--item--image .job-item__keep-icon {
                position: absolute !important;
                top: 8px !important;
                right: 8px !important;
                background: rgba(255, 255, 255, 0.8) !important;
                border-radius: 50% !important;
                padding: 4px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .my-list__jobs--item--image .job-item__keep-icon img {
                width: 20px !important;
                height: 20px !important;
            }
        `);
        console.log("CSS injected successfully.");
    }
    
    // -------------------------------------------------------------
    // メインロジック
    // -------------------------------------------------------------
    function applyGridClasses() {
        const jobItems = document.querySelectorAll('.my-list__jobs--item');
        if (jobItems.length > 0) {
            let container = jobItems[0].parentElement;
            while(container && container !== document.body) {
                // コンテナにグリッドクラスを付与
                if (container.children.length >= jobItems.length) {
                    container.classList.add('p-list-work__jobs-container');
                    console.log('Grid container class applied.');
                    break;
                }
                container = container.parentElement;
            }
        } else {
            console.log('No job items found. Retrying...');
            setTimeout(applyGridClasses, 500);
        }
    }

    // MutationObserverでDOMの変更を監視し、新しい求人にもクラスを適用
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                applyGridClasses();
            }
        });
    });

    function init() {
        console.log('Initializing...');
        injectCSS();
        applyGridClasses();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('DOMContentLoaded', init);

})();
