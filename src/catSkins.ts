export interface CatSpot {
  part: 'head' | 'body' | 'leftArm' | 'rightArm';
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation?: number;
  color: string;
  opacity?: number;
}

export type CatPattern = 'solid' | 'bicolor' | 'tuxedo' | 'tabby' | 'calico' | 'siamese';
export type CatFaceShape = 'round' | 'square' | 'wide' | 'fox' | 'oval';
export type CatEarShape = 'cat' | 'round' | 'tall' | 'small' | 'wide' | 'folded' | 'floppy';
export type CatPupilShape = 'oval' | 'round' | 'slit' | 'dot' | 'star';
export type CatNoseShape = 'cat' | 'round' | 'wide' | 'small' | 'none';
export type CatMouthShape = 'w' | 'smile' | 'flat' | 'open' | 'blep' | 'none';
export type CatEyebrowStyle = 'none' | 'soft' | 'thick' | 'angry' | 'worried';

export interface CatContourResolved {
  faceShape: CatFaceShape;
  headWidth: number;
  jawSquareness: number;
  earShape: CatEarShape;
  earScale: number;
  earSpacing: number;
  earTilt: number;
  eyeSquint: number;
  eyeScale: number;
  eyeAspect: number;
  eyeSpacing: number;
  eyeOffsetY: number;
  eyeTilt: number;
  pupilShape: CatPupilShape;
  pupilScale: number;
  noseShape: CatNoseShape;
  noseScale: number;
  noseOffsetY: number;
  mouthShape: CatMouthShape;
  mouthScale: number;
  mouthOffsetY: number;
  whiskerLength: number;
  eyebrowStyle: CatEyebrowStyle;
  blushAlways: boolean;
  blushScale: number;
  bodyChubbiness: number;
}

export interface CatSkinConfig {
  id: string;
  name: string;
  emoji?: string;
  builtin?: boolean;

  furColor: string;
  furSecondaryColor?: string;
  outlineColor?: string;
  legLineColor?: string;

  pattern?: CatPattern;
  maskColor?: string;
  foreheadBridgeColor?: string;
  flankColor?: string;
  bellyBibColor?: string;
  stripeColor?: string;
  calicoPatchColor?: string;

  earOuterColor?: string;
  earTipColor?: string;
  earInnerColor?: string;
  earTuftColor?: string;

  tailColor?: string;
  tailTipColor?: string;
  tailFluffy?: boolean;
  tailStripes?: boolean;

  eyeColorTop: string;
  eyeColorBottom?: string;
  pupilColor?: string;
  eyeCatchlight?: boolean;
  eyeRimColor?: string;
  squintColor?: string;
  squintGlowColor?: string;
  noseColor?: string;
  mouthColor?: string;
  blushColor?: string;
  whiskerColor?: string;

  armColor?: string;
  pawColor?: string;
  pawOutlineColor?: string;
  armCreaseColor?: string;

  accentColor?: string;
  accentSideColor?: string;

  // Optional contour & full facial sculpting overrides (v5.1.3+)
  faceShape?: CatFaceShape;
  headWidth?: number;
  jawSquareness?: number;
  earShape?: CatEarShape;
  earScale?: number;
  earSpacing?: number;
  earTilt?: number;
  eyeSquint?: number;
  eyeScale?: number;
  eyeAspect?: number;
  eyeSpacing?: number;
  eyeOffsetY?: number;
  eyeTilt?: number;
  pupilShape?: CatPupilShape;
  pupilScale?: number;
  rightEyeColorTop?: string;
  rightEyeColorBottom?: string;
  noseShape?: CatNoseShape;
  noseScale?: number;
  noseOffsetY?: number;
  mouthShape?: CatMouthShape;
  mouthScale?: number;
  mouthOffsetY?: number;
  whiskerLength?: number;
  eyebrowStyle?: CatEyebrowStyle;
  eyebrowColor?: string;
  blushAlways?: boolean;
  blushScale?: number;
  bodyChubbiness?: number;

