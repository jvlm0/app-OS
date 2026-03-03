// src/theme/colors.ts

// ─── Primitivos ───────────────────────────────────────────────────────────────
// Nunca use esses valores diretamente nos componentes.
// Use sempre os tokens semânticos abaixo.

const palette = {
  black:        '#000000',
  white:        '#ffffff',

  grey950:      '#333333',
  grey800:      '#666666',
  grey700:      '#999999',
  grey300:      '#e8e8e8',
  grey200:      '#e0e0e0',
  grey150:      '#f0f0f0',
  grey100:      '#f5f5f5',
  grey050:      '#f9f9f9',

  red600:       '#D32F2F',
  red500:       '#ff0000',
  red400:       '#F44336',
  red350:       '#ef5350',
  red300:       '#e53935',
  red200:       '#ffebee',

  orange500:    '#FF9800',
  orange200:    '#fff3e0',

  blue500:      '#2196F3',
  blue200:      '#e3f2fd',

  green600:     '#2e7d32',
  green500:     '#4CAF50',
  green400:     '#558b2f',
  green200:     '#e8f5e9',

  teal400:      '#22c55e',

  amber500:     '#f9a825',
  amber200:     '#fff8e1',
  amber100:     '#ffe082',

  slate500:     '#9E9E9E',

  darkSurface0: '#000000',
  darkSurface1: '#111111',
  darkSurface2: '#1a1a1a',
  darkSurface3: '#1c1c1c',
  darkSurface4: '#242424',
  darkBorder1:  '#2a2a2a',
  darkBorder2:  '#2e2e2e',
  darkText1:    '#aaaaaa',
  darkText2:    '#888888',
  darkText3:    '#555555',
} as const;

// ─── Tokens semânticos — Light ────────────────────────────────────────────────

export const lightColors = {
  // Superfícies
  background:             palette.white,
  backgroundMuted:        palette.grey100,
  backgroundScreen:       palette.grey100,
  backgroundCard:         palette.grey050,
  surface:                palette.white,

  // Bordas / divisores
  border:                 palette.grey200,
  borderStrong:           palette.grey950,
  borderDashed:           palette.black,
  divider:                palette.grey150,
  dividerSubtle:          palette.grey300,
  sectionDivider:         '#eeeeee',

  // Texto
  textPrimary:            palette.black,
  textSecondary:          palette.grey800,
  textTertiary:           palette.grey700,
  textPlaceholder:        palette.grey700,
  textOnDark:             palette.white,
  textMeta:               palette.grey950,
  textDiscount:           palette.red300,
  textDiscountGreen:      palette.teal400,
  textError:              palette.red400,
  textWarning:            palette.amber500,

  // Interativo primário
  primary:                palette.black,
  primaryDisabled:        palette.grey800,
  onPrimary:              palette.white,

  // Ícones
  iconDefault:            palette.grey800,
  iconStrong:             palette.black,
  iconMuted:              '#cccccc',

  // Campos de entrada
  inputBackground:        palette.grey100,
  inputBorder:            palette.grey200,
  inputBorderError:       palette.red500,
  inputText:              palette.black,
  inputDisabledBg:        palette.grey300,
  inputDisabledText:      palette.grey800,

  // Obrigatório
  required:               palette.red500,

  // Destrutivo
  danger:                 palette.red600,
  dangerText:             palette.red600,

  // Status badges (OrderList)
  statusPendingBg:        palette.orange500,
  statusInProgressBg:     palette.blue500,
  statusCompletedBg:      palette.green500,
  statusCancelledBg:      palette.red400,
  statusDefaultBg:        palette.slate500,
  statusText:             palette.white,

  // Status (OrderDetail — fundo + borda)
  statusAbertaBg:         palette.green200,
  statusAbertaBorder:     palette.green500,
  statusConcluidaBg:      palette.blue200,
  statusConcluidaBorder:  palette.blue500,
  statusCanceladaBg:      palette.red200,
  statusCanceladaBorder:  palette.red400,
  statusNeutralBg:        palette.grey100,
  statusNeutralBorder:    palette.slate500,
  statusDetailText:       palette.grey950,

  // VehicleInfoBox
  infoBoxSuccessBg:       palette.blue200,
  infoBoxSuccessBorder:   palette.blue500,
  infoBoxSuccessTitle:    '#1565c0',
  infoBoxSuccessMsg:      '#1976d2',
  infoBoxWarningBg:       palette.orange200,
  infoBoxWarningBorder:   palette.orange500,
  infoBoxWarningTitle:    '#e65100',
  infoBoxWarningMsg:      '#ef6c00',
  infoBoxInfoBg:          palette.green200,
  infoBoxInfoBorder:      palette.green500,
  infoBoxInfoTitle:       palette.green600,
  infoBoxInfoMsg:         palette.green400,

  // EditModeBanner
  editBannerBg:           palette.blue500,
  editBannerText:         palette.white,

  // SemSolucaoBadge (OrderDetailScreen)
  semSolucaoBg:           palette.amber200,
  semSolucaoBorder:       palette.amber100,
  semSolucaoText:         palette.amber500,
} as const;

