import { Workout, Exercise, WorkoutTemplate, ApiResponse, FilterOptions, SortOptions } from '@/types';

// Biblioteca completa de exercícios - 100+ exercícios organizados por grupos musculares
const defaultExercises: Exercise[] = [
  // === PEITORAL ===
  {
    id: '1',
    name: 'Supino Reto',
    description: 'Exercício fundamental para desenvolvimento do peitoral',
    muscleGroups: ['Peitoral', 'Tríceps', 'Deltoides'],
    equipment: 'Barra',
    instructions: ['Deite-se no banco', 'Segure a barra na largura dos ombros', 'Desça controladamente até o peito', 'Empurre explosivamente']
  },
  {
    id: '2',
    name: 'Supino Inclinado',
    description: 'Foca na porção superior do peitoral',
    muscleGroups: ['Peitoral', 'Deltoides', 'Tríceps'],
    equipment: 'Barra',
    instructions: ['Ajuste o banco em 30-45°', 'Posicione-se corretamente', 'Execute o movimento controlado', 'Foque na contração']
  },
  {
    id: '3',
    name: 'Supino Declinado',
    description: 'Trabalha a porção inferior do peitoral',
    muscleGroups: ['Peitoral', 'Tríceps'],
    equipment: 'Barra',
    instructions: ['Banco declinado 15-30°', 'Prenda os pés', 'Movimento controlado', 'Amplitude completa']
  },
  {
    id: '4',
    name: 'Supino com Halteres',
    description: 'Maior amplitude de movimento que a barra',
    muscleGroups: ['Peitoral', 'Deltoides', 'Tríceps'],
    equipment: 'Halteres',
    instructions: ['Halteres na altura do peito', 'Movimento em arco', 'Desça até sentir alongamento', 'Contraia no topo']
  },
  {
    id: '5',
    name: 'Crucifixo',
    description: 'Isolamento do peitoral com halteres',
    muscleGroups: ['Peitoral'],
    equipment: 'Halteres',
    instructions: ['Braços ligeiramente flexionados', 'Movimento em arco', 'Foque no alongamento', 'Contraia no centro']
  },
  {
    id: '6',
    name: 'Flexão de Braço',
    description: 'Exercício clássico com peso corporal',
    muscleGroups: ['Peitoral', 'Tríceps', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Posição de prancha', 'Mãos na largura dos ombros', 'Desça até quase tocar o chão', 'Empurre explosivamente']
  },
  {
    id: '7',
    name: 'Flexão Inclinada',
    description: 'Variação mais fácil da flexão tradicional',
    muscleGroups: ['Peitoral', 'Tríceps'],
    equipment: 'Peso Corporal',
    instructions: ['Mãos elevadas em banco/step', 'Corpo alinhado', 'Movimento controlado', 'Foque na forma']
  },
  {
    id: '8',
    name: 'Flexão Declinada',
    description: 'Variação avançada com pés elevados',
    muscleGroups: ['Peitoral', 'Deltoides', 'Tríceps'],
    equipment: 'Peso Corporal',
    instructions: ['Pés elevados em banco', 'Maior ativação do peitoral superior', 'Movimento controlado', 'Manter alinhamento']
  },
  {
    id: '9',
    name: 'Peck Deck',
    description: 'Isolamento do peitoral na máquina',
    muscleGroups: ['Peitoral'],
    equipment: 'Máquina',
    instructions: ['Ajuste a altura do assento', 'Braços paralelos ao chão', 'Movimento suave', 'Contraia no centro']
  },
  {
    id: '10',
    name: 'Cross Over',
    description: 'Exercício de isolamento com cabos',
    muscleGroups: ['Peitoral'],
    equipment: 'Cabo',
    instructions: ['Cabos na altura dos ombros', 'Passo à frente', 'Movimento em arco', 'Contraia no centro']
  },

  // === COSTAS ===
  {
    id: '11',
    name: 'Levantamento Terra',
    description: 'Rei dos exercícios para costas e posterior',
    muscleGroups: ['Lombar', 'Glúteos', 'Isquiotibiais', 'Trapézio'],
    equipment: 'Barra',
    instructions: ['Pés na largura dos quadris', 'Pegada pronada', 'Costas retas', 'Levante com as pernas']
  },
  {
    id: '12',
    name: 'Remada Curvada',
    description: 'Exercício fundamental para dorsais',
    muscleGroups: ['Dorsais', 'Romboides', 'Bíceps'],
    equipment: 'Barra',
    instructions: ['Incline o tronco 45°', 'Pegada pronada', 'Puxe até o abdômen', 'Contraia as escápulas']
  },
  {
    id: '13',
    name: 'Puxada na Polia',
    description: 'Desenvolvimento da largura das costas',
    muscleGroups: ['Dorsais', 'Bíceps', 'Romboides'],
    equipment: 'Cabo',
    instructions: ['Pegada larga', 'Puxe até o peito', 'Incline ligeiramente para trás', 'Contraia as escápulas']
  },
  {
    id: '14',
    name: 'Remada Sentada',
    description: 'Exercício para espessura das costas',
    muscleGroups: ['Dorsais', 'Romboides', 'Trapézio'],
    equipment: 'Cabo',
    instructions: ['Sente-se ereto', 'Puxe até o abdômen', 'Cotovelos próximos ao corpo', 'Contraia no final']
  },
  {
    id: '15',
    name: 'Barra Fixa',
    description: 'Exercício clássico com peso corporal',
    muscleGroups: ['Dorsais', 'Bíceps', 'Romboides'],
    equipment: 'Peso Corporal',
    instructions: ['Pegada pronada', 'Puxe até o queixo passar a barra', 'Movimento controlado', 'Desça completamente']
  },
  {
    id: '16',
    name: 'Remada com Halteres',
    description: 'Trabalho unilateral das costas',
    muscleGroups: ['Dorsais', 'Romboides', 'Bíceps'],
    equipment: 'Halteres',
    instructions: ['Apoie joelho e mão no banco', 'Puxe o halter até o quadril', 'Movimento controlado', 'Alterne os lados']
  },
  {
    id: '17',
    name: 'Pullover',
    description: 'Exercício para dorsais e serrátil',
    muscleGroups: ['Dorsais', 'Peitoral', 'Serrátil'],
    equipment: 'Halteres',
    instructions: ['Deite-se perpendicular ao banco', 'Halter com ambas as mãos', 'Movimento em arco', 'Sinta o alongamento']
  },
  {
    id: '18',
    name: 'Encolhimento',
    description: 'Isolamento do trapézio',
    muscleGroups: ['Trapézio'],
    equipment: 'Halteres',
    instructions: ['Halteres ao lado do corpo', 'Eleve os ombros', 'Contraia o trapézio', 'Desça controladamente']
  },
  {
    id: '19',
    name: 'Puxada Facial',
    description: 'Exercício para deltoides posterior e trapézio',
    muscleGroups: ['Deltoides', 'Trapézio', 'Romboides'],
    equipment: 'Cabo',
    instructions: ['Cabo na altura dos olhos', 'Puxe até a face', 'Cotovelos altos', 'Contraia as escápulas']
  },
  {
    id: '20',
    name: 'Remada Alta',
    description: 'Exercício para trapézio e deltoides',
    muscleGroups: ['Trapézio', 'Deltoides'],
    equipment: 'Barra',
    instructions: ['Pegada fechada', 'Puxe até o peito', 'Cotovelos altos', 'Movimento vertical']
  },

  // === OMBROS ===
  {
    id: '21',
    name: 'Desenvolvimento com Halteres',
    description: 'Exercício fundamental para deltoides',
    muscleGroups: ['Deltoides', 'Tríceps'],
    equipment: 'Halteres',
    instructions: ['Halteres na altura dos ombros', 'Empurre para cima', 'Movimento controlado', 'Não trave os cotovelos']
  },
  {
    id: '22',
    name: 'Desenvolvimento Militar',
    description: 'Desenvolvimento em pé com barra',
    muscleGroups: ['Deltoides', 'Tríceps', 'Core'],
    equipment: 'Barra',
    instructions: ['Em pé, core contraído', 'Barra na altura dos ombros', 'Empurre verticalmente', 'Controle a descida']
  },
  {
    id: '23',
    name: 'Elevação Lateral',
    description: 'Isolamento do deltoide medial',
    muscleGroups: ['Deltoides'],
    equipment: 'Halteres',
    instructions: ['Halteres ao lado do corpo', 'Eleve até a altura dos ombros', 'Movimento controlado', 'Pause no topo']
  },
  {
    id: '24',
    name: 'Elevação Frontal',
    description: 'Isolamento do deltoide anterior',
    muscleGroups: ['Deltoides'],
    equipment: 'Halteres',
    instructions: ['Halteres à frente do corpo', 'Eleve até a altura dos ombros', 'Braços ligeiramente flexionados', 'Controle a descida']
  },
  {
    id: '25',
    name: 'Crucifixo Inverso',
    description: 'Isolamento do deltoide posterior',
    muscleGroups: ['Deltoides'],
    equipment: 'Halteres',
    instructions: ['Incline o tronco', 'Abra os braços lateralmente', 'Contraia as escápulas', 'Movimento controlado']
  },
  {
    id: '26',
    name: 'Desenvolvimento Arnold',
    description: 'Variação do desenvolvimento com rotação',
    muscleGroups: ['Deltoides', 'Tríceps'],
    equipment: 'Halteres',
    instructions: ['Inicie com palmas voltadas para você', 'Gire enquanto empurra', 'Movimento fluido', 'Trabalha todos os deltoides']
  },
  {
    id: '27',
    name: 'Elevação Lateral na Polia',
    description: 'Isolamento com resistência constante',
    muscleGroups: ['Deltoides'],
    equipment: 'Cabo',
    instructions: ['Cabo na posição baixa', 'Eleve lateralmente', 'Resistência constante', 'Controle total']
  },
  {
    id: '28',
    name: 'Desenvolvimento Atrás da Nuca',
    description: 'Variação do desenvolvimento (cuidado com mobilidade)',
    muscleGroups: ['Deltoides', 'Tríceps'],
    equipment: 'Barra',
    instructions: ['Boa mobilidade necessária', 'Barra atrás da cabeça', 'Amplitude limitada', 'Movimento controlado']
  },

  // === BRAÇOS - BÍCEPS ===
  {
    id: '29',
    name: 'Rosca Direta',
    description: 'Exercício fundamental para bíceps',
    muscleGroups: ['Bíceps'],
    equipment: 'Barra',
    instructions: ['Pegada supinada', 'Cotovelos fixos', 'Flexione até a contração máxima', 'Desça controladamente']
  },
  {
    id: '30',
    name: 'Rosca com Halteres',
    description: 'Trabalho unilateral dos bíceps',
    muscleGroups: ['Bíceps'],
    equipment: 'Halteres',
    instructions: ['Halteres ao lado do corpo', 'Flexione alternadamente', 'Gire o punho', 'Contraia no topo']
  },
  {
    id: '31',
    name: 'Rosca Martelo',
    description: 'Trabalha bíceps e braquial',
    muscleGroups: ['Bíceps', 'Antebraço'],
    equipment: 'Halteres',
    instructions: ['Pegada neutra', 'Cotovelos fixos', 'Movimento controlado', 'Foque no braquial']
  },
  {
    id: '32',
    name: 'Rosca Scott',
    description: 'Isolamento total dos bíceps',
    muscleGroups: ['Bíceps'],
    equipment: 'Barra',
    instructions: ['Apoie os braços no banco Scott', 'Movimento controlado', 'Não estenda completamente', 'Foque na contração']
  },
  {
    id: '33',
    name: 'Rosca Concentrada',
    description: 'Máximo isolamento do bíceps',
    muscleGroups: ['Bíceps'],
    equipment: 'Halteres',
    instructions: ['Sente-se, cotovelo apoiado', 'Movimento lento', 'Contração máxima', 'Conexão mente-músculo']
  },
  {
    id: '34',
    name: 'Rosca na Polia',
    description: 'Resistência constante para bíceps',
    muscleGroups: ['Bíceps'],
    equipment: 'Cabo',
    instructions: ['Cabo na posição baixa', 'Cotovelos fixos', 'Resistência constante', 'Contraia no topo']
  },

  // === BRAÇOS - TRÍCEPS ===
  {
    id: '35',
    name: 'Tríceps Testa',
    description: 'Isolamento eficaz do tríceps',
    muscleGroups: ['Tríceps'],
    equipment: 'Barra',
    instructions: ['Deite-se no banco', 'Barra acima da testa', 'Flexione apenas os cotovelos', 'Movimento controlado']
  },
  {
    id: '36',
    name: 'Tríceps na Polia',
    description: 'Exercício clássico para tríceps',
    muscleGroups: ['Tríceps'],
    equipment: 'Cabo',
    instructions: ['Cabo na posição alta', 'Cotovelos fixos ao corpo', 'Estenda completamente', 'Contraia no final']
  },
  {
    id: '37',
    name: 'Mergulho',
    description: 'Exercício com peso corporal para tríceps',
    muscleGroups: ['Tríceps', 'Peitoral'],
    equipment: 'Peso Corporal',
    instructions: ['Apoie-se nas barras paralelas', 'Desça flexionando os cotovelos', 'Empurre para cima', 'Foque no tríceps']
  },
  {
    id: '38',
    name: 'Tríceps Francês',
    description: 'Exercício sentado para tríceps',
    muscleGroups: ['Tríceps'],
    equipment: 'Halteres',
    instructions: ['Halter acima da cabeça', 'Flexione apenas os cotovelos', 'Desça atrás da cabeça', 'Estenda completamente']
  },
  {
    id: '39',
    name: 'Flexão Diamante',
    description: 'Variação da flexão para tríceps',
    muscleGroups: ['Tríceps', 'Peitoral'],
    equipment: 'Peso Corporal',
    instructions: ['Mãos formando diamante', 'Cotovelos próximos ao corpo', 'Movimento controlado', 'Foque no tríceps']
  },
  {
    id: '40',
    name: 'Tríceps Coice',
    description: 'Isolamento unilateral do tríceps',
    muscleGroups: ['Tríceps'],
    equipment: 'Halteres',
    instructions: ['Incline o tronco', 'Cotovelo fixo', 'Estenda o braço para trás', 'Contraia no final']
  },

  // === PERNAS - QUADRÍCEPS ===
  {
    id: '41',
    name: 'Agachamento',
    description: 'Rei dos exercícios para pernas',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    equipment: 'Barra',
    instructions: ['Barra nas costas', 'Pés na largura dos ombros', 'Desça até 90°', 'Empurre com os calcanhares']
  },
  {
    id: '42',
    name: 'Agachamento Frontal',
    description: 'Maior ativação do quadríceps',
    muscleGroups: ['Quadríceps', 'Core'],
    equipment: 'Barra',
    instructions: ['Barra na frente dos ombros', 'Cotovelos altos', 'Tronco ereto', 'Movimento controlado']
  },
  {
    id: '43',
    name: 'Leg Press',
    description: 'Exercício seguro para quadríceps',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Máquina',
    instructions: ['Pés na plataforma', 'Desça até 90°', 'Empurre com força', 'Não trave os joelhos']
  },
  {
    id: '44',
    name: 'Extensão de Pernas',
    description: 'Isolamento do quadríceps',
    muscleGroups: ['Quadríceps'],
    equipment: 'Máquina',
    instructions: ['Sente-se na máquina', 'Estenda as pernas', 'Contraia no topo', 'Desça controladamente']
  },
  {
    id: '45',
    name: 'Afundo',
    description: 'Exercício unilateral para pernas',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Halteres',
    instructions: ['Passo largo à frente', 'Desça o joelho traseiro', 'Empurre com a perna da frente', 'Alterne as pernas']
  },
  {
    id: '46',
    name: 'Agachamento Búlgaro',
    description: 'Variação unilateral do agachamento',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Peso Corporal',
    instructions: ['Pé traseiro elevado', 'Desça a perna da frente', 'Movimento controlado', 'Foque na perna da frente']
  },
  {
    id: '47',
    name: 'Hack Squat',
    description: 'Variação do agachamento na máquina',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Máquina',
    instructions: ['Posicione-se na máquina', 'Pés na plataforma', 'Desça controladamente', 'Empurre com força']
  },

  // === PERNAS - POSTERIORES ===
  {
    id: '48',
    name: 'Stiff',
    description: 'Exercício para isquiotibiais e glúteos',
    muscleGroups: ['Isquiotibiais', 'Glúteos'],
    equipment: 'Barra',
    instructions: ['Pernas ligeiramente flexionadas', 'Desça a barra próxima às pernas', 'Sinta o alongamento', 'Volte contraindo os glúteos']
  },
  {
    id: '49',
    name: 'Mesa Flexora',
    description: 'Isolamento dos isquiotibiais',
    muscleGroups: ['Isquiotibiais'],
    equipment: 'Máquina',
    instructions: ['Deite-se na máquina', 'Flexione as pernas', 'Contraia os isquiotibiais', 'Desça controladamente']
  },
  {
    id: '50',
    name: 'Elevação Pélvica',
    description: 'Exercício para glúteos e isquiotibiais',
    muscleGroups: ['Glúteos', 'Isquiotibiais'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Pés apoiados', 'Eleve o quadril', 'Contraia os glúteos no topo']
  },
  {
    id: '51',
    name: 'Good Morning',
    description: 'Exercício para lombar e isquiotibiais',
    muscleGroups: ['Lombar', 'Isquiotibiais'],
    equipment: 'Barra',
    instructions: ['Barra nas costas', 'Incline o tronco para frente', 'Mantenha as costas retas', 'Volte contraindo os glúteos']
  },
  {
    id: '52',
    name: 'Cadeira Abdutora',
    description: 'Isolamento dos glúteos',
    muscleGroups: ['Glúteos'],
    equipment: 'Máquina',
    instructions: ['Sente-se na máquina', 'Abra as pernas contra a resistência', 'Contraia os glúteos', 'Movimento controlado']
  },

  // === PANTURRILHAS ===
  {
    id: '53',
    name: 'Panturrilha em Pé',
    description: 'Exercício fundamental para panturrilhas',
    muscleGroups: ['Panturrilha'],
    equipment: 'Máquina',
    instructions: ['Apoie os ombros', 'Eleve-se na ponta dos pés', 'Contraia no topo', 'Desça alongando']
  },
  {
    id: '54',
    name: 'Panturrilha Sentada',
    description: 'Foca no músculo sóleo',
    muscleGroups: ['Panturrilha'],
    equipment: 'Máquina',
    instructions: ['Sente-se na máquina', 'Peso sobre os joelhos', 'Eleve na ponta dos pés', 'Amplitude completa']
  },

  // === CORE/ABDÔMEN ===
  {
    id: '55',
    name: 'Abdominal Supra',
    description: 'Exercício clássico para abdômen',
    muscleGroups: ['Abdômen'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Mãos atrás da cabeça', 'Eleve o tronco', 'Contraia o abdômen']
  },
  {
    id: '56',
    name: 'Prancha',
    description: 'Exercício isométrico para core',
    muscleGroups: ['Core', 'Abdômen'],
    equipment: 'Peso Corporal',
    instructions: ['Posição de flexão', 'Apoie nos antebraços', 'Mantenha o corpo reto', 'Respire normalmente']
  },
  {
    id: '57',
    name: 'Abdominal Infra',
    description: 'Foca na porção inferior do abdômen',
    muscleGroups: ['Abdômen'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Eleve as pernas', 'Flexione os joelhos', 'Contraia o abdômen']
  },
  {
    id: '58',
    name: 'Russian Twist',
    description: 'Exercício para oblíquos',
    muscleGroups: ['Oblíquos', 'Abdômen'],
    equipment: 'Peso Corporal',
    instructions: ['Sente-se inclinado', 'Gire o tronco lateralmente', 'Toque o chão dos lados', 'Movimento controlado']
  },
  {
    id: '59',
    name: 'Mountain Climber',
    description: 'Exercício dinâmico para core',
    muscleGroups: ['Core', 'Cardio'],
    equipment: 'Peso Corporal',
    instructions: ['Posição de prancha', 'Alterne os joelhos ao peito', 'Movimento rápido', 'Mantenha o core contraído']
  },
  {
    id: '60',
    name: 'Dead Bug',
    description: 'Exercício de estabilização do core',
    muscleGroups: ['Core'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Braços e pernas a 90°', 'Estenda braço e perna opostos', 'Mantenha o core estável']
  },

  // === CARDIO/FUNCIONAIS ===
  {
    id: '61',
    name: 'Burpee',
    description: 'Exercício funcional completo',
    muscleGroups: ['Corpo Todo', 'Cardio'],
    equipment: 'Peso Corporal',
    instructions: ['Agachamento', 'Prancha', 'Flexão', 'Salto vertical']
  },
  {
    id: '62',
    name: 'Jumping Jack',
    description: 'Exercício cardiovascular clássico',
    muscleGroups: ['Cardio', 'Pernas'],
    equipment: 'Peso Corporal',
    instructions: ['Salte abrindo pernas e braços', 'Volte à posição inicial', 'Movimento rítmico', 'Mantenha o ritmo']
  },
  {
    id: '63',
    name: 'High Knees',
    description: 'Corrida estacionária com joelhos altos',
    muscleGroups: ['Cardio', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Eleve os joelhos alternadamente', 'Braços em movimento', 'Ritmo acelerado', 'Core contraído']
  },
  {
    id: '64',
    name: 'Agachamento com Salto',
    description: 'Variação pliométrica do agachamento',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Cardio'],
    equipment: 'Peso Corporal',
    instructions: ['Agachamento normal', 'Salte explosivamente', 'Aterrisse suavemente', 'Repita o movimento']
  },
  {
    id: '65',
    name: 'Bear Crawl',
    description: 'Exercício de mobilidade e força',
    muscleGroups: ['Core', 'Ombros', 'Pernas'],
    equipment: 'Peso Corporal',
    instructions: ['Posição quadrúpede', 'Joelhos ligeiramente elevados', 'Caminhe para frente/trás', 'Mantenha o core estável']
  },

  // === EXERCÍCIOS ADICIONAIS ===
  {
    id: '66',
    name: 'Farmer\'s Walk',
    description: 'Exercício funcional de caminhada com peso',
    muscleGroups: ['Antebraço', 'Core', 'Trapézio'],
    equipment: 'Halteres',
    instructions: ['Segure pesos pesados', 'Caminhe mantendo postura', 'Passos controlados', 'Core contraído']
  },
  {
    id: '67',
    name: 'Turkish Get-Up',
    description: 'Exercício complexo de mobilidade e força',
    muscleGroups: ['Corpo Todo', 'Core'],
    equipment: 'Kettlebell',
    instructions: ['Deite-se com peso acima', 'Levante-se mantendo o peso', 'Movimento complexo', 'Foque na estabilidade']
  },
  {
    id: '68',
    name: 'Kettlebell Swing',
    description: 'Exercício balístico para posterior',
    muscleGroups: ['Glúteos', 'Isquiotibiais', 'Core'],
    equipment: 'Kettlebell',
    instructions: ['Kettlebell entre as pernas', 'Movimento de quadril', 'Balanço até o peito', 'Força dos glúteos']
  },
  {
    id: '69',
    name: 'Thruster',
    description: 'Combinação de agachamento e desenvolvimento',
    muscleGroups: ['Corpo Todo'],
    equipment: 'Halteres',
    instructions: ['Agachamento com halteres', 'Levante e empurre acima', 'Movimento fluido', 'Explosivo']
  },
  {
    id: '70',
    name: 'Wall Ball',
    description: 'Exercício funcional com medicine ball',
    muscleGroups: ['Pernas', 'Ombros', 'Core'],
    equipment: 'Medicine Ball',
    instructions: ['Agachamento com bola', 'Arremesse na parede', 'Pegue e repita', 'Movimento contínuo']
  },

  // === EXERCÍCIOS DE MOBILIDADE ===
  {
    id: '71',
    name: 'Cat-Cow',
    description: 'Mobilidade da coluna vertebral',
    muscleGroups: ['Lombar', 'Mobilidade'],
    equipment: 'Peso Corporal',
    instructions: ['Posição quadrúpede', 'Alterne flexão e extensão', 'Movimento suave', 'Respire profundamente']
  },
  {
    id: '72',
    name: 'Hip Circle',
    description: 'Mobilidade do quadril',
    muscleGroups: ['Quadril', 'Mobilidade'],
    equipment: 'Peso Corporal',
    instructions: ['Em pé, mãos no quadril', 'Circule o quadril', 'Ambas as direções', 'Movimento amplo']
  },
  {
    id: '73',
    name: 'Shoulder Roll',
    description: 'Mobilidade dos ombros',
    muscleGroups: ['Ombros', 'Mobilidade'],
    equipment: 'Peso Corporal',
    instructions: ['Circule os ombros', 'Para frente e para trás', 'Movimento amplo', 'Relaxe a tensão']
  },
  {
    id: '74',
    name: 'Leg Swing',
    description: 'Aquecimento dinâmico das pernas',
    muscleGroups: ['Quadril', 'Mobilidade'],
    equipment: 'Peso Corporal',
    instructions: ['Apoie-se em algo', 'Balance a perna', 'Frente e trás', 'Lateralmente']
  },
  {
    id: '75',
    name: 'Arm Circle',
    description: 'Aquecimento dos ombros',
    muscleGroups: ['Ombros', 'Mobilidade'],
    equipment: 'Peso Corporal',
    instructions: ['Braços estendidos', 'Circule para frente', 'Depois para trás', 'Movimento controlado']
  },

  // === EXERCÍCIOS ISOMÉTRICOS ===
  {
    id: '76',
    name: 'Wall Sit',
    description: 'Exercício isométrico para pernas',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Peso Corporal',
    instructions: ['Costas na parede', 'Desça até 90°', 'Mantenha a posição', 'Respire normalmente']
  },
  {
    id: '77',
    name: 'Prancha Lateral',
    description: 'Isométrico para oblíquos',
    muscleGroups: ['Oblíquos', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de lado', 'Apoie no antebraço', 'Eleve o quadril', 'Corpo alinhado']
  },
  {
    id: '78',
    name: 'Hollow Hold',
    description: 'Isométrico para abdômen',
    muscleGroups: ['Abdômen', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Eleve ombros e pernas', 'Forma de banana', 'Mantenha a posição']
  },
  {
    id: '79',
    name: 'Superman Hold',
    description: 'Isométrico para lombar',
    muscleGroups: ['Lombar', 'Glúteos'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de bruços', 'Eleve peito e pernas', 'Mantenha a posição', 'Contraia os glúteos']
  },
  {
    id: '80',
    name: 'Single Leg Glute Bridge Hold',
    description: 'Isométrico unilateral para glúteos',
    muscleGroups: ['Glúteos', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Ponte com uma perna', 'Mantenha o quadril elevado', 'Contraia o glúteo', 'Alterne as pernas']
  },

  // === EXERCÍCIOS AVANÇADOS ===
  {
    id: '81',
    name: 'Muscle-Up (Subida na Barra)',
    description: 'Exercício avançado de barra',
    muscleGroups: ['Dorsais', 'Peitorais', 'Tríceps'],
    equipment: 'Barra',
    instructions: ['Barra fixa explosiva', 'Transição sobre a barra', 'Empurre para cima', 'Movimento técnico']
  },
  {
    id: '82',
    name: 'Agachamento Pistola',
    description: 'Agachamento unilateral avançado',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Uma perna estendida', 'Agachamento completo', 'Equilíbrio e força', 'Movimento controlado']
  },
  {
    id: '83',
    name: 'Handstand Push-Up',
    description: 'Flexão em parada de mão',
    muscleGroups: ['Deltoides', 'Tríceps', 'Core'],
    equipment: 'Peso Corporal',
    instructions: ['Parada de mão na parede', 'Flexione os braços', 'Empurre para cima', 'Equilíbrio avançado']
  },
  {
    id: '84',
    name: 'Dragon Flag',
    description: 'Exercício avançado de core',
    muscleGroups: ['Core', 'Abdômen'],
    equipment: 'Banco',
    instructions: ['Segure o banco', 'Corpo reto horizontal', 'Desça controladamente', 'Força extrema do core']
  },
  {
    id: '85',
    name: 'Human Flag',
    description: 'Exercício isométrico extremo',
    muscleGroups: ['Core', 'Dorsais', 'Ombros'],
    equipment: 'Barra Vertical',
    instructions: ['Segure a barra vertical', 'Corpo horizontal', 'Força e técnica extremas', 'Progressão lenta']
  },

  // === EXERCÍCIOS COM EQUIPAMENTOS ESPECÍFICOS ===
  {
    id: '86',
    name: 'Corda Naval',
    description: 'Exercício cardiovascular intenso',
    muscleGroups: ['Cardio', 'Core', 'Ombros'],
    equipment: 'Corda Naval',
    instructions: ['Segure as cordas', 'Movimento ondulatório', 'Ritmo intenso', 'Core contraído']
  },
  {
    id: '87',
    name: 'Salto na Caixa',
    description: 'Salto pliométrico em caixa',
    muscleGroups: ['Pernas', 'Glúteos', 'Cardio'],
    equipment: 'Caixa',
    instructions: ['Salte na caixa', 'Aterrisse suavemente', 'Desça controladamente', 'Explosão nas pernas']
  },
  {
    id: '88',
    name: 'Empurrar Trenó',
    description: 'Empurrar trenó com peso',
    muscleGroups: ['Pernas', 'Core', 'Cardio'],
    equipment: 'Trenó',
    instructions: ['Empurre o trenó', 'Passos curtos e rápidos', 'Core contraído', 'Força funcional']
  },
  {
    id: '89',
    name: 'Virar Pneu',
    description: 'Virar pneu gigante',
    muscleGroups: ['Corpo Todo'],
    equipment: 'Pneu',
    instructions: ['Agache e segure o pneu', 'Levante e empurre', 'Movimento explosivo', 'Força funcional']
  },
  {
    id: '90',
    name: 'Martelada',
    description: 'Martelada em pneu',
    muscleGroups: ['Core', 'Ombros', 'Cardio'],
    equipment: 'Marreta',
    instructions: ['Segure a marreta', 'Bata no pneu', 'Movimento controlado', 'Core ativo']
  },

  // === EXERCÍCIOS DE REABILITAÇÃO ===
  {
    id: '91',
    name: 'Band Pull Apart',
    description: 'Fortalecimento dos romboides',
    muscleGroups: ['Romboides', 'Deltoides'],
    equipment: 'Elástico',
    instructions: ['Segure o elástico', 'Puxe separando as mãos', 'Contraia as escápulas', 'Movimento controlado']
  },
  {
    id: '92',
    name: 'Clamshell',
    description: 'Ativação do glúteo médio',
    muscleGroups: ['Glúteos'],
    equipment: 'Elástico',
    instructions: ['Deite-se de lado', 'Joelhos flexionados', 'Abra o joelho superior', 'Contraia o glúteo']
  },
  {
    id: '93',
    name: 'Cão Pássaro',
    description: 'Estabilização do core e coluna',
    muscleGroups: ['Core', 'Lombar'],
    equipment: 'Peso Corporal',
    instructions: ['Posição quadrúpede', 'Estenda braço e perna opostos', 'Mantenha o equilíbrio', 'Core estável']
  },
  {
    id: '94',
    name: 'Glute Bridge',
    description: 'Ativação básica dos glúteos',
    muscleGroups: ['Glúteos', 'Isquiotibiais'],
    equipment: 'Peso Corporal',
    instructions: ['Deite-se de costas', 'Pés apoiados', 'Eleve o quadril', 'Contraia os glúteos']
  },
  {
    id: '95',
    name: 'Wall Angel',
    description: 'Mobilidade dos ombros',
    muscleGroups: ['Ombros', 'Mobilidade'],
    equipment: 'Parede',
    instructions: ['Costas na parede', 'Braços em W', 'Deslize para cima e baixo', 'Mantenha contato com a parede']
  },

  // === EXERCÍCIOS FINAIS ===
  {
    id: '96',
    name: 'Reverse Fly',
    description: 'Isolamento do deltoide posterior',
    muscleGroups: ['Deltoides'],
    equipment: 'Halteres',
    instructions: ['Incline o tronco', 'Abra os braços lateralmente', 'Contraia as escápulas', 'Movimento em arco']
  },
  {
    id: '97',
    name: 'Lateral Lunge',
    description: 'Agachamento lateral',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Adutores'],
    equipment: 'Peso Corporal',
    instructions: ['Passo lateral amplo', 'Agache na perna de apoio', 'Empurre de volta', 'Alterne os lados']
  },
  {
    id: '98',
    name: 'Reverse Lunge',
    description: 'Afundo para trás',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    equipment: 'Peso Corporal',
    instructions: ['Passo para trás', 'Desça o joelho', 'Empurre com a perna da frente', 'Movimento controlado']
  },
  {
    id: '99',
    name: 'Single Arm Row',
    description: 'Remada unilateral',
    muscleGroups: ['Dorsais', 'Bíceps'],
    equipment: 'Halteres',
    instructions: ['Apoie-se no banco', 'Puxe o halter', 'Cotovelo próximo ao corpo', 'Contraia as costas']
  },
  {
    id: '100',
    name: 'Overhead Carry',
    description: 'Caminhada com peso acima da cabeça',
    muscleGroups: ['Ombros', 'Core'],
    equipment: 'Halteres',
    instructions: ['Peso acima da cabeça', 'Caminhe mantendo postura', 'Core contraído', 'Ombros estáveis']
  },
  {
    id: '101',
    name: 'Goblet Squat',
    description: 'Agachamento com peso no peito',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Core'],
    equipment: 'Kettlebell',
    instructions: ['Segure o peso no peito', 'Agachamento profundo', 'Cotovelos entre as pernas', 'Movimento controlado']
  },
  {
    id: '102',
    name: 'Renegade Row',
    description: 'Remada em posição de prancha',
    muscleGroups: ['Dorsais', 'Core', 'Ombros'],
    equipment: 'Halteres',
    instructions: ['Prancha com halteres', 'Reme alternadamente', 'Mantenha o core estável', 'Não gire o quadril']
  },
  {
    id: '103',
    name: 'Single Leg Deadlift',
    description: 'Levantamento terra unilateral',
    muscleGroups: ['Isquiotibiais', 'Glúteos', 'Core'],
    equipment: 'Halteres',
    instructions: ['Apoie-se em uma perna', 'Incline para frente', 'Perna livre para trás', 'Equilíbrio e controle']
  },
  {
    id: '104',
    name: 'Plank to Push-Up',
    description: 'Transição de prancha para flexão',
    muscleGroups: ['Core', 'Peitorais', 'Ombros'],
    equipment: 'Peso Corporal',
    instructions: ['Inicie em prancha', 'Suba para flexão', 'Volte para prancha', 'Movimento fluido']
  },
  {
    id: '105',
    name: 'Curtsy Lunge',
    description: 'Afundo em reverência',
    muscleGroups: ['Glúteos', 'Quadríceps'],
    equipment: 'Peso Corporal',
    instructions: ['Perna cruzada para trás', 'Desça em afundo', 'Foque no glúteo', 'Movimento elegante']
  }
];

class WorkoutService {
  private storageKey = 'gym-dashboard-data';

  // Inicializar dados se não existirem
  private initializeData() {
    const data = this.getData();
    if (!data.exercises.length) {
      this.saveData({
        ...data,
        exercises: defaultExercises
      });
    }
  }

  // Obter dados do localStorage
  private getData() {
    if (typeof window === 'undefined') {
      return { workouts: [], exercises: [], templates: [] };
    }

    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return { workouts: [], exercises: [], templates: [] };
    }

    try {
      const parsed = JSON.parse(data);
      // Converter strings de data de volta para objetos Date
      parsed.workouts = parsed.workouts?.map((workout: Workout) => ({
        ...workout,
        createdAt: new Date(workout.createdAt),
        updatedAt: new Date(workout.updatedAt)
      })) || [];
      
      parsed.templates = parsed.templates?.map((template: WorkoutTemplate) => ({
        ...template,
        createdAt: new Date(template.createdAt)
      })) || [];

      return {
        workouts: parsed.workouts || [],
        exercises: parsed.exercises || [],
        templates: parsed.templates || []
      };
    } catch {
      return { workouts: [], exercises: [], templates: [] };
    }
  }

  // Salvar dados no localStorage
  private saveData(data: { workouts: Workout[]; exercises: Exercise[]; templates: WorkoutTemplate[] }) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Simular delay de API
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // CRUD para Workouts
  async getWorkouts(filters?: FilterOptions, sort?: SortOptions): Promise<ApiResponse<Workout[]>> {
    await this.delay();
    this.initializeData();
    
    let { workouts } = this.getData();

    // Aplicar filtros
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        workouts = workouts.filter((workout: Workout) => 
          workout.name.toLowerCase().includes(search) ||
          workout.description?.toLowerCase().includes(search)
        );
      }

      if (filters.difficulty?.length) {
        workouts = workouts.filter((workout: Workout) => 
          workout.difficulty && filters.difficulty!.includes(workout.difficulty)
        );
      }

      if (filters.tags?.length) {
        workouts = workouts.filter((workout: Workout) => 
          workout.tags && workout.tags.some((tag: string) => filters.tags!.includes(tag))
        );
      }
    }

    // Aplicar ordenação
    if (sort) {
      workouts.sort((a: Workout, b: Workout) => {
        const aValue = a[sort.field as keyof Workout];
        const bValue = b[sort.field as keyof Workout];
        
        // Converter para string para comparação segura
        const aStr = String(aValue || '');
        const bStr = String(bValue || '');
        
        if (sort.direction === 'asc') {
          return aStr > bStr ? 1 : -1;
        } else {
          return aStr < bStr ? 1 : -1;
        }
      });
    }

    return {
      data: workouts,
      success: true,
      message: 'Treinos carregados com sucesso'
    };
  }

  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Workout>> {
    await this.delay();
    
    const newWorkout: Workout = {
      ...workout,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const data = this.getData();
    data.workouts.push(newWorkout);
    this.saveData(data);

    return {
      data: newWorkout,
      success: true,
      message: 'Treino criado com sucesso'
    };
  }

  async updateWorkout(workout: Workout): Promise<ApiResponse<Workout>> {
    await this.delay();
    
    const updatedWorkout = {
      ...workout,
      updatedAt: new Date()
    };

    const data = this.getData();
    const index = data.workouts.findIndex((w: Workout) => w.id === workout.id);
    
    if (index === -1) {
      throw new Error('Treino não encontrado');
    }

    data.workouts[index] = updatedWorkout;
    this.saveData(data);

    return {
      data: updatedWorkout,
      success: true,
      message: 'Treino atualizado com sucesso'
    };
  }

  async deleteWorkout(id: string): Promise<ApiResponse<void>> {
    await this.delay();
    
    const data = this.getData();
    const index = data.workouts.findIndex((w: Workout) => w.id === id);
    
    if (index === -1) {
      throw new Error('Treino não encontrado');
    }

    data.workouts.splice(index, 1);
    this.saveData(data);

    return {
      data: undefined,
      success: true,
      message: 'Treino excluído com sucesso'
    };
  }

  // CRUD para Exercises
  async getExercises(filters?: FilterOptions): Promise<ApiResponse<Exercise[]>> {
    await this.delay();
    this.initializeData();
    
    let { exercises } = this.getData();

    // Aplicar filtros
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        exercises = exercises.filter((exercise: Exercise) => 
          exercise.name.toLowerCase().includes(search) ||
          exercise.description?.toLowerCase().includes(search)
        );
      }

      if (filters.muscleGroups?.length) {
        exercises = exercises.filter((exercise: Exercise) =>
          exercise.muscleGroups.some((group: string) => filters.muscleGroups!.includes(group))
        );
      }

      if (filters.equipment?.length) {
        exercises = exercises.filter((exercise: Exercise) => 
          filters.equipment!.includes(exercise.equipment || '')
        );
      }
    }

    return {
      data: exercises,
      success: true,
      message: 'Exercícios carregados com sucesso'
    };
  }

  async createExercise(exercise: Omit<Exercise, 'id'>): Promise<ApiResponse<Exercise>> {
    await this.delay();
    
    const newExercise: Exercise = {
      ...exercise,
      id: crypto.randomUUID()
    };

    const data = this.getData();
    data.exercises.push(newExercise);
    this.saveData(data);

    return {
      data: newExercise,
      success: true,
      message: 'Exercício criado com sucesso'
    };
  }

  async updateExercise(exercise: Exercise): Promise<ApiResponse<Exercise>> {
    await this.delay();
    
    const data = this.getData();
    const index = data.exercises.findIndex((e: Exercise) => e.id === exercise.id);
    
    if (index === -1) {
      throw new Error('Exercício não encontrado');
    }

    data.exercises[index] = exercise;
    this.saveData(data);

    return {
      data: exercise,
      success: true,
      message: 'Exercício atualizado com sucesso'
    };
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    await this.delay();
    
    const data = this.getData();
    const index = data.exercises.findIndex((e: Exercise) => e.id === id);
    
    if (index === -1) {
      throw new Error('Exercício não encontrado');
    }

    data.exercises.splice(index, 1);
    this.saveData(data);

    return {
      data: undefined,
      success: true,
      message: 'Exercício excluído com sucesso'
    };
  }

  // CRUD para Templates
  async getTemplates(): Promise<ApiResponse<WorkoutTemplate[]>> {
    await this.delay();
    this.initializeData();
    
    const { templates } = this.getData();

    return {
      data: templates,
      success: true,
      message: 'Templates carregados com sucesso'
    };
  }

  async createTemplate(template: Omit<WorkoutTemplate, 'id' | 'createdAt'>): Promise<ApiResponse<WorkoutTemplate>> {
    await this.delay();
    
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    const data = this.getData();
    data.templates.push(newTemplate);
    this.saveData(data);

    return {
      data: newTemplate,
      success: true,
      message: 'Template criado com sucesso'
    };
  }
}

export const workoutService = new WorkoutService();