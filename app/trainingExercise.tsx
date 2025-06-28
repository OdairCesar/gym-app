import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  AppStateStatus,
  AppState,
} from 'react-native';
import {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { Training } from '@/interfaces/Training';
import { Exercise } from '@/interfaces/Exercise';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

const SCREEN_WIDTH = Dimensions.get('window').width;

const STORAGE_COMPLETED = '@completed_exercises';
const STORAGE_SKIPPED = '@skipped_exercises';
const TIMER_KEY = 'training_timer_start';
const TIMER_KEY_FINAL = 'training_timer_final';

// Utils para timer
const getNow = (): number => new Date().getTime();

function useTrainingTimer(exercisesLeft: number) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Função para agendar notificação com o tempo atualizado
  const scheduleOrUpdateNotification = async (elapsedSeconds: number) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏱ Treino em andamento',
        body: `Tempo de treino: ${minutes}:${seconds}`,
        sticky: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        repeats: true,
        seconds: 60,
      },
    });
  };

  // Inicializar timer e notificações no início do treino
  useEffect(() => {
    const init = async () => {
      const final = await AsyncStorage.getItem(TIMER_KEY_FINAL);
      const saved = await AsyncStorage.getItem(TIMER_KEY);
      const now = getNow();

      // Se já existe um startTime salvo, manter ele
      const start = saved ? Number(saved) : now;
      setStartTime(start);
      if (!saved) await AsyncStorage.setItem(TIMER_KEY, String(start));

      setElapsed(Math.floor(((final ? Number(final) : now) - start) / 1000));

      // Permissões de notificação
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }

      // Atualiza notificação só se ainda estiver em andamento
      if (exercisesLeft > 0) {
        await scheduleOrUpdateNotification(Math.floor((now - start) / 1000));
      } else if (!final) {
        await AsyncStorage.setItem(TIMER_KEY_FINAL, String(getNow()));
      }
    };

    init();
  }, []);

  // Atualizar elapsed a cada segundo enquanto houver exercícios
  useEffect(() => {
    if (!startTime || exercisesLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = getNow();
      const newElapsed = Math.floor((now - startTime) / 1000);
      setElapsed(newElapsed);
      scheduleOrUpdateNotification(newElapsed);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime, exercisesLeft]);

  // Ouvir mudanças no estado do app para pausar/continuar timer se precisar
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Quando app voltar para foreground, atualizar elapsed e notificação
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (startTime && exercisesLeft > 0) {
          const now = getNow();
          const newElapsed = Math.floor((now - startTime) / 1000);
          setElapsed(newElapsed);
          scheduleOrUpdateNotification(newElapsed);
        }
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [startTime, exercisesLeft]);

  return elapsed;
}

type Filter = 'all' | 'completed' | 'skipped';

interface ExerciseItemProps {
  exercicio: Exercise;
  onComplete: () => void;
  onSkip: () => void;
  disableComplete?: boolean;
  disableSkip?: boolean;
}

