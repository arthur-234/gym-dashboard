'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Scale, Activity, Target, Utensils, Apple } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IMCResult {
  imc: number;
  classification: string;
  healthRisk: string;
  color: string;
  recommendations: string[];
}

interface DietPlan {
  targetCalories: number;
  goalDescription: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: number;
    snack1: number;
    lunch: number;
    snack2: number;
    dinner: number;
  };
  recommendations: string[];
  foods: string[];
}

type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

export default function CalculatorsPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [result, setResult] = useState<IMCResult | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [goal, setGoal] = useState('');
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const calculateIMC = () => {
    if (!height || !weight) return;
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const imcValue = weightInKg / (heightInMeters * heightInMeters);
    
    let classification = '';
    let healthRisk = '';
    let color = '';
    let recommendations: string[] = [];
    
    if (imcValue < 18.5) {
      classification = 'Abaixo do peso';
      healthRisk = 'Baixo risco, mas atenção à desnutrição';
      color = 'text-blue-600';
      recommendations = [
        'Consulte um nutricionista para ganho de peso saudável',
        'Inclua mais calorias nutritivas na dieta',
        'Pratique exercícios de força para ganho de massa muscular'
      ];
    } else if (imcValue >= 18.5 && imcValue < 25) {
      classification = 'Peso normal';
      healthRisk = 'Baixo risco';
      color = 'text-green-600';
      recommendations = [
        'Mantenha uma alimentação equilibrada',
        'Continue praticando exercícios regularmente',
        'Monitore seu peso periodicamente'
      ];
    } else if (imcValue >= 25 && imcValue < 30) {
      classification = 'Sobrepeso';
      healthRisk = 'Risco aumentado';
      color = 'text-yellow-600';
      recommendations = [
        'Reduza o consumo de calorias gradualmente',
        'Aumente a atividade física',
        'Consulte um profissional de saúde'
      ];
    } else if (imcValue >= 30 && imcValue < 35) {
      classification = 'Obesidade Grau I';
      healthRisk = 'Risco moderado';
      color = 'text-orange-600';
      recommendations = [
        'Procure orientação médica e nutricional',
        'Inicie um programa de exercícios supervisionado',
        'Considere mudanças significativas no estilo de vida'
      ];
    } else if (imcValue >= 35 && imcValue < 40) {
      classification = 'Obesidade Grau II';
      healthRisk = 'Risco alto';
      color = 'text-red-600';
      recommendations = [
        'Acompanhamento médico é essencial',
        'Considere tratamento multidisciplinar',
        'Avalie opções de tratamento mais intensivas'
      ];
    } else {
      classification = 'Obesidade Grau III';
      healthRisk = 'Risco muito alto';
      color = 'text-red-800';
      recommendations = [
        'Procure ajuda médica imediatamente',
        'Considere cirurgia bariátrica se indicado',
        'Tratamento multidisciplinar urgente'
      ];
    }
    
    setResult({
      imc: imcValue,
      classification,
      healthRisk,
      color,
      recommendations
    });
  };

  const calculateBMR = () => {
    if (!height || !weight || !age || !gender) return;
    
    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    const ageInYears = parseFloat(age);
    
    let bmrValue: number;
    
    if (gender === 'male') {
      // Fórmula de Harris-Benedict para homens
      bmrValue = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears);
    } else {
      // Fórmula de Harris-Benedict para mulheres
      bmrValue = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears);
    }
    
    setBmr(bmrValue);
    
    // Calcular TDEE se nível de atividade estiver selecionado
    if (activityLevel) {
      const activityMultipliers: Record<ActivityLevel, number> = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const tdeeValue = bmrValue * activityMultipliers[activityLevel as ActivityLevel];
      setTdee(tdeeValue);
    }
  };

  const calculateDietPlan = () => {
    if (!tdee || !goal) return;
    
    let targetCalories = tdee;
    let goalDescription = '';
    
    switch (goal) {
      case 'lose_weight':
        targetCalories = tdee - 500; // Déficit de 500 kcal para perder ~0.5kg/semana
        goalDescription = 'Perda de peso saudável';
        break;
      case 'maintain_weight':
        targetCalories = tdee;
        goalDescription = 'Manutenção do peso atual';
        break;
      case 'gain_weight':
        targetCalories = tdee + 500; // Superávit de 500 kcal para ganhar ~0.5kg/semana
        goalDescription = 'Ganho de peso saudável';
        break;
      case 'gain_muscle':
        targetCalories = tdee + 300; // Superávit menor para ganho de massa magra
        goalDescription = 'Ganho de massa muscular';
        break;
    }
    
    // Distribuição de macronutrientes
    const protein = Math.round((targetCalories * 0.25) / 4); // 25% das calorias, 4 kcal/g
    const carbs = Math.round((targetCalories * 0.45) / 4); // 45% das calorias, 4 kcal/g
    const fats = Math.round((targetCalories * 0.30) / 9); // 30% das calorias, 9 kcal/g
    
    // Distribuição por refeições (exemplo para 5 refeições)
    const mealDistribution = {
      breakfast: Math.round(targetCalories * 0.25), // 25%
      snack1: Math.round(targetCalories * 0.10), // 10%
      lunch: Math.round(targetCalories * 0.30), // 30%
      snack2: Math.round(targetCalories * 0.10), // 10%
      dinner: Math.round(targetCalories * 0.25), // 25%
    };
    
    // Recomendações específicas por objetivo
    let recommendations: string[] = [];
    let foods: string[] = [];
    
    if (goal === 'lose_weight') {
      recommendations = [
        'Priorize alimentos ricos em fibras para maior saciedade',
        'Beba bastante água (pelo menos 2L por dia)',
        'Evite alimentos ultraprocessados e açúcares refinados',
        'Faça refeições menores e mais frequentes',
        'Inclua exercícios cardiovasculares na rotina'
      ];
      foods = [
        'Proteínas: Frango, peixe, ovos, tofu, leguminosas',
        'Carboidratos: Aveia, quinoa, batata doce, arroz integral',
        'Gorduras: Abacate, castanhas, azeite, salmão',
        'Vegetais: Brócolis, espinafre, couve, abobrinha',
        'Frutas: Maçã, pera, frutas vermelhas, citros'
      ];
    } else if (goal === 'gain_muscle') {
      recommendations = [
        'Consuma proteína em todas as refeições',
        'Faça refeições pré e pós-treino adequadas',
        'Mantenha-se bem hidratado',
        'Priorize o sono (7-9 horas por noite)',
        'Combine com treino de força regular'
      ];
      foods = [
        'Proteínas: Whey protein, carne vermelha, frango, ovos',
        'Carboidratos: Arroz, macarrão, pão integral, banana',
        'Gorduras: Amendoim, castanhas, azeite, abacate',
        'Laticínios: Leite, iogurte grego, queijo cottage',
        'Suplementos: Creatina, BCAA (se necessário)'
      ];
    } else {
      recommendations = [
        'Mantenha uma alimentação equilibrada e variada',
        'Inclua todos os grupos alimentares',
        'Beba água regularmente',
        'Pratique atividade física regularmente',
        'Monitore seu peso semanalmente'
      ];
      foods = [
        'Proteínas: Carnes magras, peixes, ovos, leguminosas',
        'Carboidratos: Cereais integrais, tubérculos, frutas',
        'Gorduras: Oleaginosas, azeite, peixes gordos',
        'Vegetais: Variedade de cores e tipos',
        'Frutas: 2-3 porções por dia'
      ];
    }
    
    setDietPlan({
      targetCalories: Math.round(targetCalories),
      goalDescription,
      macros: { protein, carbs, fats },
      meals: mealDistribution,
      recommendations,
      foods
    });
  };

  const handleCalculate = () => {
    calculateIMC();
    calculateBMR();
    if (goal && tdee) {
      calculateDietPlan();
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setGender('');
    setActivityLevel('');
    setResult(null);
    setBmr(null);
    setTdee(null);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Calculadoras de Saúde</h1>
            <p className="text-muted-foreground text-lg">
              Ferramentas profissionais para monitorar sua saúde e fitness
            </p>
          </div>

          <Tabs defaultValue="imc" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="imc" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Calculadora IMC
              </TabsTrigger>
              <TabsTrigger value="dieta" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Plano Alimentar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imc" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulário de Entrada */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Dados Pessoais
                    </CardTitle>
                    <CardDescription>
                      Preencha seus dados para calcular IMC, TMB e TDEE
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Ex: 175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Ex: 70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="age">Idade (anos)</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Ex: 30"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Sexo</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity">Nível de Atividade</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                          <SelectItem value="light">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
                          <SelectItem value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                          <SelectItem value="active">Muito ativo (exercício pesado 6-7 dias/semana)</SelectItem>
                          <SelectItem value="very_active">Extremamente ativo (exercício muito pesado, trabalho físico)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          calculateIMC();
                          calculateBMR();
                        }} 
                        className="flex-1"
                        disabled={!height || !weight || !age || !gender || !activityLevel}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calcular
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetCalculator}
                      >
                        Limpar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Resultados */}
                <div className="space-y-6">
                  {result && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Scale className="h-5 w-5" />
                          Resultado IMC
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div className="text-4xl font-bold" style={{ color: result.color }}>
                             {result.imc.toFixed(1)}
                          </div>
                          <div>
                            <Badge 
                              variant="secondary" 
                              className="text-sm px-3 py-1"
                              style={{ backgroundColor: `${result.color}20`, color: result.color }}
                             >
                               {result.classification}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                             {result.healthRisk}
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <h4 className="font-semibold mb-2">Recomendações:</h4>
                          <ul className="space-y-1 text-sm">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {bmr && tdee && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Gasto Energético
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{Math.round(bmr)} kcal</div>
                            <div className="text-sm text-muted-foreground">TMB - Taxa Metabólica Basal</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{Math.round(tdee)} kcal</div>
                            <div className="text-sm text-muted-foreground">TDEE - Gasto Total Diário</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dieta" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulário para Plano Alimentar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Dados para Plano Alimentar
                    </CardTitle>
                    <CardDescription>
                      Complete todos os dados para gerar seu plano personalizado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="height-diet">Altura (cm)</Label>
                        <Input
                          id="height-diet"
                          type="number"
                          placeholder="Ex: 175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-diet">Peso (kg)</Label>
                        <Input
                          id="weight-diet"
                          type="number"
                          placeholder="Ex: 70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="age-diet">Idade (anos)</Label>
                        <Input
                          id="age-diet"
                          type="number"
                          placeholder="Ex: 30"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender-diet">Sexo</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-diet">Nível de Atividade</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                          <SelectItem value="light">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
                          <SelectItem value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                          <SelectItem value="active">Muito ativo (exercício pesado 6-7 dias/semana)</SelectItem>
                          <SelectItem value="very_active">Extremamente ativo (exercício muito pesado, trabalho físico)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal-diet">Objetivo</Label>
                      <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose_weight">Perder peso</SelectItem>
                          <SelectItem value="maintain_weight">Manter peso</SelectItem>
                          <SelectItem value="gain_weight">Ganhar peso</SelectItem>
                          <SelectItem value="gain_muscle">Ganhar massa muscular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          calculateBMR();
                          if (goal && tdee) {
                            calculateDietPlan();
                          }
                        }} 
                        className="flex-1"
                        disabled={!height || !weight || !age || !gender || !activityLevel || !goal}
                      >
                        <Utensils className="h-4 w-4 mr-2" />
                        Gerar Plano
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetCalculator}
                      >
                        Limpar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Resultados do Plano Alimentar */}
                <div className="space-y-6">
                  {bmr && tdee && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Gasto Energético
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{Math.round(bmr)} kcal</div>
                            <div className="text-sm text-muted-foreground">TMB - Taxa Metabólica Basal</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{Math.round(tdee)} kcal</div>
                            <div className="text-sm text-muted-foreground">TDEE - Gasto Total Diário</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {dietPlan && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Apple className="h-5 w-5" />
                          Seu Plano Alimentar
                        </CardTitle>
                        <CardDescription>
                          {dietPlan.goalDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Alert>
                          <Apple className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Meta Calórica Diária:</strong> {dietPlan.targetCalories} calorias
                          </AlertDescription>
                        </Alert>

                        <div>
                          <h4 className="font-semibold mb-3">Macronutrientes</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-center">
                              <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Proteínas</div>
                              <div className="text-xl font-bold">{dietPlan.macros.protein}g</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-center">
                              <div className="text-green-600 dark:text-green-400 font-semibold text-sm">Carboidratos</div>
                              <div className="text-xl font-bold">{dietPlan.macros.carbs}g</div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg text-center">
                              <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">Gorduras</div>
                              <div className="text-xl font-bold">{dietPlan.macros.fats}g</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Recomendações</h4>
                          <div className="space-y-2">
                            {dietPlan.recommendations.slice(0, 3).map((rec: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tabela de Referência IMC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tabela de Referência - IMC
              </CardTitle>
              <CardDescription>
                Classificação segundo a Organização Mundial da Saúde (OMS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <span>Abaixo do peso</span>
                  <span className="font-medium">&lt; 18,5</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                  <span>Peso normal</span>
                  <span className="font-medium">18,5 - 24,9</span>
                </div>
                <div className="flex justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <span>Sobrepeso</span>
                  <span className="font-medium">25,0 - 29,9</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                  <span>Obesidade Grau I</span>
                  <span className="font-medium">30,0 - 34,9</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                  <span>Obesidade Grau II</span>
                  <span className="font-medium">35,0 - 39,9</span>
                </div>
                <div className="flex justify-between p-3 bg-red-100 dark:bg-red-900/20 rounded">
                  <span>Obesidade Grau III</span>
                  <span className="font-medium">≥ 40,0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}