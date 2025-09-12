// Base de dados expandida de exercícios com imagens
import { Exercise } from '@/types';

// URLs base para imagens (usando APIs gratuitas)
const FREE_EXERCISE_IMAGES = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export const exerciseDatabase: Exercise[] = [
  // ===== PEITO (10 exercícios) =====
  {
    id: 'bench-press',
    name: 'Supino Reto',
    description: 'Exercício fundamental para desenvolvimento do peitoral maior',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Deite-se no banco com os pés firmes no chão',
      'Segure a barra com pegada ligeiramente mais larga que os ombros',
      'Desça a barra controladamente até o peito',
      'Empurre a barra de volta à posição inicial'
    ],
    tips: [
      'Mantenha os ombros retraídos durante todo o movimento',
      'Não deixe a barra quicar no peito',
      'Mantenha os pés firmes no chão'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Barbell_Bench_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Barbell_Bench_Press/1.jpg`],
    category: 'strength'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Supino Inclinado com Halteres',
    description: 'Foca na porção superior do peitoral',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior Superior'],
    secondaryMuscles: ['Deltoides Anterior', 'Tríceps'],
    equipment: 'Halteres',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Ajuste o banco em 30-45 graus',
      'Segure os halteres com pegada neutra',
      'Desça os halteres controladamente',
      'Empurre os halteres de volta unindo-os no topo'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Incline_Dumbbell_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Incline_Dumbbell_Press/1.jpg`],
    category: 'strength'
  },
  {
    id: 'push-ups',
    name: 'Flexões',
    description: 'Exercício clássico de peso corporal para peito',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Tríceps', 'Core', 'Deltoides'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione-se em prancha com mãos na largura dos ombros',
      'Mantenha o corpo reto da cabeça aos pés',
      'Desça o corpo até quase tocar o chão',
      'Empurre de volta à posição inicial'
    ],
    variations: ['Flexões inclinadas', 'Flexões diamante', 'Flexões com palmas'],
    images: [`${FREE_EXERCISE_IMAGES}/Push_ups/0.jpg`, `${FREE_EXERCISE_IMAGES}/Push_ups/1.jpg`],
    category: 'strength'
  },
  {
    id: 'dumbbell-flyes',
    name: 'Crucifixo com Halteres',
    description: 'Exercício de isolamento para o peitoral',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Deltoides Anterior'],
    equipment: 'Halteres',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Deite-se no banco com halteres nas mãos',
      'Abra os braços em arco amplo',
      'Desça até sentir alongamento no peito',
      'Retorne unindo os halteres sobre o peito'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Dumbbell_Flyes/0.jpg`, `${FREE_EXERCISE_IMAGES}/Dumbbell_Flyes/1.jpg`],
    category: 'strength'
  },
  {
    id: 'decline-bench-press',
    name: 'Supino Declinado',
    description: 'Exercício para porção inferior do peitoral',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior Inferior'],
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Deite-se no banco declinado com pés presos',
      'Segure a barra com pegada média',
      'Desça a barra até a parte inferior do peito',
      'Empurre de volta à posição inicial'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Decline_Bench_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Decline_Bench_Press/1.jpg`],
    category: 'strength'
  },
  {
    id: 'chest-dips',
    name: 'Mergulho para Peito',
    description: 'Exercício de peso corporal para peito',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: 'Barras Paralelas',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Segure as barras paralelas e se suspenda',
      'Incline o tronco ligeiramente para frente',
      'Desça flexionando os cotovelos',
      'Empurre de volta focando no peito'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Chest_Dips/0.jpg`, `${FREE_EXERCISE_IMAGES}/Chest_Dips/1.jpg`],
    category: 'strength'
  },
  {
    id: 'cable-crossover',
    name: 'Crucifixo no Cabo',
    description: 'Exercício de isolamento com tensão constante',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Deltoides Anterior'],
    equipment: 'Cabo',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Posicione-se entre as polias altas',
      'Segure as alças com braços abertos',
      'Traga as mãos para frente em arco',
      'Retorne controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Cable_Crossover/0.jpg`, `${FREE_EXERCISE_IMAGES}/Cable_Crossover/1.jpg`],
    category: 'strength'
  },
  {
    id: 'pec-deck',
    name: 'Voador (Pec Deck)',
    description: 'Exercício de isolamento na máquina',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Ajuste o assento da máquina',
      'Apoie os antebraços nas almofadas',
      'Traga os braços para frente contraindo o peito',
      'Retorne controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Pec_Deck/0.jpg`, `${FREE_EXERCISE_IMAGES}/Pec_Deck/1.jpg`],
    category: 'strength'
  },
  {
    id: 'pullover',
    name: 'Pullover com Halter',
    description: 'Exercício para expansão da caixa torácica',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior', 'Serrátil Anterior'],
    secondaryMuscles: ['Latíssimo do Dorso'],
    equipment: 'Halter',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Deite-se no banco segurando um halter',
      'Mantenha os braços ligeiramente flexionados',
      'Leve o halter atrás da cabeça',
      'Retorne contraindo o peito'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Pullover/0.jpg`, `${FREE_EXERCISE_IMAGES}/Pullover/1.jpg`],
    category: 'strength'
  },

  // ===== COSTAS (10 exercícios) =====
  {
    id: 'pull-ups',
    name: 'Barra Fixa',
    description: 'Exercício fundamental para desenvolvimento das costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso'],
    secondaryMuscles: ['Bíceps', 'Romboides', 'Trapézio'],
    equipment: 'Barra Fixa',
    difficulty: 'advanced',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Segure a barra com pegada pronada, mãos na largura dos ombros',
      'Pendure-se com braços estendidos',
      'Puxe o corpo até o queixo passar da barra',
      'Desça controladamente à posição inicial'
    ],
    variations: ['Barra fixa supinada', 'Barra fixa neutra', 'Barra fixa assistida'],
    images: [`${FREE_EXERCISE_IMAGES}/Pull_ups/0.jpg`, `${FREE_EXERCISE_IMAGES}/Pull_ups/1.jpg`],
    category: 'strength'
  },
  {
    id: 'bent-over-row',
    name: 'Remada Curvada',
    description: 'Exercício para espessura das costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Segure a barra com pegada pronada',
      'Incline o tronco para frente mantendo as costas retas',
      'Puxe a barra em direção ao abdômen',
      'Retorne controladamente à posição inicial'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Bent_Over_Barbell_Row/0.jpg`, `${FREE_EXERCISE_IMAGES}/Bent_Over_Barbell_Row/1.jpg`],
    category: 'strength'
  },
  {
    id: 'lat-pulldown',
    name: 'Puxada na Polia Alta',
    description: 'Alternativa à barra fixa para iniciantes',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso'],
    secondaryMuscles: ['Bíceps', 'Romboides'],
    equipment: 'Polia',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Sente-se na máquina e ajuste as almofadas',
      'Segure a barra com pegada larga',
      'Puxe a barra até o peito',
      'Retorne controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Wide_Grip_Lat_Pulldown/0.jpg`, `${FREE_EXERCISE_IMAGES}/Wide_Grip_Lat_Pulldown/1.jpg`],
    category: 'strength'
  },
  {
    id: 'seated-cable-row',
    name: 'Remada Sentada no Cabo',
    description: 'Exercício para meio das costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Romboides', 'Trapézio Médio'],
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior'],
    equipment: 'Cabo',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Sente-se na máquina com pés apoiados',
      'Segure a alça com ambas as mãos',
      'Puxe em direção ao abdômen',
      'Aperte as escápulas no final do movimento'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Seated_Cable_Row/0.jpg`, `${FREE_EXERCISE_IMAGES}/Seated_Cable_Row/1.jpg`],
    category: 'strength'
  },
  {
    id: 't-bar-row',
    name: 'Remada T-Bar',
    description: 'Exercício para espessura das costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Trapézio'],
    equipment: 'T-Bar',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Posicione-se sobre a T-Bar',
      'Segure as alças com pegada neutra',
      'Puxe o peso em direção ao peito',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/T_Bar_Row/0.jpg`, `${FREE_EXERCISE_IMAGES}/T_Bar_Row/1.jpg`],
    category: 'strength'
  },
  {
    id: 'chin-up',
    name: 'Barra Fixa Supinada',
    description: 'Variação da barra fixa com pegada supinada',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso'],
    secondaryMuscles: ['Bíceps'],
    equipment: 'Barra Fixa',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Segure a barra com pegada supinada',
      'Pendure-se com braços estendidos',
      'Puxe o corpo para cima',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Chin_Up/0.jpg`, `${FREE_EXERCISE_IMAGES}/Chin_Up/1.jpg`],
    category: 'strength'
  },
  {
    id: 'face-pull',
    name: 'Puxada para o Rosto',
    description: 'Exercício para deltoides posterior e trapézio',
    muscleGroups: ['Costas'],
    targetMuscles: ['Deltoides Posterior', 'Trapézio Médio'],
    secondaryMuscles: ['Romboides'],
    equipment: 'Cabo',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Ajuste a polia na altura dos olhos',
      'Segure a corda com pegada pronada',
      'Puxe em direção ao rosto',
      'Separe as mãos no final do movimento'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Face_Pull/0.jpg`, `${FREE_EXERCISE_IMAGES}/Face_Pull/1.jpg`],
    category: 'strength'
  },
  {
    id: 'shrug',
    name: 'Encolhimento de Ombros',
    description: 'Exercício para trapézio superior',
    muscleGroups: ['Costas'],
    targetMuscles: ['Trapézio Superior'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure os halteres ao lado do corpo',
      'Mantenha os braços estendidos',
      'Eleve os ombros em direção às orelhas',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Shrug/0.jpg`, `${FREE_EXERCISE_IMAGES}/Shrug/1.jpg`],
    category: 'strength'
  },
  {
    id: 'one-arm-row',
    name: 'Remada Unilateral',
    description: 'Exercício unilateral para costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo do Dorso', 'Romboides'],
    secondaryMuscles: ['Bíceps'],
    equipment: 'Halter',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Apoie um joelho e mão no banco',
      'Segure o halter com a mão livre',
      'Puxe o halter em direção ao quadril',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/One_Arm_Row/0.jpg`, `${FREE_EXERCISE_IMAGES}/One_Arm_Row/1.jpg`],
    category: 'strength'
  },

  // ===== OMBROS (8 exercícios) =====
  {
    id: 'overhead-press',
    name: 'Desenvolvimento Militar',
    description: 'Exercício fundamental para ombros',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides'],
    secondaryMuscles: ['Tríceps', 'Core'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Segure a barra na altura dos ombros',
      'Mantenha os pés na largura dos ombros',
      'Empurre a barra acima da cabeça',
      'Retorne controladamente à posição inicial'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Standing_Military_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Standing_Military_Press/1.jpg`],
    category: 'strength'
  },
  {
    id: 'lateral-raises',
    name: 'Elevação Lateral',
    description: 'Isolamento para deltoides medial',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides Medial'],
    secondaryMuscles: ['Trapézio'],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure halteres ao lado do corpo',
      'Eleve os braços lateralmente até a altura dos ombros',
      'Pause no topo do movimento',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Dumbbell_Lateral_Raise/0.jpg`, `${FREE_EXERCISE_IMAGES}/Dumbbell_Lateral_Raise/1.jpg`],
    category: 'strength'
  },
  {
    id: 'shoulder-press',
    name: 'Desenvolvimento com Halteres',
    description: 'Exercício sentado para ombros',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides'],
    secondaryMuscles: ['Tríceps'],
    equipment: 'Halteres',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Sente-se com as costas apoiadas',
      'Segure os halteres na altura dos ombros',
      'Empurre os halteres para cima até estender os braços',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Shoulder_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Shoulder_Press/1.jpg`],
    tips: ['Mantenha o core contraído', 'Não arqueie as costas'],
    category: 'strength'
  },
  {
    id: 'front-raise',
    name: 'Elevação Frontal',
    description: 'Exercício para deltoides anterior',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides Anterior'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Segure os halteres à frente do corpo',
      'Eleve os braços para frente até a altura dos ombros',
      'Mantenha os braços ligeiramente flexionados',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Front_Raise/0.jpg`, `${FREE_EXERCISE_IMAGES}/Front_Raise/1.jpg`],
    tips: ['Evite balançar o corpo', 'Controle o movimento'],
    category: 'strength'
  },
  {
    id: 'rear-delt-fly',
    name: 'Crucifixo Inverso',
    description: 'Exercício para deltoides posterior',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides Posterior'],
    secondaryMuscles: ['Romboides'],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Incline o tronco para frente',
      'Segure os halteres com braços estendidos',
      'Abra os braços lateralmente',
      'Aperte as escápulas no final'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Rear_Delt_Fly/0.jpg`, `${FREE_EXERCISE_IMAGES}/Rear_Delt_Fly/1.jpg`],
    tips: ['Mantenha ligeira flexão nos cotovelos', 'Foque no deltoides posterior'],
    category: 'strength'
  },
  {
    id: 'arnold-press',
    name: 'Desenvolvimento Arnold',
    description: 'Variação do desenvolvimento com rotação',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides'],
    secondaryMuscles: ['Tríceps'],
    equipment: 'Halteres',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Inicie com halteres à frente do peito',
      'Gire os punhos enquanto eleva',
      'Termine com palmas para frente',
      'Inverta o movimento na descida'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Arnold_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Arnold_Press/1.jpg`],
    tips: ['Movimento fluido de rotação', 'Controle em toda amplitude'],
    category: 'strength'
  },
  {
    id: 'upright-row',
    name: 'Remada Alta',
    description: 'Exercício para deltoides e trapézio',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides', 'Trapézio'],
    secondaryMuscles: ['Bíceps'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Segure a barra com pegada fechada',
      'Puxe a barra em direção ao queixo',
      'Mantenha os cotovelos altos',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Upright_Row/0.jpg`, `${FREE_EXERCISE_IMAGES}/Upright_Row/1.jpg`],
    tips: ['Não puxe muito alto para evitar impacto', 'Foque nos deltoides'],
    category: 'strength'
  },
  {
    id: 'pike-push-up',
    name: 'Flexão Pike',
    description: 'Exercício de peso corporal para ombros',
    muscleGroups: ['Ombros'],
    targetMuscles: ['Deltoides'],
    secondaryMuscles: ['Tríceps', 'Core'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione-se em V invertido',
      'Flexione os braços descendo a cabeça',
      'Empurre de volta à posição inicial',
      'Mantenha o corpo em V'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Pike_Push_Up/0.jpg`, `${FREE_EXERCISE_IMAGES}/Pike_Push_Up/1.jpg`],
    tips: ['Mantenha os pés elevados para mais dificuldade', 'Foque no movimento vertical'],
    category: 'strength'
  },

  // ===== BRAÇOS (10 exercícios) =====
  {
    id: 'barbell-curl',
    name: 'Rosca Direta',
    description: 'Exercício clássico para bíceps',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps'],
    secondaryMuscles: ['Antebraços'],
    equipment: 'Barra',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure a barra com pegada supinada',
      'Mantenha os cotovelos fixos ao lado do corpo',
      'Flexione os braços levando a barra ao peito',
      'Retorne controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Barbell_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Barbell_Curl/1.jpg`],
    category: 'strength'
  },
  {
    id: 'tricep-dips',
    name: 'Mergulho para Tríceps',
    description: 'Exercício de peso corporal para tríceps',
    muscleGroups: ['Braços'],
    targetMuscles: ['Tríceps'],
    secondaryMuscles: ['Deltoides Anterior', 'Peito'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione as mãos nas barras paralelas',
      'Desça o corpo flexionando os cotovelos',
      'Empurre de volta à posição inicial',
      'Mantenha o tronco ligeiramente inclinado'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Tricep_Dips/0.jpg`, `${FREE_EXERCISE_IMAGES}/Tricep_Dips/1.jpg`],
    category: 'strength'
  },
  {
    id: 'dumbbell-curl',
    name: 'Rosca com Halteres',
    description: 'Exercício básico para bíceps com halteres',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps'],
    secondaryMuscles: ['Antebraços'],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure os halteres com braços estendidos',
      'Flexione os cotovelos levantando os pesos',
      'Contraia o bíceps no topo',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Dumbbell_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Dumbbell_Curl/1.jpg`],
    tips: ['Evite balançar o corpo', 'Mantenha os cotovelos fixos'],
    category: 'strength'
  },
  {
    id: 'hammer-curl',
    name: 'Rosca Martelo',
    description: 'Exercício para bíceps e antebraços',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps', 'Antebraços'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure os halteres com pegada neutra',
      'Flexione os cotovelos mantendo punhos neutros',
      'Contraia no topo do movimento',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Hammer_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Hammer_Curl/1.jpg`],
    tips: ['Mantenha os punhos alinhados', 'Evite rotação dos pulsos'],
    category: 'strength'
  },
  {
    id: 'tricep-extension',
    name: 'Extensão de Tríceps',
    description: 'Exercício de isolamento para tríceps',
    muscleGroups: ['Braços'],
    targetMuscles: ['Tríceps'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Deite-se e segure o halter acima do peito',
      'Flexione apenas os cotovelos descendo o peso',
      'Estenda os braços de volta',
      'Mantenha os cotovelos fixos'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Tricep_Extension/0.jpg`, `${FREE_EXERCISE_IMAGES}/Tricep_Extension/1.jpg`],
    tips: ['Cotovelos sempre fixos', 'Movimento apenas no antebraço'],
    category: 'strength'
  },
  {
    id: 'preacher-curl',
    name: 'Rosca Scott',
    description: 'Exercício isolado para bíceps no banco scott',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps'],
    secondaryMuscles: [],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Apoie os braços no banco scott',
      'Segure a barra com pegada supinada',
      'Flexione os cotovelos controladamente',
      'Desça sem estender completamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Preacher_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Preacher_Curl/1.jpg`],
    tips: ['Não estenda totalmente na descida', 'Controle excêntrico'],
    category: 'strength'
  },
  {
    id: 'close-grip-push-up',
    name: 'Flexão Pegada Fechada',
    description: 'Flexão focada no tríceps',
    muscleGroups: ['Braços'],
    targetMuscles: ['Tríceps'],
    secondaryMuscles: ['Peito', 'Ombros'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione as mãos próximas no chão',
      'Mantenha os cotovelos próximos ao corpo',
      'Desça até o peito tocar as mãos',
      'Empurre de volta'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Close_Grip_Push_Up/0.jpg`, `${FREE_EXERCISE_IMAGES}/Close_Grip_Push_Up/1.jpg`],
    tips: ['Cotovelos sempre próximos', 'Foque no tríceps'],
    category: 'strength'
  },
  {
    id: 'concentration-curl',
    name: 'Rosca Concentrada',
    description: 'Exercício de isolamento máximo para bíceps',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Sente-se e apoie o cotovelo na coxa',
      'Segure o halter com braço estendido',
      'Flexione o cotovelo contraindo o bíceps',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Concentration_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Concentration_Curl/1.jpg`],
    tips: ['Máxima concentração no bíceps', 'Movimento lento e controlado'],
    category: 'strength'
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Extensão de Tríceps Acima da Cabeça',
    description: 'Exercício para tríceps com halter acima da cabeça',
    muscleGroups: ['Braços'],
    targetMuscles: ['Tríceps'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Segure o halter acima da cabeça',
      'Flexione apenas os cotovelos descendo o peso',
      'Estenda os braços de volta',
      'Mantenha os cotovelos fixos'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Overhead_Tricep_Extension/0.jpg`, `${FREE_EXERCISE_IMAGES}/Overhead_Tricep_Extension/1.jpg`],
    tips: ['Cotovelos sempre próximos à cabeça', 'Amplitude completa'],
    category: 'strength'
  },
  {
    id: 'cable-bicep-curl',
    name: 'Rosca no Cabo',
    description: 'Exercício para bíceps com tensão constante',
    muscleGroups: ['Braços'],
    targetMuscles: ['Bíceps'],
    secondaryMuscles: [],
    equipment: 'Cabo',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure a barra do cabo com pegada supinada',
      'Mantenha os cotovelos fixos ao lado do corpo',
      'Flexione os cotovelos contraindo o bíceps',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Cable_Bicep_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Cable_Bicep_Curl/1.jpg`],
    tips: ['Tensão constante durante todo movimento', 'Evite usar impulso'],
    category: 'strength'
  },

  // ===== PERNAS (10 exercícios) =====
  {
    id: 'squats',
    name: 'Agachamento',
    description: 'Rei dos exercícios para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione a barra nos ombros',
      'Desça flexionando quadris e joelhos',
      'Desça até as coxas ficarem paralelas ao chão',
      'Empurre pelos calcanhares para subir'
    ],
    variations: ['Agachamento frontal', 'Agachamento búlgaro', 'Agachamento sumô'],
    images: [`${FREE_EXERCISE_IMAGES}/Barbell_Squat/0.jpg`, `${FREE_EXERCISE_IMAGES}/Barbell_Squat/1.jpg`],
    category: 'strength'
  },
  {
    id: 'deadlift',
    name: 'Levantamento Terra',
    description: 'Exercício fundamental para posterior da coxa',
    muscleGroups: ['Pernas', 'Costas'],
    targetMuscles: ['Isquiotibiais', 'Glúteos', 'Eretores da Espinha'],
    secondaryMuscles: ['Trapézio', 'Latíssimo', 'Core'],
    equipment: 'Barra',
    difficulty: 'advanced',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Posicione-se com a barra sobre os pés',
      'Segure a barra com pegada mista ou pronada',
      'Levante a barra mantendo as costas retas',
      'Estenda quadris e joelhos simultaneamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Deadlift/0.jpg`, `${FREE_EXERCISE_IMAGES}/Deadlift/1.jpg`],
    category: 'strength'
  },
  {
    id: 'lunges',
    name: 'Afundo',
    description: 'Exercício unilateral para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Dê um passo à frente com uma perna',
      'Desça flexionando ambos os joelhos',
      'O joelho traseiro deve quase tocar o chão',
      'Empurre de volta à posição inicial'
    ],
    variations: ['Afundo reverso', 'Afundo lateral', 'Afundo caminhando'],
    images: [`${FREE_EXERCISE_IMAGES}/Dumbbell_Lunges/0.jpg`, `${FREE_EXERCISE_IMAGES}/Dumbbell_Lunges/1.jpg`],
    category: 'strength'
  },
  {
    id: 'leg-press',
    name: 'Leg Press (Prensa de Pernas)',
    description: 'Exercício seguro para desenvolvimento das pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais'],
    equipment: 'Máquina',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Sente-se na máquina com pés na plataforma',
      'Desça a plataforma flexionando os joelhos',
      'Pare quando os joelhos formarem 90 graus',
      'Empurre a plataforma de volta'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Leg_Press/0.jpg`, `${FREE_EXERCISE_IMAGES}/Leg_Press/1.jpg`],
    category: 'strength'
  },
  {
    id: 'romanian-deadlift',
    name: 'Levantamento Terra Romeno',
    description: 'Exercício para isquiotibiais e glúteos',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Isquiotibiais', 'Glúteos'],
    secondaryMuscles: ['Lombar'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Segure a barra com pegada pronada',
      'Mantenha as pernas ligeiramente flexionadas',
      'Desça a barra empurrando o quadril para trás',
      'Suba contraindo glúteos e isquiotibiais'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Romanian_Deadlift/0.jpg`, `${FREE_EXERCISE_IMAGES}/Romanian_Deadlift/1.jpg`],
    tips: ['Mantenha a coluna neutra', 'Movimento iniciado pelo quadril'],
    category: 'strength'
  },
  {
    id: 'calf-raise',
    name: 'Elevação de Panturrilha',
    description: 'Exercício para panturrilhas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Panturrilhas'],
    secondaryMuscles: [],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Fique em pé com pés paralelos',
      'Eleve-se na ponta dos pés',
      'Contraia as panturrilhas no topo',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Calf_Raise/0.jpg`, `${FREE_EXERCISE_IMAGES}/Calf_Raise/1.jpg`],
    tips: ['Amplitude completa', 'Pausa no topo do movimento'],
    category: 'strength'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Agachamento Búlgaro',
    description: 'Exercício unilateral avançado para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Coloque o pé traseiro elevado',
      'Desça flexionando a perna da frente',
      'Mantenha o tronco ereto',
      'Suba empurrando pela perna da frente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Bulgarian_Split_Squat/0.jpg`, `${FREE_EXERCISE_IMAGES}/Bulgarian_Split_Squat/1.jpg`],
    tips: ['Foque na perna da frente', 'Mantenha o equilíbrio'],
    category: 'strength'
  },
  {
    id: 'leg-curl',
    name: 'Mesa Flexora',
    description: 'Exercício de isolamento para isquiotibiais',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Isquiotibiais'],
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Deite-se na máquina de bruços',
      'Posicione as pernas sob o apoio',
      'Flexione os joelhos puxando os calcanhares',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Leg_Curl/0.jpg`, `${FREE_EXERCISE_IMAGES}/Leg_Curl/1.jpg`],
    tips: ['Movimento controlado', 'Foque na contração dos isquiotibiais'],
    category: 'strength'
  },
  {
    id: 'leg-extension',
    name: 'Cadeira Extensora',
    description: 'Exercício de isolamento para quadríceps',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps'],
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Sente-se na máquina',
      'Posicione as pernas sob o apoio',
      'Estenda os joelhos levantando o peso',
      'Desça controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Leg_Extension/0.jpg`, `${FREE_EXERCISE_IMAGES}/Leg_Extension/1.jpg`],
    tips: ['Não trave completamente os joelhos', 'Movimento controlado'],
    category: 'strength'
  },
  {
    id: 'wall-sit',
    name: 'Agachamento na Parede',
    description: 'Exercício isométrico para quadríceps',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps'],
    secondaryMuscles: ['Glúteos'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'compound',
    instructions: [
      'Apoie as costas na parede',
      'Desça até as coxas ficarem paralelas',
      'Mantenha a posição',
      'Respire normalmente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Wall_Sit/0.jpg`, `${FREE_EXERCISE_IMAGES}/Wall_Sit/1.jpg`],
    tips: ['Mantenha os joelhos a 90 graus', 'Distribua o peso nos calcanhares'],
    category: 'strength'
  },
  {
    id: 'goblet-squat',
    name: 'Agachamento Goblet (Cálice)',
    description: 'Agachamento com halter no peito',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Core'],
    equipment: 'Halteres',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Segure o halter próximo ao peito',
      'Desça em agachamento',
      'Mantenha o tronco ereto',
      'Suba empurrando pelos calcanhares'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Goblet_Squat/0.jpg`, `${FREE_EXERCISE_IMAGES}/Goblet_Squat/1.jpg`],
    tips: ['Halter próximo ao corpo', 'Boa postura durante todo movimento'],
    category: 'strength'
  },

  // ===== CORE/ABDÔMEN (8 exercícios) =====
  {
    id: 'plank',
    name: 'Prancha',
    description: 'Exercício isométrico para core',
    muscleGroups: ['Core'],
    targetMuscles: ['Reto Abdominal', 'Transverso do Abdômen'],
    secondaryMuscles: ['Oblíquos', 'Eretores da Espinha'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'isolation',
    instructions: [
      'Posicione-se em prancha sobre os antebraços',
      'Mantenha o corpo reto da cabeça aos pés',
      'Contraia o core e mantenha a posição',
      'Respire normalmente durante o exercício'
    ],
    variations: ['Prancha lateral', 'Prancha com elevação de perna', 'Prancha dinâmica'],
    images: [`${FREE_EXERCISE_IMAGES}/Plank/0.jpg`, `${FREE_EXERCISE_IMAGES}/Plank/1.jpg`],
    category: 'strength'
  },
  {
    id: 'crunches',
    name: 'Abdominal',
    description: 'Exercício clássico para abdômen',
    muscleGroups: ['Core'],
    targetMuscles: ['Reto Abdominal'],
    secondaryMuscles: ['Oblíquos'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Deite-se com joelhos flexionados',
      'Coloque as mãos atrás da cabeça',
      'Eleve o tronco contraindo o abdômen',
      'Retorne controladamente'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Crunches/0.jpg`, `${FREE_EXERCISE_IMAGES}/Crunches/1.jpg`],
    category: 'strength'
  },
  {
    id: 'russian-twist',
    name: 'Rotação Russa',
    description: 'Exercício para oblíquos e core',
    muscleGroups: ['Core'],
    targetMuscles: ['Oblíquos', 'Reto Abdominal'],
    secondaryMuscles: ['Flexores do Quadril'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Sente-se com joelhos flexionados',
      'Incline o tronco para trás',
      'Gire o tronco de um lado para outro',
      'Mantenha os pés elevados'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Russian_Twist/0.jpg`, `${FREE_EXERCISE_IMAGES}/Russian_Twist/1.jpg`],
    tips: ['Movimento controlado', 'Foque na rotação do tronco'],
    category: 'strength'
  },
  {
    id: 'bicycle-crunches',
    name: 'Abdominal Bicicleta',
    description: 'Exercício para abdômen e oblíquos',
    muscleGroups: ['Core'],
    targetMuscles: ['Reto Abdominal', 'Oblíquos'],
    secondaryMuscles: ['Flexores do Quadril'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Deite-se com mãos atrás da cabeça',
      'Eleve as pernas flexionadas',
      'Alterne cotovelo com joelho oposto',
      'Movimento de pedalada'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Bicycle_Crunches/0.jpg`, `${FREE_EXERCISE_IMAGES}/Bicycle_Crunches/1.jpg`],
    tips: ['Movimento alternado', 'Foque na contração dos oblíquos'],
    category: 'strength'
  },
  {
    id: 'dead-bug',
    name: 'Inseto Morto',
    description: 'Exercício de estabilização do core',
    muscleGroups: ['Core'],
    targetMuscles: ['Transverso do Abdômen', 'Multífidos'],
    secondaryMuscles: ['Reto Abdominal'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'compound',
    instructions: [
      'Deite-se com braços e pernas a 90 graus',
      'Estenda braço e perna opostos',
      'Mantenha a lombar no chão',
      'Alterne os lados'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Dead_Bug/0.jpg`, `${FREE_EXERCISE_IMAGES}/Dead_Bug/1.jpg`],
    tips: ['Lombar sempre no chão', 'Movimento lento e controlado'],
    category: 'strength'
  },
  {
    id: 'leg-raises',
    name: 'Elevação de Pernas',
    description: 'Exercício para abdômen inferior',
    muscleGroups: ['Core'],
    targetMuscles: ['Reto Abdominal Inferior'],
    secondaryMuscles: ['Flexores do Quadril'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Deite-se com pernas estendidas',
      'Eleve as pernas até 90 graus',
      'Desça controladamente',
      'Não toque o chão com os pés'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Leg_Raises/0.jpg`, `${FREE_EXERCISE_IMAGES}/Leg_Raises/1.jpg`],
    tips: ['Controle na descida', 'Mantenha a lombar no chão'],
    category: 'strength'
  },
  {
    id: 'side-plank',
    name: 'Prancha Lateral',
    description: 'Exercício isométrico para oblíquos',
    muscleGroups: ['Core'],
    targetMuscles: ['Oblíquos'],
    secondaryMuscles: ['Quadrado Lombar', 'Glúteo Médio'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'compound',
    instructions: [
      'Deite-se de lado apoiado no antebraço',
      'Eleve o quadril formando linha reta',
      'Mantenha a posição',
      'Repita do outro lado'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Side_Plank/0.jpg`, `${FREE_EXERCISE_IMAGES}/Side_Plank/1.jpg`],
    tips: ['Corpo em linha reta', 'Não deixe o quadril cair'],
    category: 'strength'
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold (Posição Oca)',
    description: 'Exercício isométrico avançado para core',
    muscleGroups: ['Core'],
    targetMuscles: ['Reto Abdominal', 'Transverso do Abdômen'],
    secondaryMuscles: ['Flexores do Quadril'],
    equipment: 'Peso Corporal',
    difficulty: 'advanced',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'compound',
    instructions: [
      'Deite-se de costas com braços estendidos',
      'Eleve ombros e pernas do chão',
      'Forme uma posição côncava',
      'Mantenha a posição contraindo o core'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Hollow_Hold/0.jpg`, `${FREE_EXERCISE_IMAGES}/Hollow_Hold/1.jpg`],
    tips: ['Lombar pressionada no chão', 'Respiração controlada'],
    category: 'strength'
  },

  // ===== CARDIO E EXERCÍCIOS FUNCIONAIS =====
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Exercício de corpo inteiro de alta intensidade',
    muscleGroups: ['Corpo Inteiro'],
    targetMuscles: ['Corpo Inteiro'],
    secondaryMuscles: [],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'cardio',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Comece em pé',
      'Agache e coloque as mãos no chão',
      'Salte os pés para trás em prancha',
      'Faça uma flexão, salte os pés de volta e pule'
    ],
    images: [`${FREE_EXERCISE_IMAGES}/Burpees/0.jpg`, `${FREE_EXERCISE_IMAGES}/Burpees/1.jpg`],
    category: 'cardio'
  },
  {
    id: 'mountain-climbers',
    name: 'Escaladores',
    description: 'Exercício cardio de alta intensidade',
    muscleGroups: ['Corpo Inteiro', 'Core'],
    targetMuscles: ['Core', 'Ombros'],
    secondaryMuscles: ['Pernas'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'cardio',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Inicie em posição de prancha',
      'Alterne trazendo os joelhos ao peito rapidamente',
      'Mantenha o core contraído',
      'Movimento rápido e controlado'
    ],
    tips: ['Mantenha os quadris estáveis', 'Respiração ritmada'],
    category: 'cardio'
  },
  {
    id: 'jumping-jacks',
    name: 'Polichinelos',
    description: 'Exercício cardio clássico',
    muscleGroups: ['Corpo Inteiro'],
    targetMuscles: ['Pernas', 'Ombros'],
    secondaryMuscles: ['Core'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'cardio',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Comece com pés juntos e braços ao lado',
      'Salte abrindo pernas e elevando braços',
      'Retorne à posição inicial',
      'Mantenha ritmo constante'
    ],
    tips: ['Aterrisse suavemente', 'Mantenha o core ativo'],
    category: 'cardio'
  },
  {
    id: 'high-knees',
    name: 'Joelhos Altos',
    description: 'Exercício cardio para pernas e core',
    muscleGroups: ['Pernas', 'Core'],
    targetMuscles: ['Quadríceps', 'Core'],
    secondaryMuscles: ['Panturrilhas'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'cardio',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Corra no lugar elevando os joelhos',
      'Traga os joelhos à altura do quadril',
      'Mantenha o tronco ereto',
      'Movimento rápido e ritmado'
    ],
    tips: ['Braços acompanham o movimento', 'Respiração controlada'],
    category: 'cardio'
  },
  {
    id: 'box-jumps',
    name: 'Saltos na Caixa',
    description: 'Exercício pliométrico para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Panturrilhas', 'Core'],
    equipment: 'Caixa/Banco',
    difficulty: 'intermediate',
    exerciseType: 'cardio',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione-se em frente à caixa',
      'Salte explosivamente sobre a caixa',
      'Aterrisse suavemente com ambos os pés',
      'Desça controladamente'
    ],
    tips: ['Comece com altura baixa', 'Aterrissagem suave'],
    category: 'cardio'
  },

  // ===== EXERCÍCIOS ADICIONAIS PARA PEITO =====
  {
    id: 'decline-bench-press',
    name: 'Supino Declinado',
    description: 'Foca na porção inferior do peitoral',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior Inferior'],
    secondaryMuscles: ['Tríceps', 'Deltoides'],
    equipment: 'Barra',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Deite-se no banco declinado',
      'Segure a barra com pegada média',
      'Desça controladamente ao peito',
      'Empurre explosivamente para cima'
    ],
    tips: ['Mantenha os pés fixos', 'Controle na descida'],
    category: 'strength'
  },
  {
    id: 'cable-crossover',
    name: 'Crucifixo no Cabo',
    description: 'Exercício de isolamento para peito',
    muscleGroups: ['Peito'],
    targetMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Deltoides Anterior'],
    equipment: 'Cabo',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'isolation',
    instructions: [
      'Posicione-se entre os cabos',
      'Segure as alças com braços abertos',
      'Una as mãos à frente do peito',
      'Retorne controladamente'
    ],
    tips: ['Mantenha ligeira flexão nos cotovelos', 'Foque na contração'],
    category: 'strength'
  },

  // ===== EXERCÍCIOS ADICIONAIS PARA COSTAS =====
  {
    id: 'face-pulls',
    name: 'Puxada Facial',
    description: 'Exercício para deltoides posterior e trapézio',
    muscleGroups: ['Costas', 'Ombros'],
    targetMuscles: ['Deltoides Posterior', 'Trapézio'],
    secondaryMuscles: ['Romboides'],
    equipment: 'Cabo',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'isolation',
    instructions: [
      'Segure a corda do cabo na altura do rosto',
      'Puxe separando as mãos em direção ao rosto',
      'Aperte as escápulas',
      'Retorne controladamente'
    ],
    tips: ['Cotovelos altos', 'Foque no deltoides posterior'],
    category: 'strength'
  },
  {
    id: 'inverted-rows',
    name: 'Remada Invertida',
    description: 'Exercício de peso corporal para costas',
    muscleGroups: ['Costas'],
    targetMuscles: ['Latíssimo', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Core'],
    equipment: 'Barra/TRX',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Deite-se sob a barra',
      'Segure a barra com pegada pronada',
      'Puxe o peito em direção à barra',
      'Mantenha o corpo reto'
    ],
    tips: ['Corpo em linha reta', 'Aperte as escápulas'],
    category: 'strength'
  },

  // ===== EXERCÍCIOS ADICIONAIS PARA PERNAS =====
  {
    id: 'bulgarian-split-squat',
    name: 'Agachamento Búlgaro',
    description: 'Exercício unilateral para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Banco',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione um pé no banco atrás de você',
      'Desça flexionando a perna da frente',
      'Mantenha o tronco ereto',
      'Empurre de volta à posição inicial'
    ],
    tips: ['Peso na perna da frente', 'Joelho alinhado'],
    category: 'strength'
  },
  {
    id: 'walking-lunges',
    name: 'Afundo Caminhando',
    description: 'Exercício dinâmico para pernas',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Peso Corporal',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Dê um passo à frente em afundo',
      'Desça até formar 90 graus nos joelhos',
      'Empurre com a perna da frente',
      'Continue alternando as pernas'
    ],
    tips: ['Passos largos', 'Tronco ereto'],
    category: 'strength'
  },
  {
    id: 'single-leg-deadlift',
    name: 'Levantamento Terra Unilateral',
    description: 'Exercício unilateral para posterior',
    muscleGroups: ['Pernas'],
    targetMuscles: ['Isquiotibiais', 'Glúteos'],
    secondaryMuscles: ['Core', 'Lombar'],
    equipment: 'Halteres',
    difficulty: 'advanced',
    exerciseType: 'strength',
    force: 'pull',
    mechanic: 'compound',
    instructions: [
      'Fique em uma perna só',
      'Incline o tronco para frente',
      'Estenda a perna livre para trás',
      'Retorne à posição inicial'
    ],
    tips: ['Equilíbrio e controle', 'Core ativo'],
    category: 'strength'
  },

  // ===== EXERCÍCIOS FUNCIONAIS E CORE =====
  {
    id: 'turkish-getup',
    name: 'Turkish Get-Up (Levantar Turco)',
    description: 'Exercício funcional completo',
    muscleGroups: ['Corpo Inteiro'],
    targetMuscles: ['Core', 'Ombros'],
    secondaryMuscles: ['Pernas', 'Glúteos'],
    equipment: 'Kettlebell',
    difficulty: 'advanced',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Deite-se com kettlebell estendido',
      'Levante-se mantendo o peso acima',
      'Siga a sequência: rolar, ajoelhar, ficar em pé',
      'Inverta o movimento para descer'
    ],
    tips: ['Movimento lento e controlado', 'Olhe sempre para o peso'],
    category: 'strength'
  },
  {
    id: 'farmers-walk',
    name: 'Caminhada do Fazendeiro',
    description: 'Exercício de força funcional',
    muscleGroups: ['Corpo Inteiro'],
    targetMuscles: ['Antebraços', 'Core'],
    secondaryMuscles: ['Trapézio', 'Pernas'],
    equipment: 'Halteres/Kettlebells',
    difficulty: 'beginner',
    exerciseType: 'strength',
    force: 'static',
    mechanic: 'compound',
    instructions: [
      'Segure pesos pesados nas duas mãos',
      'Caminhe mantendo postura ereta',
      'Passos controlados',
      'Mantenha os ombros para trás'
    ],
    tips: ['Pegada firme', 'Core contraído'],
    category: 'strength'
  },
  {
    id: 'bear-crawl',
    name: 'Caminhada do Urso',
    description: 'Exercício de mobilidade e força',
    muscleGroups: ['Corpo Inteiro'],
    targetMuscles: ['Core', 'Ombros'],
    secondaryMuscles: ['Pernas', 'Braços'],
    equipment: 'Peso Corporal',
    difficulty: 'intermediate',
    exerciseType: 'strength',
    force: 'push',
    mechanic: 'compound',
    instructions: [
      'Posicione-se em quatro apoios',
      'Eleve os joelhos do chão',
      'Caminhe para frente alternando braços e pernas',
      'Mantenha os joelhos baixos'
    ],
    tips: ['Joelhos próximos ao chão', 'Movimento coordenado'],
    category: 'strength'
  }
];

// Função para buscar exercícios por grupo muscular
export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return exerciseDatabase.filter(exercise => 
    exercise.muscleGroups.some(group => 
      group.toLowerCase().includes(muscleGroup.toLowerCase())
    )
  );
}

// Função para buscar exercícios por equipamento
export function getExercisesByEquipment(equipment: string): Exercise[] {
  return exerciseDatabase.filter(exercise => 
    exercise.equipment?.toLowerCase().includes(equipment.toLowerCase())
  );
}

// Função para buscar exercícios por dificuldade
export function getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Exercise[] {
  return exerciseDatabase.filter(exercise => exercise.difficulty === difficulty);
}

// Função para buscar exercícios por tipo
export function getExercisesByType(type: 'strength' | 'cardio' | 'flexibility' | 'balance'): Exercise[] {
  return exerciseDatabase.filter(exercise => exercise.exerciseType === type);
}

// Função para busca geral
export function searchExercises(query: string): Exercise[] {
  const searchTerm = query.toLowerCase();
  return exerciseDatabase.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm) ||
    exercise.description?.toLowerCase().includes(searchTerm) ||
    exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm)) ||
    exercise.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
  );
}

export default exerciseDatabase;