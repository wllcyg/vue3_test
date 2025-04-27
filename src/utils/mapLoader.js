/**
 * 高德地图API加载器
 * 用于异步加载高德地图API及其插件
 */

// 高德地图API密钥
const API_KEY = "2c0fc8be9389195c4489f6b1322abed6";

// 高德地图API版本
const VERSION = "2.0";

// 高德地图API加载状态
let isLoaded = false;
let loadPromise = null;

/**
 * 加载高德地图API
 * @param {Array} plugins 需要加载的插件列表
 * @returns {Promise} 返回加载完成的Promise
 */
export function loadAMap(plugins = []) {
  // 如果已经加载过，直接返回缓存的Promise
  if (loadPromise) {
    return loadPromise;
  }

  // 创建加载Promise
  loadPromise = new Promise((resolve, reject) => {
    // 如果已经加载过，直接返回
    if (isLoaded && window.AMap) {
      resolve(window.AMap);
      return;
    }

    // 创建script标签
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://webapi.amap.com/maps?v=${VERSION}&key=${API_KEY}&plugin=${plugins.join(
      ","
    )}`;

    // 加载成功回调
    script.onload = () => {
      isLoaded = true;
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error("高德地图API加载失败"));
      }
    };

    // 加载失败回调
    script.onerror = () => {
      reject(new Error("高德地图API加载失败"));
    };

    // 将script标签添加到页面
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * 检查高德地图API是否已加载
 * @returns {Boolean} 是否已加载
 */
export function isAMapLoaded() {
  return isLoaded && window.AMap;
}