// ─── Tokens semânticos — Dark ─────────────────────────────────────────────────

export const darkColors: typeof lightColors = {
  background:             palette.darkSurface0,
  backgroundMuted:        palette.darkSurface2,
  backgroundScreen:       palette.darkSurface1,
  backgroundCard:         palette.darkSurface3,
  surface:                palette.darkSurface3,

  border:                 palette.darkBorder2,
  borderStrong:           palette.grey200,
  borderDashed:           palette.grey200,
  divider:                palette.darkBorder1,
  dividerSubtle:          palette.darkBorder2,
  sectionDivider:         palette.darkBorder2,

  textPrimary:            palette.white,
  textSecondary:          palette.darkText1,
  textTertiary:           palette.darkText2,
  textPlaceholder:        palette.darkText3,
  textOnDark:             palette.white,
  textMeta:               '#bbbbbb',
  textDiscount:           palette.red350,
  textDiscountGreen:      '#4ade80',
  textError:              palette.red350,
  textWarning:            '#fbbf24',

  primary:                palette.white,
  primaryDisabled:        palette.darkText3,
  onPrimary:              palette.black,

  iconDefault:            palette.darkText1,
  iconStrong:             palette.white,
  iconMuted:              '#444444',

  inputBackground:        palette.darkSurface4,
  inputBorder:            palette.darkBorder2,
  inputBorderError:       '#ff5252',
  inputText:              palette.white,
  inputDisabledBg:        '#2e2e2e',
  inputDisabledText:      '#777777',

  required:               '#ff5252',

  danger:                 palette.red350,
  dangerText:             palette.red350,

  statusPendingBg:        palette.orange500,
  statusInProgressBg:     palette.blue500,
  statusCompletedBg:      palette.green500,
  statusCancelledBg:      palette.red400,
  statusDefaultBg:        palette.slate500,
  statusText:             palette.white,

  statusAbertaBg:         '#1b3a2a',
  statusAbertaBorder:     '#388e3c',
  statusConcluidaBg:      '#1a2e45',
  statusConcluidaBorder:  '#1976d2',
  statusCanceladaBg:      '#3b1a1a',
  statusCanceladaBorder:  palette.red400,
  statusNeutralBg:        palette.darkSurface2,
  statusNeutralBorder:    '#555555',
  statusDetailText:       '#dddddd',

  infoBoxSuccessBg:       '#1a2e45',
  infoBoxSuccessBorder:   '#1976d2',
  infoBoxSuccessTitle:    '#90caf9',
  infoBoxSuccessMsg:      '#64b5f6',
  infoBoxWarningBg:       '#2e2010',
  infoBoxWarningBorder:   palette.orange500,
  infoBoxWarningTitle:    '#ffb74d',
  infoBoxWarningMsg:      '#ffa726',
  infoBoxInfoBg:          '#1b3a2a',
  infoBoxInfoBorder:      '#388e3c',
  infoBoxInfoTitle:       '#81c784',
  infoBoxInfoMsg:         '#a5d6a7',

  editBannerBg:           '#1565c0',
  editBannerText:         palette.white,

  semSolucaoBg:           '#2a2000',
  semSolucaoBorder:       '#5c4a00',
  semSolucaoText:         '#fbbf24',
};

export type AppColors = typeof lightColors;