  spots?: CatSpot[];
}

export interface ResolvedSkin {
  id: string;
  name: string;
  isDarkBase: boolean;
  furColor: string;
  furSecondaryColor: string;
  outlineColor: string | null;
  legLineColor: string;
  pattern: CatPattern;
  maskColor: string | null;
  foreheadBridgeColor: string | null;
  flankColor: string | null;
  bellyBibColor: string | null;
  stripeColor: string | null;
  calicoPatchColor: string | null;
  earOuterColor: string;
  earTipColor: string | null;
  earInnerColor: string | null;
  earTuftColor: string | null;
  tailColor: string;
  tailTipColor: string;
  tailFluffy: boolean;
  tailStripes: boolean;
  eyeColorTop: string;
  eyeColorBottom: string;
  rightEyeColorTop: string;
  rightEyeColorBottom: string;
  pupilColor: string;
  eyeCatchlight: boolean;
  eyeRimColor: string | null;
  squintColor: string;
  squintGlowColor: string | null;
  noseColor: string | null;
  mouthColor: string | null;
  blushColor: string | null;
  whiskerColor: string;
  eyebrowColor: string;
  armColor: string;
  pawColor: string;
  pawOutlineColor: string | null;
  armCreaseColor: string | null;
  accentColor: string;
  accentSideColor: string;
  contour: CatContourResolved;
  spots: CatSpot[];
}

