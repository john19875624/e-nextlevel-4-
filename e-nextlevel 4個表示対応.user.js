// ==UserScript==
// @name         e-nextlevel 4個表示対応
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  e-nextlevelの求人リストを4個表示対応にする
// @author       You
// @match        https://www.e-nextlevel.jp/work/list*
// @match        https://www.e-nextlevel.jp/work/long-list*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let isStylesApplied = false;
    let isInitialized = false;

    // CSSスタイルを追加する関数
    function addCustomStyles() {
        if (isStylesApplied) return;
        
        try {
            const style = document.createElement('style');
            style.id = 'nextlevel-grid-styles';
            style.type = 'text/css';
            
            const cssRules = `
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
                @media (min-width: 901px) and (max-width: 1399px) {
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
                
                /* Z Fold3の内側画面サイズを特定して対応 */
                @media (min-width: 832px) and (max-width: 832px), 
                       (min-width: 884px) and (max-width: 884px) {
                    .my-list__jobs {
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 16px !important;
                    }
                }
                
                /* より大きい画面: 4個表示を維持、最大幅制限 */
                @media (min-width: 1400px) {
                    .my-list__jobs {
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 20px !important;
                        max-width: 1200px !important;
                        margin: 0 auto !important;
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
                
                /* フレックスレイアウトを使用している場合の対応 */
                .my-list__jobs[style*="flex"] {
                    display: grid !important;
                }
                
                /* 既存のfloatレイアウトを無効化 */
                .my-list__jobs--item[style*="float"] {
                    float: none !important;
                }
            `;
            
            style.textContent = cssRules;
            
            if (document.head) {
                document.head.appendChild(style);
                isStylesApplied = true;
                console.log('Base styles applied successfully');
            }
        } catch (error) {
            console.error('Error applying base styles:', error);
        }
    }

    // Z Fold3などの折りたたみデバイス検出と対応
    function detectFoldableDevice() {
        try {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const userAgent = navigator.userAgent;
            
            // Z Fold3の内側画面の特徴的なサイズ
            const zfold3Indicators = [
                // 一般的なZ Fold3の解像度パターン
                (width >= 820 && width <= 890 && height >= 1750),
                (width >= 1750 && width <= 1850 && height >= 820 && height <= 890),
                // CSS pixels基準での判定
                (width >= 768 && width <= 884),
                // 折りたたみデバイスの一般的な特徴
                userAgent.includes('SM-F') || userAgent.includes('Fold')
            ];
            
            return zfold3Indicators.some(function(condition) { return condition; });
        } catch (error) {
            console.error('Error detecting foldable device:', error);
            return false;
        }
    }

    // Z Fold3専用のスタイル調整
    function applyFoldableStyles() {
        if (!detectFoldableDevice()) return;
        
        try {
            // 既存のZ Fold3スタイルを削除
            const existingStyle = document.getElementById('zfold-specific-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            const foldableStyle = document.createElement('style');
            foldableStyle.id = 'zfold-specific-styles';
            foldableStyle.type = 'text/css';
            
            const foldableCss = `
                /* Z Fold3専用の4個表示 */
                .my-list__jobs {
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 14px !important;
                    padding: 16px !important;
                }
                
                /* Z Fold3でのアイテムサイズ最適化 */
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
            `;
            
            foldableStyle.textContent = foldableCss;
            
            if (document.head) {
                document.head.appendChild(foldableStyle);
                console.log('Z Fold3 specific styles applied');
            }
        } catch (error) {
            console.error('Error applying foldable styles:', error);
        }
    }

    // レイアウトを調整する関数
    function adjustLayout() {
        try {
            // 求人リストコンテナを探す
            const selectors = [
                '.my-list__jobs',
                '.job-list',
                '.work-list',
                '[class*="job"]',
                '[class*="work"]'
            ];

            let jobContainer = null;
            for (let i = 0; i < selectors.length; i++) {
                jobContainer = document.querySelector(selectors[i]);
                if (jobContainer) break;
            }

            if (!jobContainer) {
                // セレクタが見つからない場合、求人アイテムの親要素を探す
                const jobItems = document.querySelectorAll('a[href*="/work/detail/"]');
                if (jobItems.length > 0) {
                    jobContainer = jobItems[0].parentElement;
                    let attempts = 0;
                    while (jobContainer && jobItems.length > 1 && attempts < 10) {
                        if (jobContainer.children.length >= jobItems.length * 0.8) {
                            break;
                        }
                        jobContainer = jobContainer.parentElement;
                        attempts++;
                    }
                    
                    if (jobContainer && jobContainer !== document.body) {
                        jobContainer.classList.add('my-list__jobs');
                        // 子要素にクラスを追加
                        for (let i = 0; i < jobContainer.children.length; i++) {
                            const child = jobContainer.children[i];
                            if (child.querySelector('a[href*="/work/detail/"]')) {
                                child.classList.add('my-list__jobs--item');
                            }
                        }
                    }
                }
            }

            if (jobContainer) {
                console.log('Job container found:', jobContainer);
                
                // 既存のスタイルをクリア
                jobContainer.style.display = '';
                jobContainer.style.gridTemplateColumns = '';
                jobContainer.style.flexDirection = '';
                
                // グリッドクラスを確実に適用
                if (!jobContainer.classList.contains('my-list__jobs')) {
                    jobContainer.classList.add('my-list__jobs');
                }
            } else {
                console.log('Job container not found, will retry...');
                
                // 少し待ってからリトライ
                setTimeout(function() {
                    const jobLinks = document.querySelectorAll('a[href*="/work/detail/"]');
                    if (jobLinks.length > 0) {
                        // 最も共通の親要素を見つける
                        let commonParent = jobLinks[0];
                        for (let i = 1; i < Math.min(jobLinks.length, 5); i++) {
                            let attempts = 0;
                            while (commonParent && !commonParent.contains(jobLinks[i]) && attempts < 10) {
                                commonParent = commonParent.parentElement;
                                attempts++;
                            }
                        }
                        
                        if (commonParent && commonParent !== document.body) {
                            commonParent.classList.add('my-list__jobs');
                            console.log('Applied grid to inferred container:', commonParent);
                        }
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error in adjustLayout:', error);
        }
    }

    // 初期化関数
    function initialize() {
        if (isInitialized) return;
        
        try {
            console.log('e-nextlevel 4個表示対応 Userscript initializing...');
            
            // スタイルを追加
            addCustomStyles();
            
            // 少し遅延してから実行
            setTimeout(function() {
                applyFoldableStyles();
                adjustLayout();
            }, 500);
            
            // 動的コンテンツの変更を監視
            const observer = new MutationObserver(function(mutations) {
                let shouldAdjust = false;
                for (let i = 0; i < mutations.length; i++) {
                    const mutation = mutations[i];
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (let j = 0; j < mutation.addedNodes.length; j++) {
                            const node = mutation.addedNodes[j];
                            if (node.nodeType === 1) {
                                if ((node.querySelector && node.querySelector('a[href*="/work/detail/"]')) ||
                                    (node.href && node.href.includes('/work/detail/'))) {
                                    shouldAdjust = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldAdjust) break;
                }
                
                if (shouldAdjust) {
                    setTimeout(adjustLayout, 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 画面回転やリサイズに対応
            window.addEventListener('resize', function() {
                setTimeout(function() {
                    applyFoldableStyles();
                    adjustLayout();
                }, 300);
            });
            
            window.addEventListener('orientationchange', function() {
                setTimeout(function() {
                    applyFoldableStyles();
                    adjustLayout();
                }, 500);
            });
            
            isInitialized = true;
            console.log('e-nextlevel userscript initialized successfully');
            
        } catch (error) {
            console.error('Error in initialize:', error);
        }
    }

    // 安全な初期化実行
    function safeInitialize() {
        try {
            if (document.readyState === 'complete') {
                initialize();
            } else if (document.readyState === 'interactive') {
                setTimeout(initialize, 100);
            } else {
                document.addEventListener('DOMContentLoaded', initialize);
                window.addEventListener('load', initialize);
            }
        } catch (error) {
            console.error('Error in safeInitialize:', error);
            // フォールバック: 1秒後に強制実行
            setTimeout(initialize, 1000);
        }
    }

    // 初期化開始
    safeInitialize();

})();
