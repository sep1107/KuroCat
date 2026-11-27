import type { TailKeyMode } from '../../src/catEngine';

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'pt' | 'ru' | 'de';

export type VisitorOS = 'android' | 'ios' | 'macos' | 'win7' | 'win7-x86' | 'win' | 'linux-arm64' | 'linux-x64';

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
  ko: '한국어',
  es: 'ES',
  pt: 'PT',
  ru: 'RU',
  de: 'DE',
};

export const LANG_STORAGE_KEY = 'qianyi_lang';

export function normalizeLocale(raw: string | null | undefined): Locale | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'zh' || v.startsWith('zh-')) return 'zh';
  if (v === 'en' || v.startsWith('en-')) return 'en';
  if (v === 'ja' || v === 'jp' || v.startsWith('ja-')) return 'ja';
  if (v === 'ko' || v === 'kr' || v.startsWith('ko-')) return 'ko';
  if (v === 'es' || v.startsWith('es-')) return 'es';
  if (v === 'pt' || v === 'br' || v.startsWith('pt-')) return 'pt';
  if (v === 'ru' || v.startsWith('ru-')) return 'ru';
  if (v === 'de' || v.startsWith('de-')) return 'de';
  return null;
}

export function localeToPath(locale: Locale): string {
  return locale === 'zh' ? '/' : `/${locale}/`;
}

export function detectLocaleFromPath(pathname: string): Locale | null {
  const p = (pathname || '/').toLowerCase();
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  if (p === '/ja' || p.startsWith('/ja/')) return 'ja';
  if (p === '/ko' || p.startsWith('/ko/')) return 'ko';
  if (p === '/es' || p.startsWith('/es/')) return 'es';
  if (p === '/pt' || p.startsWith('/pt/')) return 'pt';
  if (p === '/ru' || p.startsWith('/ru/')) return 'ru';
  if (p === '/de' || p.startsWith('/de/')) return 'de';
  return null;
}

export function detectInitialLocale(): Locale {
  try {
    const param = new URLSearchParams(window.location.search).get('lang');
    const fromQuery = normalizeLocale(param);
    if (fromQuery) {
      localStorage.setItem(LANG_STORAGE_KEY, fromQuery);
      return fromQuery;
    }
    const fromPath = detectLocaleFromPath(window.location.pathname);
    if (fromPath) {
      return fromPath;
    }
    const saved = normalizeLocale(localStorage.getItem(LANG_STORAGE_KEY));
    if (saved) return saved;
  } catch {
    // Ignore storage/URL access errors in restricted contexts
  }
  return 'zh';
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, locale);
    const targetPath = localeToPath(locale);
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    url.pathname = targetPath;
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Ignore restricted history/storage environments
  }
}

export interface KuroCatI18nBundle {
  htmlLang: string;
  docTitle: string;
  metaDesc: string;
  text: Record<string, string>;
  html: Record<string, string>;
  placeholders: Record<string, string>;
  titles: Record<string, string>;
  ariaLabels: Record<string, string>;
  alts: Record<string, string>;
  downloads: Record<string, string>;
  prompts: Record<string, string>;
  skins: Record<string, string>;
  tailModeShort: Record<TailKeyMode, string>;
  mcpSnippets: Record<'win' | 'mac' | 'http', { raw: string; html: string }>;
  fmt: {
    latestVersion: (tag: string) => string;
    heroDownloadWin: (size: string) => string;
    heroDownloadWin7: (size: string, arch?: 'x64' | 'x86') => string;
    heroDownloadMac: (size: string) => string;
    heroDownloadLinux: (size: string, arch: 'x64' | 'arm64') => string;
    heroDownloadAndroid: (size: string) => string;
    heroDownloadIos: () => string;
    heroOsHint: (os: VisitorOS, size: string) => string;
    layout: (id: '65' | '108') => string;
    orient: (o: 'cat' | 'viewer') => string;
    tailPickerBtn: (open: boolean, count: number) => string;
    tailPickerTitleDefault: (count: number) => string;
    tailKeyAdded: (key: string, count: number) => string;
    tailKeyRemoved: (key: string, count: number) => string;
    tailPresetApplied: (preset: 'office' | 'rightFn' | 'edgeMods', count: number) => string;
    tailCleared: () => string;
    autoDemoBtn: (running: boolean) => string;
    privacyBtn: (active: boolean) => string;
    whaleSoundBtn: (muted: boolean) => string;
    copied: () => string;
    copyConfig: () => string;
    copyCmd: () => string;
    copyShort: () => string;
    totalDownloads: (count: string) => string;
    statsUpdated: (timePart: string) => string;
  };
}

