// ==UserScript==
// @name         e-nextlevel 4個表示対応
// @namespace    http://tampermonkey.net/
// @version      1.2
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

    // CSSを直接HTMLに挿入する安全な方法
    function injectCSS() {
        const css = `
            <style id="nextlevel-grid-styles">
            /* 4個表示対応のレスポンシブグリッド */
            .my-list__jobs {
                display: grid !important;
                gap: 16px !important;
                padding: 20px !important;
            }
            
            /* 非常に小さい画面: 1個表示 */
            @media (max-width: 480px) {
                .my-list__jobs {
                    grid-template-columns: 1fr !important;
                    gap: 12px !important;
                }
            }
            
            /* 小さい画面（スマートフォン）: 2個表示を維持 */
            @media (min-width: 481px) and (max-width: 768px) {
                .my-list__jobs {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 14px !important;
                }
            }
            
            /* 中程度の画面（タブレット縦持ち）: 3個表示 */
            @media (min-width: 769px) and (max-width: 900px) {
                .my-list__jobs {
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 16px !important;
                }
            }
            
            /* Z Fold3開いた状態を含む大画面: 4個表示 */
            @media (min-width: 901px) {
                .my-list__jobs {
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 18px !important;
                }
            }
            
            /* Z Fold3専用の調整（折りたたみスマホ検出） */
            @media (min-width: 750px) and (max-width: 950px) and (orientation: landscape) {
                .my-list__jobs {
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 14px !important;
                }
            }
            
            /* より大きい画面: 最大幅制限 */
            @media (min-width: 1400px) {
                .my-list__jobs {
                    max-width: 1200px !important;
                    margin: 0 auto !important;
                    gap: 20px !important;
                }
            }
            
            /* アイテムの基本スタイル調整 */
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
            
            /* 画像のレスポンシブ対応 */
            .my-list__jobs--item img {
                width: 100% !important;
                height: auto !important;
                max-height: 120px !important;
                object-fit: cover !important;
            }
            
            /* テキスト部分の調整 */
            .my-list__jobs--item h3,
            .my-list__jobs--item .job-title {
                font-size: 14px !important;
                line-height: 1.4 !important;
                margin-bottom: 8px !important;
            }
            
            .my-list__jobs--item .job-info {
                font-size: 12px !important;
                color: #666 !important;
            }
            
            /* Z Fold3でのサイズ最適化 */
            @media (min-width: 750px) and (max-width: 950px) {
                .my-list__jobs--item {
                    font-size: 13px !important;
                }
                
                .my-list__jobs--item img {
                    max-height: 100px !important;
                }
                
                .my-list__jobs--item h3,
                .my-list__jobs--item .job-title {
                    font-size: 13px !important;
                    line-height: 1.3 !important;
                }
                
                .my-list__jobs--item .job-info {
                    font-size: 11px !important;
                }
            }
            
            /* フレックスレイアウトを使用している場合の対応 */
            .my-list__jobs[style*="flex"] {
                display: grid !important;
            }
            
            /* 既存のfloatレイアウトを無効化 */
            .my-list__jobs--item[style*="float"] {
                float: none !important;
            }
            </style>
        `;
        
        // HTMLに直接挿入
        if (document.head) {
            document.head.insertAdjacentHTML('beforeend', css);
            console.log('CSS injected successfully');
        }
    }

    // 求人コンテナを見つけてクラスを適用
    function findAndApplyGrid() {
        // 求人リンクを探す
        const jobLinks = document.querySelectorAll('a[href*="/work/detail/"]');
        console.log('Found job links:', jobLinks.length);
        
        if (jobLinks.length === 0) {
            console.log('No job links found, retrying in 1 second...');
            setTimeout(findAndApplyGrid, 1000);
            return;
        }
        
        // 共通の親要素を見つける
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
            console.log('Applied my-list__jobs class to:', container);
            
            // 子要素にも適切なクラスを適用
            const children = container.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.querySelector('a[href*="/work/detail/"]')) {
                    child.classList.add('my-list__jobs--item');
                }
            }
            console.log('Applied classes to', children.length, 'items');
        } else {
            console.log('Could not find suitable container');
        }
    }

    // デバイス情報を表示
    function logDeviceInfo() {
        console.log('Device info:', {
            width: window.innerWidth,
            height: window.innerHeight,
            userAgent: navigator.userAgent.includes('Fold') ? 'Contains Fold' : 'Normal device'
        });
    }

    // 初期化
    function init() {
        console.log('Initializing...');
        logDeviceInfo();
        
        // CSSを注入
        injectCSS();
        
        // 少し待ってからグリッドを適用
        setTimeout(findAndApplyGrid, 500);
        
        // 動的コンテンツに対応
        const observer = new MutationObserver(function() {
            const existingContainer = document.querySelector('.my-list__jobs');
            if (!existingContainer) {
                findAndApplyGrid();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 画面サイズ変更に対応
        window.addEventListener('resize', function() {
            logDeviceInfo();
        });
    }

    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