export default function TrainingExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [skippedExercises, setSkippedExercises] = useState<number[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const router = useRouter();
  const navigation = useNavigation();

  // Carregar treino
  useEffect(() => {
    if (id) fetchTraining();
  }, [id]);

  // Função para carregar treino e listas de concluídos e pulados do AsyncStorage
  const fetchTraining = async () => {
    const token = await getToken();
    if (!id) {
      setLoading(false);
      router.replace('/(client)/training');
      return;
    }

    try {
      const response = await fetch(
        `https://gym-api-24p5.onrender.com/api/training/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

    // Carregar do AsyncStorage
    const completedRaw = await AsyncStorage.getItem(STORAGE_COMPLETED);
    const skippedRaw = await AsyncStorage.getItem(STORAGE_SKIPPED);
    setCompletedExercises(completedRaw ? JSON.parse(completedRaw) : []);
    setSkippedExercises(skippedRaw ? JSON.parse(skippedRaw) : []);
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

  // Salvar concluídos
  const saveCompleted = async (list: number[]) => {
    setCompletedExercises(list);
    await AsyncStorage.setItem(STORAGE_COMPLETED, JSON.stringify(list));
  };

  // Salvar pulados
  const saveSkipped = async (list: number[]) => {
    setSkippedExercises(list);
    await AsyncStorage.setItem(STORAGE_SKIPPED, JSON.stringify(list));
  };

  const handleCompleteExercise = (index: number) => {
    if (completedExercises.includes(index)) return;
    saveCompleted([...completedExercises, index]);
    // Se estava pulado, remove da lista pulados
    if (skippedExercises.includes(index)) {
      const filtered = skippedExercises.filter((i) => i !== index);
      saveSkipped(filtered);
    }
  };

  const handleSkipExercise = (index: number) => {
    if (skippedExercises.includes(index)) return;
    saveSkipped([...skippedExercises, index]);
    // Se estava concluído, remove da lista concluídos
    if (completedExercises.includes(index)) {
      const filtered = completedExercises.filter((i) => i !== index);
      saveCompleted(filtered);
    }
  };

  // Ordenar exercícios
  const orderedExercises = useMemo(() => {
    if (!training) return [];
    return [...training.exercicios].sort((a, b) => a.ordem - b.ordem);
  }, [training]);

  // Filtrar exercícios para exibição conforme filtro
  const exercisesToShow = useMemo(() => {
    switch (filter) {
      case 'completed':
        return orderedExercises.filter((_, i) => completedExercises.includes(i));
      case 'skipped':
        return orderedExercises.filter((_, i) => skippedExercises.includes(i));
      default:
        // 'all'
        return orderedExercises.filter(
          (_, i) => !completedExercises.includes(i) && !skippedExercises.includes(i)
        );
    }
  }, [filter, orderedExercises, completedExercises, skippedExercises]);

  // Quantidade de exercícios pendentes (não concluídos e não pulados)
  const pendingExercisesCount = useMemo(() => {
    if (!training) return 0;
    return training.exercicios.length - completedExercises.length - skippedExercises.length;
  }, [training, completedExercises, skippedExercises]);

  // Cronômetro
  const elapsed = useTrainingTimer(pendingExercisesCount);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // Cancelar notificações ao terminar treino
  useEffect(() => {
    if (exercisesToShow.length === 0) {
      void Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [exercisesToShow]);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Cronômetro */}
        <Text style={styles.timerText}>
          Tempo de treino: {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </Text>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              Concluídos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'skipped' && styles.filterButtonActive]}
            onPress={() => setFilter('skipped')}
          >
            <Text style={[styles.filterText, filter === 'skipped' && styles.filterTextActive]}>
              Pulados
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mensagem final */}
        {exercisesToShow.length === 0 && (
          <View style={styles.centered}>
            <Text style={{ fontSize: 18, color: 'green' }}>Treino Finalizado! 🎉</Text>
          </View>
        )}

        {/* Lista de exercícios */}
        {exercisesToShow.map((exercicio, idx) => {
          // índice original para marcar concluído/pulado
          const originalIndex = orderedExercises.indexOf(exercicio);

          return (
            <ExerciseItem
              key={exercicio.ordem}
              exercicio={exercicio}
              onComplete={() => handleCompleteExercise(originalIndex)}
              onSkip={() => handleSkipExercise(originalIndex)}
              disableComplete={filter === 'completed'}
              disableSkip={filter === 'skipped'}
            />
          );
        })}
      </View>
    </GestureHandlerRootView>
  );
}

function ExerciseItem({
  exercicio,
  onComplete,
  onSkip,
  disableComplete,
  disableSkip,
}: ExerciseItemProps) {
  const translateX = useSharedValue(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.15;

  const panGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      // Bloquear swipe para a esquerda se disableComplete for true
      if (disableComplete && e.translationX < 0) return;
      // Bloquear swipe para a direita se disableSkip for true
      if (disableSkip && e.translationX > 0) return;

      translateX.value = e.translationX;

      if (e.translationX < 0) {
        runOnJS(setSwipeDirection)('left');
      } else if (e.translationX > 0) {
        runOnJS(setSwipeDirection)('right');
      } else {
        runOnJS(setSwipeDirection)(null);
      }
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.2, {}, () => {
          runOnJS(onComplete)();
          runOnJS(setSwipeDirection)(null);
        });
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.2, {}, () => {
          runOnJS(onSkip)();
          runOnJS(setSwipeDirection)(null);
        });
      } else {
        translateX.value = withTiming(0, {}, () => {
          runOnJS(setSwipeDirection)(null);
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.swipeContainer}>
        {swipeDirection === 'left' && (
          <View style={[styles.swipeBackground, styles.completeRight]}>
            <Text style={styles.backgroundText}>Concluir</Text>
          </View>
        )}

        {swipeDirection === 'right' && (
          <View style={[styles.swipeBackground, styles.skipLeft]}>
            <Text style={styles.backgroundText}>Pular</Text>
          </View>
        )}

        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>{exercicio.nome}</Text>
            {exercicio.series && <Text>Séries: {exercicio.series}</Text>}
            {exercicio.tipo && <Text>Tipo: {exercicio.tipo}</Text>}
            {exercicio.carga && <Text>Carga: {exercicio.carga}</Text>}
            {exercicio.descanso && <Text>Descanso: {exercicio.descanso}</Text>}
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
    flexDirection: 'row',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  skipLeft: {
    flex: 1,
    backgroundColor: '#ff5733',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  completeRight: {
    flex: 1,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  backgroundText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    marginBottom: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginHorizontal: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    color: '#444',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
});
