import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DaySchedule } from '../types';

interface DayDetailProps {
  route: any;
  navigation: any;
}

const DayDetail: React.FC<DayDetailProps> = ({ route, navigation }) => {
  const { daySchedule }: { daySchedule: DaySchedule } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{daySchedule.day}</Text>
        <Text style={styles.headerSubtitle}>
          {daySchedule.routines.length === 0
            ? 'Rest Day'
            : `${daySchedule.routines.length} routine${daySchedule.routines.length > 1 ? 's' : ''} scheduled`}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {daySchedule.routines.length === 0 ? (
          <View style={styles.restDayContainer}>
            <Text style={styles.restDayTitle}>Rest & Recovery</Text>
            <Text style={styles.restDayText}>
              Take this day to rest and let your muscles recover.
            </Text>
          </View>
        ) : (
          daySchedule.routines.map((routine, index) => (
            <TouchableOpacity
              key={routine.id}
              style={styles.routineCard}
              onPress={() => navigation.navigate('RoutineDetail', { routine })}
            >
              <View style={styles.routineHeader}>
                <Text style={styles.routineNumber}>Routine {index + 1}</Text>
              </View>
              <Text style={styles.routineName}>{routine.name}</Text>
              {routine.description && (
                <Text style={styles.routineDescription}>{routine.description}</Text>
              )}
              <View style={styles.workoutsList}>
                {routine.workouts.map((workout, wIndex) => (
                  <View key={workout.id} style={styles.workoutItem}>
                    <Text style={styles.workoutNumber}>{wIndex + 1}.</Text>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details →</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
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
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
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
  restDayContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restDayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  restDayText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  routineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  routineHeader: {
    marginBottom: 10,
  },
  routineNumber: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  routineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  workoutsList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutNumber: {
    fontSize: 14,
    color: '#999',
    marginRight: 10,
    width: 20,
  },
  workoutName: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  viewDetailsButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default DayDetail;