export const KUROCAT_I18N: Record<Locale, KuroCatI18nBundle> = {
  zh: {
    htmlLang: 'zh-CN',
    docTitle: 'KuroCat 官网 — 免费开源 3D 桌面打字小黑猫与 AI 伴侣 (Win/Mac/Linux/Android)',
    metaDesc:
      'KuroCat 官方网站（kurocat.org · github.com/qianyiai/KuroCat）— 免费开源 3D/2D 透明置顶桌面打字小黑猫与 AI 编程伴侣（Bongo Cat 开源替代）。支持 Windows/macOS(Homebrew)/Linux/Android，6 款猫咪 + 大肥鱼、Claude/Codex/DeepSeek/豆包状态联动、OBS 免抠像透明源、输密码自动闭眼防偷窥与 MCP AI 捏猫。',
    text: {
      'nav.back': '← 谦一',
      'nav.playground': '在线试玩',
      'nav.whale': '鲸鱼娘视频',
      'nav.download': '立即下载',
      'nav.quark': '☁️ 夸克网盘',
      'nav.features': '核心特性',
      'nav.mcp': 'AI 捏猫',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': '全部平台与版本',
      'hero.ghSource': 'GitHub 源码 ›',
      'hero.spec1Lbl': '原生 Rust 安装包体积',
      'hero.spec2Val': '7 款 + MCP',
      'hero.spec2Lbl': '猫咪 & 鲸鱼娘 · AI 定制',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · 麒麟 · Android 8+',
      'pg.title': '实时网页引擎 · 直接敲键盘或摸猫头',
      'pg.mode3d': '✨ 3D 立体',
      'pg.mode2d': '🎨 2D 经典',
      'pg.bgDark': '深色桌布',
      'pg.bgLight': '浅色桌布',
      'pg.hintKey': '⌨️ 敲键盘',
      'pg.hintMouse': '🖱️ 点左/右键',
      'pg.hintPet': '🤚 来回摸猫头',
      'pg.done': '完成',
      'pg.presetOffice': '回车空格',
      'pg.presetRightFn': '方向/小键盘',
      'pg.presetEdgeMods': '外侧功能键',
      'pg.presetClear': '清空',
      'pg.lblSkin': '切换皮肤',
      'pg.layout65': '65% 紧凑',
      'pg.layout108': '108 全尺寸',
      'pg.orientCat': '面向猫咪',
      'pg.orientViewer': '面向观众',
      'pg.btnMouse': '🖱️ 左右键',
      'pg.btnCurious': '👀 好奇眼',
      'pg.btnCross': '💢 尾巴捶桌',
      'pg.btnSleep': '💤 打瞌睡',
      'pg.btnBubbles': '💬 气泡',
      'pg.btnPurr': '🔊 呼噜',
      'pg.btnHeadphones': '🎧 电竞耳机',
      'pg.btnOrbit': '🔄 360° 旋转',
      'pg.lblCollar': '3D 项圈',
      'pg.collarNone': '无',
      'pg.collarRed': '🔴 红',
      'pg.collarBlue': '🔵 蓝',
      'pg.collarPink': '🩷 粉',
      'pg.collarGreen': '🟢 绿',
      'pg.lblTail': '尾巴拍键',
      'pg.tailSmart': '智能第三只手',
      'pg.tailCustom': '自定义',
      'pg.tailEdge': '近尾边缘',
      'pg.tailOff': '仅摆动',
      'pg.lblPwd': '密码测试',
      'pg.lblScale': '无级缩放',
      'dl.eyebrow': 'Direct Downloads · Cloudflare Edge CDN',
      'dl.title': '免费下载，3 秒住进你的桌面',
      'dl.winName': 'Windows 65% 经典安装版',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': '推荐',
      'dl.primaryBtn': '高速直链下载',
      'dl.quarkBtn': '☁️ 夸克网盘 ›',
      'dl.ghBtn': 'GitHub 官方源 ›',
      'quark.badge': '☁️ 夸克网盘 · 官方合集',
      'quark.platforms': 'Win / Mac / 安卓全包',
      'quark.openBtn': '立即打开 ↗',
      'quark.copyBtn': '复制口令',
      'quark.dlBadge': '☁️ 官方夸克网盘高速分流',
      'quark.dlPlatforms': '内含 Windows · macOS · Android 安装包',
      'quark.dlTitle': '「KuroCat 谦一_官方」全平台合集文件夹',
      'quark.dlOpenBtn': '☁️ 打开夸克网盘获取 ↗',
      'dl.macName': 'macOS 通用版（M 芯片 & Intel）',
      'dl.macSub': 'macOS 10.15+ (Catalina 及以上) Universal DMG',
      'dl.recommendedTag': '为你的设备推荐',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android 手机 / 平板悬浮版',
      'dl.androidSub': 'Android 8.0+ 官方签名 APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ Windows 浏览器提示「通常不会下载 .exe / 保护你的电脑」怎么办？',
      'dl.tipBrewTitle': '🍺 macOS Homebrew 一键安装（推荐 · 自动免隔离）',
      'dl.tipMacTitle': '🍎 macOS 首次打开说明（仅需一次 · 无需开着终端）',
      'dl.copyCmd': '复制命令',
      'dl.tipWv2Title': '🪟 Windows 提示「Could not find the WebView2 Runtime」怎么办？',
      'dl.tipWv2Btn': '下载微软 WebView2 运行环境 ›',
      'dl.win7Title': '🖥️ Windows 7 SP1（64 位 & 32 位）专属兼容绿包版（内置 WebView2 109）',
      'dl.win7Btn': '64 位绿包（179.3 MB）',
      'dl.win7X86Btn': '32 位绿包（159.4 MB）',
      'dl.win7Gh': 'GitHub 64 位 ›',
      'dl.win7X86Gh': 'GitHub 32 位 ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / 银河麒麟 V11+ / 优麒麟（x86_64 & ARM64）',
      'dl.linuxX64Deb': 'x86_64 .deb（2.66 MB）',
      'dl.linuxArmDeb': 'ARM64 飞腾/麒麟 .deb（2.62 MB）',
      'dl.linuxX64AppImage': 'x86_64 AppImage（77.8 MB）›',
      'dl.linuxArmAppImage': 'ARM64 AppImage（76.0 MB）›',
      'dl.tipGameTitle': '🎮 游戏全屏 / OBS 直播怎么显示小黑猫？（含反作弊安全提示）',
      'feat.title': '把桌宠，做到强迫症级别的丝滑',
      'feat.whaleEyebrow': 'New Skin · 🐳 BigFish (鲸鱼娘) · 14s Video',
      'feat.whaleSpec1Val': '三线同动',
      'feat.whaleSpec1Lbl': '鼠标 + 手打字 + 鲸尾甩拍',
      'feat.whaleSpec2Val': '手速感应',
      'feat.whaleSpec2Lbl': '加速触发害羞脸红 → 大笑',
      'feat.whaleSpec3Val': '自动捂眼',
      'feat.whaleSpec3Lbl': '输密码自动闭眼防偷窥',
      'feat.whaleTryBtn': '在上方画布切到大肥鱼试玩 ↑',
      'feat.whaleDlBtn': '下载 1080P 竖屏演示（14s）',
      'feat.whaleMeta': '1080×1920 · 60fps · 14s 含同步键鼠音效',
      'feat.kbSpec1Val': '108 键',
      'feat.kbSpec1Lbl': '完整 F 区与数字小键盘',
      'feat.kbSpec2Val': '双视角',
      'feat.kbSpec2Lbl': '面向猫咪 / 面向观众',
      'feat.kbSpec3Val': '真键值',
      'feat.kbSpec3Lbl': '独立区分主回车与 Num↵',
      'feat.kbTryBtn': '在上方画布试玩 108 键 ↑',
      'feat.mouseSpec1Lbl': '左右中键完全独立高亮',
      'feat.mouseSpec2Lbl': '自动更新摘要校验',
      'feat.mouseSpec3Val': '一键升级',
      'feat.mouseSpec3Lbl': 'Win / Mac 静默重启',
      'bento.1Title': '双标签免滚动菜单 & 记忆穿透',
      'bento.1Body': '右键浮窗拆分为「外观与互动 / 键盘·OBS·系统」双标签一屏看完，20%–150% 无级缩放不裁切；重启自动记住鼠标穿透锁定并带启动一键解锁防误锁。',
      'bento.2Title': '摸头眯眼 & 合成呼噜声',
      'bento.2Body': '鼠标移到猫头自动变身小手光标，来回抚摸触发慵懒眯眼与 Web Audio 24.5Hz 实时合成的温柔猫咪呼噜声。',
      'bento.3Title': '输密码自动闭眼防偷窥',
      'bento.3Body': '系统级自动识别 Windows / macOS 密码输入框：底层钩子拦截不外传按键，猫咪温柔闭眼、大肥鱼双手捂眼并遮蔽键帽与气泡。',
      'bento.4Title': 'GPU 合批重构 & 游戏自动省电',
      'bento.4Body': '3D 键帽图集合批与全 GPU 顶点变形，活跃态显卡占用直降 75%；检测到游戏自动切换 30 FPS 省电模式（最高降 88.5%），双显卡优先核显零负担。',
      'mcp.p1Text': '💬 “帮我用 KuroCat MCP 捏一只英短蓝猫并切过去”',
      'mcp.p2Text': '📸 “按这张我家猫的照片，给我定制一只专属桌宠！”',
      'mcp.p3Text': '⚙️ “把桌宠缩放到 85%，切到 108 键面向观众”',
      'mcp.copyShort': '复制',
      'mcp.tabHttp': '本机 HTTP',
      'mcp.footerMeta': '支持 7 个内置工具 · 0.4s 热重载',
      'mcp.copyCfg': '复制配置',
      'growth.eyebrow': 'Live Growth · Real-Time Telemetry',
      'growth.title': '实时增长曲线',
      'growth.sub': '实时追踪全渠道累计下载量与 GitHub Stars 增长轨迹，移动鼠标查看各时段精确数据。',
      'growth.dlLbl': '累计下载量',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': '双曲线',
      'growth.modeDl': '仅下载',
      'growth.modeStars': '仅 Stars',
      'growth.loading': '正在同步实时增长数据…',
      'growth.starCta': '⭐ 去 GitHub 点颗星支持开源 ›',
      'footer.home': '谦一主页',
      'footer.pelican': '鹈鹕测试专区',
      'footer.releases': '所有版本 (Releases)',
      'footer.download': '全平台下载与校验',
      'footer.vsBongo': '对比 Bongo Cat',
      'footer.obs': 'OBS 免抠像教程',
      'footer.mcp': 'AI 捏猫 & MCP',
      'footer.security': '防伪安全公告',
      'alert.badge': '官方唯一主页',
      'alert.cta': '防伪公告与校验 →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> 是 KuroCat 唯一官方网站（源码 <code>github.com/qianyiai/KuroCat</code>）。⚠️ 警惕假冒站 <strong>kurocat.net</strong>（其 64 MB <code>KuroCat.v5.1.0.zip</code> 含非官方 36 MB 程序与 50 MB 异常填充，高度疑似木马，切勿下载）！',
      'hero.title': 'KuroCat · 敲键盘的小黑猫<br /><span>住进你的桌面</span>',
      'hero.sub':
        '免费开源的透明置顶桌面键鼠伴侣，支持 <strong>3D 手办 / 2D 经典</strong> 一键切换，超低占用不卡游戏。内置 <strong>6 款猫咪 + 大肥鱼</strong>，支持摸头呼噜、输密码自动闭眼、OBS 直播与 <strong>AI 捏猫</strong>。',
      'dl.sub':
        '所有安装包均内置 <strong>20%–150% 无级缩放</strong>、<strong>65% / 108 键随时切换</strong>、<strong>自定义尾巴拍键</strong> 与 <strong>App 内自动更新</strong>。<br />默认提供 <code>kurocat.org</code> 官方高速直链，同时保留 GitHub Releases 官方原链与 SHA-256 校验。',
      'quark.heroDesc':
        '<strong>「KuroCat 谦一_官方」</strong>高速直取 · 点开获取即免费支持开源维护',
      'quark.dlBody':
        '官方同步更新 Win / Mac / 安卓安装包，国内直连不限速且支持一键转存防丢；点击打开获取也是对 KuroCat 开源维护的免费支持。打开「夸克网盘 APP」也可复制口令 <code>/~f3813cZv6O~:/</code> 直达。',
      'dl.winDesc':
        '开箱即 65% 紧凑机械键盘，自动创建桌面 <code>KuroCat</code> 图标、开始菜单与系统卸载入口；右键随时可一键切换 <strong>108 键全尺寸小键盘</strong>、<strong>自定义尾巴按键</strong> 与内置自更新。',
      'dl.macDesc':
        '原生编译 ARM64 + x86_64 通用镜像，兼容 M1/M2/M3/M4 与老款 Intel Mac（macOS 10.15 Catalina 及以上），内置 65% / 108 键、6 款猫咪与大肥鱼皮肤。打开 <code>.dmg</code> 拖入「应用程序」即可运行。',
            'dl.androidDesc':
        '原生悬浮置顶桌宠，同步 <strong>6 款猫咪 + 大肥鱼</strong>、<strong>20%–100% 不透明度</strong>、真猫呼噜与打字键鼠音效，支持摸头/点鼻/挠下巴/揪尾巴/拎后颈摇晃、横竖屏自适应与支付键盘自动闭眼防偷窥。',
      'dl.tipWinBody':
        '由于本项目为免费开源软件、未购买商业 EV 代码签名证书，Edge 浏览器在下载新版本 <code>.exe</code> 时可能会弹出「通常不会下载」提示（全部源码已在 GitHub 公开，可放心使用）：<br /><strong>① Edge 浏览器保留步骤</strong>：鼠标移到下载记录上 → 点右侧<strong>三个点 <code>···</code></strong> → 点<strong>「保留」</strong> → 弹窗显示「删除」按钮时，点击旁边的<strong>下箭头 <code>▾</code>（显示更多）</strong> → 选择<strong>「仍然保留」</strong>即可下载完成（Chrome 请按 <code>Ctrl + J</code> 打开下载页 → 点「保留危险文件」→「仍然保留」）。<br /><strong>② 双击安装若弹出蓝框「Windows 已保护你的电脑」</strong>：点击<strong>「更多信息」</strong> → 点击<strong>「仍要运行」</strong>即可完成安装。',
      'dl.tipBrewBody':
        '已上线官方 Homebrew Tap（<code>qianyiai/homebrew-tap</code>），终端执行右侧一行命令即可直接安装并自动清理隔离属性（免手动 <code>xattr</code>），后续可随时运行 <code>brew upgrade --cask kurocat</code> 一键升级。',
      'dl.tipMacBody':
        '由于本项目为免费开源未公证应用，首次拖入「应用程序」后若提示「无法验证开发者」或「已损坏」，<strong>请勿进入包内容用终端运行</strong>，只需打开一次终端粘贴执行右侧命令即可彻底解除隔离（跑完可关闭终端，后续直接双击图标打开）。全局键鼠响应请在<strong>「系统设置 → 隐私与安全性」</strong>中同时勾选<strong>「辅助功能」与「输入监控」</strong>里的 <code>KuroCat</code>，即开即生效（兼容 Karabiner-Elements）。',
      'dl.tipWv2Body':
        '常见于较老 Win10 / LTSC 精简版、卸过 Edge 浏览器或直接运行绿色单文件版的电脑（<strong>Win7 用户请直接下载下方专属兼容绿包版</strong>）。优先推荐安装上方<strong>正式安装版（setup.exe）</strong>，或点击右侧下载微软官方 WebView2 引导程序（1.8 MB），<strong>右键 → 以管理员身份运行</strong>装完即可全机生效。',
      'dl.win7Body':
        '专为 Windows 7 SP1 64 位（x64）与 32 位（x86）单独编译适配（原生 PE 6.01，零 Win8/Win10 DLL 依赖，内置微软官方最后一版支持 Win7 的 <strong>WebView2 109.0.1518.78</strong> 离线内核，并启用 Win7 原生 256 级逐像素透明抗锯齿渲染，无论是否开启 Aero 均无白底框与锯齿）。下载后请先<strong>全部解压</strong>，保持 <code>KuroCat.exe</code> 与 <code>WebView2Runtime</code> 同目录，直接双击运行即可。',
      'dl.linuxBody':
        '原生支持 X11 全局键鼠监听（免 root）与 Wayland <code>evdev</code> 降级、透明无边框置顶、鼠标穿透（按住 <code>Alt</code> 临时拖动）及开机自启。需要 <strong><code>glibc &gt;= 2.34</code></strong>（基于 Ubuntu 22.04+ / Debian 12+ / 银河麒麟 V11+，暂不支持基于 Ubuntu 20.04 / <code>glibc 2.31</code> 的银河麒麟 V10 SP1）。优先推荐下载轻量 <strong>.deb 安装包（2.7 MB）</strong>（需 <code>libwebkit2gtk-4.1-0</code>，双击或 <code>sudo apt install ./KuroCat-*.deb</code>）；无管理员权限可直接运行 <strong>.AppImage 绿色版</strong>（<code>chmod +x</code> 后双击）。',
      'dl.tipGameBody':
        '<strong>① 单机与常规游戏</strong>：在 Win10/11 全屏优化（FSO）或「无边框窗口化」下内置持续 Z 序置顶守卫且绝不抢焦点；建议开启「锁定鼠标穿透」（按住 <code>Alt</code> 键随时临时拖动或右键解锁）。若游戏以管理员权限运行导致无法捕获键鼠，右键系统托盘点<strong>「以管理员身份重启（捕获游戏键鼠）」</strong>即可。<br /><strong>② OBS 直播 / 录屏（原生免抠像）</strong>：右键小猫或系统托盘点<strong>「复制 OBS 透明源地址」</strong>（自动开启本机 <code>http://127.0.0.1:27421/obs</code>，默认关闭零开销），在 OBS 添加「浏览器」来源即可直接获得原生 Alpha 透明通道（无需绿幕抠像，支持「仅 OBS 显示」隐藏桌面猫，密码防偷窥同步生效）。<br /><strong>③ 强内核反作弊网游</strong>（无畏契约、三角洲行动等）：建议游玩前右键系统托盘点一下<strong>「暂停监听并隐藏（游戏反作弊护航）」</strong>，彻底卸载钩子保护账号安全。',
      'feat.whaleHeadline': '新皮肤「大肥鱼」登场<br />鲸尾拍键 · 脸红大笑 · 密码捂眼',
      'feat.whaleBody':
        '内置全新 <strong>🐳 大肥鱼（鲸鱼娘）</strong> 桌宠皮肤：支持<strong>左手点鼠标 + 右手敲键盘 + 大鲸尾甩拍自定义按键</strong>三线同时开工；打字手速越快越害羞脸红，飙到高能连打直接笑开花；检测到系统密码输入框时自动<strong>乖巧闭眼、双手捂眼</strong>并隐藏所有键帽与气泡。',
      'feat.kbHeadline': '65% 紧凑或 108 键全尺寸<br />正反双视角，随手切换',
      'feat.kbBody':
        '无论你习惯极简 65% 小键盘，还是财务/工程必备的 108 键完整小键盘，右键一秒切换并自动锚定右下角平滑调整窗口宽度。支持<strong>「面向猫咪（180° 真实视角）」</strong>与<strong>「面向观众（正向字母易读视角）」</strong>双透视重投影，鼠标左右键也同步自动翻转。',
      'feat.mouseHeadline': '左右键独立分色按压<br />还有无感自升级',
      'feat.mouseBody':
        '鼠标左键（<code>L</code>）、右键（<code>R</code>）与中键滚轮彻底独立分区：左键亮起猫咪主强调色，右键呈现高对比珊瑚橙或天蓝色，带 3D 按下内阴影与 <code>LMB</code>/<code>RMB</code> 迷你气泡，支持双键同时按住！内置<strong>国内高速直连优先</strong>的自动更新检测（失败自动回退 GitHub），发现新版本时在猫头上方弹出小巧可关闭的更新胶囊（点 <code>×</code> 永久忽略当前版，下次发版自动再弹），一键完成 SHA-256 校验与静默升级。',
      'mcp.headline': '发张自家猫的照片<br />让 AI 0.4 秒捏进你的桌面',
      'mcp.body':
        'KuroCat 原生内置 <strong>Stdio</strong> 与 <strong>本机 Streamable HTTP（<code>127.0.0.1:27420</code>）</strong> 双模式 MCP 服务端，无需安装 Node.js 或 Python。右键猫咪点「复制 MCP 配置」粘贴进 <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong>，即可用自然语言捏出任何毛色、虎斑、三花、胎记斑块与主题高亮，实时热更新无需重启。',
      'footer.credit': 'KuroCat 官方唯一主页 (<code>kurocat.org</code>) · MIT Open Source · Built by <a class="footer-home" href="https://qianyi.one/" rel="me noopener">谦一 (Qianyi)</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': '点此输入密码：猫咪自动闭眼 / 大肥鱼捂眼且隐藏按键…',
    },
    titles: {
      'pg.autoDemoTitle': '自动演示打字与鼠标点击',
      'pg.mouseTitle': '演示独立左/右键点击',
      'pg.curiousTitle': '触发逗猫棒好奇大圆瞳（也可快速甩动鼠标自然触发）',
      'pg.crossTitle': '触发飞机耳 + 尾巴三连捶桌（也可乱拍键盘自然触发）',
      'pg.sleepTitle': '触发趴下打瞌睡冒 Zzz（敲任意键抖头醒来）',
      'pg.bubblesTitle': '开关悬浮按键气泡',
      'pg.purrTitle': '开关摸头呼噜声',
      'pg.headphonesTitle': '开关电竞耳机（桌面端支持检测到游戏自动戴上）',
      'pg.orbitTitle': '开启后在画布上拖动可 360° 旋转查看 3D 立体模型',
      'pg.tailSmartTitle': '平时双手打字，两手忙不过来或打完回车时自动出尾',
      'pg.tailCustomTitle': '只拍你亲手勾选的按键',
      'pg.tailEdgeTitle': '近尾外侧边缘区（不拆 WASD）',
      'pg.tailOffTitle': '尾巴只自然摆动，不拍键',
      'pg.tailPickerTitle': '直接在上方键盘点击键帽或敲实体键盘自定义尾巴按键',
      'pg.privacyTitle': '手动切换密码防偷窥演示',
      'pg.scaleResetTitle': '点击重置为 100%',
      'alert.closeTitle': '关闭公告',
    },
    ariaLabels: {
      'nav.backAria': '返回谦一主页',
      'nav.mainAria': '主导航',
      'pg.modeAria': '3D / 2D 模式切换',
      'pg.backdropAria': '预览桌布背景',
      'pg.canvas2dAria': 'KuroCat 2D 实时交互试玩画布',
      'pg.canvas3dAria': 'KuroCat 3D 实时交互试玩画布',
      'pg.tailPickerAria': '自定义尾巴按键',
      'pg.skinGroupAria': '选择桌宠皮肤',
      'pg.layoutAria': '键盘配列',
      'pg.orientAria': '键盘视角',
      'pg.collarAria': '3D 项圈铃铛颜色',
      'pg.tailModeAria': '尾巴拍键模式',
      'pg.pwdAria': '密码防偷窥演示输入框',
      'pg.scaleAria': '缩放比例 20% 到 150%',
      'alert.closeAria': '关闭公告',
    },
    alts: {
      'hero.iconAlt': 'KuroCat 图标',
      'feat.kbImgAlt': 'KuroCat 65% 与 108 键全尺寸及双视角对比展示',
      'feat.mouseImgAlt': 'KuroCat 独立鼠标左右键识别与内置新版本提醒展示',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-鲸鱼娘-14s竖屏演示.mp4',
    },
    prompts: {
      'mcp.p1': '帮我用 KuroCat MCP 新增一只英短蓝猫，琥珀色大眼睛、浅灰蓝键盘高亮，并立刻切过去',
      'mcp.p2': '看这张我家猫的照片，用 KuroCat MCP 按它的花色、耳尖和斑块位置给我定制一只专属桌宠！',
      'mcp.p3': '把 KuroCat 缩放到 85%，切换为 108 键全尺寸键盘和面向观众视角',
    },
    skins: {
      black: '小黑猫',
      ragdoll: '小肥鱼 · 小绅士',
      'orange-tabby': '大橘猫',
      calico: '三花猫',
      tuxedo: '奶牛猫',
      siamese: '暹罗猫',
      dafeiyu: '大肥鱼',
    },
    tailModeShort: {
      smart: '尾巴：智能',
      custom: '尾巴：自定义',
      edge: '尾巴：边缘',
      off: '尾巴：仅摆动',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<你的用户名>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Windows Stdio 模式（Claude / Cursor / Antigravity 通用）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;你的用户名&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// macOS Stdio 模式（零依赖直连 App 内置二进制）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// 本机 Streamable HTTP 模式（桌宠运行时直接连接）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `最新版本 ${tag}`,
      heroDownloadWin: (size) => `免费下载 Windows 版（${size}）`,
      heroDownloadMac: (size) => `免费下载 macOS 通用版（${size}）`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `免费下载 Win7 32 位绿包版（${size}）` : `免费下载 Win7 64 位绿包版（${size}）`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `免费下载 Linux ARM64 版（${size}）` : `免费下载 Linux 版（${size}）`,
      heroDownloadAndroid: (size) => `免费下载 Android 版（${size}）`,
      heroDownloadIos: () => '查看电脑与 Android 安装包',
      heroOsHint: (os, size) => {
        if (os === 'android') return `已识别当前设备：<strong>Android 手机 / 平板</strong> · 一键直下官方签名 APK（${size}）`;
        if (os === 'macos') return `已识别当前系统：<strong>macOS (Apple Silicon &amp; Intel)</strong> · 同样提供 Win / Linux / Android 版`;
        if (os === 'win7-x86') return `已识别当前系统：<strong>Windows 7（32 位）</strong> · 已自动推荐 32 位内置 WebView2 109 离线绿包`;
        if (os === 'win7') return `已识别当前系统：<strong>Windows 7（64 位）</strong> · 已自动推荐内置 WebView2 109 离线兼容绿包`;
        if (os === 'linux-arm64') return `已识别当前系统：<strong>Linux ARM64</strong> · 默认推荐轻量 .deb，下方另附 AppImage`;
        if (os === 'linux-x64') return `已识别当前系统：<strong>Linux x86_64</strong> · 默认推荐轻量 .deb，下方另附 AppImage`;
        if (os === 'ios') return '已识别当前设备：<strong>iOS / iPadOS</strong> · 暂仅支持电脑端与 Android，请在电脑或安卓手机下载';
        return '已识别当前系统：<strong>Windows 10 / 11 (x64)</strong> · 同样提供 macOS / Linux / Android 版';
      },
      layout: (id) => (id === '108' ? '108 全尺寸' : '65% 紧凑'),
      orient: (o) => (o === 'viewer' ? '面向观众' : '面向猫咪'),
      tailPickerBtn: (open, count) =>
        open ? `✓ 正在点选（已选 ${count} 键）` : `🐾 点选尾巴按键（${count}）`,
      tailPickerTitleDefault: (count) => `🐾 直接点击下方键帽或敲实体键盘开关（已选 ${count} 键）`,
      tailKeyAdded: (key, count) => `🐾 已加「${key}」· 共 ${count} 键（点完成开始打字测试）`,
      tailKeyRemoved: (key, count) => `🐾 已取消「${key}」· 共 ${count} 键`,
      tailPresetApplied: (preset, count) => {
        const names = { office: '回车空格', rightFn: '方向/小键盘', edgeMods: '外侧功能键' };
        return `🐾 已套用「${names[preset]}」（${count} 键）`;
      },
      tailCleared: () => '🐾 已清空全部尾巴按键（点键帽或敲键添加）',
      autoDemoBtn: (running) => (running ? '⏸ 停止演示' : '▶ 自动演示'),
      privacyBtn: (active) => (active ? '🙈 密码防偷窥中' : '🔒 密码防偷窥'),
      whaleSoundBtn: (muted) => (muted ? '🔇 点此开启音效' : '🔊 音效已开启'),
      copied: () => '已复制 ✓',
      copyConfig: () => '复制配置',
      copyCmd: () => '复制命令',
      copyShort: () => '复制',
      totalDownloads: (count) => `累计下载 ${count} 次`,
      statsUpdated: (timePart) => `更新于 ${timePart} (UTC+8) · 每 30 秒自动刷新`,
    },
  },

  en: {
    htmlLang: 'en',
    docTitle: 'KuroCat Official — Free Open-Source 3D Desktop Typing Cat & AI Companion (Win/Mac/Linux/Android)',
    metaDesc:
      'KuroCat Official Website (kurocat.org · github.com/qianyiai/KuroCat) — Free open-source 3D/2D transparent desktop typing cat & AI coding companion (Bongo Cat alternative) for Windows, macOS (Homebrew), Linux & Android: 6 cats + BigFish, Claude/Codex/DeepSeek status sync, OBS transparent source, password privacy guard & built-in MCP AI studio.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': 'Playground',
      'nav.whale': 'BigFish Video',
      'nav.download': 'Download',
      'nav.quark': '☁️ Quark Drive',
      'nav.features': 'Features',
      'nav.mcp': 'AI MCP',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': 'All Platforms',
      'hero.ghSource': 'GitHub Source ›',
      'hero.spec1Lbl': 'Native Rust Installer Size',
      'hero.spec2Val': '7 Skins + MCP',
      'hero.spec2Lbl': 'Cats & Whale-Girl · AI Studio',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'Live Web Engine · Type or Pet the Cat',
      'pg.mode3d': '✨ 3D Mode',
      'pg.mode2d': '🎨 2D Classic',
      'pg.bgDark': 'Dark Desk',
      'pg.bgLight': 'Light Desk',
      'pg.hintKey': '⌨️ Type',
      'pg.hintMouse': '🖱️ L/R Click',
      'pg.hintPet': '🤚 Pet Head',
      'pg.done': 'Done',
      'pg.presetOffice': 'Enter & Space',
      'pg.presetRightFn': 'Arrows & Numpad',
      'pg.presetEdgeMods': 'Outer Modifiers',
      'pg.presetClear': 'Clear',
      'pg.lblSkin': 'Skin',
      'pg.layout65': '65% Compact',
      'pg.layout108': '108 Full-Size',
      'pg.orientCat': 'Cat View',
      'pg.orientViewer': 'Viewer View',
      'pg.btnMouse': '🖱️ L/R Click',
      'pg.btnCurious': '👀 Curious',
      'pg.btnCross': '💢 Tail Thump',
      'pg.btnSleep': '💤 Sleep',
      'pg.btnBubbles': '💬 Bubbles',
      'pg.btnPurr': '🔊 Purr',
      'pg.btnHeadphones': '🎧 Headset',
      'pg.btnOrbit': '🔄 360° Orbit',
      'pg.lblCollar': '3D Collar',
      'pg.collarNone': 'None',
      'pg.collarRed': '🔴 Red',
      'pg.collarBlue': '🔵 Blue',
      'pg.collarPink': '🩷 Pink',
      'pg.collarGreen': '🟢 Green',
      'pg.lblTail': 'Tail Keys',
      'pg.tailSmart': 'Smart 3rd Hand',
      'pg.tailCustom': 'Custom',
      'pg.tailEdge': 'Edge Only',
      'pg.tailOff': 'Wag Only',
      'pg.lblPwd': 'Password',
      'pg.lblScale': 'Scale',
      'dl.eyebrow': 'Direct Downloads · Cloudflare Edge CDN',
      'dl.title': 'Free Download — On Your Desk in 3 Seconds',
      'dl.winName': 'Windows 65% Classic Installer',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'Recommended',
      'dl.primaryBtn': 'Fast Direct Download',
      'dl.quarkBtn': '☁️ Quark Drive ›',
      'dl.ghBtn': 'GitHub Official Mirror ›',
      'quark.badge': '☁️ Official Quark Drive',
      'quark.platforms': 'Win / Mac / Android Pack',
      'quark.openBtn': 'Open Drive ↗',
      'quark.copyBtn': 'Copy Code',
      'quark.dlBadge': '☁️ Official Quark Cloud Mirror',
      'quark.dlPlatforms': 'Includes Windows · macOS · Android',
      'quark.dlTitle': '"KuroCat 谦一_官方" Official All-in-One Folder',
      'quark.dlOpenBtn': '☁️ Open Quark Drive ↗',
      'dl.macName': 'macOS Universal (Apple Silicon & Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina or later) Universal DMG',
      'dl.recommendedTag': 'Recommended for You',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android Floating Pet (APK)',
      'dl.androidSub': 'Android 8.0+ · Signed Official APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ Browser says "isn\'t commonly downloaded" or Windows SmartScreen pops up?',
      'dl.tipBrewTitle': '🍺 Install on macOS via Homebrew (Recommended)',
      'dl.tipMacTitle': '🍎 macOS First-Launch Guide (One-Time Setup)',
      'dl.copyCmd': 'Copy Command',
      'dl.tipWv2Title': '🪟 Seeing "Could not find the WebView2 Runtime" on Windows?',
      'dl.tipWv2Btn': 'Download Microsoft WebView2 Runtime ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64-bit & 32-bit) Dedicated Portable (Bundled WebView2 109)',
      'dl.win7Btn': '64-bit Portable (179.3 MB)',
      'dl.win7X86Btn': '32-bit Portable (159.4 MB)',
      'dl.win7Gh': 'GitHub 64-bit ›',
      'dl.win7X86Gh': 'GitHub 32-bit ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 & ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 Fullscreen Games, OBS Streaming & Anti-Cheat Guide',
      'feat.title': 'Desktop Pet Engineering, Polished to Every Pixel',
      'feat.whaleEyebrow': 'New Skin · 🐳 BigFish (Whale-Girl) · 14s Video',
      'feat.whaleSpec1Val': '3-Limb Sync',
      'feat.whaleSpec1Lbl': 'Mouse + Typing + Tail Slaps',
      'feat.whaleSpec2Val': 'Speed Blush',
      'feat.whaleSpec2Lbl': 'Fast Typing → Shy → Laugh',
      'feat.whaleSpec3Val': 'Hands Cover',
      'feat.whaleSpec3Lbl': 'Auto Password Privacy Shield',
      'feat.whaleTryBtn': 'Try BigFish in Playground ↑',
      'feat.whaleDlBtn': 'Download 1080p Vertical Video (14s)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14s with synced key & mouse audio',
      'feat.kbSpec1Val': '108 Keys',
      'feat.kbSpec1Lbl': 'Full F-Row & Numpad',
      'feat.kbSpec2Val': 'Dual View',
      'feat.kbSpec2Lbl': 'Cat-Facing / Viewer-Facing',
      'feat.kbSpec3Val': 'True Keys',
      'feat.kbSpec3Lbl': 'Distinct Enter vs Num↵',
      'feat.kbTryBtn': 'Try 108-Key Layout Above ↑',
      'feat.mouseSpec1Lbl': 'Independent L / R / Scroll Glow',
      'feat.mouseSpec2Lbl': 'SHA-256 Verified Updates',
      'feat.mouseSpec3Val': '1-Click Update',
      'feat.mouseSpec3Lbl': 'Silent Win & Mac Upgrade',
      'bento.1Title': '2-Tab Zero-Scroll Menu & Persistent Lock',
      'bento.1Body': 'Split into Appearance and Keyboard/OBS/System tabs so everything fits on one screen—plus 20%–150% scaling and persistent click-through lock with a one-click startup Unlock pill.',
      'bento.2Title': 'Head Petting & Synthesized Purr',
      'bento.2Body': 'Hover over the cat’s head and pet back-and-forth to trigger happy squinting eyes and gentle 24.5Hz Web Audio purring.',
      'bento.3Title': 'Auto Password Privacy Guard',
      'bento.3Body': 'Detects Windows & macOS password fields at the OS level—intercepting keystrokes in Rust while cats close their eyes and BigFish covers hers.',
      'bento.4Title': 'Instanced GPU & Game Auto-Eco Mode',
      'bento.4Body': 'Instanced 3D keycap batching and GPU vertex deformation cut active GPU usage by 75%; auto 30 FPS Game Eco Mode cuts it by up to 88.5% while favoring iGPU on laptops.',
      'mcp.p1Text': '💬 "Create a British Shorthair blue cat via KuroCat MCP and switch to it"',
      'mcp.p2Text': '📸 "Look at this photo of my cat and design a matching KuroCat skin!"',
      'mcp.p3Text': '⚙️ "Scale KuroCat to 85% and switch to 108-key viewer perspective"',
      'mcp.copyShort': 'Copy',
      'mcp.tabHttp': 'Local HTTP',
      'mcp.footerMeta': '7 Built-in Tools · 0.4s Live Hot-Reload',
      'mcp.copyCfg': 'Copy Config',
      'growth.eyebrow': 'Live Growth · Real-Time Telemetry',
      'growth.title': 'Live Growth Curve',
      'growth.sub': 'Real-time trajectory of cumulative downloads across all mirrors and GitHub Stars—hover to inspect any timestamp.',
      'growth.dlLbl': 'Total Downloads',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': 'Both',
      'growth.modeDl': 'Downloads',
      'growth.modeStars': 'Stars',
      'growth.loading': 'Syncing live growth telemetry…',
      'growth.starCta': '⭐ Star KuroCat on GitHub ›',
      'footer.home': 'Qianyi Home',
      'footer.pelican': 'Pelican Benchmark',
      'footer.releases': 'All Releases',
      'footer.download': 'All-Platform Downloads',
      'footer.vsBongo': 'KuroCat vs Bongo Cat',
      'footer.obs': 'OBS Transparent Guide',
      'footer.mcp': 'AI MCP Studio',
      'footer.security': 'Security Advisory',
      'alert.badge': 'ONLY OFFICIAL SITE',
      'alert.cta': 'Security Advisory →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> is the ONLY official KuroCat website (<code>github.com/qianyiai/KuroCat</code>). ⚠️ WARNING: Impersonator <strong>kurocat.net</strong> distributes an unauthorized 64 MB <code>KuroCat.v5.1.0.zip</code> padded with 50 MiB junk &amp; a fake 36 MB binary — do NOT download or run it!',
      'hero.title': 'KuroCat — A Typing Black Cat<br /><span>Living on Your Desktop</span>',
      'hero.sub':
        'A free, open-source transparent desktop typing companion with instant <strong>3D / 2D</strong> switching and ultra-low GPU overhead. Includes <strong>6 cats + BigFish</strong>, head-pat purring, password privacy guard, OBS overlay, and <strong>AI cat studio</strong>.',
      'dl.sub':
        'Every build includes <strong>20%–150% smooth scaling</strong>, <strong>65% / 108-key switching</strong>, <strong>customizable tail keys</strong>, and <strong>in-app auto-updates</strong>.<br />Fast official CDN mirrors on <code>kurocat.org</code> alongside official GitHub Releases with SHA-256 verification.',
      'quark.heroDesc':
        '<strong>"KuroCat 谦一_官方"</strong> China fast cloud pack · Opening supports free open-source development',
      'quark.dlBody':
        'Official folder synced with Windows, macOS &amp; Android builds — fast direct access in China, and opening via Quark Drive also supports free open-source maintenance. In Quark Drive App, copy code <code>/~f3813cZv6O~:/</code>.',
      'dl.winDesc':
        'Starts with the 65% compact layout and adds Desktop, Start Menu & Uninstaller shortcuts. Right-click anytime for <strong>108-key full-size</strong>, <strong>custom tail keys</strong>, OBS source & one-click updates.',
      'dl.macDesc':
        'Native ARM64 + x86_64 Universal DMG supporting Apple Silicon M1–M4 and Intel Macs (macOS 10.15 Catalina+). Includes 65%/108-key layouts, all 6 cats & BigFish. Open <code>.dmg</code> and drag to Applications.',
            'dl.androidDesc':
        'Always-on-top Android floating companion with <strong>6 cats + BigFish</strong>, <strong>20%–100% opacity</strong>, real cat purring &amp; typing audio, head-pat / chin-scratch / scruff-lift interactions, auto rotation, and payment-keyboard privacy guard.',
      'dl.tipWinBody':
        'Because KuroCat is free open-source software without a commercial EV code-signing certificate, Edge/Chrome may show a download warning (100% source code is public on GitHub):<br /><strong>① Edge</strong>: Hover the download → click <strong><code>···</code></strong> → <strong>Keep</strong> → click the down arrow <strong><code>▾</code> (Show more)</strong> → <strong>Keep anyway</strong> (Chrome: press <code>Ctrl + J</code> → Keep dangerous file → Keep anyway).<br /><strong>② Windows SmartScreen</strong>: Click <strong>More info</strong> → <strong>Run anyway</strong>.',
      'dl.tipBrewBody':
        'Official Homebrew Tap (<code>qianyiai/homebrew-tap</code>) is live. Run the command on the right to install and automatically clear quarantine attributes (no manual <code>xattr</code> needed), and update anytime with <code>brew upgrade --cask kurocat</code>.',
      'dl.tipMacBody':
        'Because this open-source app is not Apple-notarized, if macOS says "cannot be verified" or "damaged" on first launch, run the command on the right once in Terminal to remove the quarantine attribute. Then enable <code>KuroCat</code> in <strong>System Settings → Privacy &amp; Security → Accessibility &amp; Input Monitoring</strong> (Karabiner-Elements compatible).',
      'dl.tipWv2Body':
        'Occurs on older stripped Windows 10 / LTSC installs without Microsoft Edge WebView2 (<strong>Windows 7 users should use the Win7 Portable pack below</strong>). Install the official 1.8 MB Microsoft WebView2 bootstrapper via <strong>Right-click → Run as administrator</strong>.',
      'dl.win7Body':
        'Compiled natively as PE 6.01 for Windows 7 SP1 x64 &amp; 32-bit x86 with zero Win8/Win10 DLL dependencies. Bundles Microsoft’s final Win7 offline <strong>WebView2 109.0.1518.78</strong> runtime and native 256-level per-pixel anti-aliased transparency (zero white box with or without Aero). Extract all files and run <code>KuroCat.exe</code> next to <code>WebView2Runtime</code>.',
      'dl.linuxBody':
        'Native rootless X11 <code>XRecord</code> global hooks with Wayland <code>evdev</code> fallback, borderless transparency, click-through (hold <code>Alt</code> to drag) & autostart. Requires <strong><code>glibc &gt;= 2.34</code></strong> (Ubuntu 22.04+ / Debian 12+ / KylinOS V11+; not compatible with Ubuntu 20.04 / <code>glibc 2.31</code>). Use lightweight <strong>.deb (2.7 MB)</strong> (requires <code>libwebkit2gtk-4.1-0</code>) or portable <strong>.AppImage</strong>.',
      'dl.tipGameBody':
        '<strong>① Fullscreen &amp; Borderless Games</strong>: Built-in non-focus-stealing topmost guard for FSO &amp; borderless windows; enable Click-Through Lock (hold <code>Alt</code> anytime to move). For admin games, use tray → <strong>Restart as Administrator</strong>.<br /><strong>② OBS Streaming (Zero Chroma-Key)</strong>: Right-click pet or tray → <strong>Copy OBS Transparent Source URL</strong> (starts local <code>http://127.0.0.1:27421/obs</code>, off by default with zero overhead) and add as an OBS Browser Source for native Alpha transparency + OBS-Only mode + synced password guard.<br /><strong>③ Kernel Anti-Cheat Games</strong> (Valorant, etc.): Use tray → <strong>Pause Hook &amp; Hide (Anti-Cheat Safe Mode)</strong> before launching to fully unload global hooks.',
      'feat.whaleHeadline': 'Meet "BigFish" Whale-Girl<br />Tail Slaps · Speed Blush · Privacy Shield',
      'feat.whaleBody':
        'Our built-in <strong>🐳 BigFish (whale-girl)</strong> skin supports simultaneous <strong>left-hand mouse + right-hand typing + splashing whale-tail key slaps</strong>. Type faster to make her blush and burst into a happy smile; focus any password field and she covers her eyes with both hands while hiding every keycap.',
      'feat.kbHeadline': '65% Compact or 108 Full-Size<br />Dual Perspectives, Instant Switch',
      'feat.kbBody':
        'Switch in one click between minimal 65% and full 108-key ANSI (complete F-row &amp; numpad) with smooth bottom-right anchored resizing. Flip between <strong>Cat-Facing (180°)</strong> and <strong>Viewer-Facing (upright legends)</strong> with synchronized mouse button orientation.',
      'feat.mouseHeadline': 'Independent L / R Click Colors<br />&amp; Seamless In-App Auto-Updater',
      'feat.mouseBody':
        'Left (<code>L</code>), Right (<code>R</code>), and scroll/middle clicks glow independently with contrasting accent colors, 3D pressed shadows, and mini <code>LMB</code>/<code>RMB</code> badges—supporting dual-button holds. Fast CDN-first update checks (with GitHub fallback) pop a compact dismissible update pill above the pet for SHA-256 verified one-click upgrades.',
      'mcp.headline': 'Share a Photo of Your Cat<br />AI Sculpts It in 0.4 Seconds',
      'mcp.body':
        'KuroCat ships with both <strong>Stdio</strong> and <strong>Local Streamable HTTP (<code>127.0.0.1:27420</code>)</strong> MCP servers inside the single binary—no Node.js or Python needed. Click "Copy MCP Config" and paste into <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong> to design any coat, tabby stripes, calico patches, or eye colors with instant hot-reload.',
      'footer.credit': 'KuroCat Official Website (<code>kurocat.org</code>) · MIT Open Source · Built by <a class="footer-home" href="https://qianyi.one/?lang=en" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'Type a password here: cat closes eyes / BigFish covers eyes & hides keys…',
    },
    titles: {
      'pg.autoDemoTitle': 'Toggle automatic typing & mouse demo',
      'pg.mouseTitle': 'Demo independent L/R mouse clicks',
      'pg.curiousTitle': 'Trigger curious wide pupils (or flick cursor quickly)',
      'pg.crossTitle': 'Trigger airplane ears + 3-beat tail desk-thump (or mash keys)',
      'pg.sleepTitle': 'Trigger sleepy loaf with floating Zzz (press any key to wake)',
      'pg.bubblesTitle': 'Toggle floating keycap bubbles',
      'pg.purrTitle': 'Toggle petting purr sound',
      'pg.headphonesTitle': 'Toggle gaming headset (desktop app auto-equips when a game is detected)',
      'pg.orbitTitle': 'Enable to drag on the canvas and rotate the 3D model 360°',
      'pg.tailSmartTitle': 'Paws type normally; tail assists as a 3rd hand when busy or on fast Enter',
      'pg.tailCustomTitle': 'Tail taps only the keys you select',
      'pg.tailEdgeTitle': 'Outer tail-side edge keys only (protects WASD)',
      'pg.tailOffTitle': 'Tail wags naturally without pressing keys',
      'pg.tailPickerTitle': 'Click keycaps on the keyboard above or press physical keys to toggle',
      'pg.privacyTitle': 'Toggle password privacy guard demo',
      'pg.scaleResetTitle': 'Click to reset to 100%',
      'alert.closeTitle': 'Dismiss notice',
    },
    ariaLabels: {
      'nav.backAria': 'Back to Qianyi home',
      'nav.mainAria': 'Main navigation',
      'pg.modeAria': '3D / 2D render mode',
      'pg.backdropAria': 'Preview desk backdrop',
      'pg.canvas2dAria': 'KuroCat 2D live interactive playground canvas',
      'pg.canvas3dAria': 'KuroCat 3D live interactive playground canvas',
      'pg.tailPickerAria': 'Customize tail keys',
      'pg.skinGroupAria': 'Choose pet skin',
      'pg.layoutAria': 'Keyboard layout',
      'pg.orientAria': 'Keyboard perspective',
      'pg.collarAria': '3D collar and bell color',
      'pg.tailModeAria': 'Tail key-patting mode',
      'pg.pwdAria': 'Password privacy guard demo input',
      'pg.scaleAria': 'Scale from 20% to 150%',
      'alert.closeAria': 'Dismiss notice',
    },
    alts: {
      'hero.iconAlt': 'KuroCat app icon',
      'feat.kbImgAlt': 'KuroCat 65% compact vs 108-key full-size and dual perspective showcase',
      'feat.mouseImgAlt': 'KuroCat independent L/R mouse highlights and in-app auto-updater showcase',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-BigFish-14s-Vertical-Demo.mp4',
    },
    prompts: {
      'mcp.p1': 'Use KuroCat MCP to create a British Shorthair blue cat with amber eyes and ice-blue keycaps, and switch to it now',
      'mcp.p2': 'Look at this photo of my cat and design a custom KuroCat desktop pet matching its fur pattern and markings!',
      'mcp.p3': 'Scale KuroCat to 85% and switch to the 108-key full-size viewer-facing keyboard',
    },
    skins: {
      black: 'Black Cat',
      ragdoll: 'Little Whale Butler',
      'orange-tabby': 'Orange Tabby',
      calico: 'Calico',
      tuxedo: 'Tuxedo',
      siamese: 'Siamese',
      dafeiyu: 'BigFish',
    },
    tailModeShort: {
      smart: 'Tail: Smart',
      custom: 'Tail: Custom',
      edge: 'Tail: Edge',
      off: 'Tail: Wag Only',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<YourUsername>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Windows Stdio Mode (Claude / Cursor / Antigravity)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;YourUsername&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// macOS Stdio Mode (zero dependencies, built into app binary)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// Local Streamable HTTP Mode (connect while KuroCat is running)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `Latest ${tag}`,
      heroDownloadWin: (size) => `Download for Windows (${size})`,
      heroDownloadMac: (size) => `Download for macOS (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Download for Windows 7 32-bit (${size})` : `Download for Windows 7 64-bit (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Download for Linux ARM64 (${size})` : `Download for Linux (${size})`,
      heroDownloadAndroid: (size) => `Download Android APK (${size})`,
      heroDownloadIos: () => 'Browse Desktop & Android Builds',
      heroOsHint: (os, size) => {
        if (os === 'android') return `Detected your device: <strong>Android</strong> · Tap to download the signed APK (${size})`;
        if (os === 'macos') return 'Detected your OS: <strong>macOS (Apple Silicon &amp; Intel)</strong> · Also available for Win / Linux / Android';
        if (os === 'win7-x86') return 'Detected your OS: <strong>Windows 7 (32-bit)</strong> · Auto-selected 32-bit offline WebView2 109 portable build';
        if (os === 'win7') return 'Detected your OS: <strong>Windows 7 (64-bit)</strong> · Auto-selected offline WebView2 109 portable build';
        if (os === 'linux-arm64') return 'Detected your OS: <strong>Linux ARM64</strong> · Recommended lightweight .deb (AppImage below)';
        if (os === 'linux-x64') return 'Detected your OS: <strong>Linux x86_64</strong> · Recommended lightweight .deb (AppImage below)';
        if (os === 'ios') return 'Detected your device: <strong>iOS / iPadOS</strong> · Available for Windows, macOS, Linux &amp; Android below';
        return 'Detected your OS: <strong>Windows 10 / 11 (x64)</strong> · Also available for macOS / Linux / Android';
      },
      layout: (id) => (id === '108' ? '108 Full-Size' : '65% Compact'),
      orient: (o) => (o === 'viewer' ? 'Viewer View' : 'Cat View'),
      tailPickerBtn: (open, count) =>
        open ? `✓ Picking (${count} selected)` : `🐾 Pick Tail Keys (${count})`,
      tailPickerTitleDefault: (count) => `🐾 Click keycaps below or press physical keys (${count} selected)`,
      tailKeyAdded: (key, count) => `🐾 Added "${key}" · ${count} keys (click Done to test)`,
      tailKeyRemoved: (key, count) => `🐾 Removed "${key}" · ${count} keys`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter & Space', rightFn: 'Arrows & Numpad', edgeMods: 'Outer Modifiers' };
        return `🐾 Applied "${names[preset]}" (${count} keys)`;
      },
      tailCleared: () => '🐾 Cleared all tail keys (click keycaps or press keys to add)',
      autoDemoBtn: (running) => (running ? '⏸ Stop Demo' : '▶ Auto Demo'),
      privacyBtn: (active) => (active ? '🙈 Privacy Active' : '🔒 Privacy Guard'),
      whaleSoundBtn: (muted) => (muted ? '🔇 Unmute Audio' : '🔊 Audio On'),
      copied: () => 'Copied ✓',
      copyConfig: () => 'Copy Config',
      copyCmd: () => 'Copy Command',
      copyShort: () => 'Copy',
      totalDownloads: (count) => `${count} total downloads`,
      statsUpdated: (timePart) => `Updated ${timePart} (UTC+8) · auto-refreshes every 30s`,
    },
  },

  ja: {
    htmlLang: 'ja',
    docTitle: 'KuroCat 公式サイト — 無料オープンソース 3D デスクトップタイピング黒猫 & AI コンパニオン (Win/Mac/Linux/Android)',
    metaDesc:
      'KuroCat 公式サイト（kurocat.org · github.com/qianyiai/KuroCat）— Windows / macOS (Homebrew) / Linux / Android 対応の無料オープンソース 3D/2D 透過デスクトップタイピング黒猫＆AI コーディングコンパニオン（Bongo Cat 代替）。猫 6 種＋クジラ娘、Claude/Codex/DeepSeek 連携、OBS 透過ソース、パスワード保護、内蔵 MCP AI カスタム対応。',
    text: {
      'nav.back': '← 謙一',
      'nav.playground': '体験版',
      'nav.whale': 'クジラ娘動画',
      'nav.download': 'ダウンロード',
      'nav.quark': '☁️ Quark クラウド',
      'nav.features': '主な機能',
      'nav.mcp': 'AI カスタム',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': '全プラットフォーム',
      'hero.ghSource': 'GitHub ソース ›',
      'hero.spec1Lbl': 'Rust ネイティブ導入サイズ',
      'hero.spec2Val': '7 種 + MCP',
      'hero.spec2Lbl': '猫 & クジラ娘 · AI 制作',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'リアルタイム体験版 · 打鍵やなでなでに対応',
      'pg.mode3d': '✨ 3D モード',
      'pg.mode2d': '🎨 2D クラシック',
      'pg.bgDark': 'ダーク壁紙',
      'pg.bgLight': 'ライト壁紙',
      'pg.hintKey': '⌨️ キー入力',
      'pg.hintMouse': '🖱️ 左右クリック',
      'pg.hintPet': '🤚 頭をなでる',
      'pg.done': '完了',
      'pg.presetOffice': 'Enter・Space',
      'pg.presetRightFn': '方向・テンキー',
      'pg.presetEdgeMods': '外側修飾キー',
      'pg.presetClear': 'クリア',
      'pg.lblSkin': 'スキン',
      'pg.layout65': '65% コンパクト',
      'pg.layout108': '108 フルサイズ',
      'pg.orientCat': '猫目線',
      'pg.orientViewer': '視聴者目線',
      'pg.btnMouse': '🖱️ 左右クリック',
      'pg.btnCurious': '👀 好奇心',
      'pg.btnCross': '💢 しっぽ叩き',
      'pg.btnSleep': '💤 うたた寝',
      'pg.btnBubbles': '💬 バブル',
      'pg.btnPurr': '🔊 ゴロゴロ',
      'pg.btnHeadphones': '🎧 ヘッドセット',
      'pg.btnOrbit': '🔄 360° 回転',
      'pg.lblCollar': '3D 首輪',
      'pg.collarNone': 'なし',
      'pg.collarRed': '🔴 赤',
      'pg.collarBlue': '🔵 青',
      'pg.collarPink': '🩷 ピンク',
      'pg.collarGreen': '🟢 緑',
      'pg.lblTail': 'しっぽ打鍵',
      'pg.tailSmart': 'スマート第3の手',
      'pg.tailCustom': 'カスタム',
      'pg.tailEdge': '端エリア',
      'pg.tailOff': '揺らすだけ',
      'pg.lblPwd': 'パスワード',
      'pg.lblScale': '拡大縮小',
      'dl.eyebrow': 'Direct Downloads · Cloudflare Edge CDN',
      'dl.title': '無料ダウンロード、3 秒でデスクにお迎え',
      'dl.winName': 'Windows 65% インストーラー版',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'おすすめ',
      'dl.primaryBtn': '高速ダイレクトDL',
      'dl.quarkBtn': '☁️ Quark クラウド ›',
      'dl.ghBtn': 'GitHub 公式ミラー ›',
      'quark.badge': '☁️ 公式 Quark クラウド',
      'quark.platforms': 'Win / Mac / Android 一括',
      'quark.openBtn': '開く ↗',
      'quark.copyBtn': 'コードコピー',
      'quark.dlBadge': '☁️ 公式 Quark クラウド高速ミラー',
      'quark.dlPlatforms': 'Windows · macOS · Android 同梱',
      'quark.dlTitle': '「KuroCat 谦一_官方」公式パッケージフォルダ',
      'quark.dlOpenBtn': '☁️ Quark クラウドで開く ↗',
      'dl.macName': 'macOS ユニバーサル版（M チップ & Intel）',
      'dl.macSub': 'macOS 10.15+ (Catalina 以降) Universal DMG',
      'dl.recommendedTag': 'この端末におすすめ',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android オーバーレイ版 (APK)',
      'dl.androidSub': 'Android 8.0+ 公式署名済み APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ ブラウザのダウンロード警告や SmartScreen が表示されたら？',
      'dl.tipBrewTitle': '🍺 macOS Homebrew ワンラインインストール（推奨・自動検疫解除）',
      'dl.tipMacTitle': '🍎 macOS 初回起動ガイド（初回のみ・常時ターミナル不要）',
      'dl.copyCmd': 'コマンドをコピー',
      'dl.tipWv2Title': '🪟 Windows で「Could not find the WebView2 Runtime」が出たら？',
      'dl.tipWv2Btn': 'Microsoft WebView2 をダウンロード ›',
      'dl.win7Title': '🖥️ Windows 7 SP1（64bit / 32bit）専用ポータブル版（WebView2 109 同梱）',
      'dl.win7Btn': '64bit ポータブル（179.3 MB）',
      'dl.win7X86Btn': '32bit ポータブル（159.4 MB）',
      'dl.win7Gh': 'GitHub 64bit ›',
      'dl.win7X86Gh': 'GitHub 32bit ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+（x86_64 & ARM64）',
      'dl.linuxX64Deb': 'x86_64 .deb（2.66 MB）',
      'dl.linuxArmDeb': 'ARM64 .deb（2.62 MB）',
      'dl.linuxX64AppImage': 'x86_64 AppImage（77.8 MB）›',
      'dl.linuxArmAppImage': 'ARM64 AppImage（76.0 MB）›',
      'dl.tipGameTitle': '🎮 フルスクリーンゲーム・OBS 配信・アンチチート案内',
      'feat.title': '1 ピクセルまでこだわり抜いた滑らかさ',
      'feat.whaleEyebrow': 'New Skin · 🐳 クジラ娘（BigFish）· 14s Video',
      'feat.whaleSpec1Val': '3 系統同時動作',
      'feat.whaleSpec1Lbl': 'マウス + 手打ち + クジラ尾',
      'feat.whaleSpec2Val': '速度連動',
      'feat.whaleSpec2Lbl': '高速打鍵で照れ顔 → 満面笑顔',
      'feat.whaleSpec3Val': '自動目隠し',
      'feat.whaleSpec3Lbl': 'パスワード入力を両手で保護',
      'feat.whaleTryBtn': '上の体験版でクジラ娘を試す ↑',
      'feat.whaleDlBtn': '1080p 縦型デモ動画を保存（14秒）',
      'feat.whaleMeta': '1080×1920 · 60fps · 14秒 同期打鍵＆クリック音付き',
      'feat.kbSpec1Val': '108 キー',
      'feat.kbSpec1Lbl': 'F 列＆テンキー完全搭載',
      'feat.kbSpec2Val': '2 視点切替',
      'feat.kbSpec2Lbl': '猫目線 / 視聴者目線',
      'feat.kbSpec3Val': '完全識別',
      'feat.kbSpec3Lbl': 'メイン Enter と Num↵ を独立認識',
      'feat.kbTryBtn': '上の体験版で 108 キーを試す ↑',
      'feat.mouseSpec1Lbl': '左右中クリック完全独立発光',
      'feat.mouseSpec2Lbl': 'SHA-256 自動検証更新',
      'feat.mouseSpec3Val': '1 クリック更新',
      'feat.mouseSpec3Lbl': 'Win / Mac 自動再起動アップデート',
      'bento.1Title': '2 タブ式スクロール不要メニュー & 透過ロック記憶',
      'bento.1Body': '「外観と操作 / キーボード・OBS・システム」の 2 タブで 1 画面完結。20%–150% ズーム対応＆再起動後もクリック透過を維持し、起動時ワンクリック解除バー付き。',
      'bento.2Title': 'なでなで細目 & 合成ゴロゴロ音',
      'bento.2Body': '猫の頭を往復でなでると気持ちよさそうに目を細め、Web Audio 24.5Hz 合成のやさしいゴロゴロ音が鳴ります。',
      'bento.3Title': 'パスワード自動目隠し保護',
      'bento.3Body': 'Windows / macOS のパスワード欄を自動検知し Rust 層で打鍵を遮断。猫は目を閉じ、クジラ娘は両手で目を覆います。',
      'bento.4Title': 'GPU インスタンス描画 & ゲーム自動省電力',
      'bento.4Body': '3D キーキャップのインスタンス統合と GPU 頂点変形でアクティブ時 GPU 負荷 75% 削減。ゲーム起動中は自動で 30 FPS 省電力（最大 88.5% 削減）へ切替。',
      'mcp.p1Text': '💬 「KuroCat MCP でブリティッシュショートヘアを作って切り替えて」',
      'mcp.p2Text': '📸 「うちの猫の写真に合わせて専用ペットを作って！」',
      'mcp.p3Text': '⚙️ 「85% に縮小して 108 キー・視聴者目線に切り替えて」',
      'mcp.copyShort': 'コピー',
      'mcp.tabHttp': 'ローカル HTTP',
      'mcp.footerMeta': '内蔵 7 ツール対応 · 0.4 秒ホットリロード',
      'mcp.copyCfg': '設定をコピー',
      'growth.eyebrow': 'Live Growth · Real-Time Telemetry',
      'growth.title': 'リアルタイム成長グラフ',
      'growth.sub': '全チャネル累計ダウンロード数と GitHub Stars の推移をリアルタイム表示。グラフ上でカーソルを動かすと詳細を確認できます。',
      'growth.dlLbl': '累計ダウンロード',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': '2 軸表示',
      'growth.modeDl': 'DL のみ',
      'growth.modeStars': 'Stars のみ',
      'growth.loading': 'リアルタイム統計を読み込み中…',
      'growth.starCta': '⭐ GitHub でスターを付ける ›',
      'footer.home': '謙一ホーム',
      'footer.pelican': 'ペリカンテスト',
      'footer.releases': '全リリース (Releases)',
      'footer.download': '全プラットフォーム DL',
      'footer.vsBongo': 'Bongo Cat 比較',
      'footer.obs': 'OBS 透過配信ガイド',
      'footer.mcp': 'AI MCP カスタム',
      'footer.security': '偽サイト注意・セキュリティ',
      'alert.badge': '唯一の公式サイト',
      'alert.cta': '偽サイト警告・検証 →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> が KuroCat 唯一の公式サイトです（<code>github.com/qianyiai/KuroCat</code>）。⚠️ 偽サイト <strong>kurocat.net</strong> の 64 MB <code>KuroCat.v5.1.0.zip</code> は 50 MiB の異常パディングと非公式 36 MB 実行ファイルを含む危険な偽ビルドのため絶対に実行しないでください！',
      'hero.title': 'KuroCat · キーボードを叩く黒猫が<br /><span>あなたのデスクトップに</span>',
      'hero.sub':
        '無料・オープンソースの透過デスクトップ相棒。<strong>3D / 2D</strong> をワンクリックで切替でき、ゲーム中も超低負荷で動作します。<strong>猫 6 種 + クジラ娘</strong>、なでなでゴロゴロ、パスワード自動保護、OBS 透過配信、<strong>AI カスタム猫</strong> に対応。',
      'dl.sub':
        '全パッケージに <strong>20%–150% 無段階ズーム</strong>・<strong>65% / 108 キー切替</strong>・<strong>しっぽキー選択</strong>・<strong>アプリ内自動更新</strong> を内蔵。<br /><code>kurocat.org</code> 公式高速ミラーと GitHub Releases 公式リンク（SHA-256 検証対応）を用意しています。',
      'quark.heroDesc':
        '<strong>「KuroCat 谦一_官方」</strong>公式クラウドフォルダ · 開くだけで無料開発の応援になります',
      'quark.dlBody':
        'Windows・macOS・Android 最新パッケージを公式同期中。リンクを開くだけで無料オープンソース開発の応援になります。Quark アプリではコード <code>/~f3813cZv6O~:/</code> をコピーして開けます。',
      'dl.winDesc':
        '初期配列は 65% コンパクト。デスクトップアイコンやアンインストーラーを自動作成し、右クリックから <strong>108 フルサイズ</strong>・<strong>しっぽキー指定</strong>・OBS 透過ソース・自動更新へいつでも切替できます。',
      'dl.macDesc':
        'Apple Silicon (M1–M4) と Intel Mac（macOS 10.15 Catalina 以降）両対応の Universal DMG。65%/108 キーと全 7 スキンを内蔵。<code>.dmg</code> を開いて「アプリケーション」へドラッグするだけです。',
            'dl.androidDesc':
        'スマホ・タブレット対応の常駐デスクトップペット。<strong>猫 6 種 + クジラ娘</strong>、<strong>20%–100% 不透明度</strong>、本物のゴロゴロ音＆打鍵音、なでなで・首根っこ持ち上げ、縦横画面切替、決済キーボード自動目隠しに対応。',
      'dl.tipWinBody':
        '無料オープンソースで商用コード署名がないため、ダウンロード時に警告が表示される場合があります（全ソースコードは GitHub で公開済み）：<br /><strong>① Edge</strong>：履歴にカーソルを合わせ <strong><code>···</code></strong> → <strong>保存</strong> → <strong><code>▾</code>（詳細表示）</strong> → <strong>保持する</strong>（Chrome は <code>Ctrl + J</code> → 危険なファイルを保存 → 保持）。<br /><strong>② SmartScreen の青い画面</strong>：<strong>詳細情報</strong> → <strong>実行</strong> をクリックしてください。',
      'dl.tipBrewBody':
        '公式 Homebrew Tap（<code>qianyiai/homebrew-tap</code>）を公開しました。右のコマンド 1 行で導入でき、検疫属性も自動解除されます（手動 <code>xattr</code> 不要）。以降は <code>brew upgrade --cask kurocat</code> で簡単に更新できます。',
      'dl.tipMacBody':
        '未公証アプリのため初回起動時に「開発元を確認できない」等と出た場合は、ターミナルで右のコマンドを一度だけ実行して隔離属性を解除してください。その後、<strong>システム設定 → プライバシーとセキュリティ</strong> で <strong>アクセシビリティ</strong> と <strong>入力監視</strong> の両方に <code>KuroCat</code> を許可すれば即時動作します（Karabiner-Elements 併用可）。',
      'dl.tipWv2Body':
        '古い Win10 / LTSC 環境で WebView2 が未導入の場合に表示されます（<strong>Windows 7 は下の専用ポータブル版をご利用ください</strong>）。右の Microsoft 公式 1.8 MB インストーラーを <strong>右クリック → 管理者として実行</strong> で導入してください。',
      'dl.win7Body':
        'Windows 7 SP1 64bit / 32bit 専用 PE 6.01 ネイティブビルド。Win7 最終版オフライン <strong>WebView2 109.0.1518.78</strong> を同梱し、Aero 有無を問わず白枠ゼロの 256 段階透過レンダリングを実現。すべて展開し <code>KuroCat.exe</code> と <code>WebView2Runtime</code> を同フォルダで起動してください。',
      'dl.linuxBody':
        'root 不要の X11 <code>XRecord</code> 監視と Wayland <code>evdev</code> フォールバック、透過最前面・クリック透過（<code>Alt</code> ドラッグ）・自動起動に対応。<strong><code>glibc &gt;= 2.34</code></strong>（Ubuntu 22.04+ / Debian 12+ / KylinOS V11+）が必要です。軽量な <strong>.deb（2.7 MB）</strong>（要 <code>libwebkit2gtk-4.1-0</code>）または <strong>.AppImage</strong> をお選びください。',
      'dl.tipGameBody':
        '<strong>① フルスクリーン＆ボーダレスゲーム</strong>：フォーカスを奪わない最前面ガードを内蔵（マウス透過ロック＋<code>Alt</code> 一時解除推奨）。管理者権限ゲームではトレイから <strong>管理者として再起動</strong> できます。<br /><strong>② OBS 透過配信（クロマキー不要）</strong>：右クリックまたはトレイから <strong>OBS 透過ソース URL をコピー</strong>（<code>http://127.0.0.1:27421/obs</code>、初期 OFF で負荷ゼロ）。OBS のブラウザソースに追加するだけで透過表示＆「OBS のみ表示」＆パスワード保護連動に対応します。<br /><strong>③ カーネル型アンチチート搭載ゲーム</strong>（VALORANT 等）：プレイ前にトレイの <strong>監視を一時停止して非表示</strong> をオンにすると安全にフックを解除できます。',
      'feat.whaleHeadline': '新スキン「クジラ娘」登場<br />クジラ尾打鍵・照れ笑顔・パスワード目隠し',
      'feat.whaleBody':
        '標準搭載の <strong>🐳 クジラ娘（BigFish）</strong> は <strong>左手マウス + 右手タイピング + 水しぶき付きクジラ尾打鍵</strong> の 3 系統同時動作に対応。高速タイピングで頬が染まり満面の笑顔に、パスワード入力時は両手で目を覆って入力を隠します。',
      'feat.kbHeadline': '65% コンパクト / 108 フルサイズ<br />2 視点をワンクリック切替',
      'feat.kbBody':
        '省スペースな 65% もテンキー完備の 108 キーも右クリック 1 秒で切替でき、右下基準でウィンドウ幅を自動調整。<strong>猫目線（180°）</strong> と <strong>視聴者目線（正立印字）</strong> に合わせてマウス左右ボタンも自動反転します。',
      'feat.mouseHeadline': '左右クリックを別カラーで発光<br />アプリ内ワンクリック自動更新',
      'feat.mouseBody':
        '左（<code>L</code>）・右（<code>R</code>）・中/ホイールをコントラスト配色と 3D 影、ミニ <code>LMB</code>/<code>RMB</code> バッジで明確に識別（同時押し対応）。高速 CDN 優先（GitHub フォールバック）の自動更新チェックにより、新バージョン配信時はペット頭上に閉じられる小型更新ピルを表示し、SHA-256 検証付きでシームレスに更新できます。',
      'mcp.headline': '愛猫の写真から<br />AI が 0.4 秒でデスクトップへ再現',
      'mcp.body':
        'Node.js も Python も不要。単体アプリに <strong>Stdio</strong> と <strong>ローカル Streamable HTTP（<code>127.0.0.1:27420</code>）</strong> MCP サーバーを内蔵しています。右クリック「MCP 設定をコピー」を <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong> に貼るだけで、毛色や柄・瞳の色を自然言語で自由作成できます。',
      'footer.credit': 'KuroCat 公式サイト (<code>kurocat.org</code>) · MIT Open Source · Built by <a class="footer-home" href="https://qianyi.one/?lang=ja" rel="me noopener">謙一 (Qianyi)</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'ここにパスワードを入力：猫は目閉じ / クジラ娘は両手で目隠し…',
    },
    titles: {
      'pg.autoDemoTitle': '自動タイピング＆クリックデモの切替',
      'pg.mouseTitle': '左右独立クリックのデモ',
      'pg.curiousTitle': '好奇心のまん丸瞳をトリガー（素早いマウス移動でも発動）',
      'pg.crossTitle': 'イカ耳＋しっぽ 3 連机叩きをトリガー（連打でも発動）',
      'pg.sleepTitle': '香箱座りうたた寝 Zzz をトリガー（キー入力で起床）',
      'pg.bubblesTitle': 'キーバブル表示のオン/オフ',
      'pg.purrTitle': 'なでなでゴロゴロ音のオン/オフ',
      'pg.headphonesTitle': 'ゲーミングヘッドセットのオン/オフ（デスクトップ版はゲーム起動時に自動装着）',
      'pg.orbitTitle': 'オンにするとキャンバス上をドラッグして 3D モデルを 360° 回転できます',
      'pg.tailSmartTitle': '通常は両前足で打ち、忙しい時や高速 Enter でしっぽが自動補佐',
      'pg.tailCustomTitle': '自分で選んだキーだけしっぽで叩く',
      'pg.tailEdgeTitle': 'しっぽ側の外側端キーのみ（WASD 保護）',
      'pg.tailOffTitle': 'しっぽは自然に揺らすだけ（キーは叩かない）',
      'pg.tailPickerTitle': '上のキーボードをクリック、または実キーボードを押してしっぽキーを選択',
      'pg.privacyTitle': 'パスワード自動目隠しデモを切替',
      'pg.scaleResetTitle': 'クリックで 100% にリセット',
      'alert.closeTitle': 'お知らせを閉じる',
    },
    ariaLabels: {
      'nav.backAria': '謙一ホームへ戻る',
      'nav.mainAria': 'メインナビゲーション',
      'pg.modeAria': '3D / 2D 表示モード切替',
      'pg.backdropAria': 'プレビュー背景切替',
      'pg.canvas2dAria': 'KuroCat 2D リアルタイム体験キャンバス',
      'pg.canvas3dAria': 'KuroCat 3D リアルタイム体験キャンバス',
      'pg.tailPickerAria': 'しっぽキーのカスタム設定',
      'pg.skinGroupAria': 'ペットスキンを選択',
      'pg.layoutAria': 'キーボード配列',
      'pg.orientAria': 'キーボード視点',
      'pg.collarAria': '3D 首輪と鈴のカラー',
      'pg.tailModeAria': 'しっぽ打鍵モード',
      'pg.pwdAria': 'パスワード自動保護デモ入力欄',
      'pg.scaleAria': '拡大縮小 20%〜150%',
      'alert.closeAria': 'お知らせを閉じる',
    },
    alts: {
      'hero.iconAlt': 'KuroCat アプリアイコン',
      'feat.kbImgAlt': 'KuroCat 65% コンパクト・108 フルサイズおよび 2 視点比較プレビュー',
      'feat.mouseImgAlt': 'KuroCat マウス左右独立ハイライトとアプリ内自動更新プレビュー',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-クジラ娘-14秒縦型デモ.mp4',
    },
    prompts: {
      'mcp.p1': 'KuroCat MCP を使って、琥珀色の瞳とアイスブルーのキーハイライトを持つブリティッシュショートヘアを作ってすぐ切り替えて',
      'mcp.p2': 'このうちの猫の写真を見て、KuroCat MCP で毛色と模様を再現した専用デスクトップペットを作って！',
      'mcp.p3': 'KuroCat を 85% に縮小して、108 キー・視聴者目線に切り替えて',
    },
    skins: {
      black: '黒猫',
      ragdoll: 'クジラの執事',
      'orange-tabby': '茶トラ',
      calico: '三毛猫',
      tuxedo: 'ハチワレ',
      siamese: 'シャム猫',
      dafeiyu: 'クジラ娘',
    },
    tailModeShort: {
      smart: 'しっぽ：スマート',
      custom: 'しっぽ：カスタム',
      edge: 'しっぽ：端のみ',
      off: 'しっぽ：揺れのみ',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<ユーザー名>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Windows Stdio モード（Claude / Cursor / Antigravity 共通）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;ユーザー名&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// macOS Stdio モード（外部依存なし・アプリ内蔵バイナリ直結）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// ローカル Streamable HTTP モード（KuroCat 起動中に直接接続）</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `最新版 ${tag}`,
      heroDownloadWin: (size) => `Windows 版を無料ダウンロード（${size}）`,
      heroDownloadMac: (size) => `macOS 版を無料ダウンロード（${size}）`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Windows 7 32bit 版をダウンロード（${size}）` : `Windows 7 64bit 版をダウンロード（${size}）`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Linux ARM64 版を無料ダウンロード（${size}）` : `Linux 版を無料ダウンロード（${size}）`,
      heroDownloadAndroid: (size) => `Android APK を無料ダウンロード（${size}）`,
      heroDownloadIos: () => 'PC / Android 版のダウンロードを見る',
      heroOsHint: (os, size) => {
        if (os === 'android') return `端末を自動検出：<strong>Android</strong> · 公式署名 APK（${size}）をすぐダウンロード`;
        if (os === 'macos') return 'OS を自動検出：<strong>macOS (Apple Silicon &amp; Intel)</strong> · Win / Linux / Android 版もあり';
        if (os === 'win7-x86') return 'OS を自動検出：<strong>Windows 7（32bit）</strong> · 32bit WebView2 109 同梱ポータブル版をおすすめ';
        if (os === 'win7') return 'OS を自動検出：<strong>Windows 7（64bit）</strong> · WebView2 109 同梱ポータブル版をおすすめ';
        if (os === 'linux-arm64') return 'OS を自動検出：<strong>Linux ARM64</strong> · 軽量 .deb を推奨（AppImage は下部に掲載）';
        if (os === 'linux-x64') return 'OS を自動検出：<strong>Linux x86_64</strong> · 軽量 .deb を推奨（AppImage は下部に掲載）';
        if (os === 'ios') return '端末を自動検出：<strong>iOS / iPadOS</strong> · 現在は PC（Win/Mac/Linux）と Android 向けを提供中';
        return 'OS を自動検出：<strong>Windows 10 / 11 (x64)</strong> · macOS / Linux / Android 版もあり';
      },
      layout: (id) => (id === '108' ? '108 フルサイズ' : '65% コンパクト'),
      orient: (o) => (o === 'viewer' ? '視聴者目線' : '猫目線'),
      tailPickerBtn: (open, count) =>
        open ? `✓ 選択中（${count} キー）` : `🐾 しっぽキー選択（${count}）`,
      tailPickerTitleDefault: (count) => `🐾 下のキーをクリック、または実キーボードで切替（${count} キー選択中）`,
      tailKeyAdded: (key, count) => `🐾 「${key}」を追加・計 ${count} キー（完了でテスト）`,
      tailKeyRemoved: (key, count) => `🐾 「${key}」を解除・計 ${count} キー`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter・Space', rightFn: '方向・テンキー', edgeMods: '外側修飾キー' };
        return `🐾 「${names[preset]}」を適用（${count} キー）`;
      },
      tailCleared: () => '🐾 しっぽキーをすべてクリアしました（キーを押して追加）',
      autoDemoBtn: (running) => (running ? '⏸ デモ停止' : '▶ 自動デモ'),
      privacyBtn: (active) => (active ? '🙈 目隠し保護中' : '🔒 パスワード保護'),
      whaleSoundBtn: (muted) => (muted ? '🔇 音声をオン' : '🔊 音声オン'),
      copied: () => 'コピー済み ✓',
      copyConfig: () => '設定をコピー',
      copyCmd: () => 'コマンドをコピー',
      copyShort: () => 'コピー',
      totalDownloads: (count) => `累計 ${count} ダウンロード`,
      statsUpdated: (timePart) => `${timePart} (UTC+8) 更新 · 30 秒ごとに自動更新`,
    },
  },

  ko: {
    htmlLang: 'ko',
    docTitle: 'KuroCat 공식 사이트 — 무료 오픈소스 3D 바탕화면 타이핑 검은 고양이 & AI 컴패니언 (Win/Mac/Linux/Android)',
    metaDesc:
      'KuroCat 공식 웹사이트(kurocat.org · github.com/qianyiai/KuroCat) — Windows, macOS (Homebrew), Linux, Android를 지원하는 무료 오픈소스 3D/2D 투명 바탕화면 타이핑 검은 고양이 & AI 코딩 컴패니언(Bongo Cat 대안). 고양이 6종 + 고래소녀, Claude/Codex/DeepSeek 연동, OBS 투명 소스, 비밀번호 자동 눈 가리기, 내장 MCP AI 커스텀 지원.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': '체험판',
      'nav.whale': '고래소녀 영상',
      'nav.download': '다운로드',
      'nav.quark': '☁️ Quark 클라우드',
      'nav.features': '핵심 기능',
      'nav.mcp': 'AI 커스텀',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': '전체 플랫폼',
      'hero.ghSource': 'GitHub 소스 ›',
      'hero.spec1Lbl': '네이티브 Rust 설치 용량',
      'hero.spec2Val': '7종 + MCP',
      'hero.spec2Lbl': '고양이 & 고래소녀 · AI 제작',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': '실시간 체험 · 타이핑 & 쓰다듬기',
      'pg.mode3d': '✨ 3D 모드',
      'pg.mode2d': '🎨 2D 클래식',
      'pg.bgDark': '다크 배경',
      'pg.bgLight': '라이트 배경',
      'pg.hintKey': '⌨️ 키 입력',
      'pg.hintMouse': '🖱️ 좌/우 클릭',
      'pg.hintPet': '🤚 머리 쓰다듬기',
      'pg.done': '완료',
      'pg.presetOffice': 'Enter·Space',
      'pg.presetRightFn': '방향키·넘패드',
      'pg.presetEdgeMods': '우측 기능키',
      'pg.presetClear': '초기화',
      'pg.lblSkin': '스킨',
      'pg.layout65': '65% 콤팩트',
      'pg.layout108': '108 풀배열',
      'pg.orientCat': '고양이 시점',
      'pg.orientViewer': '시청자 시점',
      'pg.btnMouse': '🖱️ 좌/우 클릭',
      'pg.btnCurious': '👀 호기심',
      'pg.btnCross': '💢 꼬리 쿵',
      'pg.btnSleep': '💤 졸기',
      'pg.btnBubbles': '💬 말풍선',
      'pg.btnPurr': '🔊 골골송',
      'pg.btnHeadphones': '🎧 헤드셋',
      'pg.btnOrbit': '🔄 360° 회전',
      'pg.lblCollar': '3D 목걸이',
      'pg.collarNone': '없음',
      'pg.collarRed': '🔴 빨강',
      'pg.collarBlue': '🔵 파랑',
      'pg.collarPink': '🩷 분홍',
      'pg.collarGreen': '🟢 초록',
      'pg.lblTail': '꼬리 타건',
      'pg.tailSmart': '스마트 보조',
      'pg.tailCustom': '커스텀',
      'pg.tailEdge': '가장자리',
      'pg.tailOff': '흔들기만',
      'pg.lblPwd': '비밀번호',
      'pg.lblScale': '크기 조절',
      'dl.eyebrow': 'Direct Downloads · Cloudflare Edge CDN',
      'dl.title': '무료 다운로드 · 3초 만에 시작하기',
      'dl.winName': 'Windows 65% 클래식 설치판',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': '추천',
      'dl.primaryBtn': '고속 직접 다운로드',
      'dl.quarkBtn': '☁️ Quark 클라우드 ›',
      'dl.ghBtn': 'GitHub 공식 미러 ›',
      'quark.badge': '☁️ 공식 Quark 클라우드',
      'quark.platforms': 'Win / Mac / Android 통합',
      'quark.openBtn': '바로 열기 ↗',
      'quark.copyBtn': '코드 복사',
      'quark.dlBadge': '☁️ 공식 Quark 클라우드 고속 미러',
      'quark.dlPlatforms': 'Windows · macOS · Android 포함',
      'quark.dlTitle': '「KuroCat 谦一_官方」공식 통합 폴더',
      'quark.dlOpenBtn': '☁️ Quark 클라우드 열기 ↗',
      'dl.macName': 'macOS 유니버설 (Apple Silicon & Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina 이상) Universal DMG',
      'dl.recommendedTag': '내 기기 추천',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android 플로팅 펫 (APK)',
      'dl.androidSub': 'Android 8.0+ 공식 서명 APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ 브라우저에서 "일반적으로 다운로드되지 않음" 또는 Windows SmartScreen 경고가 뜨나요?',
      'dl.tipBrewTitle': '🍺 macOS Homebrew 한 줄 설치 (추천 · 격리 자동 해제)',
      'dl.tipMacTitle': '🍎 macOS 첫 실행 안내 (최초 1회 · 터미널 상시 실행 불필요)',
      'dl.copyCmd': '명령어 복사',
      'dl.tipWv2Title': '🪟 Windows에서 "Could not find the WebView2 Runtime" 오류가 뜨나요?',
      'dl.tipWv2Btn': 'Microsoft WebView2 다운로드 ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64비트 & 32비트) 전용 포터블 (WebView2 109 내장)',
      'dl.win7Btn': '64비트 포터블 (179.3 MB)',
      'dl.win7X86Btn': '32비트 포터블 (159.4 MB)',
      'dl.win7Gh': 'GitHub 64비트 ›',
      'dl.win7X86Gh': 'GitHub 32비트 ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 & ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 전체화면 게임 · OBS 방송 · 안티치트 안전 가이드',
      'feat.title': '한 픽셀까지 집요하게 다듬은 부드러움',
      'feat.whaleEyebrow': 'New Skin · 🐳 고래소녀 (BigFish) · 14초 영상',
      'feat.whaleSpec1Val': '3부위 동시',
      'feat.whaleSpec1Lbl': '마우스 + 타이핑 + 고래꼬리 타건',
      'feat.whaleSpec2Val': '속도 반응',
      'feat.whaleSpec2Lbl': '고속 타건 시 발그레 → 환한 웃음',
      'feat.whaleSpec3Val': '자동 눈 가리기',
      'feat.whaleSpec3Lbl': '비밀번호 입력 시 두 손으로 가림',
      'feat.whaleTryBtn': '위 체험판에서 고래소녀 바로 써보기 ↑',
      'feat.whaleDlBtn': '1080p 세로 데모 저장 (14초)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14초 동기화 타건·클릭 사운드 포함',
      'feat.kbSpec1Val': '108키',
      'feat.kbSpec1Lbl': '완전한 F열 및 숫자 키패드',
      'feat.kbSpec2Val': '이중 시점',
      'feat.kbSpec2Lbl': '고양이 시점 / 시청자 시점',
      'feat.kbSpec3Val': '정확한 구분',
      'feat.kbSpec3Lbl': '메인 Enter와 Num↵ 독립 인식',
      'feat.kbTryBtn': '위 체험판에서 108키 배열 체험하기 ↑',
      'feat.mouseSpec1Lbl': '좌/우/휠 클릭 완전 독립 발광',
      'feat.mouseSpec2Lbl': 'SHA-256 자동 무결성 검증',
      'feat.mouseSpec3Val': '원클릭 업뎃',
      'feat.mouseSpec3Lbl': 'Win / Mac 무중단 자동 재시작',
      'bento.1Title': '스크롤 없는 2탭 메뉴 & 클릭 통과 기억',
      'bento.1Body': '「외형·반응 / 키보드·OBS·설정」 2탭으로 한 화면에 깔끔하게 정리. 20%–150% 자유 조절과 재시작 후 클릭 통과 잠금 유지 및 시작 시 원클릭 해제 바를 제공합니다.',
      'bento.2Title': '머리 쓰다듬기 & 실시간 합성 골골송',
      'bento.2Body': '고양이 머리 위로 커서를 올려 좌우로 쓰다듬으면 나른하게 눈을 가늘게 뜨며 Web Audio 24.5Hz로 실시간 합성한 부드러운 골골송을 들려줍니다.',
      'bento.3Title': '비밀번호 입력 시 자동 눈 가리기',
      'bento.3Body': 'Windows·macOS 비밀번호 입력창을 OS 수준에서 자동 감지해 Rust 계층에서 키 입력을 차단합니다. 고양이는 눈을 감고, 고래소녀는 두 손으로 눈을 가립니다.',
      'bento.4Title': 'GPU 인스턴싱 최적화 & 게임 자동 절전',
      'bento.4Body': '3D 키캡 인스턴스 배칭과 GPU 정점 변형으로 활성 GPU 사용량을 75% 절감. 게임 실행 감지 시 자동으로 30 FPS 절전 모드(최대 88.5% 절감)로 전환됩니다.',
      'mcp.p1Text': '💬 "KuroCat MCP로 브리티시 숏헤어 블루 고양이를 만들어 바로 적용해 줘"',
      'mcp.p2Text': '📸 "우리 집 고양이 사진을 보고 꼭 닮은 전용 펫을 만들어 줘!"',
      'mcp.p3Text': '⚙️ "펫 크기를 85%로 줄이고 108키 시청자 시점으로 바꿔 줘"',
      'mcp.copyShort': '복사',
      'mcp.tabHttp': '로컬 HTTP',
      'mcp.footerMeta': '내장 도구 7종 지원 · 0.4초 핫 리로드',
      'mcp.copyCfg': '설정 복사',
      'growth.eyebrow': 'Live Growth · Real-Time Telemetry',
      'growth.title': '실시간 성장 그래프',
      'growth.sub': '전체 채널 누적 다운로드 수와 GitHub Stars 추이를 실시간으로 추적합니다. 그래프에 마우스를 올려 시점별 상세 수치를 확인하세요.',
      'growth.dlLbl': '누적 다운로드',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': '함께 보기',
      'growth.modeDl': '다운로드만',
      'growth.modeStars': 'Stars만',
      'growth.loading': '실시간 성장 데이터를 동기화하는 중…',
      'growth.starCta': '⭐ GitHub에서 Star로 응원하기 ›',
      'footer.home': 'Qianyi 홈',
      'footer.pelican': '펠리컨 벤치마크',
      'footer.releases': '모든 릴리스 (Releases)',
      'footer.download': '전체 플랫폼 다운로드',
      'footer.vsBongo': 'Bongo Cat 비교',
      'footer.obs': 'OBS 투명 방송 가이드',
      'footer.mcp': 'AI MCP 커스텀',
      'footer.security': '사칭 주의·보안 공지',
      'alert.badge': '유일한 공식 사이트',
      'alert.cta': '보안 공지·검증 →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong>는 KuroCat의 유일한 공식 사이트입니다 (<code>github.com/qianyiai/KuroCat</code>). ⚠️ 사칭 사이트 <strong>kurocat.net</strong>의 64 MB <code>KuroCat.v5.1.0.zip</code>에는 비공식 36 MB 실행 파일과 50 MiB 패딩이 포함되어 있어 악성코드 위험이 높으니 절대 실행하지 마세요!',
      'hero.title': 'KuroCat · 키보드를 치는 검은 고양이<br /><span>내 바탕화면에 살아요</span>',
      'hero.sub':
        '무료 오픈소스 투명 바탕화면 키보드·마우스 펫. <strong>3D 피규어 / 2D 클래식</strong> 원클릭 전환과 초저사양 GPU 최적화로 게임 중에도 가볍게 동작합니다. <strong>고양이 6종 + 고래소녀</strong>, 쓰다듬기 골골송, 비밀번호 눈 가리기, OBS 투명 방송, <strong>AI 펫 커스텀</strong>을 지원합니다.',
      'dl.sub':
        '모든 패키지에 <strong>20%–150% 자유 크기 조절</strong>, <strong>65% / 108키 즉시 전환</strong>, <strong>커스텀 꼬리 타건</strong>, <strong>앱 내 자동 업데이트</strong>가 기본 포함됩니다.<br /><code>kurocat.org</code> 공식 고속 CDN 미러와 SHA-256 검증을 지원하는 GitHub Releases 공식 링크를 함께 제공합니다.',
      'quark.heroDesc':
        '<strong>「KuroCat 谦一_官方」</strong>공식 클라우드 폴더 · 열어 주시면 무료 오픈소스 유지에 힘이 됩니다',
      'quark.dlBody':
        'Windows, macOS, Android 최신 설치 파일이 공식 동기화되어 있습니다. Quark 클라우드로 열면 무료 오픈소스 유지보수에도 도움이 됩니다. 앱에서는 코드 <code>/~f3813cZv6O~:/</code>를 복사해 바로 열 수 있습니다.',
      'dl.winDesc':
        '기본 65% 콤팩트 배열로 시작하며 바탕화면·시작 메뉴·제거 항목을 자동 생성합니다. 우클릭 메뉴에서 <strong>108 풀배열</strong>, <strong>커스텀 꼬리 키</strong>, OBS 투명 소스, 원클릭 업데이트를 언제든 사용할 수 있습니다.',
      'dl.macDesc':
        'Apple Silicon(M1–M4)과 Intel Mac(macOS 10.15 Catalina 이상)을 모두 지원하는 네이티브 Universal DMG. 65%/108키와 고양이 6종 및 고래소녀 스킨이 모두 포함됩니다. <code>.dmg</code>를 열어 「응용 프로그램」에 드래그하세요.',
            'dl.androidDesc':
        '스마트폰·태블릿용 플로팅 데스크톱 펫. <strong>고양이 6종 + 고래소녀</strong>, <strong>20%–100% 투명도 조절</strong>, 실제 고양이 골골송과 타건음, 쓰다듬기·목덜미 들어올리기, 가로/세로 자동 대응, 보안 키보드 자동 눈 가리기를 지원합니다.',
      'dl.tipWinBody':
        '상용 EV 코드 서명 인증서가 없는 무료 오픈소스 소프트웨어이므로 다운로드 시 브라우저 경고가 표시될 수 있습니다(전체 소스는 GitHub에 100% 공개됨):<br /><strong>① Edge</strong>: 다운로드 항목에 마우스 올리기 → <strong><code>···</code></strong> → <strong>유지</strong> → 삭제 옆 <strong><code>▾</code> (더 보기)</strong> → <strong>그래도 유지</strong> (Chrome: <code>Ctrl + J</code> → 위험한 파일 유지 → 계속 유지).<br /><strong>② Windows SmartScreen 파란 창</strong>: <strong>추가 정보</strong> → <strong>실행</strong>을 클릭하세요.',
      'dl.tipBrewBody':
        '공식 Homebrew Tap(<code>qianyiai/homebrew-tap</code>)이 오픈되었습니다. 오른쪽 명령어 한 줄로 설치하며 격리 속성도 자동 해제됩니다(수동 <code>xattr</code> 불필요). 이후 <code>brew upgrade --cask kurocat</code>로 간편하게 업그레이드할 수 있습니다.',
      'dl.tipMacBody':
        'Apple 공증을 받지 않은 오픈소스 앱이므로 첫 실행 시 "개발자를 확인할 수 없음" 또는 "손상됨" 알림이 뜨면 터미널에서 오른쪽 명령어를 한 번만 실행해 격리를 해제하세요. 전역 입력 감지는 <strong>시스템 설정 → 개인정보 보호 및 보안</strong>에서 <strong>손쉬운 사용</strong>과 <strong>입력 모니터링</strong> 모두에 <code>KuroCat</code>을 허용하면 즉시 작동합니다(Karabiner-Elements 호환).',
      'dl.tipWv2Body':
        'Microsoft Edge WebView2가 없는 구형 Win10 / LTSC 환경에서 발생합니다(<strong>Windows 7 사용자는 아래 전용 포터블 버전을 이용하세요</strong>). 오른쪽 Microsoft 공식 1.8 MB 설치 도구를 <strong>우클릭 → 관리자 권한으로 실행</strong>으로 설치하면 해결됩니다.',
      'dl.win7Body':
        'Windows 7 SP1 64비트·32비트 전용 네이티브 PE 6.01 빌드(Win8/Win10 DLL 의존성 0). Microsoft의 마지막 Win7 오프라인 <strong>WebView2 109.0.1518.78</strong> 런타임과 256단계 픽셀 투명 안티앨리어싱 렌더링을 탑재해 Aero 여부와 무관하게 흰 테두리가 전혀 없습니다. 압축을 모두 풀고 <code>WebView2Runtime</code>과 같은 폴더의 <code>KuroCat.exe</code>를 실행하세요.',
      'dl.linuxBody':
        '루트 권한 없는 X11 <code>XRecord</code> 전역 입력 감지 및 Wayland <code>evdev</code> 폴백, 투명 최상단 창, 클릭 통과(<code>Alt</code> 드래그) 및 자동 실행을 지원합니다. <strong><code>glibc &gt;= 2.34</code></strong>(Ubuntu 22.04+ / Debian 12+ / KylinOS V11+)가 필요합니다. 가벼운 <strong>.deb (2.7 MB)</strong>(<code>libwebkit2gtk-4.1-0</code> 필요) 또는 포터블 <strong>.AppImage</strong>를 선택하세요.',
      'dl.tipGameBody':
        '<strong>① 전체화면 &amp; 테두리 없는 창 게임</strong>: 포커스를 빼앗지 않는 최상단 가드를 내장(클릭 통과 잠금 + <code>Alt</code> 임시 이동 권장). 관리자 권한 게임은 트레이에서 <strong>관리자 권한으로 다시 시작</strong>을 사용하세요.<br /><strong>② OBS 투명 방송 (크로마키 불필요)</strong>: 우클릭 또는 트레이에서 <strong>OBS 소스 주소 복사</strong>(로컬 <code>http://127.0.0.1:27421/obs</code>, 기본 꺼짐으로 부하 0)를 누르고 OBS 브라우저 소스에 추가하면 알파 투명 채널, OBS 전용 표시 및 비밀번호 눈 가리기가 모두 연동됩니다.<br /><strong>③ 커널 안티치트 온라인 게임</strong>(발로란트 등): 플레이 전 트레이에서 <strong>입력 감지 일시정지 및 숨기기</strong>를 선택하면 훅을 완전히 해제할 수 있습니다.',
      'feat.whaleHeadline': '신규 스킨 「고래소녀」 등장<br />고래꼬리 타건 · 발그레 웃음 · 비밀번호 가리기',
      'feat.whaleBody':
        '기본 탑재된 <strong>🐳 고래소녀(BigFish)</strong> 스킨은 <strong>왼손 마우스 + 오른손 타이핑 + 물보라 고래꼬리 키 타건</strong> 3부위 동시 동작을 지원합니다. 빠르게 타이핑할수록 수줍게 볼이 붉어지다 환하게 웃고, 비밀번호 입력창에서는 두 손으로 눈을 가리며 모든 키캡을 숨깁니다.',
      'feat.kbHeadline': '65% 콤팩트 &amp; 108 풀배열<br />양방향 시점을 원클릭으로',
      'feat.kbBody':
        '미니멀한 65% 배열과 숫자 키패드가 완비된 108 풀배열을 우클릭 한 번으로 전환하며 우측 하단 기준으로 창 너비를 부드럽게 조절합니다. <strong>고양이 시점(180°)</strong>과 <strong>시청자 시점(정방향 각인)</strong> 전환 시 마우스 좌우 버튼 방향도 자동 동기화됩니다.',
      'feat.mouseHeadline': '좌/우 클릭 독립 컬러 발광<br />&amp; 원클릭 앱 내 자동 업데이트',
      'feat.mouseBody':
        '좌클릭(<code>L</code>), 우클릭(<code>R</code>), 휠/중간 클릭을 선명한 대비 색상과 3D 눌림 음영, <code>LMB</code>/<code>RMB</code> 미니 말풍선으로 완벽히 구분합니다(동시 누름 지원). 고속 CDN 우선(GitHub 폴백) 업데이트 감지로 새 버전이 출시되면 펫 머리 위에 닫을 수 있는 알림 바가 뜨며 SHA-256 검증 후 원클릭 업그레이드를 지원합니다.',
      'mcp.headline': '반려묘 사진 한 장이면<br />AI가 0.4초 만에 바탕화면에 제작',
      'mcp.body':
        'Node.js나 Python 설치가 필요 없습니다. 단일 실행 파일에 <strong>Stdio</strong>와 <strong>로컬 Streamable HTTP(<code>127.0.0.1:27420</code>)</strong> MCP 서버를 모두 내장했습니다. 우클릭「MCP 설정 복사」를 <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong>에 붙여넣고 원하는 털색, 줄무늬, 삼색 얼룩, 눈동자 색을 말로 주문하세요.',
      'footer.credit': 'KuroCat 공식 사이트 (<code>kurocat.org</code>) · MIT Open Source · Built by <a class="footer-home" href="https://qianyi.one/?lang=ko" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': '비밀번호 입력: 고양이는 눈 감기 / 고래소녀는 눈 가리기…',
    },
    titles: {
      'pg.autoDemoTitle': '자동 타이핑 및 마우스 클릭 데모 전환',
      'pg.mouseTitle': '독립 좌/우 마우스 클릭 데모',
      'pg.curiousTitle': '호기심 큰 눈동자 발동 (마우스를 빠르게 흔들어도 발동)',
      'pg.crossTitle': '비행기 귀 + 꼬리 3연타 책상 쿵 발동 (키를 마구 두드려도 발동)',
      'pg.sleepTitle': '식빵 굽고 Zzz 졸기 발동 (아무 키나 누르면 기상)',
      'pg.bubblesTitle': '키 입력 말풍선 켜기/끄기',
      'pg.purrTitle': '쓰다듬기 골골송 켜기/끄기',
      'pg.headphonesTitle': '게이밍 헤드셋 켜기/끄기 (데스크톱 앱은 게임 실행 시 자동 착용)',
      'pg.orbitTitle': '켜면 캔버스를 드래그해 3D 모델을 360° 회전할 수 있습니다',
      'pg.tailSmartTitle': '평소엔 양손으로 치고, 바쁘거나 빠른 Enter 시 꼬리가 자동 보조',
      'pg.tailCustomTitle': '직접 선택한 키만 꼬리로 타건',
      'pg.tailEdgeTitle': '꼬리 쪽 우측 가장자리 키만 타건 (WASD 보호)',
      'pg.tailOffTitle': '꼬리는 자연스럽게 흔들기만 함 (타건 안 함)',
      'pg.tailPickerTitle': '위 키보드 키캡을 클릭하거나 실제 키를 눌러 꼬리 키 지정',
      'pg.privacyTitle': '비밀번호 눈 가리기 데모 수동 전환',
      'pg.scaleResetTitle': '클릭하여 100%로 초기화',
      'alert.closeTitle': '공지 닫기',
    },
    ariaLabels: {
      'nav.backAria': 'Qianyi 홈으로 돌아가기',
      'nav.mainAria': '메인 내비게이션',
      'pg.modeAria': '3D / 2D 렌더 모드 전환',
      'pg.backdropAria': '미리보기 배경 전환',
      'pg.canvas2dAria': 'KuroCat 2D 실시간 인터랙티브 체험 캔버스',
      'pg.canvas3dAria': 'KuroCat 3D 실시간 인터랙티브 체험 캔버스',
      'pg.tailPickerAria': '꼬리 타건 키 커스텀 설정',
      'pg.skinGroupAria': '펫 스킨 선택',
      'pg.layoutAria': '키보드 배열',
      'pg.orientAria': '키보드 시점',
      'pg.collarAria': '3D 목걸이 방울 색상',
      'pg.tailModeAria': '꼬리 타건 모드',
      'pg.pwdAria': '비밀번호 눈 가리기 데모 입력란',
      'pg.scaleAria': '크기 조절 20%~150%',
      'alert.closeAria': '공지 닫기',
    },
    alts: {
      'hero.iconAlt': 'KuroCat 앱 아이콘',
      'feat.kbImgAlt': 'KuroCat 65% 콤팩트 대 108 풀배열 및 이중 시점 미리보기',
      'feat.mouseImgAlt': 'KuroCat 좌/우 마우스 독립 하이라이트 및 앱 내 자동 업데이트 미리보기',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-고래소녀-14초-세로데모.mp4',
    },
    prompts: {
      'mcp.p1': 'KuroCat MCP로 호박색 눈동자와 아이스블루 키 하이라이트를 가진 브리티시 숏헤어 블루 고양이를 만들어 바로 적용해 줘',
      'mcp.p2': '우리 집 고양이 사진을 보고 KuroCat MCP로 털 무늬와 반점 위치가 꼭 닮은 나만의 바탕화면 펫을 만들어 줘!',
      'mcp.p3': 'KuroCat 크기를 85%로 줄이고 108 풀배열 시청자 시점으로 바꿔 줘',
    },
    skins: {
      black: '검은 고양이',
      ragdoll: '꼬마 고래 집사',
      'orange-tabby': '치즈 태비',
      calico: '삼색이',
      tuxedo: '턱시도',
      siamese: '샴 고양이',
      dafeiyu: '고래소녀',
    },
    tailModeShort: {
      smart: '꼬리: 스마트',
      custom: '꼬리: 커스텀',
      edge: '꼬리: 가장자리',
      off: '꼬리: 흔들기만',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<사용자명>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Windows Stdio 모드 (Claude / Cursor / Antigravity 공통)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;사용자명&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// macOS Stdio 모드 (외부 의존성 없음 · 앱 내장 바이너리 직접 연결)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// 로컬 Streamable HTTP 모드 (KuroCat 실행 중 직접 연결)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `최신 버전 ${tag}`,
      heroDownloadWin: (size) => `Windows용 무료 다운로드 (${size})`,
      heroDownloadMac: (size) => `macOS용 무료 다운로드 (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Windows 7 32비트용 다운로드 (${size})` : `Windows 7 64비트용 다운로드 (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Linux ARM64용 무료 다운로드 (${size})` : `Linux용 무료 다운로드 (${size})`,
      heroDownloadAndroid: (size) => `Android APK 무료 다운로드 (${size})`,
      heroDownloadIos: () => 'PC / Android 다운로드 보기',
      heroOsHint: (os, size) => {
        if (os === 'android') return `기기 자동 감지: <strong>Android</strong> · 공식 서명 APK(${size}) 바로 다운로드`;
        if (os === 'macos') return 'OS 자동 감지: <strong>macOS (Apple Silicon &amp; Intel)</strong> · Win / Linux / Android 버전도 제공';
        if (os === 'win7-x86') return 'OS 자동 감지: <strong>Windows 7 (32비트)</strong> · 32비트 WebView2 109 포터블 버전 자동 추천';
        if (os === 'win7') return 'OS 자동 감지: <strong>Windows 7 (64비트)</strong> · WebView2 109 내장 포터블 버전 자동 추천';
        if (os === 'linux-arm64') return 'OS 자동 감지: <strong>Linux ARM64</strong> · 경량 .deb 권장 (아래 AppImage 포함)';
        if (os === 'linux-x64') return 'OS 자동 감지: <strong>Linux x86_64</strong> · 경량 .deb 권장 (아래 AppImage 포함)';
        if (os === 'ios') return '기기 자동 감지: <strong>iOS / iPadOS</strong> · 현재 PC(Win/Mac/Linux)와 Android 버전을 제공합니다';
        return 'OS 자동 감지: <strong>Windows 10 / 11 (x64)</strong> · macOS / Linux / Android 버전도 제공';
      },
      layout: (id) => (id === '108' ? '108 풀배열' : '65% 콤팩트'),
      orient: (o) => (o === 'viewer' ? '시청자 시점' : '고양이 시점'),
      tailPickerBtn: (open, count) =>
        open ? `✓ 선택 중 (${count}개)` : `🐾 꼬리 키 선택 (${count})`,
      tailPickerTitleDefault: (count) => `🐾 아래 키캡을 클릭하거나 실제 키를 눌러 지정 (${count}개 선택됨)`,
      tailKeyAdded: (key, count) => `🐾 "${key}" 추가됨 · 총 ${count}개 (완료 후 테스트)`,
      tailKeyRemoved: (key, count) => `🐾 "${key}" 해제됨 · 총 ${count}개`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter·Space', rightFn: '방향키·넘패드', edgeMods: '우측 기능키' };
        return `🐾 "${names[preset]}" 적용됨 (${count}개)`;
      },
      tailCleared: () => '🐾 꼬리 키가 모두 초기화되었습니다 (키캡 클릭 또는 입력으로 추가)',
      autoDemoBtn: (running) => (running ? '⏸ 데모 정지' : '▶ 자동 데모'),
      privacyBtn: (active) => (active ? '🙈 눈 가리기 중' : '🔒 눈 가리기'),
      whaleSoundBtn: (muted) => (muted ? '🔇 사운드 켜기' : '🔊 사운드 켜짐'),
      copied: () => '복사됨 ✓',
      copyConfig: () => '설정 복사',
      copyCmd: () => '명령어 복사',
      copyShort: () => '복사',
      totalDownloads: (count) => `누적 다운로드 ${count}회`,
      statsUpdated: (timePart) => `${timePart} (UTC+8) 업데이트 · 30초마다 자동 새로고침`,
    },
  },

  es: {
    htmlLang: 'es',
    docTitle: 'KuroCat Oficial — Gato Negro 3D Open-Source para Escritorio y Compañero IA (Win/Mac/Linux/Android)',
    metaDesc:
      'Sitio web oficial de KuroCat (kurocat.org · github.com/qianyiai/KuroCat) — Gato negro 3D/2D transparente de escritorio gratuito y de código abierto y compañero IA de programación (alternativa a Bongo Cat) para Windows, macOS (Homebrew), Linux y Android: 6 gatos + BigFish, sincronización de estado Claude/Codex/DeepSeek, fuente transparente para OBS, protección de contraseñas y estudio IA MCP integrado.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': 'Probar',
      'nav.whale': 'Video BigFish',
      'nav.download': 'Descargar',
      'nav.quark': '☁️ Quark Drive',
      'nav.features': 'Funciones',
      'nav.mcp': 'IA MCP',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Código Abierto',
      'hero.allPlatforms': 'Todas las plataformas',
      'hero.ghSource': 'Código en GitHub ›',
      'hero.spec1Lbl': 'Instalador nativo en Rust',
      'hero.spec2Val': '7 skins + MCP',
      'hero.spec2Lbl': 'Gatos y Chica Ballena · Estudio IA',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'Motor web en vivo · Teclea o acaricia al gato',
      'pg.mode3d': '✨ Modo 3D',
      'pg.mode2d': '🎨 2D Clásico',
      'pg.bgDark': 'Escritorio oscuro',
      'pg.bgLight': 'Escritorio claro',
      'pg.hintKey': '⌨️ Teclea',
      'pg.hintMouse': '🖱️ Clic izq./der.',
      'pg.hintPet': '🤚 Acaricia cabeza',
      'pg.done': 'Listo',
      'pg.presetOffice': 'Enter y Espacio',
      'pg.presetRightFn': 'Flechas y NumPad',
      'pg.presetEdgeMods': 'Modificadores ext.',
      'pg.presetClear': 'Limpiar',
      'pg.lblSkin': 'Skin',
      'pg.layout65': '65% Compacto',
      'pg.layout108': '108 Completo',
      'pg.orientCat': 'Vista gato',
      'pg.orientViewer': 'Vista espectador',
      'pg.btnMouse': '🖱️ Clic izq./der.',
      'pg.btnCurious': '👀 Curioso',
      'pg.btnCross': '💢 Golpe de cola',
      'pg.btnSleep': '💤 Dormir',
      'pg.btnBubbles': '💬 Burbujas',
      'pg.btnPurr': '🔊 Ronroneo',
      'pg.btnHeadphones': '🎧 Auriculares',
      'pg.btnOrbit': '🔄 Órbita 360°',
      'pg.lblCollar': 'Collar 3D',
      'pg.collarNone': 'Ninguno',
      'pg.collarRed': '🔴 Rojo',
      'pg.collarBlue': '🔵 Azul',
      'pg.collarPink': '🩷 Rosa',
      'pg.collarGreen': '🟢 Verde',
      'pg.lblTail': 'Teclas cola',
      'pg.tailSmart': '3.ª mano intel.',
      'pg.tailCustom': 'Personalizado',
      'pg.tailEdge': 'Solo borde',
      'pg.tailOff': 'Solo mover',
      'pg.lblPwd': 'Contraseña',
      'pg.lblScale': 'Escala',
      'dl.eyebrow': 'Descargas directas · Cloudflare Edge CDN',
      'dl.title': 'Descarga gratis — En tu escritorio en 3 segundos',
      'dl.winName': 'Instalador clásico Windows 65%',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'Recomendado',
      'dl.primaryBtn': 'Descarga directa rápida',
      'dl.quarkBtn': '☁️ Quark Drive ›',
      'dl.ghBtn': 'Espejo oficial de GitHub ›',
      'quark.badge': '☁️ Quark Drive Oficial',
      'quark.platforms': 'Win / Mac / Android',
      'quark.openBtn': 'Abrir ↗',
      'quark.copyBtn': 'Copiar código',
      'quark.dlBadge': '☁️ Espejo oficial en la nube Quark Drive',
      'quark.dlPlatforms': 'Incluye Windows · macOS · Android',
      'quark.dlTitle': 'Carpeta oficial «KuroCat 谦一_官方»',
      'quark.dlOpenBtn': '☁️ Abrir Quark Drive ↗',
      'dl.macName': 'macOS Universal (Apple Silicon e Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina o superior) Universal DMG',
      'dl.recommendedTag': 'Recomendado para ti',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'App flotante para Android (APK)',
      'dl.androidSub': 'Android 8.0+ · APK oficial firmado',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ ¿El navegador dice «no se descarga habitualmente» o salta Windows SmartScreen?',
      'dl.tipBrewTitle': '🍺 Instalar en macOS con Homebrew (Recomendado)',
      'dl.tipMacTitle': '🍎 Guía de primer inicio en macOS (solo una vez)',
      'dl.copyCmd': 'Copiar comando',
      'dl.tipWv2Title': '🪟 ¿Aparece «Could not find the WebView2 Runtime» en Windows?',
      'dl.tipWv2Btn': 'Descargar Microsoft WebView2 Runtime ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64 y 32 bits) Portable dedicado (WebView2 109 incluido)',
      'dl.win7Btn': '64 bits Portable (179.3 MB)',
      'dl.win7X86Btn': '32 bits Portable (159.4 MB)',
      'dl.win7Gh': 'GitHub 64 bits ›',
      'dl.win7X86Gh': 'GitHub 32 bits ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 y ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 Juegos en pantalla completa, OBS y guía antitrampas',
      'feat.title': 'Ingeniería de mascota de escritorio, pulida al píxel',
      'feat.whaleEyebrow': 'Nueva skin · 🐳 BigFish (Chica Ballena) · Video 14s',
      'feat.whaleSpec1Val': '3 acciones',
      'feat.whaleSpec1Lbl': 'Ratón + Teclado + Golpe de cola',
      'feat.whaleSpec2Val': 'Rubor veloz',
      'feat.whaleSpec2Lbl': 'Teclea rápido → Sonrojo → Risa',
      'feat.whaleSpec3Val': 'Se tapa ojos',
      'feat.whaleSpec3Lbl': 'Escudo automático de contraseñas',
      'feat.whaleTryBtn': 'Probar a BigFish arriba ↑',
      'feat.whaleDlBtn': 'Descargar video vertical 1080p (14s)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14s con audio sincronizado de teclado y ratón',
      'feat.kbSpec1Val': '108 teclas',
      'feat.kbSpec1Lbl': 'Fila F completa y teclado numérico',
      'feat.kbSpec2Val': 'Doble vista',
      'feat.kbSpec2Lbl': 'Vista gato / Vista espectador',
      'feat.kbSpec3Val': 'Teclas reales',
      'feat.kbSpec3Lbl': 'Distingue Enter principal y Num↵',
      'feat.kbTryBtn': 'Probar teclado de 108 teclas arriba ↑',
      'feat.mouseSpec1Lbl': 'Luz independiente izq. / der. / rueda',
      'feat.mouseSpec2Lbl': 'Actualizaciones verificadas con SHA-256',
      'feat.mouseSpec3Val': '1 clic',
      'feat.mouseSpec3Lbl': 'Actualización silenciosa en Win y Mac',
      'bento.1Title': 'Menú de 2 pestañas sin scroll y bloqueo persistente',
      'bento.1Body': 'Dividido en Apariencia y Teclado/OBS/Sistema para verlo todo en una sola pantalla, con escala fluida 20%–150% y bloqueo click-through persistente con píldora de desbloqueo al iniciar.',
      'bento.2Title': 'Caricias en la cabeza y ronroneo sintetizado',
      'bento.2Body': 'Pasa el cursor sobre la cabeza del gato y acaricia de lado a lado para que entrecierre los ojos feliz con un suave ronroneo Web Audio de 24.5Hz en tiempo real.',
      'bento.3Title': 'Escudo automático de contraseñas',
      'bento.3Body': 'Detecta campos de contraseña en Windows y macOS a nivel del sistema: intercepta pulsaciones en Rust mientras los gatos cierran los ojos y BigFish se los tapa con las manos.',
      'bento.4Title': 'GPU instanciada y modo ahorro en juegos',
      'bento.4Body': 'El instanciado de teclas 3D y la deformación de vértices en GPU reducen un 75% el uso activo de GPU; el modo Eco automático a 30 FPS en juegos ahorra hasta 88.5% y prioriza la iGPU.',
      'mcp.p1Text': '💬 "Crea un gato British Shorthair azul con KuroCat MCP y cámbialo ahora"',
      'mcp.p2Text': '📸 "Mira esta foto de mi gato y diseña una skin de KuroCat igual a él"',
      'mcp.p3Text': '⚙️ "Escala KuroCat al 85% y cambia al teclado de 108 teclas vista espectador"',
      'mcp.copyShort': 'Copiar',
      'mcp.tabHttp': 'HTTP local',
      'mcp.footerMeta': '7 herramientas integradas · Recarga en vivo 0.4s',
      'mcp.copyCfg': 'Copiar config',
      'growth.eyebrow': 'Crecimiento en vivo · Telemetría en tiempo real',
      'growth.title': 'Curva de crecimiento en vivo',
      'growth.sub': 'Trayectoria en tiempo real de descargas acumuladas en todos los espejos y GitHub Stars; pasa el cursor para inspeccionar cada instante.',
      'growth.dlLbl': 'Descargas totales',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': 'Ambas',
      'growth.modeDl': 'Descargas',
      'growth.modeStars': 'Stars',
      'growth.loading': 'Sincronizando telemetría en vivo…',
      'growth.starCta': '⭐ Dale una estrella a KuroCat en GitHub ›',
      'footer.home': 'Inicio de Qianyi',
      'footer.pelican': 'Benchmark Pelícano',
      'footer.releases': 'Todas las versiones',
      'footer.download': 'Descargas multiplataforma',
      'footer.vsBongo': 'KuroCat vs Bongo Cat',
      'footer.obs': 'Guía OBS transparente',
      'footer.mcp': 'Estudio IA MCP',
      'footer.security': 'Aviso de seguridad',
      'alert.badge': 'ÚNICO SITIO OFICIAL',
      'alert.cta': 'Aviso de seguridad →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> es el ÚNICO sitio oficial de KuroCat (<code>github.com/qianyiai/KuroCat</code>). ⚠️ ALERTA: El sitio suplantador <strong>kurocat.net</strong> distribuye un archivo no autorizado de 64 MB <code>KuroCat.v5.1.0.zip</code> relleno con 50 MiB de basura y un binario falso de 36 MB — ¡NO lo descargues ni ejecutes!',
      'hero.title': 'KuroCat — Un gato negro tecleador<br /><span>viviendo en tu escritorio</span>',
      'hero.sub':
        'Compañero de teclado y ratón transparente, gratuito y de código abierto con cambio instantáneo <strong>3D / 2D</strong> y consumo mínimo de GPU. Incluye <strong>6 gatos + BigFish</strong>, ronroneo al acariciarlo, escudo de contraseñas, overlay para OBS y <strong>estudio IA de gatos</strong>.',
      'dl.sub':
        'Cada compilación incluye <strong>escala fluida 20%–150%</strong>, <strong>cambio 65% / 108 teclas</strong>, <strong>teclas de cola personalizables</strong> y <strong>actualización automática integrada</strong>.<br />Espejos CDN oficiales y rápidos en <code>kurocat.org</code> junto con GitHub Releases oficiales y verificación SHA-256.',
      'quark.heroDesc':
        '<strong>«KuroCat 谦一_官方»</strong> paquete en la nube · Abrir apoya gratis el proyecto open source',
      'quark.dlBody':
        'Carpeta oficial sincronizada con instaladores de Windows, macOS y Android; abrir desde Quark Drive también apoya gratuitamente el mantenimiento open source. En la app Quark usa el código <code>/~f3813cZv6O~:/</code>.',
      'dl.winDesc':
        'Inicia con teclado compacto 65% y crea accesos directos en Escritorio, Menú Inicio y desinstalador. Haz clic derecho cuando quieras para <strong>108 teclas completo</strong>, <strong>teclas de cola personalizadas</strong>, fuente OBS y actualización en un clic.',
      'dl.macDesc':
        'DMG Universal nativo ARM64 + x86_64 compatible con Apple Silicon M1–M4 y Mac Intel (macOS 10.15 Catalina o superior). Incluye distribuciones 65%/108 teclas, los 6 gatos y BigFish. Abre el <code>.dmg</code> y arrástralo a Aplicaciones.',
            'dl.androidDesc':
        'Mascota flotante para móvil y tablet con <strong>6 gatos + BigFish</strong>, <strong>opacidad 20%–100%</strong>, ronroneo real y sonido al teclear, gestos de acariciar o levantar del cuello, giro automático y privacidad ante teclados de pago.',
      'dl.tipWinBody':
        'Como KuroCat es software gratuito de código abierto sin certificado comercial EV de firma de código, Edge/Chrome puede mostrar un aviso al descargar (el 100% del código fuente es público en GitHub):<br /><strong>① Edge</strong>: Pasa el cursor sobre la descarga → haz clic en <strong><code>···</code></strong> → <strong>Conservar</strong> → flecha hacia abajo <strong><code>▾</code> (Mostrar más)</strong> → <strong>Conservar de todos modos</strong> (Chrome: pulsa <code>Ctrl + J</code> → Conservar archivo peligroso → Mantener de todos modos).<br /><strong>② Windows SmartScreen</strong>: Haz clic en <strong>Más información</strong> → <strong>Ejecutar de todas formas</strong>.',
      'dl.tipBrewBody':
        'El Homebrew Tap oficial (<code>qianyiai/homebrew-tap</code>) ya está disponible. Ejecuta el comando de la derecha para instalar y eliminar automáticamente la cuarentena (sin <code>xattr</code> manual), y actualiza cuando quieras con <code>brew upgrade --cask kurocat</code>.',
      'dl.tipMacBody':
        'Como esta app de código abierto no está notarizada por Apple, si macOS muestra «no se puede verificar» o «está dañada» al abrirla por primera vez, ejecuta una sola vez el comando de la derecha en Terminal para quitar la cuarentena. Luego activa <code>KuroCat</code> en <strong>Ajustes del Sistema → Privacidad y seguridad → Accesibilidad y Supervisión de entrada</strong> (compatible con Karabiner-Elements).',
      'dl.tipWv2Body':
        'Ocurre en instalaciones antiguas o recortadas de Windows 10 / LTSC sin Microsoft Edge WebView2 (<strong>usuarios de Windows 7: usad la versión Win7 Portable de abajo</strong>). Instala el instalador oficial de 1.8 MB de Microsoft WebView2 con <strong>Clic derecho → Ejecutar como administrador</strong>.',
      'dl.win7Body':
        'Compilado de forma nativa como PE 6.01 para Windows 7 SP1 x64 y x86 (32 bits) sin dependencias DLL de Win8/Win10. Incluye el último entorno sin conexión oficial para Win7 <strong>WebView2 109.0.1518.78</strong> y transparencia antialias nativa de 256 niveles por píxel (cero recuadro blanco con o sin Aero). Extrae todos los archivos y ejecuta <code>KuroCat.exe</code> junto a <code>WebView2Runtime</code>.',
      'dl.linuxBody':
        'Hooks globales nativos X11 <code>XRecord</code> sin root con respaldo <code>evdev</code> en Wayland, transparencia sin bordes, click-through (mantén <code>Alt</code> para arrastrar) e inicio automático. Requiere <strong><code>glibc &gt;= 2.34</code></strong> (Ubuntu 22.04+ / Debian 12+ / KylinOS V11+; no compatible con Ubuntu 20.04 / <code>glibc 2.31</code>). Usa el ligero <strong>.deb (2.7 MB)</strong> (requiere <code>libwebkit2gtk-4.1-0</code>) o el portable <strong>.AppImage</strong>.',
      'dl.tipGameBody':
        '<strong>① Juegos en pantalla completa y sin bordes</strong>: Guardia topmost integrada que no roba el foco en FSO y ventana sin bordes; activa Bloqueo click-through (mantén <code>Alt</code> para mover cuando quieras). En juegos con privilegios elevados, usa bandeja → <strong>Reiniciar como administrador</strong>.<br /><strong>② Streaming en OBS (sin croma)</strong>: Clic derecho en la mascota o bandeja → <strong>Copiar URL de fuente transparente OBS</strong> (inicia <code>http://127.0.0.1:27421/obs</code> localmente, desactivado por defecto con cero consumo) y añádelo como Fuente de Navegador en OBS con canal Alpha nativo, modo Solo OBS y escudo de contraseñas sincronizado.<br /><strong>③ Juegos con antitrampas a nivel de kernel</strong> (Valorant, etc.): Usa bandeja → <strong>Pausar captura y ocultar (Modo seguro antitrampas)</strong> antes de jugar para descargar por completo los hooks globales.',
      'feat.whaleHeadline': 'Conoce a «BigFish» (Chica Ballena)<br />Golpes de cola · Rubor veloz · Escudo de privacidad',
      'feat.whaleBody':
        'Nuestra skin integrada <strong>🐳 BigFish (chica ballena)</strong> admite en simultáneo <strong>ratón con mano izquierda + teclado con mano derecha + golpes de cola de ballena con salpicadura</strong>. Teclea más rápido para hacerla sonrojar y reír alegremente; al enfocar cualquier campo de contraseña se tapa los ojos con ambas manos y oculta todas las teclas.',
      'feat.kbHeadline': '65% Compacto o 108 Completo<br />Doble perspectiva, cambio al instante',
      'feat.kbBody':
        'Cambia en un clic entre el compacto 65% y el teclado ANSI completo de 108 teclas (fila F completa y teclado numérico) con redimensionado suave anclado abajo a la derecha. Alterna entre <strong>Vista gato (180°)</strong> y <strong>Vista espectador (leyendas derechas)</strong> con inversión sincronizada de los botones del ratón.',
      'feat.mouseHeadline': 'Colores independientes izq. / der.<br />y actualización automática integrada',
      'feat.mouseBody':
        'Clic izquierdo (<code>L</code>), derecho (<code>R</code>) y rueda/central se iluminan por separado con colores de acento en contraste, sombras 3D al pulsar y mini burbujas <code>LMB</code>/<code>RMB</code>, admitiendo pulsación simultánea. Comprobación rápida con prioridad CDN (y respaldo en GitHub) que muestra una cápsula discreta sobre la mascota para actualizar en un clic con verificación SHA-256.',
      'mcp.headline': 'Envía una foto de tu gato<br />La IA lo esculpe en 0.4 segundos',
      'mcp.body':
        'KuroCat incluye servidores MCP <strong>Stdio</strong> y <strong>Streamable HTTP local (<code>127.0.0.1:27420</code>)</strong> dentro del mismo binario, sin Node.js ni Python. Haz clic en «Copiar config MCP» y pégalo en <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong> para crear cualquier pelaje, rayas atigradas, manchas calicó o color de ojos con recarga instantánea.',
      'footer.credit': 'Sitio oficial de KuroCat (<code>kurocat.org</code>) · MIT Open Source · Creado por <a class="footer-home" href="https://qianyi.one/?lang=en" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'Escribe una contraseña aquí: el gato cierra los ojos / BigFish se los tapa y oculta teclas…',
    },
    titles: {
      'pg.autoDemoTitle': 'Activar/desactivar demo automática de teclado y ratón',
      'pg.mouseTitle': 'Probar clics izquierdo/derecho independientes',
      'pg.curiousTitle': 'Activar pupilas curiosas (o sacude el cursor rápido)',
      'pg.crossTitle': 'Activar orejas de avión + 3 golpes de cola (o teclea frenéticamente)',
      'pg.sleepTitle': 'Activar siesta con Zzz flotantes (pulsa cualquier tecla para despertar)',
      'pg.bubblesTitle': 'Activar/desactivar burbujas flotantes de teclas',
      'pg.purrTitle': 'Activar/desactivar ronroneo al acariciar',
      'pg.headphonesTitle': 'Activar/desactivar auriculares gaming (la app de escritorio los pone automáticamente al detectar un juego)',
      'pg.orbitTitle': 'Actívalo para arrastrar sobre el lienzo y rotar el modelo 3D 360°',
      'pg.tailSmartTitle': 'Las patas teclean normal; la cola ayuda como 3.ª mano en ráfagas o Enter rápido',
      'pg.tailCustomTitle': 'La cola pulsa solo las teclas que selecciones',
      'pg.tailEdgeTitle': 'Solo teclas exteriores del lado de la cola (protege WASD)',
      'pg.tailOffTitle': 'La cola se mueve de forma natural sin pulsar teclas',
      'pg.tailPickerTitle': 'Haz clic en las teclas del teclado de arriba o pulsa teclas físicas para alternar',
      'pg.privacyTitle': 'Alternar demo de escudo de contraseñas',
      'pg.scaleResetTitle': 'Haz clic para restablecer al 100%',
      'alert.closeTitle': 'Cerrar aviso',
    },
    ariaLabels: {
      'nav.backAria': 'Volver al inicio de Qianyi',
      'nav.mainAria': 'Navegación principal',
      'pg.modeAria': 'Modo de renderizado 3D / 2D',
      'pg.backdropAria': 'Fondo de escritorio de vista previa',
      'pg.canvas2dAria': 'Lienzo interactivo en vivo 2D de KuroCat',
      'pg.canvas3dAria': 'Lienzo interactivo en vivo 3D de KuroCat',
      'pg.tailPickerAria': 'Personalizar teclas de la cola',
      'pg.skinGroupAria': 'Elegir skin de mascota',
      'pg.layoutAria': 'Distribución del teclado',
      'pg.orientAria': 'Perspectiva del teclado',
      'pg.collarAria': 'Color del collar 3D y cascabel',
      'pg.tailModeAria': 'Modo de tecleo con la cola',
      'pg.pwdAria': 'Campo de prueba del escudo de contraseñas',
      'pg.scaleAria': 'Escala del 20% al 150%',
      'alert.closeAria': 'Cerrar aviso',
    },
    alts: {
      'hero.iconAlt': 'Icono de la app KuroCat',
      'feat.kbImgAlt': 'Comparativa de KuroCat 65% compacto vs 108 teclas completo y doble perspectiva',
      'feat.mouseImgAlt': 'Demostración de clics izq./der. independientes y autoactualización integrada de KuroCat',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-BigFish-Demo-Vertical-14s-ES.mp4',
    },
    prompts: {
      'mcp.p1': 'Usa KuroCat MCP para crear un gato British Shorthair azul con ojos ámbar y teclas azul hielo, y cámbiate a él ahora',
      'mcp.p2': 'Mira esta foto de mi gato y diseña una mascota de escritorio KuroCat personalizada con su mismo pelaje y manchas.',
      'mcp.p3': 'Escala KuroCat al 85% y cambia al teclado completo de 108 teclas con vista espectador',
    },
    skins: {
      black: 'Gato Negro',
      ragdoll: 'Little Whale Butler',
      'orange-tabby': 'Atigrado Naranja',
      calico: 'Calicó',
      tuxedo: 'Esmoquin',
      siamese: 'Siamés',
      dafeiyu: 'BigFish',
    },
    tailModeShort: {
      smart: 'Cola: Intel.',
      custom: 'Cola: Custom',
      edge: 'Cola: Borde',
      off: 'Cola: Solo mover',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<TuUsuario>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo Windows Stdio (Claude / Cursor / Antigravity)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;TuUsuario&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo macOS Stdio (sin dependencias, integrado en el binario)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo Streamable HTTP local (conectar con KuroCat abierto)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `Última versión ${tag}`,
      heroDownloadWin: (size) => `Descargar para Windows (${size})`,
      heroDownloadMac: (size) => `Descargar para macOS (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Descargar para Windows 7 32 bits (${size})` : `Descargar para Windows 7 64 bits (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Descargar Linux ARM64 (${size})` : `Descargar para Linux (${size})`,
      heroDownloadAndroid: (size) => `Descargar APK Android (${size})`,
      heroDownloadIos: () => 'Ver descargas de PC y Android',
      heroOsHint: (os, size) => {
        if (os === 'android') return `Dispositivo detectado: <strong>Android</strong> · Toca para descargar el APK oficial (${size})`;
        if (os === 'macos') return 'Sistema detectado: <strong>macOS (Apple Silicon e Intel)</strong> · También para Win / Linux / Android';
        if (os === 'win7-x86') return 'Sistema detectado: <strong>Windows 7 (32 bits)</strong> · Recomendada la versión portátil 32 bits con WebView2 109';
        if (os === 'win7') return 'Sistema detectado: <strong>Windows 7 (64 bits)</strong> · Recomendada la versión portátil con WebView2 109';
        if (os === 'linux-arm64') return 'Sistema detectado: <strong>Linux ARM64</strong> · Paquete .deb ligero recomendado (AppImage abajo)';
        if (os === 'linux-x64') return 'Sistema detectado: <strong>Linux x86_64</strong> · Paquete .deb ligero recomendado (AppImage abajo)';
        if (os === 'ios') return 'Dispositivo detectado: <strong>iOS / iPadOS</strong> · Disponible para Windows, macOS, Linux y Android abajo';
        return 'Sistema detectado: <strong>Windows 10 / 11 (x64)</strong> · También para macOS / Linux / Android';
      },
      layout: (id) => (id === '108' ? '108 Completo' : '65% Compacto'),
      orient: (o) => (o === 'viewer' ? 'Vista espectador' : 'Vista gato'),
      tailPickerBtn: (open, count) =>
        open ? `✓ Eligiendo (${count} selec.)` : `🐾 Elegir teclas cola (${count})`,
      tailPickerTitleDefault: (count) => `🐾 Haz clic en las teclas de abajo o pulsa tu teclado (${count} selec.)`,
      tailKeyAdded: (key, count) => `🐾 Añadida «${key}» · ${count} teclas (pulsa Listo para probar)`,
      tailKeyRemoved: (key, count) => `🐾 Quitada «${key}» · ${count} teclas`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter y Espacio', rightFn: 'Flechas y NumPad', edgeMods: 'Modificadores ext.' };
        return `🐾 Aplicado «${names[preset]}» (${count} teclas)`;
      },
      tailCleared: () => '🐾 Teclas de cola vaciadas (haz clic o pulsa teclas para añadir)',
      autoDemoBtn: (running) => (running ? '⏸ Detener demo' : '▶ Demo auto'),
      privacyBtn: (active) => (active ? '🙈 Escudo activo' : '🔒 Escudo contraseña'),
      whaleSoundBtn: (muted) => (muted ? '🔇 Activar audio' : '🔊 Audio activo'),
      copied: () => 'Copiado ✓',
      copyConfig: () => 'Copiar config',
      copyCmd: () => 'Copiar comando',
      copyShort: () => 'Copiar',
      totalDownloads: (count) => `${count} descargas totales`,
      statsUpdated: (timePart) => `Actualizado ${timePart} (UTC+8) · se refresca cada 30s`,
    },
  },

  pt: {
    htmlLang: 'pt-BR',
    docTitle: 'KuroCat Oficial — Gato Preto 3D Open-Source na Área de Trabalho e Companheiro IA (Win/Mac/Linux/Android)',
    metaDesc:
      'Site oficial do KuroCat (kurocat.org · github.com/qianyiai/KuroCat) — Gato preto 3D/2D transparente open-source para área de trabalho e companheiro IA de programação (alternativa ao Bongo Cat) para Windows, macOS (Homebrew), Linux e Android: 6 gatos + BigFish, sincronização Claude/Codex/DeepSeek, fonte transparente para OBS, proteção de senha e estúdio IA MCP integrado.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': 'Testar',
      'nav.whale': 'Vídeo BigFish',
      'nav.download': 'Baixar',
      'nav.quark': '☁️ Quark Drive',
      'nav.features': 'Recursos',
      'nav.mcp': 'IA MCP',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': 'Todas as plataformas',
      'hero.ghSource': 'Código no GitHub ›',
      'hero.spec1Lbl': 'Instalador nativo em Rust',
      'hero.spec2Val': '7 skins + MCP',
      'hero.spec2Lbl': 'Gatos & Garota-Baleia · Estúdio IA',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'Motor web ao vivo · Digite ou faça carinho no gato',
      'pg.mode3d': '✨ Modo 3D',
      'pg.mode2d': '🎨 2D Clássico',
      'pg.bgDark': 'Fundo escuro',
      'pg.bgLight': 'Fundo claro',
      'pg.hintKey': '⌨️ Digite',
      'pg.hintMouse': '🖱️ Clique E/D',
      'pg.hintPet': '🤚 Carinho cabeça',
      'pg.done': 'Concluir',
      'pg.presetOffice': 'Enter e Espaço',
      'pg.presetRightFn': 'Setas e NumPad',
      'pg.presetEdgeMods': 'Modificadores ext.',
      'pg.presetClear': 'Limpar',
      'pg.lblSkin': 'Skin',
      'pg.layout65': '65% Compacto',
      'pg.layout108': '108 Completo',
      'pg.orientCat': 'Visão do gato',
      'pg.orientViewer': 'Visão do público',
      'pg.btnMouse': '🖱️ Clique E/D',
      'pg.btnCurious': '👀 Curioso',
      'pg.btnCross': '💢 Batida de cauda',
      'pg.btnSleep': '💤 Cochilar',
      'pg.btnBubbles': '💬 Bolhas',
      'pg.btnPurr': '🔊 Ronronar',
      'pg.btnHeadphones': '🎧 Headset',
      'pg.btnOrbit': '🔄 Órbita 360°',
      'pg.lblCollar': 'Coleira 3D',
      'pg.collarNone': 'Nenhuma',
      'pg.collarRed': '🔴 Vermelha',
      'pg.collarBlue': '🔵 Azul',
      'pg.collarPink': '🩷 Rosa',
      'pg.collarGreen': '🟢 Verde',
      'pg.lblTail': 'Teclas cauda',
      'pg.tailSmart': '3ª mão intel.',
      'pg.tailCustom': 'Personalizado',
      'pg.tailEdge': 'Só borda',
      'pg.tailOff': 'Só abanar',
      'pg.lblPwd': 'Senha',
      'pg.lblScale': 'Escala',
      'dl.eyebrow': 'Downloads diretos · Cloudflare Edge CDN',
      'dl.title': 'Baixe grátis — Na sua tela em 3 segundos',
      'dl.winName': 'Instalador Clássico Windows 65%',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'Recomendado',
      'dl.primaryBtn': 'Download direto rápido',
      'dl.quarkBtn': '☁️ Quark Drive ›',
      'dl.ghBtn': 'Espelho oficial no GitHub ›',
      'quark.badge': '☁️ Quark Drive Oficial',
      'quark.platforms': 'Win / Mac / Android',
      'quark.openBtn': 'Abrir ↗',
      'quark.copyBtn': 'Copiar código',
      'quark.dlBadge': '☁️ Espelho oficial na nuvem Quark Drive',
      'quark.dlPlatforms': 'Inclui Windows · macOS · Android',
      'quark.dlTitle': 'Pasta oficial «KuroCat 谦一_官方»',
      'quark.dlOpenBtn': '☁️ Abrir Quark Drive ↗',
      'dl.macName': 'macOS Universal (Apple Silicon e Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina ou superior) Universal DMG',
      'dl.recommendedTag': 'Recomendado p/ você',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'App flutuante para Android (APK)',
      'dl.androidSub': 'Android 8.0+ · APK oficial assinado',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ O navegador diz «não costuma ser baixado» ou o Windows SmartScreen apareceu?',
      'dl.tipBrewTitle': '🍺 Instalar no macOS via Homebrew (Recomendado)',
      'dl.tipMacTitle': '🍎 Guia da primeira abertura no macOS (só uma vez)',
      'dl.copyCmd': 'Copiar comando',
      'dl.tipWv2Title': '🪟 Apareceu «Could not find the WebView2 Runtime» no Windows?',
      'dl.tipWv2Btn': 'Baixar Microsoft WebView2 Runtime ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64 e 32 bits) Portátil dedicado (WebView2 109 incluso)',
      'dl.win7Btn': '64 bits Portátil (179.3 MB)',
      'dl.win7X86Btn': '32 bits Portátil (159.4 MB)',
      'dl.win7Gh': 'GitHub 64 bits ›',
      'dl.win7X86Gh': 'GitHub 32 bits ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 e ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 Jogos em tela cheia, OBS e guia anti-cheat',
      'feat.title': 'Engenharia de desktop pet, lapidada pixel a pixel',
      'feat.whaleEyebrow': 'Nova skin · 🐳 BigFish (Garota-Baleia) · Vídeo 14s',
      'feat.whaleSpec1Val': '3 ações',
      'feat.whaleSpec1Lbl': 'Mouse + Teclado + Cauda nas teclas',
      'feat.whaleSpec2Val': 'Rubor veloz',
      'feat.whaleSpec2Lbl': 'Digite rápido → Corar → Gargalhar',
      'feat.whaleSpec3Val': 'Cobre os olhos',
      'feat.whaleSpec3Lbl': 'Proteção automática de senhas',
      'feat.whaleTryBtn': 'Testar BigFish no canvas acima ↑',
      'feat.whaleDlBtn': 'Baixar vídeo vertical 1080p (14s)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14s com áudio sincronizado de teclado e mouse',
      'feat.kbSpec1Val': '108 teclas',
      'feat.kbSpec1Lbl': 'Fileira F completa e teclado numérico',
      'feat.kbSpec2Val': 'Dupla visão',
      'feat.kbSpec2Lbl': 'Visão do gato / Visão do público',
      'feat.kbSpec3Val': 'Teclas reais',
      'feat.kbSpec3Lbl': 'Diferencia Enter principal de Num↵',
      'feat.kbTryBtn': 'Testar teclado de 108 teclas acima ↑',
      'feat.mouseSpec1Lbl': 'Brilho independente E / D / scroll',
      'feat.mouseSpec2Lbl': 'Atualizações verificadas por SHA-256',
      'feat.mouseSpec3Val': '1 clique',
      'feat.mouseSpec3Lbl': 'Atualização silenciosa no Win e Mac',
      'bento.1Title': 'Menu de 2 abas sem rolagem e trava persistente',
      'bento.1Body': 'Dividido nas abas Aparência e Teclado/OBS/Sistema para caber tudo em uma tela, com escala suave de 20%–150% e trava click-through persistente com botão de desbloqueio ao iniciar.',
      'bento.2Title': 'Carinho na cabeça e ronronado sintetizado',
      'bento.2Body': 'Passe o cursor pela cabeça do gato e faça carinho de um lado para o outro para fazê-lo fechar os olhos satisfeito com um ronronado Web Audio de 24.5Hz em tempo real.',
      'bento.3Title': 'Proteção automática de senhas',
      'bento.3Body': 'Detecta campos de senha no Windows e macOS em nível de sistema: intercepta teclas no Rust enquanto os gatos fecham os olhos e BigFish cobre os dela com as mãos.',
      'bento.4Title': 'GPU instanciada e modo Eco em jogos',
      'bento.4Body': 'Batching instanciado de teclas 3D e deformação de vértices na GPU cortam o uso ativo de GPU em 75%; o modo Eco automático a 30 FPS em jogos reduz até 88.5% e prioriza a iGPU.',
      'mcp.p1Text': '💬 "Crie um gato British Shorthair azul via KuroCat MCP e troque para ele agora"',
      'mcp.p2Text': '📸 "Veja esta foto do meu gato e crie uma skin KuroCat igualzinha a ele!"',
      'mcp.p3Text': '⚙️ "Ajuste o KuroCat para 85% e mude para teclado 108 teclas na visão do público"',
      'mcp.copyShort': 'Copiar',
      'mcp.tabHttp': 'HTTP local',
      'mcp.footerMeta': '7 ferramentas nativas · Recarga ao vivo 0.4s',
      'mcp.copyCfg': 'Copiar config',
      'growth.eyebrow': 'Crescimento ao vivo · Telemetria em tempo real',
      'growth.title': 'Curva de crescimento ao vivo',
      'growth.sub': 'Trajetória em tempo real dos downloads acumulados em todos os espelhos e GitHub Stars — passe o mouse para conferir cada horário.',
      'growth.dlLbl': 'Downloads totais',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': 'Ambos',
      'growth.modeDl': 'Downloads',
      'growth.modeStars': 'Stars',
      'growth.loading': 'Sincronizando telemetria ao vivo…',
      'growth.starCta': '⭐ Dê uma estrela ao KuroCat no GitHub ›',
      'footer.home': 'Início Qianyi',
      'footer.pelican': 'Benchmark Pelicano',
      'footer.releases': 'Todas as versões',
      'footer.download': 'Downloads multiplataforma',
      'footer.vsBongo': 'KuroCat vs Bongo Cat',
      'footer.obs': 'Guia OBS transparente',
      'footer.mcp': 'Estúdio IA MCP',
      'footer.security': 'Aviso de segurança',
      'alert.badge': 'ÚNICO SITE OFICIAL',
      'alert.cta': 'Aviso de segurança →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> é o ÚNICO site oficial do KuroCat (<code>github.com/qianyiai/KuroCat</code>). ⚠️ ALERTA: O site falso <strong>kurocat.net</strong> distribui um arquivo não autorizado de 64 MB <code>KuroCat.v5.1.0.zip</code> preenchido com 50 MiB de lixo e um binário falso de 36 MB — NÃO baixe nem execute!',
      'hero.title': 'KuroCat — Um gato preto digitando<br /><span>morando na sua área de trabalho</span>',
      'hero.sub':
        'Companheiro de teclado e mouse transparente, gratuito e open-source com troca instantânea <strong>3D / 2D</strong> e uso mínimo de GPU. Inclui <strong>6 gatos + BigFish</strong>, ronronado ao fazer carinho, proteção de senhas, overlay para OBS e <strong>estúdio IA de gatos</strong>.',
      'dl.sub':
        'Todas as versões incluem <strong>escala suave 20%–150%</strong>, <strong>troca 65% / 108 teclas</strong>, <strong>teclas de cauda personalizáveis</strong> e <strong>atualização automática no app</strong>.<br />Espelhos CDN oficiais rápidos em <code>kurocat.org</code> junto aos GitHub Releases oficiais com verificação SHA-256.',
      'quark.heroDesc':
        '<strong>«KuroCat 谦一_官方»</strong> pacote oficial na nuvem · Abrir apoia grátis o projeto open source',
      'quark.dlBody':
        'Pasta oficial sincronizada com instaladores de Windows, macOS e Android; abrir pelo Quark Drive também apoia gratuitamente a manutenção open source. No app Quark use o código <code>/~f3813cZv6O~:/</code>.',
      'dl.winDesc':
        'Começa com o layout compacto 65% e cria atalhos na Área de Trabalho, Menu Iniciar e desinstalador. Clique com o botão direito quando quiser para <strong>108 teclas completo</strong>, <strong>teclas de cauda</strong>, fonte OBS e atualização em um clique.',
      'dl.macDesc':
        'DMG Universal nativo ARM64 + x86_64 compatível com Apple Silicon M1–M4 e Macs Intel (macOS 10.15 Catalina+). Inclui layouts 65%/108 teclas, os 6 gatos e BigFish. Abra o <code>.dmg</code> e arraste para Aplicativos.',
            'dl.androidDesc':
        'Pet flutuante sempre no topo para celular e tablet com <strong>6 gatos + BigFish</strong>, <strong>opacidade 20%–100%</strong>, ronronado real e som de teclado, carinho/segurar pela nuca, rotação automática e proteção em teclados de banco.',
      'dl.tipWinBody':
        'Como o KuroCat é software open-source gratuito sem certificado comercial EV de assinatura de código, Edge/Chrome pode exibir um aviso ao baixar (100% do código-fonte é público no GitHub):<br /><strong>① Edge</strong>: Passe o mouse no download → clique em <strong><code>···</code></strong> → <strong>Manter</strong> → seta para baixo <strong><code>▾</code> (Mostrar mais)</strong> → <strong>Manter mesmo assim</strong> (Chrome: aperte <code>Ctrl + J</code> → Manter arquivo perigoso → Manter mesmo assim).<br /><strong>② Windows SmartScreen</strong>: Clique em <strong>Mais informações</strong> → <strong>Executar assim mesmo</strong>.',
      'dl.tipBrewBody':
        'O Homebrew Tap oficial (<code>qianyiai/homebrew-tap</code>) está no ar. Execute o comando ao lado para instalar e remover a quarentena automaticamente (sem precisar de <code>xattr</code> manual), e atualize quando quiser com <code>brew upgrade --cask kurocat</code>.',
      'dl.tipMacBody':
        'Como este app open-source não é notarizado pela Apple, se o macOS avisar «não pode ser verificado» ou «danificado» na primeira abertura, rode o comando ao lado uma única vez no Terminal para remover a quarentena. Depois ative <code>KuroCat</code> em <strong>Ajustes do Sistema → Privacidade e Segurança → Acessibilidade e Monitoramento de Entrada</strong> (compatível com Karabiner-Elements).',
      'dl.tipWv2Body':
        'Ocorre em instalações antigas ou enxutas do Windows 10 / LTSC sem o Microsoft Edge WebView2 (<strong>usuários de Windows 7 devem usar o pacote Win7 Portátil abaixo</strong>). Instale o instalador oficial de 1.8 MB do Microsoft WebView2 com <strong>Botão direito → Executar como administrador</strong>.',
      'dl.win7Body':
        'Compilado nativamente como PE 6.01 para Windows 7 SP1 x64 e x86 (32 bits) sem nenhuma dependência de DLL do Win8/Win10. Embute o último runtime offline oficial da Microsoft para Win7 (<strong>WebView2 109.0.1518.78</strong>) e transparência nativa de 256 níveis por pixel com antialiasing (sem caixa branca, com ou sem Aero). Extraia tudo e execute <code>KuroCat.exe</code> ao lado de <code>WebView2Runtime</code>.',
      'dl.linuxBody':
        'Hooks globais nativos X11 <code>XRecord</code> sem root com fallback <code>evdev</code> no Wayland, transparência sem bordas, click-through (segure <code>Alt</code> para arrastar) e início automático. Requer <strong><code>glibc &gt;= 2.34</code></strong> (Ubuntu 22.04+ / Debian 12+ / KylinOS V11+; incompatível com Ubuntu 20.04 / <code>glibc 2.31</code>). Use o pacote leve <strong>.deb (2.7 MB)</strong> (requer <code>libwebkit2gtk-4.1-0</code>) ou o portátil <strong>.AppImage</strong>.',
      'dl.tipGameBody':
        '<strong>① Jogos em tela cheia e sem bordas</strong>: Guarda topmost integrada que nunca rouba foco em FSO e janela sem bordas; ative a Trava Click-Through (segure <code>Alt</code> para mover). Para jogos como administrador, use a bandeja → <strong>Reiniciar como Administrador</strong>.<br /><strong>② Lives no OBS (sem chroma key)</strong>: Clique direito no pet ou na bandeja → <strong>Copiar URL de fonte transparente OBS</strong> (abre <code>http://127.0.0.1:27421/obs</code> localmente, desligado por padrão com consumo zero) e adicione como Fonte de Navegador no OBS com canal Alpha nativo, modo Somente OBS e proteção de senha sincronizada.<br /><strong>③ Jogos com anti-cheat de kernel</strong> (Valorant, etc.): Use a bandeja → <strong>Pausar captura e ocultar (Modo seguro anti-cheat)</strong> antes de abrir o jogo para descarregar totalmente os hooks globais.',
      'feat.whaleHeadline': 'Conheça a «BigFish» (Garota-Baleia)<br />Cauda nas teclas · Rubor veloz · Escudo de privacidade',
      'feat.whaleBody':
        'Nossa skin integrada <strong>🐳 BigFish (garota-baleia)</strong> faz tudo ao mesmo tempo: <strong>mouse na mão esquerda + digitação na direita + batidas de cauda com respingo</strong>. Digite mais rápido para deixá-la corada e sorrindo de orelha a orelha; ao focar qualquer campo de senha, ela cobre os olhos com as duas mãos e oculta todas as teclas.',
      'feat.kbHeadline': '65% Compacto ou 108 Completo<br />Dupla perspectiva, troca instantânea',
      'feat.kbBody':
        'Alterne com um clique entre o compacto 65% e o teclado ANSI completo de 108 teclas (fileira F e teclado numérico) com redimensionamento suave ancorado no canto inferior direito. Alterne entre <strong>Visão do gato (180°)</strong> e <strong>Visão do público (legendas de frente)</strong> com inversão sincronizada dos botões do mouse.',
      'feat.mouseHeadline': 'Cores independentes nos cliques E / D<br />e atualização automática no app',
      'feat.mouseBody':
        'Clique esquerdo (<code>L</code>), direito (<code>R</code>) e scroll/meio acendem de forma independente com cores de contraste, sombras 3D ao pressionar e mini balões <code>LMB</code>/<code>RMB</code> — suportando cliques simultâneos. Checagem rápida priorizando CDN (com fallback no GitHub) exibe um selo discreto acima do pet para atualizar em um clique com verificação SHA-256.',
      'mcp.headline': 'Envie uma foto do seu gato<br />A IA esculpe no desktop em 0.4s',
      'mcp.body':
        'O KuroCat traz servidores MCP <strong>Stdio</strong> e <strong>Streamable HTTP local (<code>127.0.0.1:27420</code>)</strong> dentro do próprio binário, sem precisar de Node.js ou Python. Clique em «Copiar config MCP» e cole no <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong> para criar qualquer pelagem, listras, manchas tricolor ou cor de olhos com hot-reload imediato.',
      'footer.credit': 'Site oficial do KuroCat (<code>kurocat.org</code>) · MIT Open Source · Criado por <a class="footer-home" href="https://qianyi.one/?lang=en" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'Digite uma senha aqui: o gato fecha os olhos / BigFish cobre os olhos e oculta teclas…',
    },
    titles: {
      'pg.autoDemoTitle': 'Alternar demonstração automática de teclado e mouse',
      'pg.mouseTitle': 'Demonstrar cliques esquerdo/direito independentes',
      'pg.curiousTitle': 'Ativar pupilas curiosas (ou balance o cursor rápido)',
      'pg.crossTitle': 'Ativar orelhas de avião + 3 batidas de cauda na mesa (ou bata nas teclas)',
      'pg.sleepTitle': 'Ativar soneca com Zzz flutuando (aperte qualquer tecla para acordar)',
      'pg.bubblesTitle': 'Ligar/desligar bolhas flutuantes de teclas',
      'pg.purrTitle': 'Ligar/desligar som de ronronado ao acariciar',
      'pg.headphonesTitle': 'Ligar/desligar headset gamer (o app desktop equipa automaticamente ao abrir um jogo)',
      'pg.orbitTitle': 'Ative para arrastar no canvas e girar o modelo 3D em 360°',
      'pg.tailSmartTitle': 'As patas digitam normalmente; a cauda ajuda como 3ª mão em rajadas ou Enter rápido',
      'pg.tailCustomTitle': 'A cauda bate apenas nas teclas que você escolher',
      'pg.tailEdgeTitle': 'Somente teclas externas do lado da cauda (protege WASD)',
      'pg.tailOffTitle': 'A cauda apenas abana naturalmente sem apertar teclas',
      'pg.tailPickerTitle': 'Clique nas teclas do teclado acima ou aperte teclas físicas para alternar',
      'pg.privacyTitle': 'Alternar demonstração de proteção de senha',
      'pg.scaleResetTitle': 'Clique para redefinir para 100%',
      'alert.closeTitle': 'Fechar aviso',
    },
    ariaLabels: {
      'nav.backAria': 'Voltar para o início da Qianyi',
      'nav.mainAria': 'Navegação principal',
      'pg.modeAria': 'Modo de renderização 3D / 2D',
      'pg.backdropAria': 'Fundo de visualização da mesa',
      'pg.canvas2dAria': 'Canvas interativo ao vivo 2D do KuroCat',
      'pg.canvas3dAria': 'Canvas interativo ao vivo 3D do KuroCat',
      'pg.tailPickerAria': 'Personalizar teclas da cauda',
      'pg.skinGroupAria': 'Escolher skin do pet',
      'pg.layoutAria': 'Layout do teclado',
      'pg.orientAria': 'Perspectiva do teclado',
      'pg.collarAria': 'Cor da coleira 3D e guizo',
      'pg.tailModeAria': 'Modo de digitação com a cauda',
      'pg.pwdAria': 'Campo de teste da proteção de senha',
      'pg.scaleAria': 'Escala de 20% a 150%',
      'alert.closeAria': 'Fechar aviso',
    },
    alts: {
      'hero.iconAlt': 'Ícone do app KuroCat',
      'feat.kbImgAlt': 'Comparação KuroCat 65% compacto vs 108 teclas completo e dupla perspectiva',
      'feat.mouseImgAlt': 'Demonstração de cliques E/D independentes e atualização automática do KuroCat',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-BigFish-Demo-Vertical-14s-PT.mp4',
    },
    prompts: {
      'mcp.p1': 'Use o KuroCat MCP para criar um gato British Shorthair azul com olhos âmbar e teclas azul-gelo e já trocar para ele',
      'mcp.p2': 'Veja esta foto do meu gato e crie um desktop pet KuroCat sob medida com a mesma pelagem e manchas dele!',
      'mcp.p3': 'Ajuste o KuroCat para 85% e mude para o teclado completo de 108 teclas na visão do público',
    },
    skins: {
      black: 'Gato Preto',
      ragdoll: 'Little Whale Butler',
      'orange-tabby': 'Laranja Tigrado',
      calico: 'Tricolor',
      tuxedo: 'Frajola',
      siamese: 'Siamês',
      dafeiyu: 'BigFish',
    },
    tailModeShort: {
      smart: 'Cauda: Intel.',
      custom: 'Cauda: Custom',
      edge: 'Cauda: Borda',
      off: 'Cauda: Só abanar',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<SeuUsuario>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo Windows Stdio (Claude / Cursor / Antigravity)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;SeuUsuario&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo macOS Stdio (zero dependências, embutido no binário)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// Modo Streamable HTTP local (conecte com o KuroCat aberto)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `Versão mais recente ${tag}`,
      heroDownloadWin: (size) => `Baixar para Windows (${size})`,
      heroDownloadMac: (size) => `Baixar para macOS (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Baixar para Windows 7 32 bits (${size})` : `Baixar para Windows 7 64 bits (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Baixar Linux ARM64 (${size})` : `Baixar para Linux (${size})`,
      heroDownloadAndroid: (size) => `Baixar APK Android (${size})`,
      heroDownloadIos: () => 'Ver versões de PC e Android',
      heroOsHint: (os, size) => {
        if (os === 'android') return `Dispositivo detectado: <strong>Android</strong> · Toque para baixar o APK oficial (${size})`;
        if (os === 'macos') return 'Sistema detectado: <strong>macOS (Apple Silicon e Intel)</strong> · Também para Win / Linux / Android';
        if (os === 'win7-x86') return 'Sistema detectado: <strong>Windows 7 (32 bits)</strong> · Selecionada a edição portátil 32 bits com WebView2 109';
        if (os === 'win7') return 'Sistema detectado: <strong>Windows 7 (64 bits)</strong> · Selecionada a edição portátil com WebView2 109';
        if (os === 'linux-arm64') return 'Sistema detectado: <strong>Linux ARM64</strong> · Pacote .deb leve recomendado (AppImage abaixo)';
        if (os === 'linux-x64') return 'Sistema detectado: <strong>Linux x86_64</strong> · Pacote .deb leve recomendado (AppImage abaixo)';
        if (os === 'ios') return 'Dispositivo detectado: <strong>iOS / iPadOS</strong> · Disponível para Windows, macOS, Linux e Android abaixo';
        return 'Sistema detectado: <strong>Windows 10 / 11 (x64)</strong> · Também para macOS / Linux / Android';
      },
      layout: (id) => (id === '108' ? '108 Completo' : '65% Compacto'),
      orient: (o) => (o === 'viewer' ? 'Visão do público' : 'Visão do gato'),
      tailPickerBtn: (open, count) =>
        open ? `✓ Escolhendo (${count} selec.)` : `🐾 Escolher teclas cauda (${count})`,
      tailPickerTitleDefault: (count) => `🐾 Clique nas teclas abaixo ou aperte o teclado físico (${count} selec.)`,
      tailKeyAdded: (key, count) => `🐾 Adicionada «${key}» · ${count} teclas (clique Concluir para testar)`,
      tailKeyRemoved: (key, count) => `🐾 Removida «${key}» · ${count} teclas`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter e Espaço', rightFn: 'Setas e NumPad', edgeMods: 'Modificadores ext.' };
        return `🐾 Aplicado «${names[preset]}» (${count} teclas)`;
      },
      tailCleared: () => '🐾 Todas as teclas da cauda limpas (clique ou aperte teclas para adicionar)',
      autoDemoBtn: (running) => (running ? '⏸ Parar demo' : '▶ Demo auto'),
      privacyBtn: (active) => (active ? '🙈 Proteção ativa' : '🔒 Proteção senha'),
      whaleSoundBtn: (muted) => (muted ? '🔇 Ativar áudio' : '🔊 Áudio ativo'),
      copied: () => 'Copiado ✓',
      copyConfig: () => 'Copiar config',
      copyCmd: () => 'Copiar comando',
      copyShort: () => 'Copiar',
      totalDownloads: (count) => `${count} downloads no total`,
      statsUpdated: (timePart) => `Atualizado ${timePart} (UTC+8) · atualiza a cada 30s`,
    },
  },

  ru: {
    htmlLang: 'ru',
    docTitle: 'KuroCat — Бесплатный Open-Source 3D-кот на рабочий стол и ИИ-компаньон (Win/Mac/Linux/Android)',
    metaDesc:
      'Официальный сайт KuroCat (kurocat.org · github.com/qianyiai/KuroCat) — бесплатный 3D/2D прозрачный питомец-кот с открытым исходным кодом для рабочего стола и ИИ-компаньон для кода (альтернатива Bongo Cat) для Windows, macOS (Homebrew), Linux и Android: 6 котов + BigFish, синхронизация статусов Claude/Codex/DeepSeek, прозрачный источник для OBS, защита паролей и встроенная ИИ-студия MCP.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': 'Демо',
      'nav.whale': 'Видео BigFish',
      'nav.download': 'Скачать',
      'nav.quark': '☁️ Quark Drive',
      'nav.features': 'Функции',
      'nav.mcp': 'ИИ MCP',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': 'Все платформы',
      'hero.ghSource': 'Код на GitHub ›',
      'hero.spec1Lbl': 'Нативный установщик на Rust',
      'hero.spec2Val': '7 скинов + MCP',
      'hero.spec2Lbl': 'Коты и девушка-кит · ИИ-студия',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'Живой веб-движок · Печатайте или гладьте кота',
      'pg.mode3d': '✨ 3D-режим',
      'pg.mode2d': '🎨 2D классика',
      'pg.bgDark': 'Тёмный стол',
      'pg.bgLight': 'Светлый стол',
      'pg.hintKey': '⌨️ Печатайте',
      'pg.hintMouse': '🖱️ ЛКМ / ПКМ',
      'pg.hintPet': '🤚 Погладьте',
      'pg.done': 'Готово',
      'pg.presetOffice': 'Enter и Пробел',
      'pg.presetRightFn': 'Стрелки и NumPad',
      'pg.presetEdgeMods': 'Боковые клавиши',
      'pg.presetClear': 'Очистить',
      'pg.lblSkin': 'Скин',
      'pg.layout65': '65% компакт',
      'pg.layout108': '108 полная',
      'pg.orientCat': 'От кота',
      'pg.orientViewer': 'Для зрителя',
      'pg.btnMouse': '🖱️ ЛКМ / ПКМ',
      'pg.btnCurious': '👀 Любопытство',
      'pg.btnCross': '💢 Удар хвостом',
      'pg.btnSleep': '💤 Сон',
      'pg.btnBubbles': '💬 Пузыри',
      'pg.btnPurr': '🔊 Мурчание',
      'pg.btnHeadphones': '🎧 Наушники',
      'pg.btnOrbit': '🔄 Обзор 360°',
      'pg.lblCollar': '3D-ошейник',
      'pg.collarNone': 'Нет',
      'pg.collarRed': '🔴 Красный',
      'pg.collarBlue': '🔵 Синий',
      'pg.collarPink': '🩷 Розовый',
      'pg.collarGreen': '🟢 Зелёный',
      'pg.lblTail': 'Клавиши хвоста',
      'pg.tailSmart': 'Умная 3-я лапа',
      'pg.tailCustom': 'Свои',
      'pg.tailEdge': 'Только край',
      'pg.tailOff': 'Только вилять',
      'pg.lblPwd': 'Пароль',
      'pg.lblScale': 'Масштаб',
      'dl.eyebrow': 'Прямые загрузки · Cloudflare Edge CDN',
      'dl.title': 'Скачайте бесплатно — поселится на столе за 3 секунды',
      'dl.winName': 'Классический установщик Windows 65%',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'Рекомендуем',
      'dl.primaryBtn': 'Быстрая прямая загрузка',
      'dl.quarkBtn': '☁️ Quark Drive ›',
      'dl.ghBtn': 'Официальное зеркало GitHub ›',
      'quark.badge': '☁️ Официальный Quark Drive',
      'quark.platforms': 'Win / Mac / Android',
      'quark.openBtn': 'Открыть ↗',
      'quark.copyBtn': 'Копировать код',
      'quark.dlBadge': '☁️ Официальное облачное зеркало Quark Drive',
      'quark.dlPlatforms': 'Включает Windows · macOS · Android',
      'quark.dlTitle': 'Официальная папка «KuroCat 谦一_官方»',
      'quark.dlOpenBtn': '☁️ Открыть Quark Drive ↗',
      'dl.macName': 'macOS Universal (Apple Silicon и Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina и выше) Universal DMG',
      'dl.recommendedTag': 'Для вашего устройства',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android-версия поверх окон (APK)',
      'dl.androidSub': 'Android 8.0+ · Официальный APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ Браузер пишет «обычно не скачивается» или срабатывает Windows SmartScreen?',
      'dl.tipBrewTitle': '🍺 Установка на macOS через Homebrew (Рекомендуем)',
      'dl.tipMacTitle': '🍎 Первый запуск на macOS (делается один раз)',
      'dl.copyCmd': 'Копировать команду',
      'dl.tipWv2Title': '🪟 Ошибка «Could not find the WebView2 Runtime» в Windows?',
      'dl.tipWv2Btn': 'Скачать Microsoft WebView2 Runtime ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64-bit и 32-bit) Portable-версия (встроен WebView2 109)',
      'dl.win7Btn': '64-bit Portable (179.3 MB)',
      'dl.win7X86Btn': '32-bit Portable (159.4 MB)',
      'dl.win7Gh': 'GitHub 64-bit ›',
      'dl.win7X86Gh': 'GitHub 32-bit ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 и ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 Полноэкранные игры, стримы в OBS и античиты',
      'feat.title': 'Десктопный питомец, отточенный до каждого пикселя',
      'feat.whaleEyebrow': 'Новый скин · 🐳 BigFish (девушка-кит) · Видео 14с',
      'feat.whaleSpec1Val': '3 линии',
      'feat.whaleSpec1Lbl': 'Мышь + Печать + Удары хвостом',
      'feat.whaleSpec2Val': 'Румянец',
      'feat.whaleSpec2Lbl': 'Быстрый набор → Смущение → Смех',
      'feat.whaleSpec3Val': 'Закрывает глаза',
      'feat.whaleSpec3Lbl': 'Автозащита при вводе паролей',
      'feat.whaleTryBtn': 'Попробовать BigFish выше ↑',
      'feat.whaleDlBtn': 'Скачать вертикальное 1080p видео (14с)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14с с синхронным звуком клавиатуры и мыши',
      'feat.kbSpec1Val': '108 клавиш',
      'feat.kbSpec1Lbl': 'Полный F-ряд и цифровой блок',
      'feat.kbSpec2Val': '2 ракурса',
      'feat.kbSpec2Lbl': 'От кота / Для зрителя',
      'feat.kbSpec3Val': 'Точные коды',
      'feat.kbSpec3Lbl': 'Различает основной Enter и Num↵',
      'feat.kbTryBtn': 'Попробовать 108 клавиш выше ↑',
      'feat.mouseSpec1Lbl': 'Независимая подсветка ЛКМ / ПКМ / колеса',
      'feat.mouseSpec2Lbl': 'Обновления с проверкой SHA-256',
      'feat.mouseSpec3Val': 'В 1 клик',
      'feat.mouseSpec3Lbl': 'Тихое обновление на Win и Mac',
      'bento.1Title': 'Меню на 2 вкладки без прокрутки и память кликов',
      'bento.1Body': 'Вкладки «Внешность» и «Клавиатура / OBS / Система» умещаются на одном экране. Плавный масштаб 20%–150% и запоминание прозрачности для кликов с кнопкой разблокировки при запуске.',
      'bento.2Title': 'Поглаживание головы и синтез мурчания',
      'bento.2Body': 'Наведите курсор на голову кота и погладьте из стороны в сторону — он сладко прищурится под мягкое мурчание 24.5Hz, синтезируемое в реальном времени через Web Audio.',
      'bento.3Title': 'Автоматическая защита паролей',
      'bento.3Body': 'Определяет поля паролей в Windows и macOS на уровне ОС: перехватывает ввод в Rust, пока коты закрывают глаза, а BigFish прикрывает их ладонями и скрывает клавиши.',
      'bento.4Title': 'GPU-инстансинг и авто-экорежим в играх',
      'bento.4Body': 'Инстансинг 3D-кейкапов и деформация вершин на GPU снижают активную нагрузку на видеокарту на 75%; игровой Эко-режим 30 FPS снижает её до 88.5% и предпочитает встроенную графику.',
      'mcp.p1Text': '💬 «Создай через KuroCat MCP британского голубого кота и сразу переключись на него»',
      'mcp.p2Text': '📸 «Посмотри на фото моего кота и сделай такой же скин для KuroCat!»',
      'mcp.p3Text': '⚙️ «Поставь масштаб KuroCat 85% и включи 108 клавиш в ракурсе для зрителя»',
      'mcp.copyShort': 'Копировать',
      'mcp.tabHttp': 'Локальный HTTP',
      'mcp.footerMeta': '7 встроенных инструментов · Горячая перезагрузка 0.4с',
      'mcp.copyCfg': 'Копировать конфиг',
      'growth.eyebrow': 'Живой рост · Телеметрия в реальном времени',
      'growth.title': 'График роста в реальном времени',
      'growth.sub': 'Актуальная динамика суммарных загрузок со всех зеркал и GitHub Stars — наведите курсор, чтобы увидеть значения на любой момент.',
      'growth.dlLbl': 'Всего загрузок',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': 'Оба',
      'growth.modeDl': 'Загрузки',
      'growth.modeStars': 'Stars',
      'growth.loading': 'Синхронизация живой телеметрии…',
      'growth.starCta': '⭐ Поставить звезду KuroCat на GitHub ›',
      'footer.home': 'Главная Qianyi',
      'footer.pelican': 'Тест Пеликана',
      'footer.releases': 'Все релизы',
      'footer.download': 'Загрузки для всех ОС',
      'footer.vsBongo': 'KuroCat vs Bongo Cat',
      'footer.obs': 'Гайд по OBS без хромакея',
      'footer.mcp': 'ИИ-студия MCP',
      'footer.security': 'Безопасность и фейки',
      'alert.badge': 'ЕДИНСТВЕННЫЙ ОФИЦИАЛЬНЫЙ САЙТ',
      'alert.cta': 'Предупреждение и проверка →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> — ЕДИНСТВЕННЫЙ официальный сайт KuroCat (<code>github.com/qianyiai/KuroCat</code>). ⚠️ ВНИМАНИЕ: Фейковый сайт <strong>kurocat.net</strong> распространяет неофициальный 64 МБ архив <code>KuroCat.v5.1.0.zip</code> с 50 МиБ мусорного наполнителя и поддельным 36 МБ бинарником — НЕ скачивайте и не запускайте его!',
      'hero.title': 'KuroCat — Чёрный кот за клавиатурой<br /><span>живёт на вашем рабочем столе</span>',
      'hero.sub':
        'Бесплатный прозрачный десктоп-компаньон с открытым кодом, мгновенным переключением <strong>3D / 2D</strong> и минимальной нагрузкой на GPU. В комплекте <strong>6 котов + BigFish</strong>, мурчание при поглаживании, защита паролей, оверлей для OBS и <strong>ИИ-студия скинов</strong>.',
      'dl.sub':
        'Каждая сборка включает <strong>плавный масштаб 20%–150%</strong>, <strong>переключение 65% / 108 клавиш</strong>, <strong>настройку клавиш для хвоста</strong> и <strong>автообновление внутри приложения</strong>.<br />Быстрые официальные CDN-зеркала на <code>kurocat.org</code> вместе с официальными GitHub Releases и проверкой SHA-256.',
      'quark.heroDesc':
        '<strong>«KuroCat 谦一_官方»</strong> официальная папка · Переход бесплатно поддерживает проект',
      'quark.dlBody':
        'Официальная папка со сборками для Windows, macOS и Android — переход через Quark Drive также бесплатно поддерживает разработку KuroCat. В приложении Quark используйте код <code>/~f3813cZv6O~:/</code>.',
      'dl.winDesc':
        'По умолчанию запускается компактная 65%-клавиатура, создаются ярлыки на рабочем столе, в меню «Пуск» и деинсталлятор. По правому клику доступны <strong>полные 108 клавиш</strong>, <strong>свои клавиши хвоста</strong>, источник OBS и обновление в один клик.',
      'dl.macDesc':
        'Нативный универсальный DMG (ARM64 + x86_64) для Apple Silicon M1–M4 и Intel Mac (macOS 10.15 Catalina+). Включает раскладки 65%/108 клавиш, всех 6 котов и BigFish. Откройте <code>.dmg</code> и перетащите в «Программы».',
            'dl.androidDesc':
        'Плавающий питомец для Android-смартфонов и планшетов: <strong>6 котов + BigFish</strong>, <strong>прозрачность 20%–100%</strong>, живое мурлыканье и звуки клавиш, поглаживания и поднятие за шкирку, поворот экрана и защита паролей.',
      'dl.tipWinBody':
        'Поскольку KuroCat — бесплатное ПО с открытым кодом без коммерческого EV-сертификата подписи, Edge/Chrome может показать предупреждение при загрузке (100% исходного кода открыто на GitHub):<br /><strong>① Edge</strong>: Наведите на загрузку → нажмите <strong><code>···</code></strong> → <strong>Сохранить</strong> → стрелка вниз <strong><code>▾</code> (Показать больше)</strong> → <strong>Всё равно сохранить</strong> (Chrome: <code>Ctrl + J</code> → Сохранить опасный файл → Всё равно сохранить).<br /><strong>② Windows SmartScreen</strong>: Нажмите <strong>Подробнее</strong> → <strong>Выполнить в любом случае</strong>.',
      'dl.tipBrewBody':
        'Запущен официальный Homebrew Tap (<code>qianyiai/homebrew-tap</code>). Выполните команду справа для установки с автоматическим снятием карантина (ручной <code>xattr</code> не нужен); обновляйте в любой момент командой <code>brew upgrade --cask kurocat</code>.',
      'dl.tipMacBody':
        'Поскольку приложение с открытым кодом не нотаризовано Apple, если при первом запуске macOS пишет «не удалось проверить разработчика» или «файл повреждён», один раз выполните команду справа в Терминале для снятия карантина. Затем разрешите <code>KuroCat</code> в <strong>Системные настройки → Конфиденциальность и безопасность → Универсальный доступ и Мониторинг ввода</strong> (совместимо с Karabiner-Elements).',
      'dl.tipWv2Body':
        'Возникает на старых или урезанных сборках Windows 10 / LTSC без Microsoft Edge WebView2 (<strong>для Windows 7 скачайте отдельный Win7 Portable ниже</strong>). Установите официальный загрузчик Microsoft WebView2 (1.8 МБ) через <strong>ПКМ → Запуск от имени администратора</strong>.',
      'dl.win7Body':
        'Нативно скомпилировано как PE 6.01 для Windows 7 SP1 x64 и 32-bit x86 без зависимостей от DLL Win8/Win10. Встроен последний официальный офлайн-рантайм для Win7 <strong>WebView2 109.0.1518.78</strong> и попиксельная 256-уровневая прозрачность со сглаживанием (никаких белых рамок с Aero и без него). Распакуйте всё и запустите <code>KuroCat.exe</code> рядом с папкой <code>WebView2Runtime</code>.',
      'dl.linuxBody':
        'Нативный глобальный перехват X11 <code>XRecord</code> без root и резервный режим <code>evdev</code> для Wayland, прозрачность без рамок, пропуск кликов (удерживайте <code>Alt</code> для перетаскивания) и автозапуск. Требуется <strong><code>glibc &gt;= 2.34</code></strong> (Ubuntu 22.04+ / Debian 12+ / KylinOS V11+; несовместимо с Ubuntu 20.04 / <code>glibc 2.31</code>). Выбирайте лёгкий <strong>.deb (2.7 MB)</strong> (нужен <code>libwebkit2gtk-4.1-0</code>) или портативный <strong>.AppImage</strong>.',
      'dl.tipGameBody':
        '<strong>① Полноэкранные и безрамочные игры</strong>: Встроенная защита «поверх окон» без перехвата фокуса для FSO и Borderless; включите «Пропуск кликов» (зажмите <code>Alt</code> для перемещения). Для игр от администратора выберите в трее → <strong>Перезапустить от имени администратора</strong>.<br /><strong>② Стримы в OBS (без хромакея)</strong>: ПКМ по питомцу или трею → <strong>Копировать URL прозрачного источника OBS</strong> (запускает локальный <code>http://127.0.0.1:27421/obs</code>, по умолчанию выключен с нулевой нагрузкой) и добавьте как Источник браузера в OBS: нативный Alpha-канал, режим «Только OBS» и синхронная защита паролей.<br /><strong>③ Игры с ядерными античитами</strong> (Valorant и др.): Перед запуском нажмите в трее → <strong>Приостановить перехват и скрыть (Безопасный режим)</strong>, чтобы полностью выгрузить глобальные хуки.',
      'feat.whaleHeadline': 'Знакомьтесь: «BigFish» (девушка-кит)<br />Удары хвостом · Румянец · Защита паролей',
      'feat.whaleBody':
        'Встроенный скин <strong>🐳 BigFish (девушка-кит)</strong> одновременно управляет <strong>мышью левой рукой + клавиатурой правой рукой + брызгами ударов китового хвоста</strong>. Печатайте быстрее — она смущённо краснеет и радостно смеётся; при фокусе в поле пароля закрывает глаза обеими руками и прячет все клавиши.',
      'feat.kbHeadline': 'Компактные 65% или полные 108 клавиш<br />Два ракурса, мгновенное переключение',
      'feat.kbBody':
        'Переключайтесь в один клик между компактной 65% и полноразмерной 108-клавишной ANSI-клавиатурой (с F-рядом и NumPad) с плавным изменением ширины от правого нижнего угла. Меняйте <strong>ракурс от кота (180°)</strong> на <strong>ракурс для зрителя (прямые подписи)</strong> с синхронным отражением кнопок мыши.',
      'feat.mouseHeadline': 'Раздельная подсветка ЛКМ / ПКМ<br />и бесшовное автообновление',
      'feat.mouseBody':
        'Левая (<code>L</code>), правая (<code>R</code>) кнопки и колесо/СКМ подсвечиваются независимо контрастными цветами, с 3D-тенью нажатия и мини-бейджами <code>LMB</code>/<code>RMB</code> — поддерживается одновременное удержание. Быстрая проверка через CDN (с резервом GitHub) показывает компактную плашку над питомцем для обновления в один клик с проверкой SHA-256.',
      'mcp.headline': 'Отправьте фото своего кота<br />ИИ создаст его на рабочем столе за 0.4 с',
      'mcp.body':
        'В единый бинарник KuroCat встроены MCP-серверы <strong>Stdio</strong> и <strong>локальный Streamable HTTP (<code>127.0.0.1:27420</code>)</strong> — Node.js и Python не нужны. Нажмите «Копировать конфиг MCP» и вставьте в <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong>, чтобы задать любой окрас, полоски, пятна и цвет глаз с мгновенным обновлением.',
      'footer.credit': 'Официальный сайт KuroCat (<code>kurocat.org</code>) · MIT Open Source · Создано <a class="footer-home" href="https://qianyi.one/?lang=en" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'Введите пароль здесь: кот закроет глаза / BigFish прикроет их руками и скроет клавиши…',
    },
    titles: {
      'pg.autoDemoTitle': 'Включить/выключить автодемо печати и кликов',
      'pg.mouseTitle': 'Демо независимых кликов ЛКМ/ПКМ',
      'pg.curiousTitle': 'Включить любопытные большие зрачки (или резко махните мышкой)',
      'pg.crossTitle': 'Включить уши-самолётики + тройной удар хвостом (или побейте по клавишам)',
      'pg.sleepTitle': 'Включить сон с летающими Zzz (нажмите любую клавишу, чтобы разбудить)',
      'pg.bubblesTitle': 'Включить/выключить всплывающие пузыри клавиш',
      'pg.purrTitle': 'Включить/выключить звук мурчания при поглаживании',
      'pg.headphonesTitle': 'Включить/выключить игровые наушники (десктоп-версия надевает их автоматически в играх)',
      'pg.orbitTitle': 'Включите, чтобы тянуть мышью по холсту и вращать 3D-модель на 360°',
      'pg.tailSmartTitle': 'Обычно печатают лапы; хвост помогает как 3-я лапа при быстром наборе или Enter',
      'pg.tailCustomTitle': 'Хвост нажимает только выбранные вами клавиши',
      'pg.tailEdgeTitle': 'Только крайние клавиши со стороны хвоста (не трогает WASD)',
      'pg.tailOffTitle': 'Хвост просто естественно виляет, не нажимая клавиши',
      'pg.tailPickerTitle': 'Нажимайте кейкапы на клавиатуре выше или физические клавиши для выбора',
      'pg.privacyTitle': 'Переключить демо защиты паролей',
      'pg.scaleResetTitle': 'Нажмите, чтобы сбросить масштаб до 100%',
      'alert.closeTitle': 'Закрыть уведомление',
    },
    ariaLabels: {
      'nav.backAria': 'Вернуться на главную Qianyi',
      'nav.mainAria': 'Главная навигация',
      'pg.modeAria': 'Переключение режима 3D / 2D',
      'pg.backdropAria': 'Фон стола для предпросмотра',
      'pg.canvas2dAria': 'Интерактивный 2D-холст KuroCat',
      'pg.canvas3dAria': 'Интерактивный 3D-холст KuroCat',
      'pg.tailPickerAria': 'Настройка клавиш хвоста',
      'pg.skinGroupAria': 'Выбор скина питомца',
      'pg.layoutAria': 'Раскладка клавиатуры',
      'pg.orientAria': 'Ракурс клавиатуры',
      'pg.collarAria': 'Цвет 3D-ошейника и колокольчика',
      'pg.tailModeAria': 'Режим нажатий хвостом',
      'pg.pwdAria': 'Поле проверки защиты паролей',
      'pg.scaleAria': 'Масштаб от 20% до 150%',
      'alert.closeAria': 'Закрыть уведомление',
    },
    alts: {
      'hero.iconAlt': 'Иконка приложения KuroCat',
      'feat.kbImgAlt': 'Сравнение 65% компактной и 108-клавишной раскладок и двух ракурсов KuroCat',
      'feat.mouseImgAlt': 'Независимая подсветка ЛКМ/ПКМ и встроенное автообновление KuroCat',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-BigFish-Demo-Vertical-14s-RU.mp4',
    },
    prompts: {
      'mcp.p1': 'Создай через KuroCat MCP британского голубого кота с янтарными глазами и ледяно-голубой подсветкой клавиш и сразу переключись на него',
      'mcp.p2': 'Посмотри на эту фотографию моего кота и сделай через KuroCat MCP персонального питомца с таким же окрасом и пятнами!',
      'mcp.p3': 'Уменьши масштаб KuroCat до 85% и переключись на полноразмерную 108-клавишную клавиатуру в ракурсе для зрителя',
    },
    skins: {
      black: 'Чёрный кот',
      ragdoll: 'Little Whale Butler',
      'orange-tabby': 'Рыжий полосатый',
      calico: 'Трёхцветная',
      tuxedo: 'Смокинг',
      siamese: 'Сиамский',
      dafeiyu: 'BigFish',
    },
    tailModeShort: {
      smart: 'Хвост: Умный',
      custom: 'Хвост: Свои',
      edge: 'Хвост: Край',
      off: 'Хвост: Вилять',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<ИмяПользователя>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Режим Windows Stdio (Claude / Cursor / Antigravity)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;ИмяПользователя&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Режим macOS Stdio (без зависимостей, встроен в бинарник)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// Локальный Streamable HTTP (подключение при запущенном KuroCat)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `Последняя версия ${tag}`,
      heroDownloadWin: (size) => `Скачать для Windows (${size})`,
      heroDownloadMac: (size) => `Скачать для macOS (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Скачать для Windows 7 32-bit (${size})` : `Скачать для Windows 7 64-bit (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Скачать Linux ARM64 (${size})` : `Скачать для Linux (${size})`,
      heroDownloadAndroid: (size) => `Скачать APK для Android (${size})`,
      heroDownloadIos: () => 'Смотреть сборки для ПК и Android',
      heroOsHint: (os, size) => {
        if (os === 'android') return `Определено устройство: <strong>Android</strong> · Нажмите для загрузки официального APK (${size})`;
        if (os === 'macos') return 'Определена система: <strong>macOS (Apple Silicon и Intel)</strong> · Также есть Win / Linux / Android';
        if (os === 'win7-x86') return 'Определена система: <strong>Windows 7 (32-bit)</strong> · Подобрана 32-битная портативная сборка с WebView2 109';
        if (os === 'win7') return 'Определена система: <strong>Windows 7 (64-bit)</strong> · Подобрана портативная сборка с WebView2 109';
        if (os === 'linux-arm64') return 'Определена система: <strong>Linux ARM64</strong> · Рекомендован лёгкий .deb (AppImage ниже)';
        if (os === 'linux-x64') return 'Определена система: <strong>Linux x86_64</strong> · Рекомендован лёгкий .deb (AppImage ниже)';
        if (os === 'ios') return 'Определено устройство: <strong>iOS / iPadOS</strong> · Доступно для Windows, macOS, Linux и Android ниже';
        return 'Определена система: <strong>Windows 10 / 11 (x64)</strong> · Также есть macOS / Linux / Android';
      },
      layout: (id) => (id === '108' ? '108 полная' : '65% компакт'),
      orient: (o) => (o === 'viewer' ? 'Для зрителя' : 'От кота'),
      tailPickerBtn: (open, count) =>
        open ? `✓ Выбор (${count} выбр.)` : `🐾 Клавиши хвоста (${count})`,
      tailPickerTitleDefault: (count) => `🐾 Кликайте по клавишам ниже или жмите на клавиатуре (выбрано: ${count})`,
      tailKeyAdded: (key, count) => `🐾 Добавлена «${key}» · всего ${count} (нажмите «Готово» для теста)`,
      tailKeyRemoved: (key, count) => `🐾 Убрана «${key}» · всего ${count}`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter и Пробел', rightFn: 'Стрелки и NumPad', edgeMods: 'Боковые клавиши' };
        return `🐾 Применён пресет «${names[preset]}» (${count} кл.)`;
      },
      tailCleared: () => '🐾 Все клавиши хвоста очищены (нажмите кейкап или клавишу для добавления)',
      autoDemoBtn: (running) => (running ? '⏸ Стоп демо' : '▶ Автодемо'),
      privacyBtn: (active) => (active ? '🙈 Защита активна' : '🔒 Защита паролей'),
      whaleSoundBtn: (muted) => (muted ? '🔇 Включить звук' : '🔊 Звук вкл.'),
      copied: () => 'Скопировано ✓',
      copyConfig: () => 'Копировать конфиг',
      copyCmd: () => 'Копировать команду',
      copyShort: () => 'Копировать',
      totalDownloads: (count) => `Всего ${count} загрузок`,
      statsUpdated: (timePart) => `Обновлено ${timePart} (UTC+8) · автообновление каждые 30с`,
    },
  },

  de: {
    htmlLang: 'de',
    docTitle: 'KuroCat Offiziell — Kostenlose Open-Source-3D-Desktop-Katze & KI-Begleiter (Win/Mac/Linux/Android)',
    metaDesc:
      'Offizielle KuroCat-Website (kurocat.org · github.com/qianyiai/KuroCat) — Kostenlose Open-Source-3D/2D-Desktop-Tippkatze mit transparentem Overlay & KI-Coding-Begleiter (Bongo-Cat-Alternative) für Windows, macOS (Homebrew), Linux & Android: 6 Katzen + BigFish, Claude/Codex/DeepSeek-Statussync, transparente OBS-Quelle, Passwort-Sichtschutz & integriertes MCP-KI-Studio.',
    text: {
      'nav.back': '← Qianyi',
      'nav.playground': 'Live-Demo',
      'nav.whale': 'BigFish-Video',
      'nav.download': 'Download',
      'nav.quark': '☁️ Quark Drive',
      'nav.features': 'Funktionen',
      'nav.mcp': 'KI MCP',
      'hero.eyebrow': 'Windows · macOS · Linux · Android · Open Source',
      'hero.allPlatforms': 'Alle Plattformen',
      'hero.ghSource': 'GitHub-Quellcode ›',
      'hero.spec1Lbl': 'Nativer Rust-Installer',
      'hero.spec2Val': '7 Skins + MCP',
      'hero.spec2Lbl': 'Katzen & Wal-Mädchen · KI-Studio',
      'hero.spec3Val': 'Win / Mac / Linux / Android',
      'hero.spec3Lbl': 'Apple Silicon · Win7 · Android 8+',
      'pg.title': 'Live-Web-Engine · Tippe oder streichle die Katze',
      'pg.mode3d': '✨ 3D-Modus',
      'pg.mode2d': '🎨 2D Klassik',
      'pg.bgDark': 'Dunkler Tisch',
      'pg.bgLight': 'Heller Tisch',
      'pg.hintKey': '⌨️ Tippen',
      'pg.hintMouse': '🖱️ L/R-Klick',
      'pg.hintPet': '🤚 Kopf streicheln',
      'pg.done': 'Fertig',
      'pg.presetOffice': 'Enter & Leer',
      'pg.presetRightFn': 'Pfeile & Numpad',
      'pg.presetEdgeMods': 'Äußere Tasten',
      'pg.presetClear': 'Leeren',
      'pg.lblSkin': 'Skin',
      'pg.layout65': '65% Kompakt',
      'pg.layout108': '108 Vollformat',
      'pg.orientCat': 'Katzensicht',
      'pg.orientViewer': 'Zuschauersicht',
      'pg.btnMouse': '🖱️ L/R-Klick',
      'pg.btnCurious': '👀 Neugierig',
      'pg.btnCross': '💢 Schwanzklopfen',
      'pg.btnSleep': '💤 Schlafen',
      'pg.btnBubbles': '💬 Blasen',
      'pg.btnPurr': '🔊 Schnurren',
      'pg.btnHeadphones': '🎧 Headset',
      'pg.btnOrbit': '🔄 360°-Drehung',
      'pg.lblCollar': '3D-Halsband',
      'pg.collarNone': 'Keins',
      'pg.collarRed': '🔴 Rot',
      'pg.collarBlue': '🔵 Blau',
      'pg.collarPink': '🩷 Rosa',
      'pg.collarGreen': '🟢 Grün',
      'pg.lblTail': 'Schwanztasten',
      'pg.tailSmart': 'Smarte 3. Hand',
      'pg.tailCustom': 'Eigene',
      'pg.tailEdge': 'Nur Rand',
      'pg.tailOff': 'Nur wedeln',
      'pg.lblPwd': 'Passwort',
      'pg.lblScale': 'Größe',
      'dl.eyebrow': 'Direktdownloads · Cloudflare Edge CDN',
      'dl.title': 'Kostenlos laden — In 3 Sekunden auf deinem Desktop',
      'dl.winName': 'Windows 65% Klassik-Installer',
      'dl.winSub': 'Windows 10 / 11 (x64)',
      'dl.winTag': 'Empfohlen',
      'dl.primaryBtn': 'Schneller Direktdownload',
      'dl.quarkBtn': '☁️ Quark Drive ›',
      'dl.ghBtn': 'Offizieller GitHub-Mirror ›',
      'quark.badge': '☁️ Offizielles Quark Drive',
      'quark.platforms': 'Win / Mac / Android',
      'quark.openBtn': 'Öffnen ↗',
      'quark.copyBtn': 'Code kopieren',
      'quark.dlBadge': '☁️ Offizieller Quark-Cloud-Mirror',
      'quark.dlPlatforms': 'Enthält Windows · macOS · Android',
      'quark.dlTitle': 'Offizieller Ordner „KuroCat 谦一_官方“',
      'quark.dlOpenBtn': '☁️ Quark Drive öffnen ↗',
      'dl.macName': 'macOS Universal (Apple Silicon & Intel)',
      'dl.macSub': 'macOS 10.15+ (Catalina oder neuer) Universal DMG',
      'dl.recommendedTag': 'Für dein Gerät',
      'dl.winTagDefault': 'Windows 10/11',
      'dl.macTagDefault': 'Apple Silicon',
      'dl.androidName': 'Android Schwebende Katze (APK)',
      'dl.androidSub': 'Android 8.0+ · Signierte APK',
      'dl.androidTagDefault': 'Android 8.0+',
      'dl.tipWinTitle': '🛡️ Browser warnt „wird nicht häufig heruntergeladen“ oder Windows SmartScreen erscheint?',
      'dl.tipBrewTitle': '🍺 Installation unter macOS mit Homebrew (Empfohlen)',
      'dl.tipMacTitle': '🍎 macOS-Erststart-Anleitung (einmalig)',
      'dl.copyCmd': 'Befehl kopieren',
      'dl.tipWv2Title': '🪟 Meldung „Could not find the WebView2 Runtime“ unter Windows?',
      'dl.tipWv2Btn': 'Microsoft WebView2 Runtime laden ›',
      'dl.win7Title': '🖥️ Windows 7 SP1 (64-Bit & 32-Bit) Portable-Paket (inkl. WebView2 109)',
      'dl.win7Btn': '64-Bit Portable (179.3 MB)',
      'dl.win7X86Btn': '32-Bit Portable (159.4 MB)',
      'dl.win7Gh': 'GitHub 64-Bit ›',
      'dl.win7X86Gh': 'GitHub 32-Bit ›',
      'dl.linuxTitle': '🐧 Linux / Ubuntu 22.04+ / Debian 12+ / KylinOS V11+ (x86_64 & ARM64)',
      'dl.linuxX64Deb': 'x86_64 .deb (2.66 MB)',
      'dl.linuxArmDeb': 'ARM64 .deb (2.62 MB)',
      'dl.linuxX64AppImage': 'x86_64 AppImage (77.8 MB) ›',
      'dl.linuxArmAppImage': 'ARM64 AppImage (76.0 MB) ›',
      'dl.tipGameTitle': '🎮 Vollbild-Spiele, OBS-Streaming & Anti-Cheat-Hinweise',
      'feat.title': 'Desktop-Pet-Engineering, bis ins letzte Pixel poliert',
      'feat.whaleEyebrow': 'Neuer Skin · 🐳 BigFish (Wal-Mädchen) · 14s-Video',
      'feat.whaleSpec1Val': '3-fach-Sync',
      'feat.whaleSpec1Lbl': 'Maus + Tippen + Walflosse',
      'feat.whaleSpec2Val': 'Tempo-Reaktion',
      'feat.whaleSpec2Lbl': 'Schnelles Tippen → Erröten → Lachen',
      'feat.whaleSpec3Val': 'Hände vor Augen',
      'feat.whaleSpec3Lbl': 'Automatischer Passwort-Sichtschutz',
      'feat.whaleTryBtn': 'BigFish oben ausprobieren ↑',
      'feat.whaleDlBtn': '1080p-Hochformat-Demo laden (14s)',
      'feat.whaleMeta': '1080×1920 · 60fps · 14s mit synchronem Tastatur- & Maus-Sound',
      'feat.kbSpec1Val': '108 Tasten',
      'feat.kbSpec1Lbl': 'Komplette F-Reihe & Nummernblock',
      'feat.kbSpec2Val': '2 Ansichten',
      'feat.kbSpec2Lbl': 'Katzensicht / Zuschauersicht',
      'feat.kbSpec3Val': 'Echte Codes',
      'feat.kbSpec3Lbl': 'Unterscheidet Enter & Num↵ exakt',
      'feat.kbTryBtn': '108-Tasten-Layout oben testen ↑',
      'feat.mouseSpec1Lbl': 'Unabhängiges Leuchten für L / R / Rad',
      'feat.mouseSpec2Lbl': 'SHA-256-geprüfte Updates',
      'feat.mouseSpec3Val': '1-Klick-Update',
      'feat.mouseSpec3Lbl': 'Lautloses Upgrade für Win & Mac',
      'bento.1Title': '2-Tab-Menü ohne Scrollen & Klick-Sperre',
      'bento.1Body': 'Übersichtlich geteilt in Aussehen und Tastatur/OBS/System auf einer Seite – plus stufenlose 20%–150%-Skalierung und gemerkte Klickdurchlässigkeit mit 1-Klick-Entsperr-Hinweis beim Start.',
      'bento.2Title': 'Kopf streicheln & Echtzeit-Schnurren',
      'bento.2Body': 'Fahre mit der Maus über den Katzenkopf und streichle hin und her: Sie kneift genüsslich die Augen zusammen und schnurrt mit live synthetisiertem 24.5Hz-Web-Audio.',
      'bento.3Title': 'Automatischer Passwort-Sichtschutz',
      'bento.3Body': 'Erkennt Passwortfelder in Windows & macOS auf Systemebene – fängt Tastenanschläge direkt in Rust ab, während Katzen die Augen schließen und BigFish sie mit beiden Händen verdeckt.',
      'bento.4Title': 'GPU-Instancing & Spiele-Öko-Modus',
      'bento.4Body': 'Instanziiertes 3D-Tasten-Batching und GPU-Vertex-Verformung senken die aktive GPU-Last um 75%; der automatische 30-FPS-Spiele-Öko-Modus spart bis zu 88.5% und bevorzugt die iGPU.',
      'mcp.p1Text': '💬 „Erstelle per KuroCat MCP eine blaue Britisch Kurzhaar und wechsle direkt zu ihr“',
      'mcp.p2Text': '📸 „Schau dir dieses Foto meiner Katze an und gestalte einen passenden KuroCat-Skin!“',
      'mcp.p3Text': '⚙️ „Skaliere KuroCat auf 85% und schalte auf 108 Tasten in Zuschauersicht um“',
      'mcp.copyShort': 'Kopieren',
      'mcp.tabHttp': 'Lokales HTTP',
      'mcp.footerMeta': '7 integrierte Tools · 0.4s Live-Hot-Reload',
      'mcp.copyCfg': 'Konfig kopieren',
      'growth.eyebrow': 'Live-Wachstum · Echtzeit-Telemetrie',
      'growth.title': 'Live-Wachstumskurve',
      'growth.sub': 'Echtzeit-Verlauf aller Downloads über sämtliche Mirrors sowie der GitHub Stars – fahre mit der Maus über jeden Zeitpunkt.',
      'growth.dlLbl': 'Downloads gesamt',
      'growth.starLbl': 'GitHub Stars',
      'growth.modeBoth': 'Beide',
      'growth.modeDl': 'Downloads',
      'growth.modeStars': 'Stars',
      'growth.loading': 'Synchronisiere Live-Telemetrie…',
      'growth.starCta': '⭐ KuroCat auf GitHub einen Stern geben ›',
      'footer.home': 'Qianyi Startseite',
      'footer.pelican': 'Pelikan-Benchmark',
      'footer.releases': 'Alle Releases',
      'footer.download': 'Alle Plattform-Downloads',
      'footer.vsBongo': 'KuroCat vs. Bongo Cat',
      'footer.obs': 'OBS-Transparenz-Guide',
      'footer.mcp': 'KI MCP Studio',
      'footer.security': 'Sicherheitshinweis',
      'alert.badge': 'EINZIGE OFFIZIELLE SEITE',
      'alert.cta': 'Sicherheitshinweis →',
    },
    html: {
      'alert.text':
        '<strong>kurocat.org</strong> ist die EINZIGE offizielle KuroCat-Website (<code>github.com/qianyiai/KuroCat</code>). ⚠️ WARNUNG: Die Fälschung <strong>kurocat.net</strong> verbreitet eine unautorisierte 64 MB große <code>KuroCat.v5.1.0.zip</code>, aufgebläht mit 50 MiB Datenmüll und einer gefälschten 36-MB-Datei — NICHT herunterladen oder ausführen!',
      'hero.title': 'KuroCat — Eine tippende schwarze Katze<br /><span>direkt auf deinem Desktop</span>',
      'hero.sub':
        'Kostenloser, quelloffener Desktop-Tastatur- &amp; Maus-Begleiter mit transparentem Overlay, blitzschnellem <strong>3D / 2D</strong>-Wechsel und minimaler GPU-Last. Enthält <strong>6 Katzen + BigFish</strong>, Streichel-Schnurren, Passwort-Sichtschutz, OBS-Overlay und <strong>KI-Katzenstudio</strong>.',
      'dl.sub':
        'Jeder Build enthält <strong>stufenlose 20%–150%-Skalierung</strong>, <strong>65% / 108-Tasten-Wechsel</strong>, <strong>frei wählbare Schwanztasten</strong> und <strong>In-App-Auto-Updates</strong>.<br />Schnelle offizielle CDN-Mirrors auf <code>kurocat.org</code> neben offiziellen GitHub Releases mit SHA-256-Prüfsumme.',
      'quark.heroDesc':
        '<strong>„KuroCat 谦一_官方“</strong> offizieller Cloud-Ordner · Öffnen unterstützt kostenlos die Pflege',
      'quark.dlBody':
        'Offizieller Ordner mit Windows-, macOS- &amp; Android-Installern — das Öffnen über Quark Drive unterstützt kostenlos die Open-Source-Pflege. In der Quark-App einfach Code <code>/~f3813cZv6O~:/</code> nutzen.',
      'dl.winDesc':
        'Startet im kompakten 65%-Layout und erstellt Verknüpfungen für Desktop, Startmenü &amp; Deinstallation. Per Rechtsklick jederzeit umschaltbar auf <strong>108-Tasten-Vollformat</strong>, <strong>eigene Schwanztasten</strong>, OBS-Quelle &amp; 1-Klick-Update.',
      'dl.macDesc':
        'Natives Universal-DMG (ARM64 + x86_64) für Apple Silicon M1–M4 und Intel-Macs (macOS 10.15 Catalina+). Enthält 65%-/108-Tasten-Layouts, alle 6 Katzen &amp; BigFish. Einfach <code>.dmg</code> öffnen und in „Programme“ ziehen.',
            'dl.androidDesc':
        'Schwebender Android-Begleiter für Smartphone &amp; Tablet mit <strong>6 Katzen + BigFish</strong>, <strong>20%–100% Deckkraft</strong>, echtem Schnurren &amp; Tipp-Sounds, Streicheln/Nackengriff, Auto-Drehung und Sichtschutz bei Zahlungstastaturen.',
      'dl.tipWinBody':
        'Da KuroCat kostenlose Open-Source-Software ohne kostenpflichtiges EV-Code-Signing-Zertifikat ist, warnen Edge/Chrome gelegentlich beim Download (100% des Quellcodes sind öffentlich auf GitHub):<br /><strong>① Edge</strong>: Über den Download fahren → <strong><code>···</code></strong> klicken → <strong>Behalten</strong> → Pfeil nach unten <strong><code>▾</code> (Mehr anzeigen)</strong> → <strong>Trotzdem behalten</strong> (Chrome: <code>Ctrl + J</code> → Gefährliche Datei behalten → Trotzdem beibehalten).<br /><strong>② Windows SmartScreen</strong>: Auf <strong>Weitere Informationen</strong> → <strong>Trotzdem ausführen</strong> klicken.',
      'dl.tipBrewBody':
        'Der offizielle Homebrew Tap (<code>qianyiai/homebrew-tap</code>) ist online. Der Befehl rechts installiert KuroCat und entfernt die Quarantäne automatisch (kein manuelles <code>xattr</code> nötig); Updates gehen jederzeit per <code>brew upgrade --cask kurocat</code>.',
      'dl.tipMacBody':
        'Da diese Open-Source-App nicht von Apple notarisiert ist, führe bei Meldungen wie „Entwickler kann nicht verifiziert werden“ oder „beschädigt“ einmalig den Befehl rechts im Terminal aus, um das Quarantäne-Flag zu entfernen. Aktiviere danach <code>KuroCat</code> unter <strong>Systemeinstellungen → Datenschutz &amp; Sicherheit → Bedienungshilfen &amp; Eingabeüberwachung</strong> (kompatibel mit Karabiner-Elements).',
      'dl.tipWv2Body':
        'Tritt bei älteren oder abgespeckten Windows-10-/LTSC-Systemen ohne Microsoft Edge WebView2 auf (<strong>Windows-7-Nutzer bitte das Win7-Portable-Paket unten verwenden</strong>). Installiere den offiziellen 1.8-MB-Bootstrapper von Microsoft per <strong>Rechtsklick → Als Administrator ausführen</strong>.',
      'dl.win7Body':
        'Nativ als PE 6.01 für Windows 7 SP1 x64 &amp; 32-Bit x86 kompiliert, ganz ohne Win8/Win10-DLL-Abhängigkeiten. Enthält Microsofts finale Offline-Runtime für Win7 (<strong>WebView2 109.0.1518.78</strong>) und native 256-Stufen-Pixeltransparenz mit Kantenglättung (kein weißer Rahmen, mit oder ohne Aero). Alle Dateien entpacken und <code>KuroCat.exe</code> neben <code>WebView2Runtime</code> starten.',
      'dl.linuxBody':
        'Native rootlose X11-<code>XRecord</code>-Hooks mit Wayland-<code>evdev</code>-Fallback, rahmenlose Transparenz, Klickdurchlässigkeit (<code>Alt</code> zum Ziehen gedrückt halten) &amp; Autostart. Erfordert <strong><code>glibc &gt;= 2.34</code></strong> (Ubuntu 22.04+ / Debian 12+ / KylinOS V11+; nicht kompatibel mit Ubuntu 20.04 / <code>glibc 2.31</code>). Wähle das schlanke <strong>.deb (2.7 MB)</strong> (benötigt <code>libwebkit2gtk-4.1-0</code>) oder das portable <strong>.AppImage</strong>.',
      'dl.tipGameBody':
        '<strong>① Vollbild- &amp; randlose Spiele</strong>: Eingebauter Topmost-Wächter ohne Fokusverlust für FSO &amp; randlose Fenster; aktiviere die Klick-Sperre (mit <code>Alt</code> jederzeit verschiebbar). Für Admin-Spiele im Tray → <strong>Als Administrator neu starten</strong> wählen.<br /><strong>② OBS-Streaming (ohne Greenscreen)</strong>: Rechtsklick auf das Pet oder Tray → <strong>Transparente OBS-Quellen-URL kopieren</strong> (startet lokal <code>http://127.0.0.1:27421/obs</code>, standardmäßig aus ohne Last) und als OBS-Browserquelle hinzufügen – mit echtem Alpha-Kanal, Nur-OBS-Modus &amp; synchronem Passwort-Sichtschutz.<br /><strong>③ Spiele mit Kernel-Anti-Cheat</strong> (Valorant usw.): Vor dem Start im Tray → <strong>Eingabe pausieren &amp; ausblenden (Anti-Cheat-Schutz)</strong> klicken, um alle globalen Hooks komplett zu entladen.',
      'feat.whaleHeadline': 'Lerne „BigFish“ (Wal-Mädchen) kennen<br />Flossenschlag · Tempo-Erröten · Sichtschutz',
      'feat.whaleBody':
        'Unser integrierter Skin <strong>🐳 BigFish (Wal-Mädchen)</strong> beherrscht gleichzeitig <strong>Maus links + Tippen rechts + spritzige Walflossen-Tastenschläge</strong>. Tippe schneller, damit sie verlegen errötet und fröhlich lacht; sobald du in ein Passwortfeld klickst, hält sie sich beide Hände vor die Augen und blendet alle Tasten aus.',
      'feat.kbHeadline': '65% Kompakt oder 108 Vollformat<br />Zwei Perspektiven, sofort umschaltbar',
      'feat.kbBody':
        'Wechsle mit einem Klick zwischen minimalistischem 65%-Layout und vollem 108-Tasten-ANSI-Board (F-Reihe &amp; Numpad) mit sauberer Ausrichtung an der unteren rechten Ecke. Schalte zwischen <strong>Katzensicht (180°)</strong> und <strong>Zuschauersicht (aufrechte Beschriftung)</strong> um – die Maustasten spiegeln sich automatisch mit.',
      'feat.mouseHeadline': 'Getrennte Farben für Links- &amp; Rechtsklick<br />&amp; nahtlose In-App-Auto-Updates',
      'feat.mouseBody':
        'Linksklick (<code>L</code>), Rechtsklick (<code>R</code>) und Mittelklick/Scrollrad leuchten getrennt in klaren Kontrastfarben samt 3D-Druckschatten und Mini-<code>LMB</code>/<code>RMB</code>-Badges – auch bei gleichzeitigem Halten. Schnelle CDN-Update-Prüfung (mit GitHub-Fallback) zeigt bei neuen Versionen eine wegklickbare Pille über dem Pet für SHA-256-geprüfte 1-Klick-Upgrades.',
      'mcp.headline': 'Schick ein Foto deiner Katze<br />Die KI modelliert sie in 0.4 Sekunden',
      'mcp.body':
        'KuroCat bringt sowohl <strong>Stdio</strong>- als auch <strong>lokale Streamable-HTTP-MCP-Server (<code>127.0.0.1:27420</code>)</strong> direkt in einer Datei mit – ganz ohne Node.js oder Python. Klicke auf „MCP-Konfig kopieren“, füge sie in <strong>Claude Desktop / Cursor / Antigravity / Windsurf</strong> ein und gestalte Fellfarbe, Streifen, Flecken oder Augenfarbe per Text mit sofortigem Hot-Reload.',
      'footer.credit': 'Offizielle KuroCat-Website (<code>kurocat.org</code>) · MIT Open Source · Entwickelt von <a class="footer-home" href="https://qianyi.one/?lang=en" rel="me noopener">Qianyi</a>',
    },
    placeholders: {
      'pg.pwdPlaceholder': 'Passwort hier tippen: Katze schließt Augen / BigFish hält sie zu & blendet Tasten aus…',
    },
    titles: {
      'pg.autoDemoTitle': 'Automatische Tipp- & Klick-Demo ein-/ausschalten',
      'pg.mouseTitle': 'Getrennte Links-/Rechtsklicks demonstrieren',
      'pg.curiousTitle': 'Neugierige große Pupillen auslösen (oder Cursor schnell bewegen)',
      'pg.crossTitle': 'Flugzeugohren + 3-fach-Schwanzklopfen auslösen (oder wild tippen)',
      'pg.sleepTitle': 'Schlafmodus mit schwebenden Zzz auslösen (beliebige Taste weckt auf)',
      'pg.bubblesTitle': 'Schwebende Tastenblasen ein-/ausschalten',
      'pg.purrTitle': 'Schnurren beim Streicheln ein-/ausschalten',
      'pg.headphonesTitle': 'Gaming-Headset ein-/ausschalten (Desktop-App setzt es bei Spielen automatisch auf)',
      'pg.orbitTitle': 'Aktivieren, um das 3D-Modell per Ziehen auf dem Canvas um 360° zu drehen',
      'pg.tailSmartTitle': 'Pfoten tippen normal; der Schwanz hilft bei hohem Tempo oder Enter als 3. Hand',
      'pg.tailCustomTitle': 'Der Schwanz tippt nur deine ausgewählten Tasten',
      'pg.tailEdgeTitle': 'Nur äußere Randtasten auf der Schwanzseite (schützt WASD)',
      'pg.tailOffTitle': 'Der Schwanz wedelt nur natürlich, ohne Tasten zu drücken',
      'pg.tailPickerTitle': 'Tasten oben anklicken oder physische Tasten drücken zum Umschalten',
      'pg.privacyTitle': 'Passwort-Sichtschutz-Demo umschalten',
      'pg.scaleResetTitle': 'Klicken zum Zurücksetzen auf 100%',
      'alert.closeTitle': 'Hinweis schließen',
    },
    ariaLabels: {
      'nav.backAria': 'Zurück zur Qianyi-Startseite',
      'nav.mainAria': 'Hauptnavigation',
      'pg.modeAria': '3D- / 2D-Darstellungsmodus',
      'pg.backdropAria': 'Vorschau-Tischhintergrund',
      'pg.canvas2dAria': 'Interaktiver 2D-Live-Canvas von KuroCat',
      'pg.canvas3dAria': 'Interaktiver 3D-Live-Canvas von KuroCat',
      'pg.tailPickerAria': 'Schwanztasten anpassen',
      'pg.skinGroupAria': 'Pet-Skin auswählen',
      'pg.layoutAria': 'Tastaturlayout',
      'pg.orientAria': 'Tastaturperspektive',
      'pg.collarAria': 'Farbe von 3D-Halsband und Glöckchen',
      'pg.tailModeAria': 'Schwanz-Tippmodus',
      'pg.pwdAria': 'Testfeld für den Passwort-Sichtschutz',
      'pg.scaleAria': 'Skalierung von 20% bis 150%',
      'alert.closeAria': 'Hinweis schließen',
    },
    alts: {
      'hero.iconAlt': 'KuroCat App-Symbol',
      'feat.kbImgAlt': 'KuroCat 65% Kompakt vs. 108-Tasten-Vollformat und Doppelperspektive',
      'feat.mouseImgAlt': 'KuroCat unabhängige L/R-Mausbeleuchtung und integriertes Auto-Update',
    },
    downloads: {
      'feat.whaleDlFile': 'KuroCat-BigFish-Demo-Vertical-14s-DE.mp4',
    },
    prompts: {
      'mcp.p1': 'Erstelle mit KuroCat MCP eine blaue Britisch-Kurzhaar-Katze mit bernsteinfarbenen Augen und eisblauen Tasten und wechsle sofort zu ihr',
      'mcp.p2': 'Schau dir dieses Foto meiner Katze an und erstelle mit KuroCat MCP ein eigenes Desktop-Pet mit genau ihrem Fellmuster und Flecken!',
      'mcp.p3': 'Skaliere KuroCat auf 85% und schalte auf das 108-Tasten-Vollformat in Zuschauersicht um',
    },
    skins: {
      black: 'Schwarze Katze',
      ragdoll: 'Little Whale Butler',
      'orange-tabby': 'Roter Tiger',
      calico: 'Glückskatze',
      tuxedo: 'Tuxedo',
      siamese: 'Siamkatze',
      dafeiyu: 'BigFish',
    },
    tailModeShort: {
      smart: 'Schwanz: Smart',
      custom: 'Schwanz: Eigene',
      edge: 'Schwanz: Rand',
      off: 'Schwanz: Wedeln',
    },
    mcpSnippets: {
      win: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "C:\\\\Users\\\\<Benutzername>\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// Windows Stdio-Modus (Claude / Cursor / Antigravity)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"C:\\\\Users\\\\&lt;Benutzername&gt;\\\\AppData\\\\Local\\\\KuroCat\\\\KuroCat.exe"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      mac: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "command": "/Applications/KuroCat.app/Contents/MacOS/KuroCat",\n      "args": ["--mcp"]\n    }\n  }\n}`,
        html: `<span class="c-dim">// macOS Stdio-Modus (ohne Abhängigkeiten, direkt in der App)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"command"</span>: <span class="c-str">"/Applications/KuroCat.app/Contents/MacOS/KuroCat"</span>,\n      <span class="c-key">"args"</span>: [<span class="c-str">"--mcp"</span>]\n    }\n  }\n}`,
      },
      http: {
        raw: `{\n  "mcpServers": {\n    "kurocat": {\n      "url": "http://127.0.0.1:27420/mcp"\n    }\n  }\n}`,
        html: `<span class="c-dim">// Lokaler Streamable-HTTP-Modus (bei laufendem KuroCat verbinden)</span>\n{\n  <span class="c-key">"mcpServers"</span>: {\n    <span class="c-key">"kurocat"</span>: {\n      <span class="c-key">"url"</span>: <span class="c-str">"http://127.0.0.1:27420/mcp"</span>\n    }\n  }\n}`,
      },
    },
    fmt: {
      latestVersion: (tag) => `Aktuelle Version ${tag}`,
      heroDownloadWin: (size) => `Für Windows laden (${size})`,
      heroDownloadMac: (size) => `Für macOS laden (${size})`,
      heroDownloadWin7: (size, arch) =>
        arch === 'x86' ? `Für Windows 7 32-Bit laden (${size})` : `Für Windows 7 64-Bit laden (${size})`,
      heroDownloadLinux: (size, arch) =>
        arch === 'arm64' ? `Für Linux ARM64 laden (${size})` : `Für Linux laden (${size})`,
      heroDownloadAndroid: (size) => `Android-APK laden (${size})`,
      heroDownloadIos: () => 'PC- & Android-Builds ansehen',
      heroOsHint: (os, size) => {
        if (os === 'android') return `Gerät erkannt: <strong>Android</strong> · Tippen zum Laden der offiziellen APK (${size})`;
        if (os === 'macos') return 'System erkannt: <strong>macOS (Apple Silicon &amp; Intel)</strong> · Auch für Win / Linux / Android';
        if (os === 'win7-x86') return 'System erkannt: <strong>Windows 7 (32-Bit)</strong> · Automatisch gewählt: 32-Bit WebView2-109-Paket';
        if (os === 'win7') return 'System erkannt: <strong>Windows 7 (64-Bit)</strong> · Automatisch gewählt: portables WebView2-109-Paket';
        if (os === 'linux-arm64') return 'System erkannt: <strong>Linux ARM64</strong> · Empfohlenes schlankes .deb (AppImage unten)';
        if (os === 'linux-x64') return 'System erkannt: <strong>Linux x86_64</strong> · Empfohlenes schlankes .deb (AppImage unten)';
        if (os === 'ios') return 'Gerät erkannt: <strong>iOS / iPadOS</strong> · Verfügbar für Windows, macOS, Linux &amp; Android unten';
        return 'System erkannt: <strong>Windows 10 / 11 (x64)</strong> · Auch für macOS / Linux / Android';
      },
      layout: (id) => (id === '108' ? '108 Vollformat' : '65% Kompakt'),
      orient: (o) => (o === 'viewer' ? 'Zuschauersicht' : 'Katzensicht'),
      tailPickerBtn: (open, count) =>
        open ? `✓ Auswahl (${count} gewählt)` : `🐾 Schwanztasten (${count})`,
      tailPickerTitleDefault: (count) => `🐾 Tasten unten anklicken oder physisch drücken (${count} gewählt)`,
      tailKeyAdded: (key, count) => `🐾 „${key}“ hinzugefügt · ${count} Tasten (zum Testen „Fertig“ klicken)`,
      tailKeyRemoved: (key, count) => `🐾 „${key}“ entfernt · ${count} Tasten`,
      tailPresetApplied: (preset, count) => {
        const names = { office: 'Enter & Leer', rightFn: 'Pfeile & Numpad', edgeMods: 'Äußere Tasten' };
        return `🐾 „${names[preset]}“ angewendet (${count} Tasten)`;
      },
      tailCleared: () => '🐾 Alle Schwanztasten geleert (Tasten anklicken oder drücken zum Hinzufügen)',
      autoDemoBtn: (running) => (running ? '⏸ Demo stoppen' : '▶ Auto-Demo'),
      privacyBtn: (active) => (active ? '🙈 Sichtschutz aktiv' : '🔒 Passwort-Schutz'),
      whaleSoundBtn: (muted) => (muted ? '🔇 Ton einschalten' : '🔊 Ton an'),
      copied: () => 'Kopiert ✓',
      copyConfig: () => 'Konfig kopieren',
      copyCmd: () => 'Befehl kopieren',
      copyShort: () => 'Kopieren',
      totalDownloads: (count) => `${count} Downloads gesamt`,
      statsUpdated: (timePart) => `Aktualisiert ${timePart} (UTC+8) · alle 30s neu geladen`,
    },
  },
};

