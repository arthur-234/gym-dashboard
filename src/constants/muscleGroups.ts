// Constantes para grupos musculares padronizados

export const MUSCLE_GROUPS = {
  CHEST: 'Peito',
  BACK: 'Costas',
  SHOULDERS: 'Ombros',
  ARMS: 'Braços',
  BICEPS: 'Bíceps',
  TRICEPS: 'Tríceps',
  LEGS: 'Pernas',
  QUADRICEPS: 'Quadríceps',
  HAMSTRINGS: 'Isquiotibiais',
  GLUTES: 'Glúteos',
  CALVES: 'Panturrilhas',
  CORE: 'Core',
  ABS: 'Abdômen',
  CARDIO: 'Cardio',
  FULL_BODY: 'Corpo Inteiro',
  FOREARMS: 'Antebraços',
  TRAPS: 'Trapézio',
  LATS: 'Dorsais',
  DELTS: 'Deltoides',
  RHOMBOIDS: 'Romboides'
} as const;

export const MUSCLE_GROUP_OPTIONS = [
  { value: 'all', label: 'Todos os grupos', icon: '🌟' },
  { value: 'chest', label: MUSCLE_GROUPS.CHEST, icon: '💪' },
  { value: 'back', label: MUSCLE_GROUPS.BACK, icon: '🔙' },
  { value: 'shoulders', label: MUSCLE_GROUPS.SHOULDERS, icon: '🤷' },
  { value: 'arms', label: MUSCLE_GROUPS.ARMS, icon: '💪' },
  { value: 'biceps', label: MUSCLE_GROUPS.BICEPS, icon: '💪' },
  { value: 'triceps', label: MUSCLE_GROUPS.TRICEPS, icon: '💪' },
  { value: 'legs', label: MUSCLE_GROUPS.LEGS, icon: '🦵' },
  { value: 'quadriceps', label: MUSCLE_GROUPS.QUADRICEPS, icon: '🦵' },
  { value: 'hamstrings', label: MUSCLE_GROUPS.HAMSTRINGS, icon: '🦵' },
  { value: 'glutes', label: MUSCLE_GROUPS.GLUTES, icon: '🍑' },
  { value: 'calves', label: MUSCLE_GROUPS.CALVES, icon: '🦵' },
  { value: 'core', label: MUSCLE_GROUPS.CORE, icon: '🔥' },
  { value: 'abs', label: MUSCLE_GROUPS.ABS, icon: '🔥' },
  { value: 'cardio', label: MUSCLE_GROUPS.CARDIO, icon: '❤️' },
  { value: 'full-body', label: MUSCLE_GROUPS.FULL_BODY, icon: '🏋️' },
  { value: 'forearms', label: MUSCLE_GROUPS.FOREARMS, icon: '💪' },
  { value: 'traps', label: MUSCLE_GROUPS.TRAPS, icon: '🔺' },
  { value: 'lats', label: MUSCLE_GROUPS.LATS, icon: '🔙' },
  { value: 'delts', label: MUSCLE_GROUPS.DELTS, icon: '🤷' },
  { value: 'rhomboids', label: MUSCLE_GROUPS.RHOMBOIDS, icon: '🔙' }
];

