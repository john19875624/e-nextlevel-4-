// ==UserScript==
// @name         e-nextlevel 4個表示対応 (最終確定版)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  e-nextlevelの求人リストを4個表示にする最終確定版
// @author       You
// @match        https://www.e-nextlevel.jp/work/list*
// @match        https://www.e-nextlevel.jp/work/long-list*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('e-nextlevel 4個表示対応 Userscript starting...');

    // -------------------------------------------------------------
    // CSSを挿入
    // -------------------------------------------------------------
    function injectCSS() {
        GM_addStyle(`
            /* グリッドコンテナのスタイル */
            /* my-list__jobs--itemの親要素を直接ターゲット */
            .my-list__jobs--item-list-container {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
                gap: 20px !important;
                padding: 20px !important;
                margin: 0 auto !important;
                max-width: 1200px !important;
            }

            /* 各求人カードのスタイル */
            .my-list__jobs--item {
                border-radius: 8px !important;
                border: 1px solid #e0e0e0 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                overflow: hidden !important;
                text-decoration: none !important;
                color: inherit !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05) !important;
            }

            .my-list__jobs--item:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }

            /* 画像のスタイル調整 */
            .my-list__jobs--item--image {
                position: relative !important;
            }
            .my-list__jobs--item--image img {
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
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 4px !important;
                background-color: rgba(255, 255, 255, 0.8) !important;
                border-radius: 50% !important;
            }
        `);
        console.log("CSS injected successfully.");
    }
    
    // -------------------------------------------------------------
    // グリッドクラスの適用とDOMの監視
    // -------------------------------------------------------------
    function applyGrid() {
        // 求人カードの親要素を特定する
        const jobItems = document.querySelectorAll('.my-list__jobs--item');
        if (jobItems.length > 0) {
            let container = jobItems[0].parentElement;
            let foundContainer = false;
            while(container && container !== document.body) {
                if (container.children.length >= jobItems.length && !container.classList.contains('my-list__jobs--item')) {
                    container.classList.add('my-list__jobs--item-list-container');
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
    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('.my-list__jobs--item-list-container')) {
            applyGrid();
        }
    });

    // -------------------------------------------------------------
    // スクリプトの初期化
    // -------------------------------------------------------------
    function init() {
        console.log('Initializing script...');
        // ページ全体がロードされた後に実行
        setTimeout(() => {
            injectCSS();
            applyGrid();
        }, 1000); // 1秒遅延させて、サイトの動的ロード完了を待つ

        // MutationObserverでDOMの変更を継続的に監視
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // スクリプトの実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
