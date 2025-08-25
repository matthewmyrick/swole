import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { ApiService } from '../services/api';
import { DaySchedule, WeekSchedule } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface WeekViewProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const WeekView: React.FC<WeekViewProps> = ({ navigation }) => {
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadWeekSchedule();
  }, []);

  useEffect(() => {
    if (!loading && weekSchedule) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, weekSchedule]);

  const loadWeekSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const schedule = await ApiService.getWeekSchedule();
      setWeekSchedule(schedule);
    } catch (err) {
      setError('Failed to load week schedule');
      console.error('Error loading week schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDayInfo = (day: string) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isToday = today === day;
    
    const dayIcons: { [key: string]: string } = {
      'Monday': 'partly-sunny',
      'Tuesday': 'barbell',
      'Wednesday': 'fitness',
      'Thursday': 'bicycle',
      'Friday': 'trophy',
      'Saturday': 'basketball',
      'Sunday': 'bed',
    };

    return {
      isToday,
      icon: dayIcons[day] || 'calendar',
      gradient: isToday ? colors.success.gradient : colors.primary.gradient,
    };
  };

  const renderDay = (daySchedule: DaySchedule, index: number) => {
    const dayInfo = getDayInfo(daySchedule.day);
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        {
          scale: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    };

    return (
      <Animated.View
        key={daySchedule.day}
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
          onPress={() => navigation.navigate('DayDetail', { daySchedule })}
        >
          <LinearGradient
            colors={dayInfo.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dayCardGradient}
          >
            <View style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayTitleContainer}>
                  <Icon name={dayInfo.icon} size={24} color={colors.text.primary} />
                  <Text style={styles.dayTitle}>{daySchedule.day}</Text>
                  {dayInfo.isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>TODAY</Text>
                    </View>
                  )}
                </View>
                <Icon name="chevron-forward" size={20} color={colors.text.secondary} />
              </View>
              
              <View style={styles.dayContent}>
                {daySchedule.routines.length === 0 ? (
                  <View style={styles.restDayContainer}>
                    <Icon name="moon" size={20} color={colors.text.tertiary} />
                    <Text style={styles.restDay}>Rest & Recovery Day</Text>
                  </View>
                ) : (
                  <>
                    {daySchedule.routines.map((routine, rIndex) => (
                      <View key={routine.id} style={[
                        styles.routineItem,
                        rIndex === daySchedule.routines.length - 1 && styles.lastRoutineItem
                      ]}>
                        <View style={styles.routineIndicator} />
                        <View style={styles.routineInfo}>
                          <Text style={styles.routineName}>{routine.name}</Text>
                          <View style={styles.workoutInfo}>
                            <Icon name="barbell-outline" size={14} color={colors.text.tertiary} />
                            <Text style={styles.workoutCount}>
                              {routine.workouts.length} exercises
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={colors.background.gradient}
          style={styles.gradientBackground}
        >
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Loading your schedule...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={colors.background.gradient}
          style={styles.gradientBackground}
        >
          <View style={styles.centerContent}>
            <Icon name="alert-circle" size={48} color={colors.danger.main} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWeekSchedule}>
              <LinearGradient
                colors={colors.primary.gradient}
                style={styles.retryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Schedule</Text>
          <Text style={styles.headerSubtitle}>Your workout plan for this week</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {weekSchedule?.schedule.map((day, index) => renderDay(day, index))}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dayCardGradient: {
    borderRadius: borderRadius.xl,
    padding: 2,
  },
  dayCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl - 2,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayTitle: {
    ...typography.h5,
    color: colors.text.primary,
  },
  todayBadge: {
    backgroundColor: colors.success.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  todayText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  dayContent: {
    padding: spacing.md,
  },
  restDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  restDay: {
    ...typography.body1,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastRoutineItem: {
    borderBottomWidth: 0,
  },
  routineIndicator: {
    width: 4,
    height: 40,
    backgroundColor: colors.primary.light,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  workoutCount: {
    ...typography.body2,
    color: colors.text.tertiary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body1,
    color: colors.danger.main,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
});

export default WeekView;