// Mapeamento de grupos musculares em inglês para português
export const MUSCLE_GROUP_MAPPING: { [key: string]: string } = {
  'chest': MUSCLE_GROUPS.CHEST,
  'back': MUSCLE_GROUPS.BACK,
  'shoulders': MUSCLE_GROUPS.SHOULDERS,
  'arms': MUSCLE_GROUPS.ARMS,
  'biceps': MUSCLE_GROUPS.BICEPS,
  'triceps': MUSCLE_GROUPS.TRICEPS,
  'legs': MUSCLE_GROUPS.LEGS,
  'quadriceps': MUSCLE_GROUPS.QUADRICEPS,
  'hamstrings': MUSCLE_GROUPS.HAMSTRINGS,
  'glutes': MUSCLE_GROUPS.GLUTES,
  'calves': MUSCLE_GROUPS.CALVES,
  'core': MUSCLE_GROUPS.CORE,
  'abs': MUSCLE_GROUPS.ABS,
  'cardio': MUSCLE_GROUPS.CARDIO,
  'full-body': MUSCLE_GROUPS.FULL_BODY,
  'forearms': MUSCLE_GROUPS.FOREARMS,
  'traps': MUSCLE_GROUPS.TRAPS,
  'lats': MUSCLE_GROUPS.LATS,
  'delts': MUSCLE_GROUPS.DELTS,
  'rhomboids': MUSCLE_GROUPS.RHOMBOIDS,
  // Variações em português
  'peito': MUSCLE_GROUPS.CHEST,
  'costas': MUSCLE_GROUPS.BACK,
  'ombros': MUSCLE_GROUPS.SHOULDERS,
  'braços': MUSCLE_GROUPS.ARMS,
  'bíceps': MUSCLE_GROUPS.BICEPS,
  'tríceps': MUSCLE_GROUPS.TRICEPS,
  'pernas': MUSCLE_GROUPS.LEGS,
  'quadríceps': MUSCLE_GROUPS.QUADRICEPS,
  'isquiotibiais': MUSCLE_GROUPS.HAMSTRINGS,
  'glúteos': MUSCLE_GROUPS.GLUTES,
  'panturrilhas': MUSCLE_GROUPS.CALVES,
  'abdômen': MUSCLE_GROUPS.ABS,
  'corpo inteiro': MUSCLE_GROUPS.FULL_BODY,
  'antebraços': MUSCLE_GROUPS.FOREARMS,
  'trapézio': MUSCLE_GROUPS.TRAPS,
  'dorsais': MUSCLE_GROUPS.LATS,
  'deltoides': MUSCLE_GROUPS.DELTS,
  'romboides': MUSCLE_GROUPS.RHOMBOIDS
};

// Função para normalizar grupos musculares
export function normalizeMuscleGroup(muscleGroup: string): string {
  const normalized = muscleGroup.toLowerCase().trim();
  return MUSCLE_GROUP_MAPPING[normalized] || muscleGroup;
}

// Função para obter grupos musculares únicos de uma lista de exercícios
export function getUniqueMuscleGroups(exercises: any[]): string[] {
  const allGroups = exercises.flatMap(exercise => 
    exercise.muscleGroups?.map((group: string) => normalizeMuscleGroup(group)) || []
  );
  return Array.from(new Set(allGroups)).sort();
}

// Cores para visualização dos grupos musculares
export const MUSCLE_GROUP_COLORS: { [key: string]: string } = {
  [MUSCLE_GROUPS.CHEST]: '#FF6B6B',
  [MUSCLE_GROUPS.BACK]: '#4ECDC4',
  [MUSCLE_GROUPS.SHOULDERS]: '#45B7D1',
  [MUSCLE_GROUPS.ARMS]: '#96CEB4',
  [MUSCLE_GROUPS.BICEPS]: '#FFEAA7',
  [MUSCLE_GROUPS.TRICEPS]: '#DDA0DD',
  [MUSCLE_GROUPS.LEGS]: '#98D8C8',
  [MUSCLE_GROUPS.QUADRICEPS]: '#F7DC6F',
  [MUSCLE_GROUPS.HAMSTRINGS]: '#BB8FCE',
  [MUSCLE_GROUPS.GLUTES]: '#F8C471',
  [MUSCLE_GROUPS.CALVES]: '#85C1E9',
  [MUSCLE_GROUPS.CORE]: '#F1948A',
  [MUSCLE_GROUPS.ABS]: '#82E0AA',
  [MUSCLE_GROUPS.CARDIO]: '#FF7675',
  [MUSCLE_GROUPS.FULL_BODY]: '#6C5CE7',
  [MUSCLE_GROUPS.FOREARMS]: '#A29BFE',
  [MUSCLE_GROUPS.TRAPS]: '#FD79A8',
  [MUSCLE_GROUPS.LATS]: '#00B894',
  [MUSCLE_GROUPS.DELTS]: '#E17055',
  [MUSCLE_GROUPS.RHOMBOIDS]: '#00CEC9'
};

export type MuscleGroupKey = keyof typeof MUSCLE_GROUPS;
export type MuscleGroupValue = typeof MUSCLE_GROUPS[MuscleGroupKey];