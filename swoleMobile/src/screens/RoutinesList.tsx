import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { mockRoutines } from '../data/mockData';
import { Routine } from '../types';

interface RoutinesListProps {
  navigation: any;
}

const RoutinesList: React.FC<RoutinesListProps> = ({ navigation }) => {
  const getRoutineTypeColor = (routine: Routine): string => {
    const firstWorkout = routine.workouts[0];
    if (!firstWorkout) return '#9E9E9E';
    
    if (firstWorkout.exerciseType === 'class') return '#9C27B0';
    if (firstWorkout.exerciseType === 'activity') return '#FF9800';
    if (firstWorkout.type === 'upper_body') return '#2196F3';
    if (firstWorkout.type === 'lower_body') return '#4CAF50';
    if (firstWorkout.type === 'abs') return '#F44336';
    
    return '#9E9E9E';
  };

  const getRoutineTypeLabel = (routine: Routine): string => {
    const firstWorkout = routine.workouts[0];
    if (!firstWorkout) return 'General';
    
    if (firstWorkout.exerciseType === 'class') return 'Class';
    if (firstWorkout.exerciseType === 'activity') return 'Activity';
    if (firstWorkout.type === 'upper_body') return 'Upper Body';
    if (firstWorkout.type === 'lower_body') return 'Lower Body';
    if (firstWorkout.type === 'abs') return 'Core';
    
    return 'General';
  };

  const renderRoutine = (routine: Routine) => {
    const typeColor = getRoutineTypeColor(routine);
    const typeLabel = getRoutineTypeLabel(routine);

    return (
      <TouchableOpacity
        key={routine.id}
        style={styles.routineCard}
        onPress={() => navigation.navigate('RoutineDetail', { routine })}
      >
        <View style={[styles.routineTypeIndicator, { backgroundColor: typeColor }]} />
        <View style={styles.routineContent}>
          <View style={styles.routineHeader}>
            <Text style={styles.routineName}>{routine.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>{typeLabel}</Text>
            </View>
          </View>
          {routine.description && (
            <Text style={styles.routineDescription}>{routine.description}</Text>
          )}
          <View style={styles.routineStats}>
            <Text style={styles.statText}>{routine.workouts.length} exercises</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Routines</Text>
        <Text style={styles.headerSubtitle}>Your workout routines</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockRoutines.map(renderRoutine)}
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
  routineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  routineTypeIndicator: {
    width: 4,
  },
  routineContent: {
    flex: 1,
    padding: 15,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  routineStats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 14,
    color: '#999',
  },
});

export default RoutinesList;