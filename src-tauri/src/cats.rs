use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CatSpot {
    /// "head" | "body" | "leftArm" | "rightArm"
    pub part: String,
    /// Normalized offset (-1..1 for head/body; 0..1 along arm from shoulder to paw)
    pub x: f64,
    /// Normalized vertical offset (-1..1 for head/body; lateral px for arm)
    pub y: f64,
    pub rx: f64,
    pub ry: f64,
    #[serde(default)]
    pub rotation: f64,
    pub color: String,
    #[serde(default = "default_opacity")]
    pub opacity: f64,
}

fn default_opacity() -> f64 {
    0.85
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CatSkinConfig {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub emoji: Option<String>,
    #[serde(default)]
    pub builtin: bool,

    // Core fur & outline
    pub fur_color: String,
    #[serde(default)]
    pub fur_secondary_color: Option<String>,
    #[serde(default)]
    pub outline_color: Option<String>,
    #[serde(default)]
    pub leg_line_color: Option<String>,

    // Pattern preset: "solid" | "bicolor" | "tuxedo" | "tabby" | "calico" | "siamese"
    #[serde(default)]
    pub pattern: Option<String>,
    #[serde(default)]
    pub mask_color: Option<String>,
    #[serde(default)]
    pub forehead_bridge_color: Option<String>,
    #[serde(default)]
    pub flank_color: Option<String>,
    #[serde(default)]
    pub belly_bib_color: Option<String>,
    #[serde(default)]
    pub stripe_color: Option<String>,
    #[serde(default)]
    pub calico_patch_color: Option<String>,

    // Ears
    #[serde(default)]
    pub ear_outer_color: Option<String>,
    #[serde(default)]
    pub ear_tip_color: Option<String>,
    #[serde(default)]
    pub ear_inner_color: Option<String>,
    #[serde(default)]
    pub ear_tuft_color: Option<String>,

    // Tail
    #[serde(default)]
    pub tail_color: Option<String>,
    #[serde(default)]
    pub tail_tip_color: Option<String>,
    #[serde(default)]
    pub tail_fluffy: Option<bool>,
    #[serde(default)]
    pub tail_stripes: Option<bool>,

    // Eyes & face
    #[serde(default = "default_eye_top")]
    pub eye_color_top: String,
    #[serde(default)]
    pub eye_color_bottom: Option<String>,
    #[serde(default)]
    pub pupil_color: Option<String>,
    #[serde(default)]
    pub eye_catchlight: Option<bool>,
    #[serde(default)]
    pub eye_rim_color: Option<String>,
    #[serde(default)]
    pub squint_color: Option<String>,
    #[serde(default)]
    pub squint_glow_color: Option<String>,
    #[serde(default)]
    pub nose_color: Option<String>,
    #[serde(default)]
    pub mouth_color: Option<String>,
    #[serde(default)]
    pub blush_color: Option<String>,
    #[serde(default)]
    pub whisker_color: Option<String>,

    // Arms & paws
    #[serde(default)]
    pub arm_color: Option<String>,
    #[serde(default)]
    pub paw_color: Option<String>,
    #[serde(default)]
    pub paw_outline_color: Option<String>,
    #[serde(default)]
    pub arm_crease_color: Option<String>,

    // Keyboard & mouse accent theme
    #[serde(default)]
    pub accent_color: Option<String>,
    #[serde(default)]
    pub accent_side_color: Option<String>,

    // Optional contour & full facial sculpting overrides (v5.1.3+; omit to keep classic round cat!)
    // faceShape: "round" | "square" | "wide" | "fox" | "oval"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub face_shape: Option<String>,
    // Horizontal head width multiplier (0.78..=1.32, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub head_width: Option<f64>,
    // Cheek/jawline squareness (0.0..=1.0; e.g. 0.85-0.95 for Tibetan fox square face)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub jaw_squareness: Option<f64>,
    // earShape: "cat" | "round" | "tall" | "small" | "wide" | "folded" | "floppy"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ear_shape: Option<String>,
    // Ear size scale multiplier (0.55..=1.55, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ear_scale: Option<f64>,
    // Horizontal ear spread multiplier (0.70..=1.35, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ear_spacing: Option<f64>,
    // Extra outward ear tilt in radians (-0.45..=0.65, default 0.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ear_tilt: Option<f64>,
    // Resting upper-eyelid droop / half-lidded cool gaze (0.0..=0.75; e.g. 0.45 for Tibetan fox)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_squint: Option<f64>,
    // Overall eye size multiplier (0.55..=1.45, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_scale: Option<f64>,
    // Eye height/width aspect ratio (0.60..=1.40; <1 narrow almond, >1 tall round)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_aspect: Option<f64>,
    // Horizontal eye spacing multiplier (0.72..=1.35, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_spacing: Option<f64>,
    // Vertical eye placement offset (-1.0 higher .. +1.0 lower, default 0.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_offset_y: Option<f64>,
    // Outer eye corner slant in radians (-0.50 droopy puppy .. +0.50 upturned fox, default 0.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eye_tilt: Option<f64>,
    // pupilShape: "oval" | "round" | "slit" | "dot" | "star"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pupil_shape: Option<String>,
    // Pupil size multiplier (0.40..=1.45, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pupil_scale: Option<f64>,
    // Heterochromia: optional viewer-right eye iris gradient override
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub right_eye_color_top: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub right_eye_color_bottom: Option<String>,
    // noseShape: "cat" | "round" | "wide" | "small" | "none"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nose_shape: Option<String>,
    // Nose size multiplier (0.50..=1.80, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nose_scale: Option<f64>,
    // Vertical nose offset (-1.0 higher .. +1.0 lower, default 0.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nose_offset_y: Option<f64>,
    // mouthShape: "w" | "smile" | "flat" | "open" | "blep" | "none"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mouth_shape: Option<String>,
    // Mouth width/size multiplier (0.55..=1.70, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mouth_scale: Option<f64>,
    // Vertical mouth offset (-1.0 higher .. +1.0 lower, default 0.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mouth_offset_y: Option<f64>,
    // Whisker length multiplier (0.0 hides whiskers .. 1.60 long whiskers, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub whisker_length: Option<f64>,
    // eyebrowStyle: "none" | "soft" | "thick" | "angry" | "worried"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eyebrow_style: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub eyebrow_color: Option<String>,
    // Permanent soft rosy cheeks even when not being petted
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub blush_always: Option<bool>,
    // Blush size multiplier (0.50..=1.60, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub blush_scale: Option<f64>,
    // Torso chubbiness multiplier (0.80..=1.25, default 1.0)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body_chubbiness: Option<f64>,

    // Unique pet birthmarks / patches
    #[serde(default)]
    pub spots: Vec<CatSpot>,
}

fn default_eye_top() -> String {
    "#d4f044".to_string()
}

pub fn cats_path() -> PathBuf {
    crate::config::app_data_dir().join("cats.json")
}

pub fn sanitize_cat_id(raw: &str) -> String {
    let cleaned: String = raw
        .trim()
        .to_lowercase()
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '-'
            }
        })
        .collect();
    let trimmed = cleaned.trim_matches('-').to_string();
    if trimmed.is_empty() {
        "custom-cat".to_string()
    } else {
        trimmed.chars().take(36).collect()
    }
}

