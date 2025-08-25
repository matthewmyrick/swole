import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { DaySchedule } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface DayDetailProps {
  route: any;
  navigation: any;
}

const DayDetail: React.FC<DayDetailProps> = ({ route, navigation }) => {
  const { daySchedule }: { daySchedule: DaySchedule } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.primary.main} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{daySchedule.day}</Text>
            <Text style={styles.headerSubtitle}>
              {daySchedule.routines.length === 0
                ? 'Rest & Recovery'
                : `${daySchedule.routines.length} routine${daySchedule.routines.length > 1 ? 's' : ''} scheduled`}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={animatedStyle}>
            {daySchedule.routines.length === 0 ? (
              <LinearGradient
                colors={colors.success.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.restDayGradient}
              >
                <View style={styles.restDayContainer}>
                  <Icon name="moon" size={48} color={colors.text.inverse} />
                  <Text style={styles.restDayTitle}>Rest & Recovery</Text>
                  <Text style={styles.restDayText}>
                    Take this day to rest and let your muscles recover. Stay hydrated and get good sleep!
                  </Text>
                </View>
              </LinearGradient>
            ) : (
              daySchedule.routines.map((routine, index) => (
                <TouchableOpacity
                  key={routine.id}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('RoutineDetail', { routine })}
                  style={{ marginBottom: spacing.md }}
                >
                  <View style={styles.routineCard}>
                    <LinearGradient
                      colors={colors.primary.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.routineNumberContainer}
                    >
                      <Text style={styles.routineNumberText}>{index + 1}</Text>
                    </LinearGradient>
                    
                    <View style={styles.routineContent}>
                      <View style={styles.routineHeader}>
                        <Text style={styles.routineName}>{routine.name}</Text>
                        <Icon name="chevron-forward" size={20} color={colors.text.tertiary} />
                      </View>
                      
                      {routine.description && (
                        <Text style={styles.routineDescription} numberOfLines={2}>
                          {routine.description}
                        </Text>
                      )}
                      
                      <View style={styles.workoutsList}>
                        {routine.workouts.slice(0, 3).map((workout, wIndex) => (
                          <View key={workout.id} style={styles.workoutItem}>
                            <Icon 
                              name="checkmark-circle" 
                              size={16} 
                              color={colors.primary.light} 
                            />
                            <Text style={styles.workoutName} numberOfLines={1}>
                              {workout.name}
                            </Text>
                          </View>
                        ))}
                        {routine.workouts.length > 3 && (
                          <Text style={styles.moreWorkouts}>
                            +{routine.workouts.length - 3} more exercises
                          </Text>
                        )}
                      </View>
                      
                      <View style={styles.viewDetailsButton}>
                        <LinearGradient
                          colors={colors.primary.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.viewDetailsGradient}
                        >
                          <Text style={styles.viewDetailsText}>Start Workout</Text>
                          <Icon name="play" size={16} color={colors.text.inverse} />
                        </LinearGradient>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...colors.shadow.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  restDayGradient: {
    borderRadius: borderRadius.xl,
    padding: 3,
    marginTop: spacing.md,
  },
  restDayContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl - 3,
    padding: spacing.xl,
    alignItems: 'center',
  },
  restDayTitle: {
    ...typography.h3,
    color: colors.success.main,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  restDayText: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  routineCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    padding: spacing.md,
    ...colors.shadow.md,
  },
  routineNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  routineNumberText: {
    ...typography.h4,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  routineContent: {
    flex: 1,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  routineName: {
    ...typography.h5,
    color: colors.text.primary,
    flex: 1,
  },
  routineDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  workoutsList: {
    marginBottom: spacing.md,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  workoutName: {
    ...typography.body2,
    color: colors.text.primary,
    flex: 1,
  },
  moreWorkouts: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  viewDetailsButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  viewDetailsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  viewDetailsText: {
    ...typography.button,
    color: colors.text.inverse,
  },
});

export default DayDetail;