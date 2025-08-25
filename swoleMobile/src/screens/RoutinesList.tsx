import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { mockRoutines } from '../data/mockData';
import { Routine } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface RoutinesListProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const RoutinesList: React.FC<RoutinesListProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getRoutineTypeInfo = (routine: Routine) => {
    const firstWorkout = routine.workouts[0];
    if (!firstWorkout) return { 
      color: colors.neutral.gray400, 
      gradient: [colors.neutral.gray400, colors.neutral.gray300],
      icon: 'barbell',
      label: 'General'
    };
    
    if (firstWorkout.exerciseType === 'class') return {
      color: colors.workoutTypes.class.main,
      gradient: colors.workoutTypes.class.gradient,
      icon: 'people',
      label: 'Class'
    };
    
    if (firstWorkout.exerciseType === 'activity') return {
      color: colors.workoutTypes.activity.main,
      gradient: colors.workoutTypes.activity.gradient,
      icon: 'walk',
      label: 'Activity'
    };
    
    if (firstWorkout.type === 'upper_body') return {
      color: colors.workoutTypes.upperBody.main,
      gradient: colors.workoutTypes.upperBody.gradient,
      icon: 'body',
      label: 'Upper Body'
    };
    
    if (firstWorkout.type === 'lower_body') return {
      color: colors.workoutTypes.lowerBody.main,
      gradient: colors.workoutTypes.lowerBody.gradient,
      icon: 'footsteps',
      label: 'Lower Body'
    };
    
    if (firstWorkout.type === 'abs') return {
      color: colors.workoutTypes.core.main,
      gradient: colors.workoutTypes.core.gradient,
      icon: 'fitness',
      label: 'Core'
    };
    
    return {
      color: colors.neutral.gray400,
      gradient: [colors.neutral.gray400, colors.neutral.gray300],
      icon: 'barbell',
      label: 'General'
    };
  };

  const renderRoutine = (routine: Routine, index: number) => {
    const typeInfo = getRoutineTypeInfo(routine);
    const delay = index * 50;

    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        { scale: scaleAnim },
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View
        key={routine.id}
        style={[
          animatedStyle,
          {
            marginBottom: spacing.md,
            ...(index === 0 ? { marginTop: spacing.sm } : {}),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('RoutineDetail', { routine })}
        >
          <View style={styles.routineCard}>
            <LinearGradient
              colors={typeInfo.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.routineIconContainer}
            >
              <Icon name={typeInfo.icon} size={28} color={colors.text.inverse} />
            </LinearGradient>
            
            <View style={styles.routineContent}>
              <View style={styles.routineHeader}>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName} numberOfLines={2}>
                    {routine.name}
                  </Text>
                  <View style={styles.typeBadge}>
                    <View 
                      style={[
                        styles.typeDot, 
                        { backgroundColor: typeInfo.color }
                      ]} 
                    />
                    <Text style={styles.typeText}>{typeInfo.label}</Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.text.tertiary} />
              </View>
              
              {routine.description && (
                <Text style={styles.routineDescription} numberOfLines={2}>
                  {routine.description}
                </Text>
              )}
              
              <View style={styles.routineStats}>
                <View style={styles.statItem}>
                  <Icon name="barbell-outline" size={16} color={colors.text.tertiary} />
                  <Text style={styles.statText}>{routine.workouts.length} exercises</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Icon name="time-outline" size={16} color={colors.text.tertiary} />
                  <Text style={styles.statText}>~45 min</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Routines</Text>
            <Text style={styles.headerSubtitle}>Your workout library</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <LinearGradient
              colors={colors.primary.gradient}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="add" size={24} color={colors.text.inverse} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {mockRoutines.map((routine, index) => renderRoutine(routine, index))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  addButton: {
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    ...colors.shadow.md,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  routineCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    padding: spacing.md,
    minHeight: 100,
    ...colors.shadow.md,
  },
  routineIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  routineContent: {
    flex: 1,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
  },
  typeText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  routineDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  routineStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.sm,
  },
});

export default RoutinesList;