// ==UserScript==
// @name         e-nextlevel 4個表示対応 (最終修正版)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  e-nextlevelの求人リストを4個表示にする最終修正版
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
        // `GM_addStyle`を使用し、スタイルを安全に適用
        GM_addStyle(`
            /* 全体コンテナをグリッド化 */
            .p-list-work__jobs {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
                gap: 16px !important;
                padding: 20px !important;
            }
            
            /* 各求人カードのスタイル調整 */
            .p-list-work__jobs > a {
                border-radius: 8px !important;
                border: 1px solid #e0e0e0 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                overflow: hidden !important;
            }

            .p-list-work__jobs > a:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }

            /* 各求人カード内の画像のスタイルを修正 */
            .p-list-work__jobs > a .p-list-work__jobs--item__image img {
                width: 100% !important;
                height: 120px !important;
                object-fit: cover !important;
            }
        `);
        console.log("CSS injected successfully.");
    }

    // -------------------------------------------------------------
    // メインロジック
    // -------------------------------------------------------------
    function init() {
        console.log('Initializing script...');

        // ページがロードされたらCSSを挿入
        injectCSS();
    }
    
    // DOMContentLoadedイベントでスクリプトを開始
    document.addEventListener('DOMContentLoaded', init);

})();