function clampNum(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function resolveCatContour(raw?: Partial<CatSkinConfig> | null): CatContourResolved {
  const fsRaw = (raw?.faceShape || 'round').toLowerCase();
  const faceShape: CatFaceShape =
    fsRaw === 'square' || fsRaw === 'wide' || fsRaw === 'fox' || fsRaw === 'oval'
      ? fsRaw
      : 'round';

  const esRaw = (raw?.earShape || 'cat').toLowerCase();
  const earShape: CatEarShape =
    esRaw === 'round' ||
    esRaw === 'tall' ||
    esRaw === 'small' ||
    esRaw === 'wide' ||
    esRaw === 'folded' ||
    esRaw === 'floppy'
      ? esRaw
      : 'cat';

  const psRaw = (raw?.pupilShape || 'oval').toLowerCase();
  const pupilShape: CatPupilShape =
    psRaw === 'round' || psRaw === 'slit' || psRaw === 'dot' || psRaw === 'star'
      ? psRaw
      : 'oval';

  const nsRaw = (raw?.noseShape || 'cat').toLowerCase();
  const noseShape: CatNoseShape =
    nsRaw === 'round' || nsRaw === 'wide' || nsRaw === 'small' || nsRaw === 'none'
      ? nsRaw
      : 'cat';

  const msRaw = (raw?.mouthShape || 'w').toLowerCase();
  const mouthShape: CatMouthShape =
    msRaw === 'smile' || msRaw === 'flat' || msRaw === 'open' || msRaw === 'blep' || msRaw === 'none'
      ? msRaw
      : 'w';

  const ebRaw = (raw?.eyebrowStyle || 'none').toLowerCase();
  const eyebrowStyle: CatEyebrowStyle =
    ebRaw === 'soft' || ebRaw === 'thick' || ebRaw === 'angry' || ebRaw === 'worried'
      ? ebRaw
      : 'none';

  const numOr = (val: number | undefined, lo: number, hi: number, fallback: number): number =>
    typeof val === 'number' && Number.isFinite(val) ? clampNum(val, lo, hi) : fallback;

  const defaultHeadWidth =
    faceShape === 'square'
      ? 1.14
      : faceShape === 'wide'
        ? 1.12
        : faceShape === 'fox'
          ? 0.98
          : faceShape === 'oval'
            ? 0.93
            : 1.0;

  const defaultJawSquareness =
    faceShape === 'square' ? 0.88 : faceShape === 'wide' ? 0.36 : 0.0;

  return {
    faceShape,
    headWidth: numOr(raw?.headWidth, 0.78, 1.32, defaultHeadWidth),
    jawSquareness: numOr(raw?.jawSquareness, 0.0, 1.0, defaultJawSquareness),
    earShape,
    earScale: numOr(raw?.earScale, 0.55, 1.55, 1.0),
    earSpacing: numOr(raw?.earSpacing, 0.70, 1.35, 1.0),
    earTilt: numOr(raw?.earTilt, -0.45, 0.65, 0.0),
    eyeSquint: numOr(raw?.eyeSquint, 0.0, 0.75, 0.0),
    eyeScale: numOr(raw?.eyeScale, 0.55, 1.45, 1.0),
    eyeAspect: numOr(raw?.eyeAspect, 0.60, 1.40, 1.0),
    eyeSpacing: numOr(raw?.eyeSpacing, 0.72, 1.35, 1.0),
    eyeOffsetY: numOr(raw?.eyeOffsetY, -1.0, 1.0, 0.0),
    eyeTilt: numOr(raw?.eyeTilt, -0.50, 0.50, 0.0),
    pupilShape,
    pupilScale: numOr(raw?.pupilScale, 0.40, 1.45, 1.0),
    noseShape,
    noseScale: numOr(raw?.noseScale, 0.50, 1.80, 1.0),
    noseOffsetY: numOr(raw?.noseOffsetY, -1.0, 1.0, 0.0),
    mouthShape,
    mouthScale: numOr(raw?.mouthScale, 0.55, 1.70, 1.0),
    mouthOffsetY: numOr(raw?.mouthOffsetY, -1.0, 1.0, 0.0),
    whiskerLength: numOr(raw?.whiskerLength, 0.0, 1.60, 1.0),
    eyebrowStyle,
    blushAlways: Boolean(raw?.blushAlways),
    blushScale: numOr(raw?.blushScale, 0.50, 1.60, 1.0),
    bodyChubbiness: numOr(raw?.bodyChubbiness, 0.80, 1.25, 1.0),
  };
}

function parseHexLuminance(hex: string): number {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return 0.5;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function isLightColor(hex: string): boolean {
  return parseHexLuminance(hex) > 0.48;
}

export function resolveCustomSkin(raw: CatSkinConfig): ResolvedSkin {
  const fur = raw.furColor || '#f2a452';
  const darkBase = !isLightColor(fur);
  const pattern: CatPattern = raw.pattern || 'solid';
  const defaultOutline = darkBase ? null : '#524840';
  const outlineColor = raw.outlineColor !== undefined ? (raw.outlineColor || null) : defaultOutline;
  const pawColor = raw.pawColor || (pattern === 'tuxedo' ? '#faf9f5' : fur);
  const armColor = raw.armColor || fur;
  const pawIsLight = isLightColor(pawColor);

  return {
    id: raw.id,
    name: raw.name || raw.id,
    isDarkBase: darkBase,
    furColor: fur,
    furSecondaryColor: raw.furSecondaryColor || fur,
    outlineColor,
    legLineColor:
      raw.legLineColor || (darkBase ? 'rgba(214, 218, 224, 0.62)' : 'rgba(82, 72, 64, 0.62)'),
    pattern,
    maskColor: raw.maskColor || (pattern === 'siamese' ? '#4a382c' : pattern === 'bicolor' ? '#9e8e7f' : null),
    foreheadBridgeColor: raw.foreheadBridgeColor || null,
    flankColor: raw.flankColor || null,
    bellyBibColor:
      raw.bellyBibColor || (pattern === 'tuxedo' ? '#faf9f5' : null),
    stripeColor:
      raw.stripeColor || (pattern === 'tabby' ? '#9e5318' : null),
    calicoPatchColor:
      raw.calicoPatchColor || (pattern === 'calico' ? '#3a3533' : null),
    earOuterColor: raw.earOuterColor || raw.maskColor || fur,
    earTipColor: raw.earTipColor || null,
    earInnerColor: raw.earInnerColor || (darkBase ? null : '#efc4c8'),
    earTuftColor: raw.earTuftColor || null,
    tailColor: raw.tailColor || raw.earOuterColor || raw.maskColor || fur,
    tailTipColor: raw.tailTipColor || raw.earTipColor || raw.tailColor || fur,
    tailFluffy: Boolean(raw.tailFluffy),
    tailStripes: Boolean(raw.tailStripes || pattern === 'tabby'),
    eyeColorTop: raw.eyeColorTop || '#5a94d6',
    eyeColorBottom: raw.eyeColorBottom || raw.eyeColorTop || '#a3d2f2',
    rightEyeColorTop: raw.rightEyeColorTop || raw.eyeColorTop || '#5a94d6',
    rightEyeColorBottom:
      raw.rightEyeColorBottom ||
      raw.rightEyeColorTop ||
      raw.eyeColorBottom ||
      raw.eyeColorTop ||
      '#a3d2f2',
    pupilColor: raw.pupilColor || '#10141e',
    eyeCatchlight: raw.eyeCatchlight ?? !darkBase,
    eyeRimColor: raw.eyeRimColor || (darkBase ? null : 'rgba(42, 46, 58, 0.78)'),
    squintColor: raw.squintColor || (darkBase ? raw.eyeColorTop || '#d4f044' : '#2c2928'),
    squintGlowColor: raw.squintGlowColor || null,
    noseColor: raw.noseColor !== undefined ? (raw.noseColor || null) : (darkBase ? null : '#ee8e9e'),
    mouthColor: raw.mouthColor || (darkBase ? null : 'rgba(72, 68, 76, 0.78)'),
    blushColor: raw.blushColor || (darkBase ? null : '#f492a6'),
    whiskerColor:
      raw.whiskerColor || (darkBase ? 'rgba(210, 214, 220, 0.56)' : 'rgba(84, 76, 70, 0.56)'),
    eyebrowColor: raw.eyebrowColor || (darkBase ? '#e8e2d4' : outlineColor || '#4a3d35'),
    armColor,
    pawColor,
    pawOutlineColor:
      raw.pawOutlineColor !== undefined
        ? (raw.pawOutlineColor || null)
        : (pawIsLight ? outlineColor || '#524840' : null),
    armCreaseColor:
      raw.armCreaseColor !== undefined
        ? (raw.armCreaseColor || null)
        : (!pawIsLight ? 'rgba(216, 218, 222, 0.62)' : null),
    accentColor: raw.accentColor || '#d2f244',
    accentSideColor: raw.accentSideColor || '#8cb014',
    contour: resolveCatContour(raw),
    spots: Array.isArray(raw.spots) ? raw.spots : [],
  };
}

export const DEFAULT_BUILTIN_CATS: CatSkinConfig[] = [
  {
    id: 'black',
    name: '小黑猫',
    emoji: '🐈‍⬛',
    builtin: true,
    furColor: '#141314',
    eyeColorTop: '#d4f044',
    accentColor: '#d2f244',
    accentSideColor: '#8cb014',
  },
  {
    id: 'ragdoll',
    name: '小肥鱼 · 小绅士',
    emoji: '🐳',
    builtin: true,
    furColor: '#2957a4',
    eyeColorTop: '#2563eb',
    accentColor: '#5cc8ff',
    accentSideColor: '#2563eb',
  },
  {
    id: 'dafeiyu',
    name: '大肥鱼',
    emoji: '🐳',
    builtin: true,
    furColor: '#2957a4',
    eyeColorTop: '#2563eb',
    accentColor: '#5cc8ff',
    accentSideColor: '#2563eb',
  },
];

// Keep the existing ragdoll slot ID for saved preferences and MCP callers.
export function isWhaleBreed(id: string | undefined): boolean {
  return id === 'dafeiyu' || id === 'ragdoll';
}
