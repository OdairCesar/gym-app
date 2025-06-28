import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';

import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { Training } from '@/interfaces/Training';
import { Exercise } from '@/interfaces/Exercise';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ExerciseItemProps {
  exercicio: Exercise;
  onComplete: () => void;
}

export default function TrainingExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    if (id) {
      fetchTraining();
    }
  }, [id]);

  const fetchTraining = async () => {
    const token = await getToken();

    if (!id) {
      setLoading(false);
      router.replace('/(client)/training');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.86:8844/api/training/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.status || data.status === 'error') {
        setError(data.message || 'Erro ao carregar os treinos.');
        return;
      }

      if (data.status === 'success') {
        setTraining(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTraining();
    }, [])
  );

  useLayoutEffect(() => {
    if (training?.nome) {
      navigation.setOptions({ title: training.nome });
    }
  }, [training]);

  const handleCompleteExercise = (index: number) => {
    setCompletedExercises((prev) => [...prev, index]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Erro: {error}</Text>
      </View>
    );
  }

  if (!training) {
    return (
      <View style={styles.centered}>
        <Text>Treino não encontrado.</Text>
      </View>
    );
  }

  const orderedExercises = [...training.exercicios].sort((a, b) => a.ordem - b.ordem);
  const remainingExercises = orderedExercises.filter((_, index) => !completedExercises.includes(index));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        {remainingExercises.length === 0 && (
          <View style={styles.centered}>
            <Text style={{ fontSize: 18, color: 'green' }}>Treino Finalizado! 🎉</Text>
          </View>
        )}

        {remainingExercises.map((exercicio, index) => (
          <ExerciseItem
            key={exercicio.ordem} // Melhor chave
            exercicio={exercicio}
            onComplete={() => handleCompleteExercise(orderedExercises.indexOf(exercicio))}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

function ExerciseItem({ exercicio, onComplete }: ExerciseItemProps) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      if (e.translationX < 0) { // apenas swipe para esquerda
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -SCREEN_WIDTH * 0.3) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.2, {}, () => {
          runOnJS(onComplete)();
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.swipeContainer}>
        <View style={styles.swipeBackground}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Concluir</Text>
        </View>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>{exercicio.nome}</Text>
            {exercicio.series && (<Text>Séries: {exercicio.series}</Text>)}
            {exercicio.tipo && (<Text>Tipo: {exercicio.tipo}</Text>)}
            {exercicio.carga && (<Text>Carga: {exercicio.carga}</Text>)}
            {exercicio.descanso && (<Text>Descanso: {exercicio.descanso}</Text>)}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swipeContainer: {
    marginBottom: 12,
  },
  swipeBackground: {
    position: 'absolute',
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  }
});