export function applyStaticI18n(locale: Locale): KuroCatI18nBundle {
  const bundle = KUROCAT_I18N[locale];
  document.documentElement.lang = bundle.htmlLang;
  document.title = bundle.docTitle;
  const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (descEl) descEl.content = bundle.metaDesc;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key && key in bundle.text) {
      el.textContent = bundle.text[key];
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key && key in bundle.html) {
      el.innerHTML = bundle.html[key];
    }
  });

  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && key in bundle.placeholders) {
      el.placeholder = bundle.placeholders[key];
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key && key in bundle.titles) {
      el.title = bundle.titles[key];
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key && key in bundle.ariaLabels) {
      el.setAttribute('aria-label', bundle.ariaLabels[key]);
    }
  });

  document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (key && key in bundle.alts) {
      el.alt = bundle.alts[key];
    }
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-i18n-download]').forEach((el) => {
    const key = el.dataset.i18nDownload;
    if (key && key in bundle.downloads) {
      el.setAttribute('download', bundle.downloads[key]);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-prompt]').forEach((el) => {
    const key = el.dataset.i18nPrompt;
    if (key && key in bundle.prompts) {
      el.dataset.prompt = bundle.prompts[key];
    }
  });

  const canonEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonEl) canonEl.href = `https://kurocat.org${localeToPath(locale)}`;

  const localePrefix = locale === 'zh' ? '' : `/${locale}`;
  document.querySelectorAll<HTMLAnchorElement>('[data-locale-path]').forEach((el) => {
    const basePath = el.dataset.localePath;
    if (basePath) {
      el.setAttribute('href', `${localePrefix}${basePath}`);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === locale);
  });

  const curLbl = document.getElementById('lang-current-label');
  if (curLbl) curLbl.textContent = LOCALE_SHORT_LABELS[locale];

  return bundle;
}