pub fn builtin_cats() -> Vec<CatSkinConfig> {
    vec![
        CatSkinConfig {
            id: "black".to_string(),
            name: "小黑猫".to_string(),
            emoji: Some("🐈‍⬛".to_string()),
            builtin: true,
            fur_color: "#141314".to_string(),
            fur_secondary_color: None,
            outline_color: None,
            leg_line_color: Some("rgba(210, 212, 216, 0.64)".to_string()),
            pattern: Some("solid".to_string()),
            mask_color: None,
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: None,
            ear_outer_color: Some("#141314".to_string()),
            ear_tip_color: None,
            ear_inner_color: None,
            ear_tuft_color: None,
            tail_color: Some("#141314".to_string()),
            tail_tip_color: None,
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#d4f044".to_string(),
            eye_color_bottom: Some("#d4f044".to_string()),
            pupil_color: Some("#0e0e10".to_string()),
            eye_catchlight: Some(false),
            eye_rim_color: None,
            squint_color: Some("#d4f044".to_string()),
            squint_glow_color: None,
            nose_color: None,
            mouth_color: None,
            blush_color: None,
            whisker_color: Some("rgba(205, 208, 214, 0.54)".to_string()),
            arm_color: Some("#141314".to_string()),
            paw_color: Some("#141314".to_string()),
            paw_outline_color: None,
            arm_crease_color: Some("rgba(216, 218, 222, 0.64)".to_string()),
            accent_color: Some("#d2f244".to_string()),
            accent_side_color: Some("#8cb014".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "ragdoll".to_string(),
            name: "小肥鱼 · 小绅士".to_string(),
            emoji: Some("🐳".to_string()),
            builtin: true,
            fur_color: "#2957a4".to_string(),
            fur_secondary_color: Some("#1d3269".to_string()),
            outline_color: Some("#16203d".to_string()),
            leg_line_color: None,
            pattern: Some("solid".to_string()),
            mask_color: None,
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: None,
            ear_outer_color: None,
            ear_tip_color: None,
            ear_inner_color: None,
            ear_tuft_color: None,
            tail_color: Some("#2957a4".to_string()),
            tail_tip_color: Some("#5cc8ff".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#2563eb".to_string(),
            eye_color_bottom: Some("#5cc8ff".to_string()),
            pupil_color: Some("#101b36".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: None,
            squint_color: Some("#1e293b".to_string()),
            squint_glow_color: None,
            nose_color: None,
            mouth_color: None,
            blush_color: Some("#ff6e94".to_string()),
            whisker_color: None,
            arm_color: Some("#232745".to_string()),
            paw_color: Some("#fde7df".to_string()),
            paw_outline_color: Some("#3d2c35".to_string()),
            arm_crease_color: None,
            accent_color: Some("#5cc8ff".to_string()),
            accent_side_color: Some("#2563eb".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "orange-tabby".to_string(),
            name: "大橘猫".to_string(),
            emoji: Some("🍊".to_string()),
            builtin: true,
            fur_color: "#f2a452".to_string(),
            fur_secondary_color: Some("#e38c38".to_string()),
            outline_color: Some("#6b4322".to_string()),
            leg_line_color: Some("rgba(107, 67, 34, 0.60)".to_string()),
            pattern: Some("tabby".to_string()),
            mask_color: None,
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: Some("#fdf6e8".to_string()),
            stripe_color: Some("#b85d19".to_string()),
            calico_patch_color: None,
            ear_outer_color: Some("#e38c38".to_string()),
            ear_tip_color: None,
            ear_inner_color: Some("#f3b9b5".to_string()),
            ear_tuft_color: None,
            tail_color: Some("#eb9640".to_string()),
            tail_tip_color: Some("#b85d19".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(true),
            eye_color_top: "#b86b14".to_string(),
            eye_color_bottom: Some("#ffd369".to_string()),
            pupil_color: Some("#141210".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: Some("rgba(82, 52, 24, 0.78)".to_string()),
            squint_color: Some("#523318".to_string()),
            squint_glow_color: None,
            nose_color: Some("#ee8d98".to_string()),
            mouth_color: Some("rgba(92, 62, 36, 0.80)".to_string()),
            blush_color: Some("#f596a2".to_string()),
            whisker_color: Some("rgba(107, 67, 34, 0.56)".to_string()),
            arm_color: Some("#f2a452".to_string()),
            paw_color: Some("#fdf6e8".to_string()),
            paw_outline_color: Some("#6b4322".to_string()),
            arm_crease_color: None,
            accent_color: Some("#ffb347".to_string()),
            accent_side_color: Some("#cc7a16".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "calico".to_string(),
            name: "三花猫".to_string(),
            emoji: Some("🌸".to_string()),
            builtin: true,
            fur_color: "#fcfaf5".to_string(),
            fur_secondary_color: Some("#f1ece2".to_string()),
            outline_color: Some("#4f4640".to_string()),
            leg_line_color: Some("rgba(79, 70, 64, 0.60)".to_string()),
            pattern: Some("calico".to_string()),
            mask_color: Some("#ea9446".to_string()),
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: Some("#3c3634".to_string()),
            ear_outer_color: Some("#3c3634".to_string()),
            ear_tip_color: None,
            ear_inner_color: Some("#f2bfc4".to_string()),
            ear_tuft_color: None,
            tail_color: Some("#3c3634".to_string()),
            tail_tip_color: Some("#ea9446".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#5a8f3d".to_string(),
            eye_color_bottom: Some("#c9e87c".to_string()),
            pupil_color: Some("#101412".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: Some("rgba(46, 44, 42, 0.80)".to_string()),
            squint_color: Some("#383230".to_string()),
            squint_glow_color: None,
            nose_color: Some("#ef95a2".to_string()),
            mouth_color: Some("rgba(76, 68, 66, 0.80)".to_string()),
            blush_color: Some("#f498a8".to_string()),
            whisker_color: Some("rgba(86, 76, 70, 0.56)".to_string()),
            arm_color: Some("#fcfaf5".to_string()),
            paw_color: Some("#fcfaf5".to_string()),
            paw_outline_color: Some("#4f4640".to_string()),
            arm_crease_color: None,
            accent_color: Some("#ffa6c1".to_string()),
            accent_side_color: Some("#cc6c8b".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "tuxedo".to_string(),
            name: "小肥鱼 · 浅蓝版".to_string(),
            emoji: Some("🐳".to_string()),
            builtin: true,
            fur_color: "#2957a4".to_string(),
            fur_secondary_color: Some("#1d3269".to_string()),
            outline_color: Some("#16203d".to_string()),
            leg_line_color: None,
            pattern: Some("solid".to_string()),
            mask_color: None,
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: None,
            ear_outer_color: None,
            ear_tip_color: None,
            ear_inner_color: None,
            ear_tuft_color: None,
            tail_color: Some("#2957a4".to_string()),
            tail_tip_color: Some("#5cc8ff".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#2563eb".to_string(),
            eye_color_bottom: Some("#5cc8ff".to_string()),
            pupil_color: Some("#101b36".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: None,
            squint_color: Some("#1e293b".to_string()),
            squint_glow_color: None,
            nose_color: None,
            mouth_color: None,
            blush_color: Some("#ff6e94".to_string()),
            whisker_color: None,
            arm_color: Some("#232745".to_string()),
            paw_color: Some("#fde7df".to_string()),
            paw_outline_color: Some("#3d2c35".to_string()),
            arm_crease_color: None,
            accent_color: Some("#5cc8ff".to_string()),
            accent_side_color: Some("#2563eb".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "siamese".to_string(),
            name: "暹罗猫".to_string(),
            emoji: Some("🤎".to_string()),
            builtin: true,
            fur_color: "#f3eadb".to_string(),
            fur_secondary_color: Some("#e2d4be".to_string()),
            outline_color: Some("#4c3b30".to_string()),
            leg_line_color: Some("rgba(76, 59, 48, 0.58)".to_string()),
            pattern: Some("siamese".to_string()),
            mask_color: Some("#4a382c".to_string()),
            forehead_bridge_color: None,
            flank_color: Some("#cbb9a0".to_string()),
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: None,
            ear_outer_color: Some("#3e2e24".to_string()),
            ear_tip_color: Some("#2c2018".to_string()),
            ear_inner_color: Some("#bfa494".to_string()),
            ear_tuft_color: None,
            tail_color: Some("#4a382c".to_string()),
            tail_tip_color: Some("#2c2018".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#245ab8".to_string(),
            eye_color_bottom: Some("#8ad4ff".to_string()),
            pupil_color: Some("#0e1320".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: Some("rgba(28, 22, 18, 0.80)".to_string()),
            squint_color: Some("#8ad4ff".to_string()),
            squint_glow_color: None,
            nose_color: Some("#3c2b22".to_string()),
            mouth_color: Some("rgba(56, 42, 34, 0.78)".to_string()),
            blush_color: Some("#e89aa6".to_string()),
            whisker_color: Some("rgba(98, 82, 70, 0.58)".to_string()),
            arm_color: Some("#5a4638".to_string()),
            paw_color: Some("#3c2c22".to_string()),
            paw_outline_color: Some("#2c2018".to_string()),
            arm_crease_color: Some("rgba(220, 208, 194, 0.45)".to_string()),
            accent_color: Some("#72c4ff".to_string()),
            accent_side_color: Some("#3a84c8".to_string()),
            ..Default::default()
        },
        CatSkinConfig {
            id: "dafeiyu".to_string(),
            name: "大肥鱼".to_string(),
            emoji: Some("🐳".to_string()),
            builtin: true,
            fur_color: "#2957a4".to_string(),
            fur_secondary_color: Some("#1d3269".to_string()),
            outline_color: Some("#16203d".to_string()),
            leg_line_color: None,
            pattern: Some("solid".to_string()),
            mask_color: None,
            forehead_bridge_color: None,
            flank_color: None,
            belly_bib_color: None,
            stripe_color: None,
            calico_patch_color: None,
            ear_outer_color: None,
            ear_tip_color: None,
            ear_inner_color: None,
            ear_tuft_color: None,
            tail_color: Some("#2957a4".to_string()),
            tail_tip_color: Some("#5cc8ff".to_string()),
            tail_fluffy: Some(false),
            tail_stripes: Some(false),
            eye_color_top: "#2563eb".to_string(),
            eye_color_bottom: Some("#5cc8ff".to_string()),
            pupil_color: Some("#101b36".to_string()),
            eye_catchlight: Some(true),
            eye_rim_color: None,
            squint_color: Some("#1e293b".to_string()),
            squint_glow_color: None,
            nose_color: None,
            mouth_color: None,
            blush_color: Some("#ff6e94".to_string()),
            whisker_color: None,
            arm_color: Some("#232745".to_string()),
            paw_color: Some("#fde7df".to_string()),
            paw_outline_color: Some("#3d2c35".to_string()),
            arm_crease_color: None,
            accent_color: Some("#5cc8ff".to_string()),
            accent_side_color: Some("#2563eb".to_string()),
            ..Default::default()
        },
    ]
}

pub fn load_custom_cats() -> Vec<CatSkinConfig> {
    let path = cats_path();
    if let Ok(content) = fs::read_to_string(&path) {
        if let Ok(mut parsed) = serde_json::from_str::<Vec<CatSkinConfig>>(&content) {
            for c in &mut parsed {
                c.id = sanitize_cat_id(&c.id);
                c.builtin = false;
            }
            return parsed;
        }
    }
    vec![]
}

pub fn save_custom_cats(cats: &[CatSkinConfig]) -> Result<(), String> {
    static NEXT_WRITE: AtomicUsize = AtomicUsize::new(0);
    let path = cats_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(cats).map_err(|e| e.to_string())?;
    let write_id = NEXT_WRITE.fetch_add(1, Ordering::Relaxed);
    let tmp_path = path.with_extension(format!("json.{}.{write_id}.tmp", std::process::id()));
    let res = fs::write(&tmp_path, json).and_then(|()| fs::rename(&tmp_path, &path));
    if res.is_err() {
        let _ = fs::remove_file(&tmp_path);
    }
    res.map_err(|e| e.to_string())
}

pub fn all_cats() -> Vec<CatSkinConfig> {
    let mut list = builtin_cats();
    let custom = load_custom_cats();
    for mut c in custom {
        c.builtin = false;
        if let Some(existing) = list.iter_mut().find(|x| x.id == c.id) {
            // Mark overridden built-in entries as customized (`builtin = false`) so both 2D & 3D
            // renderers and localized menu labels immediately honor the user's custom appearance.
            // Deleting the custom override via `delete_cat` restores the original built-in skin.
            *existing = c;
        } else {
            list.push(c);
        }
    }
    list
}

fn is_valid_css_color(raw: &str) -> bool {
    let s = raw.trim();
    if let Some(hex) = s.strip_prefix('#') {
        return matches!(hex.len(), 3 | 6) && hex.chars().all(|c| c.is_ascii_hexdigit());
    }
    let lower = s.to_ascii_lowercase();
    if (lower.starts_with("rgb(") || lower.starts_with("rgba(")) && lower.ends_with(')') {
        return s.len() <= 48;
    }
    false
}

fn validate_opt_color(field: &str, val: &mut Option<String>) -> Result<(), String> {
    if let Some(raw) = val.as_mut() {
        let trimmed = raw.trim().to_string();
        if trimmed.is_empty() {
            *val = None;
            return Ok(());
        }
        if !is_valid_css_color(&trimmed) {
            return Err(format!(
                "Invalid color '{}' for '{}'. Expected #RGB, #RRGGBB, rgb(...), or rgba(...).",
                trimmed, field
            ));
        }
        *raw = trimmed;
    }
    Ok(())
}

pub fn normalize_face_shape(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "round" | "default" | "cat" => Some("round".to_string()),
        "square" | "box" | "tibetan-fox" | "fox-square" => Some("square".to_string()),
        "wide" | "tiger" | "broad" | "bear" => Some("wide".to_string()),
        "fox" | "pointed" | "slim" | "v" => Some("fox".to_string()),
        "oval" | "tall" | "long" => Some("oval".to_string()),
        _ => None,
    }
}

pub fn normalize_ear_shape(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "cat" | "default" | "pointed" => Some("cat".to_string()),
        "round" | "bear" | "tiger" | "panda" => Some("round".to_string()),
        "tall" | "fox" | "rabbit" | "bunny" | "long" | "corgi" => Some("tall".to_string()),
        "small" | "short" | "tiny" => Some("small".to_string()),
        "wide" | "fennec" | "flare" => Some("wide".to_string()),
        "folded" | "fold" | "scottish-fold" | "scottish" => Some("folded".to_string()),
        "floppy" | "droopy" | "lop" | "dog" | "puppy" => Some("floppy".to_string()),
        _ => None,
    }
}

pub fn normalize_pupil_shape(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "oval" | "default" | "cat" => Some("oval".to_string()),
        "round" | "circle" | "big" | "anime" => Some("round".to_string()),
        "slit" | "narrow" | "vertical" | "sharp" => Some("slit".to_string()),
        "dot" | "bead" | "button" | "small" => Some("dot".to_string()),
        "star" | "sparkle" | "diamond" => Some("star".to_string()),
        _ => None,
    }
}

pub fn normalize_nose_shape(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "cat" | "default" | "triangle" => Some("cat".to_string()),
        "round" | "button" | "dot" | "dog" | "puppy" => Some("round".to_string()),
        "wide" | "broad" | "bear" | "tiger" | "snout" => Some("wide".to_string()),
        "small" | "tiny" | "mini" => Some("small".to_string()),
        "none" | "hidden" | "off" => Some("none".to_string()),
        _ => None,
    }
}

pub fn normalize_mouth_shape(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "w" | "default" | "cat" | "omega" => Some("w".to_string()),
        "smile" | "happy" | "u" => Some("smile".to_string()),
        "flat" | "straight" | "neutral" | "serious" | "line" => Some("flat".to_string()),
        "open" | "o" | "surprised" => Some("open".to_string()),
        "blep" | "tongue" | "derp" => Some("blep".to_string()),
        "none" | "hidden" | "off" => Some("none".to_string()),
        _ => None,
    }
}

pub fn normalize_eyebrow_style(raw: &str) -> Option<String> {
    match raw.trim().to_ascii_lowercase().as_str() {
        "none" | "default" | "off" => Some("none".to_string()),
        "soft" | "arched" | "gentle" | "thin" => Some("soft".to_string()),
        "thick" | "dot" | "shiba" | "bold" | "oval" => Some("thick".to_string()),
        "angry" | "fierce" | "sharp" | "grumpy" => Some("angry".to_string()),
        "worried" | "sad" | "droopy" | "innocent" => Some("worried".to_string()),
        _ => None,
    }
}

pub fn sanitize_and_validate_cat(cat: &mut CatSkinConfig) -> Result<(), String> {
    cat.id = sanitize_cat_id(&cat.id);
    if cat.name.trim().is_empty() {
        cat.name = cat.id.clone();
    } else {
        cat.name = cat.name.trim().chars().take(40).collect();
    }
    cat.builtin = false;

    cat.fur_color = cat.fur_color.trim().to_string();
    if !is_valid_css_color(&cat.fur_color) {
        return Err(format!(
            "Invalid color '{}' for 'furColor'. Expected #RGB, #RRGGBB, rgb(...), or rgba(...).",
            cat.fur_color
        ));
    }
    cat.eye_color_top = cat.eye_color_top.trim().to_string();
    if cat.eye_color_top.is_empty() {
        cat.eye_color_top = default_eye_top();
    } else if !is_valid_css_color(&cat.eye_color_top) {
        return Err(format!(
            "Invalid color '{}' for 'eyeColorTop'. Expected #RGB, #RRGGBB, rgb(...), or rgba(...).",
            cat.eye_color_top
        ));
    }

    validate_opt_color("furSecondaryColor", &mut cat.fur_secondary_color)?;
    validate_opt_color("outlineColor", &mut cat.outline_color)?;
    validate_opt_color("legLineColor", &mut cat.leg_line_color)?;
    validate_opt_color("maskColor", &mut cat.mask_color)?;
    validate_opt_color("foreheadBridgeColor", &mut cat.forehead_bridge_color)?;
    validate_opt_color("flankColor", &mut cat.flank_color)?;
    validate_opt_color("bellyBibColor", &mut cat.belly_bib_color)?;
    validate_opt_color("stripeColor", &mut cat.stripe_color)?;
    validate_opt_color("calicoPatchColor", &mut cat.calico_patch_color)?;
    validate_opt_color("earOuterColor", &mut cat.ear_outer_color)?;
    validate_opt_color("earTipColor", &mut cat.ear_tip_color)?;
    validate_opt_color("earInnerColor", &mut cat.ear_inner_color)?;
    validate_opt_color("earTuftColor", &mut cat.ear_tuft_color)?;
    validate_opt_color("tailColor", &mut cat.tail_color)?;
    validate_opt_color("tailTipColor", &mut cat.tail_tip_color)?;
    validate_opt_color("eyeColorBottom", &mut cat.eye_color_bottom)?;
    validate_opt_color("rightEyeColorTop", &mut cat.right_eye_color_top)?;
    validate_opt_color("rightEyeColorBottom", &mut cat.right_eye_color_bottom)?;
    validate_opt_color("pupilColor", &mut cat.pupil_color)?;
    validate_opt_color("eyeRimColor", &mut cat.eye_rim_color)?;
    validate_opt_color("squintColor", &mut cat.squint_color)?;
    validate_opt_color("squintGlowColor", &mut cat.squint_glow_color)?;
    validate_opt_color("noseColor", &mut cat.nose_color)?;
    validate_opt_color("mouthColor", &mut cat.mouth_color)?;
    validate_opt_color("blushColor", &mut cat.blush_color)?;
    validate_opt_color("whiskerColor", &mut cat.whisker_color)?;
    validate_opt_color("eyebrowColor", &mut cat.eyebrow_color)?;
    validate_opt_color("armColor", &mut cat.arm_color)?;
    validate_opt_color("pawColor", &mut cat.paw_color)?;
    validate_opt_color("pawOutlineColor", &mut cat.paw_outline_color)?;
    validate_opt_color("armCreaseColor", &mut cat.arm_crease_color)?;
    validate_opt_color("accentColor", &mut cat.accent_color)?;
    validate_opt_color("accentSideColor", &mut cat.accent_side_color)?;

    if let Some(pat) = cat.pattern.as_deref() {
        let clean = pat.trim().to_ascii_lowercase();
        cat.pattern = match clean.as_str() {
            "solid" | "bicolor" | "tuxedo" | "tabby" | "calico" | "siamese" => Some(clean),
            "" => None,
            _ => {
                return Err(format!(
                    "Invalid pattern '{}'. Expected one of: solid, bicolor, tuxedo, tabby, calico, siamese.",
                    pat
                ));
            }
        };
    }

    if let Some(fs_raw) = cat.face_shape.as_deref() {
        if fs_raw.trim().is_empty() {
            cat.face_shape = None;
        } else if let Some(norm) = normalize_face_shape(fs_raw) {
            cat.face_shape = Some(norm);
        } else {
            return Err(format!(
                "Invalid faceShape '{}'. Expected one of: round, square, wide, fox, oval.",
                fs_raw
            ));
        }
    }
    if let Some(es_raw) = cat.ear_shape.as_deref() {
        if es_raw.trim().is_empty() {
            cat.ear_shape = None;
        } else if let Some(norm) = normalize_ear_shape(es_raw) {
            cat.ear_shape = Some(norm);
        } else {
            return Err(format!(
                "Invalid earShape '{}'. Expected one of: cat, round, tall, small, wide, folded, floppy.",
                es_raw
            ));
        }
    }
    if let Some(ps_raw) = cat.pupil_shape.as_deref() {
        if ps_raw.trim().is_empty() {
            cat.pupil_shape = None;
        } else if let Some(norm) = normalize_pupil_shape(ps_raw) {
            cat.pupil_shape = Some(norm);
        } else {
            return Err(format!(
                "Invalid pupilShape '{}'. Expected one of: oval, round, slit, dot, star.",
                ps_raw
            ));
        }
    }
    if let Some(ns_raw) = cat.nose_shape.as_deref() {
        if ns_raw.trim().is_empty() {
            cat.nose_shape = None;
        } else if let Some(norm) = normalize_nose_shape(ns_raw) {
            cat.nose_shape = Some(norm);
        } else {
            return Err(format!(
                "Invalid noseShape '{}'. Expected one of: cat, round, wide, small, none.",
                ns_raw
            ));
        }
    }
    if let Some(ms_raw) = cat.mouth_shape.as_deref() {
        if ms_raw.trim().is_empty() {
            cat.mouth_shape = None;
        } else if let Some(norm) = normalize_mouth_shape(ms_raw) {
            cat.mouth_shape = Some(norm);
        } else {
            return Err(format!(
                "Invalid mouthShape '{}'. Expected one of: w, smile, flat, open, blep, none.",
                ms_raw
            ));
        }
    }
    if let Some(eb_raw) = cat.eyebrow_style.as_deref() {
        if eb_raw.trim().is_empty() {
            cat.eyebrow_style = None;
        } else if let Some(norm) = normalize_eyebrow_style(eb_raw) {
            cat.eyebrow_style = Some(norm);
        } else {
            return Err(format!(
                "Invalid eyebrowStyle '{}'. Expected one of: none, soft, thick, angry, worried.",
                eb_raw
            ));
        }
    }

    cat.head_width = cat.head_width.map(|v| v.clamp(0.78, 1.32));
    cat.jaw_squareness = cat.jaw_squareness.map(|v| v.clamp(0.0, 1.0));
    cat.ear_scale = cat.ear_scale.map(|v| v.clamp(0.55, 1.55));
    cat.ear_spacing = cat.ear_spacing.map(|v| v.clamp(0.70, 1.35));
    cat.ear_tilt = cat.ear_tilt.map(|v| v.clamp(-0.45, 0.65));
    cat.eye_squint = cat.eye_squint.map(|v| v.clamp(0.0, 0.75));
    cat.eye_scale = cat.eye_scale.map(|v| v.clamp(0.55, 1.45));
    cat.eye_aspect = cat.eye_aspect.map(|v| v.clamp(0.60, 1.40));
    cat.eye_spacing = cat.eye_spacing.map(|v| v.clamp(0.72, 1.35));
    cat.eye_offset_y = cat.eye_offset_y.map(|v| v.clamp(-1.0, 1.0));
    cat.eye_tilt = cat.eye_tilt.map(|v| v.clamp(-0.50, 0.50));
    cat.pupil_scale = cat.pupil_scale.map(|v| v.clamp(0.40, 1.45));
    cat.nose_scale = cat.nose_scale.map(|v| v.clamp(0.50, 1.80));
    cat.nose_offset_y = cat.nose_offset_y.map(|v| v.clamp(-1.0, 1.0));
    cat.mouth_scale = cat.mouth_scale.map(|v| v.clamp(0.55, 1.70));
    cat.mouth_offset_y = cat.mouth_offset_y.map(|v| v.clamp(-1.0, 1.0));
    cat.whisker_length = cat.whisker_length.map(|v| v.clamp(0.0, 1.60));
    cat.blush_scale = cat.blush_scale.map(|v| v.clamp(0.50, 1.60));
    cat.body_chubbiness = cat.body_chubbiness.map(|v| v.clamp(0.80, 1.25));

    for (idx, spot) in cat.spots.iter_mut().enumerate() {
        spot.color = spot.color.trim().to_string();
        if !is_valid_css_color(&spot.color) {
            return Err(format!(
                "Invalid color '{}' for 'spots[{}].color'.",
                spot.color, idx
            ));
        }
        if !matches!(spot.part.as_str(), "head" | "body" | "leftArm" | "rightArm") {
            return Err(format!(
                "Invalid part '{}' for 'spots[{}].part'. Expected head, body, leftArm, or rightArm.",
                spot.part, idx
            ));
        }
        spot.rx = spot.rx.clamp(1.5, 90.0);
        spot.ry = spot.ry.clamp(1.5, 90.0);
        spot.opacity = spot.opacity.clamp(0.05, 1.0);
    }
    Ok(())
}

pub fn upsert_custom_cat(mut cat: CatSkinConfig) -> Result<CatSkinConfig, String> {
    sanitize_and_validate_cat(&mut cat)?;

    let mut custom = load_custom_cats();
    if let Some(existing) = custom.iter_mut().find(|c| c.id == cat.id) {
        *existing = cat.clone();
    } else {
        custom.push(cat.clone());
    }
    save_custom_cats(&custom)?;
    Ok(cat)
}

/// Partial update: merges only the provided JSON fields onto an existing cat (custom or built-in).
pub fn patch_custom_cat(
    id: &str,
    patch: &serde_json::Map<String, serde_json::Value>,
) -> Result<CatSkinConfig, String> {
    let clean_id = sanitize_cat_id(id);
    let existing = all_cats()
        .into_iter()
        .find(|c| c.id == clean_id)
        .ok_or_else(|| format!("Cat '{}' not found. Use upsert_cat to create a new cat.", clean_id))?;

    let mut base = serde_json::to_value(&existing).map_err(|e| e.to_string())?;
    let Some(obj) = base.as_object_mut() else {
        return Err("Internal serialization error".to_string());
    };
    for (k, v) in patch {
        if k == "id" || k == "builtin" {
            continue;
        }
        obj.insert(k.clone(), v.clone());
    }
    let parsed: CatSkinConfig =
        serde_json::from_value(base).map_err(|e| format!("Invalid patch field: {}", e))?;
    upsert_custom_cat(parsed)
}

pub fn delete_custom_cat(id: &str) -> Result<bool, String> {
    let clean_id = sanitize_cat_id(id);
    let mut custom = load_custom_cats();
    let before = custom.len();
    custom.retain(|c| c.id != clean_id);
    if custom.len() == before {
        return Ok(false);
    }
    save_custom_cats(&custom)?;
    Ok(true)
}

pub fn cat_exists(id: &str) -> bool {
    let clean = sanitize_cat_id(id);
    all_cats().iter().any(|c| c.id == clean)
}

pub fn cat_schema_guide() -> serde_json::Value {
    serde_json::json!({
        "description": "KuroCat Custom Cat & Animal Skin Schema (v5.1.3). Pass any JSON to upsert_cat (with activate: true) or partially modify an existing cat with patch_cat — hot-reloads live in both 2D & 3D!",
        "patterns": {
            "solid": "Single coat color (e.g., British Shorthair blue, white Persian, golden chinchilla, black cat, capybara)",
            "bicolor": "Ragdoll / bicolor inverted-V face mask (uses maskColor, foreheadBridgeColor, flankColor)",
            "tuxedo": "Dark hood & back with clean light chin/chest bib and mittens (uses furColor + bellyBibColor + pawColor)",
            "tabby": "Forehead M stripes, cheek stripes, back/flank stripes, and ringed tail (uses furColor + stripeColor + bellyBibColor + tailStripes: true)",
            "calico": "Creamy white base with asymmetric warm orange & dark espresso patches (uses furColor + maskColor + calicoPatchColor)",
            "siamese": "Creamy body with dark seal/chocolate face mask, dark ears, dark paws, dark tail, sapphire eyes"
        },
        "contourOptions": {
            "faceShape": {
                "values": ["round", "square", "wide", "fox", "oval"],
                "guide": "round = classic chubby cat; square = boxy Tibetan fox (藏狐方脸); wide = bold broad tiger/bear/lion cheeks (老虎宽腮); fox = sleek tapered fox/shiba chin; oval = taller bunny/capybara face"
            },
            "headWidth": "Horizontal head width multiplier (0.78..1.32, default 1.0)",
            "jawSquareness": "Jaw/cheek angularity (0.0..1.0; 0.85..0.95 creates a crisp square face)",
            "earShape": {
                "values": ["cat", "round", "tall", "small", "wide", "folded", "floppy"],
                "guide": "cat = pointed cat ears; round = tiger/panda/bear round ears; tall = fox/bunny/corgi tall ears; small = Tibetan fox compact ears; wide = fennec flared ears; folded = Scottish Fold bent ears (折耳猫); floppy = puppy/lop-bunny hanging ears (垂耳狗/兔)"
            },
            "earScale": "Ear size multiplier (0.55..1.55, default 1.0)",
            "earSpacing": "Horizontal ear spread multiplier (0.70..1.35, default 1.0)",
            "earTilt": "Extra outward ear tilt in radians (-0.45 upright .. +0.65 outward/droopy, default 0.0)",
            "bodyChubbiness": "Torso fullness multiplier (0.80..1.25, default 1.0)"
        },
        "facialFeatureOptions": {
            "eyeScale": "Overall eye size multiplier (0.55..1.45, default 1.0)",
            "eyeAspect": "Eye height/width ratio (0.60 sleek narrow almond .. 1.40 big tall round eyes, default 1.0)",
            "eyeSpacing": "Horizontal eye distance multiplier (0.72 close-set .. 1.35 wide-set, default 1.0)",
            "eyeOffsetY": "Vertical eye placement (-1.0 higher on forehead .. +1.0 lower cute baby face, default 0.0)",
            "eyeTilt": "Outer eye corner slant in radians (-0.50 droopy puppy eyes .. +0.50 upturned fox eyes, default 0.0)",
            "eyeSquint": "Resting upper-eyelid droop (0.0..0.75; e.g. 0.50 for Tibetan fox deadpan gaze)",
            "pupilShape": {
                "values": ["oval", "round", "slit", "dot", "star"],
                "guide": "oval = classic cat oval; round = big anime/puppy pupil; slit = sharp vertical cat slit; dot = tiny kawaii bead/button eyes (Shiba/hamster/Snoopy); star = sparkling 4-point star pupil"
            },
            "pupilScale": "Pupil size multiplier (0.40..1.45, default 1.0)",
            "heterochromia": "Set rightEyeColorTop (and optional rightEyeColorBottom) differently from eyeColorTop/eyeColorBottom for odd-eyed pets (异瞳/鸳鸯眼)!",
            "noseShape": {
                "values": ["cat", "round", "wide", "small", "none"],
                "guide": "cat = inverted triangle; round = dog/bear button nose; wide = tiger/capybara snout; small = tiny cute dot; none = hide nose"
            },
            "noseScale": "Nose size multiplier (0.50..1.80, default 1.0)",
            "noseOffsetY": "Vertical nose placement (-1.0 higher .. +1.0 lower, default 0.0)",
            "mouthShape": {
                "values": ["w", "smile", "flat", "open", "blep", "none"],
                "guide": "w = classic :3 cat mouth; smile = cheerful curved U smile; flat = deadpan straight line; open = tiny surprised o; blep = :3 with tiny sticking-out pink tongue (吐舌呆萌); none = hide mouth"
            },
            "mouthScale": "Mouth size/width multiplier (0.55..1.70, default 1.0)",
            "mouthOffsetY": "Vertical mouth placement (-1.0 higher .. +1.0 lower, default 0.0)",
            "whiskerLength": "Whisker length multiplier (0.0 hides whiskers for dogs/bears/anime .. 1.60 long whiskers, default 1.0)",
            "eyebrowStyle": {
                "values": ["none", "soft", "thick", "angry", "worried"],
                "guide": "none = hidden; soft = thin arched brows; thick = adorable Shiba/husky dot-oval brows (豆豆眉); angry = fierce slanted brows; worried = sympathetic upturned-inner brows (八字眉)"
            },
            "eyebrowColor": "Optional eyebrow CSS color",
            "blushAlways": "true keeps soft rosy cheeks permanently visible even when not being petted",
            "blushScale": "Blush size multiplier (0.50..1.60, default 1.0)"
        },
        "spotsGuide": {
            "maxIn3D": 16,
            "units": "For 'head' and 'body': x and y are normalized (-1.0..1.0; +x right, +y down in 2D and auto-mirrored in 3D). For 'leftArm'/'rightArm': x is 0.0..1.0 shoulder-to-paw. IMPORTANT: rx and ry are in 2D canvas pixels (recommended 6..42; e.g. 14 is a medium spot, 28 is a big patch).",
            "tip": "Use new custom IDs (e.g. 'bengal-tiger', 'tibetan-fox', 'my-calico') instead of built-in IDs unless you intentionally want to override a built-in skin (delete_cat resets an overridden built-in)."
        },
        "examples": {
            "bengalTiger": {
                "id": "bengal-tiger",
                "name": "霸气小老虎",
                "emoji": "🐯",
                "pattern": "tabby",
                "faceShape": "wide",
                "headWidth": 1.16,
                "jawSquareness": 0.42,
                "earShape": "round",
                "earScale": 0.92,
                "eyeSquint": 0.16,
                "bodyChubbiness": 1.12,
                "furColor": "#f49235",
                "furSecondaryColor": "#df7820",
                "outlineColor": "#4c2c12",
                "bellyBibColor": "#fff7ea",
                "stripeColor": "#231a16",
                "earOuterColor": "#231a16",
                "earInnerColor": "#f4c8b4",
                "tailColor": "#eb882c",
                "tailTipColor": "#231a16",
                "tailStripes": true,
                "eyeColorTop": "#c97a10",
                "eyeColorBottom": "#ffdf6b",
                "eyeCatchlight": true,
                "noseColor": "#e87884",
                "blushColor": "#f596a2",
                "armColor": "#f49235",
                "pawColor": "#fff7ea",
                "accentColor": "#ff9e2c",
                "accentSideColor": "#c4620a",
                "spots": [
                    { "part": "head", "x": 0.0, "y": -0.58, "rx": 18, "ry": 5, "color": "#231a16", "opacity": 0.9 },
                    { "part": "head", "x": -0.68, "y": 0.12, "rx": 14, "ry": 12, "color": "#fff7ea", "opacity": 0.95 },
                    { "part": "head", "x": 0.68, "y": 0.12, "rx": 14, "ry": 12, "color": "#fff7ea", "opacity": 0.95 }
                ]
            },
            "tibetanFox": {
                "id": "tibetan-fox",
                "name": "淡定藏狐",
                "emoji": "🦊",
                "pattern": "solid",
                "faceShape": "square",
                "headWidth": 1.22,
                "jawSquareness": 0.94,
                "earShape": "small",
                "earScale": 0.76,
                "eyeSquint": 0.50,
                "bodyChubbiness": 1.04,
                "furColor": "#c9a67d",
                "furSecondaryColor": "#a88966",
                "outlineColor": "#4e4032",
                "bellyBibColor": "#efe9de",
                "earOuterColor": "#a3825c",
                "earTipColor": "#63503b",
                "earInnerColor": "#dfd3c3",
                "tailColor": "#b89670",
                "tailTipColor": "#f4f1ea",
                "tailFluffy": true,
                "eyeColorTop": "#7c6742",
                "eyeColorBottom": "#cdb278",
                "eyeCatchlight": false,
                "noseColor": "#2c2420",
                "mouthColor": "#4d3e34",
                "whiskerColor": "rgba(78, 64, 50, 0.5)",
                "armColor": "#b8956e",
                "pawColor": "#ede6da",
                "accentColor": "#d9a86c",
                "accentSideColor": "#9a6d38",
                "spots": [
                    { "part": "head", "x": 0.0, "y": 0.44, "rx": 34, "ry": 15, "color": "#f2ece2", "opacity": 0.94 },
                    { "part": "head", "x": -0.74, "y": 0.20, "rx": 16, "ry": 18, "color": "#ded3c4", "opacity": 0.72 },
                    { "part": "head", "x": 0.74, "y": 0.20, "rx": 16, "ry": 18, "color": "#ded3c4", "opacity": 0.72 }
                ]
            },
            "myCalico": {
                "id": "my-calico",
                "name": "定制三花",
                "emoji": "🌸",
                "pattern": "calico",
                "furColor": "#fcfaf5",
                "outlineColor": "#4f4640",
                "maskColor": "#ea9446",
                "calicoPatchColor": "#3c3634",
                "earOuterColor": "#3c3634",
                "earInnerColor": "#f2bfc4",
                "tailColor": "#3c3634",
                "tailTipColor": "#ea9446",
                "eyeColorTop": "#5a8f3d",
                "eyeColorBottom": "#c9e87c",
                "eyeCatchlight": true,
                "noseColor": "#ef95a2",
                "blushColor": "#f498a8",
                "pawColor": "#fcfaf5",
                "accentColor": "#ffa6c1",
                "accentSideColor": "#cc6c8b"
            },
            "scottishFoldOddEye": {
                "id": "scottish-fold-odd-eye",
                "name": "异瞳折耳吐舌猫",
                "emoji": "🤍",
                "pattern": "solid",
                "faceShape": "round",
                "headWidth": 1.10,
                "earShape": "folded",
                "earScale": 0.92,
                "eyeScale": 1.20,
                "eyeAspect": 1.08,
                "eyeOffsetY": 0.16,
                "pupilShape": "round",
                "pupilScale": 1.08,
                "furColor": "#fcfaf5",
                "outlineColor": "#5c544e",
                "earInnerColor": "#f4c8d0",
                "eyeColorTop": "#2c7be5",
                "eyeColorBottom": "#8ad4ff",
                "rightEyeColorTop": "#d9921c",
                "rightEyeColorBottom": "#ffe066",
                "eyeCatchlight": true,
                "noseShape": "small",
                "noseColor": "#f498a8",
                "mouthShape": "blep",
                "mouthColor": "#5c4d4a",
                "blushColor": "#f7a0b2",
                "blushAlways": true,
                "blushScale": 1.15,
                "accentColor": "#8ad4ff",
                "accentSideColor": "#4690d8"
            },
            "shibaInu": {
                "id": "shiba-inu",
                "name": "豆豆眉柴犬",
                "emoji": "🐕",
                "pattern": "bicolor",
                "faceShape": "fox",
                "headWidth": 1.08,
                "earShape": "tall",
                "earScale": 0.96,
                "earSpacing": 1.08,
                "eyeScale": 0.86,
                "eyeAspect": 0.92,
                "eyeSpacing": 1.06,
                "eyeTilt": 0.10,
                "pupilShape": "dot",
                "pupilScale": 0.95,
                "eyebrowStyle": "thick",
                "eyebrowColor": "#fff7e8",
                "whiskerLength": 0.0,
                "noseShape": "round",
                "noseScale": 1.32,
                "noseColor": "#282220",
                "mouthShape": "smile",
                "mouthScale": 1.18,
                "mouthColor": "#443730",
                "blushColor": "#f49aa6",
                "blushAlways": true,
                "furColor": "#e39848",
                "maskColor": "#e39848",
                "bellyBibColor": "#fff8ec",
                "outlineColor": "#593b1d",
                "earInnerColor": "#f0c8b0",
                "tailFluffy": true,
                "eyeColorTop": "#3b2c20",
                "eyeColorBottom": "#5c4532",
                "eyeCatchlight": true,
                "pawColor": "#fff8ec",
                "accentColor": "#f5b041",
                "accentSideColor": "#ba7318"
            }
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validates_colors_and_clamps_contour_fields() {
        let mut cat = builtin_cats().remove(0);
        cat.id = "tibetan-fox".to_string();
        cat.face_shape = Some("SQUARE".to_string());
        cat.ear_shape = Some("Floppy".to_string());
        cat.pupil_shape = Some("SLIT".to_string());
        cat.nose_shape = Some("Wide".to_string());
        cat.mouth_shape = Some("BLEP".to_string());
        cat.eyebrow_style = Some("Shiba".to_string());
        cat.right_eye_color_top = Some("#2c7be5".to_string());
        cat.eyebrow_color = Some("#fff7e8".to_string());
        cat.head_width = Some(2.5);
        cat.jaw_squareness = Some(1.4);
        cat.ear_scale = Some(0.1);
        cat.ear_spacing = Some(2.0);
        cat.ear_tilt = Some(1.5);
        cat.eye_squint = Some(0.95);
        cat.eye_scale = Some(3.0);
        cat.eye_aspect = Some(0.1);
        cat.eye_spacing = Some(2.0);
        cat.eye_offset_y = Some(-5.0);
        cat.eye_tilt = Some(2.0);
        cat.pupil_scale = Some(0.1);
        cat.nose_scale = Some(3.0);
        cat.mouth_scale = Some(0.1);
        cat.whisker_length = Some(-1.0);
        cat.blush_scale = Some(4.0);
        cat.body_chubbiness = Some(2.0);
        sanitize_and_validate_cat(&mut cat).expect("valid custom cat should pass");
        assert_eq!(cat.face_shape.as_deref(), Some("square"));
        assert_eq!(cat.ear_shape.as_deref(), Some("floppy"));
        assert_eq!(cat.pupil_shape.as_deref(), Some("slit"));
        assert_eq!(cat.nose_shape.as_deref(), Some("wide"));
        assert_eq!(cat.mouth_shape.as_deref(), Some("blep"));
        assert_eq!(cat.eyebrow_style.as_deref(), Some("thick"));
        assert_eq!(cat.head_width, Some(1.32));
        assert_eq!(cat.jaw_squareness, Some(1.0));
        assert_eq!(cat.ear_scale, Some(0.55));
        assert_eq!(cat.ear_spacing, Some(1.35));
        assert_eq!(cat.ear_tilt, Some(0.65));
        assert_eq!(cat.eye_squint, Some(0.75));
        assert_eq!(cat.eye_scale, Some(1.45));
        assert_eq!(cat.eye_aspect, Some(0.60));
        assert_eq!(cat.eye_spacing, Some(1.35));
        assert_eq!(cat.eye_offset_y, Some(-1.0));
        assert_eq!(cat.eye_tilt, Some(0.50));
        assert_eq!(cat.pupil_scale, Some(0.40));
        assert_eq!(cat.nose_scale, Some(1.80));
        assert_eq!(cat.mouth_scale, Some(0.55));
        assert_eq!(cat.whisker_length, Some(0.0));
        assert_eq!(cat.blush_scale, Some(1.60));
        assert_eq!(cat.body_chubbiness, Some(1.25));

        cat.fur_color = "not-a-color".to_string();
        assert!(sanitize_and_validate_cat(&mut cat).is_err());
    }
}
