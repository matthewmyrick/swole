import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { ApiService } from '../services/api';
import { DaySchedule, WeekSchedule } from '../types';

interface WeekViewProps {
  navigation: any;
}

const WeekView: React.FC<WeekViewProps> = ({ navigation }) => {
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeekSchedule();
  }, []);

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

  const getDayColor = (day: string): string => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today === day ? '#4CAF50' : '#2196F3';
  };

  const renderDay = (daySchedule: DaySchedule) => {
    return (
      <TouchableOpacity
        key={daySchedule.day}
        style={styles.dayCard}
        onPress={() => navigation.navigate('DayDetail', { daySchedule })}
      >
        <View style={[styles.dayHeader, { backgroundColor: getDayColor(daySchedule.day) }]}>
          <Text style={styles.dayTitle}>{daySchedule.day}</Text>
        </View>
        <View style={styles.dayContent}>
          {daySchedule.routines.length === 0 ? (
            <Text style={styles.restDay}>Rest Day</Text>
          ) : (
            daySchedule.routines.map((routine) => (
              <View key={routine.id} style={styles.routineItem}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <Text style={styles.workoutCount}>
                  {routine.workouts.length} exercises
                </Text>
              </View>
            ))
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading your schedule...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWeekSchedule}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weekly Schedule</Text>
        <Text style={styles.headerSubtitle}>Your workout plan for this week</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {weekSchedule?.schedule.map(renderDay)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayHeader: {
    padding: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayContent: {
    padding: 15,
  },
  restDay: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  routineItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WeekView;