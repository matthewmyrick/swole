import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ApiService } from '../services/api';
import { Routine, Workout } from '../types';

interface RoutineDetailProps {
  route: any;
  navigation: any;
}

const RoutineDetail: React.FC<RoutineDetailProps> = ({ route, navigation }) => {
  const { routine }: { routine: Routine } = route.params;
  const [workouts, setWorkouts] = useState<Workout[]>(routine.workouts);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [updatedWeight, setUpdatedWeight] = useState('');
  const [updatedTime, setUpdatedTime] = useState('');
  const [saving, setSaving] = useState(false);

  const getWorkoutTypeColor = (workout: Workout): string => {
    if (workout.exerciseType === 'class') return '#9C27B0';
    if (workout.exerciseType === 'activity') return '#FF9800';
    if (workout.type === 'upper_body') return '#2196F3';
    if (workout.type === 'lower_body') return '#4CAF50';
    if (workout.type === 'abs') return '#F44336';
    return '#9E9E9E';
  };

  const getWorkoutTypeLabel = (workout: Workout): string => {
    if (workout.exerciseType === 'class') return 'Class';
    if (workout.exerciseType === 'activity') return 'Activity';
    if (workout.type === 'upper_body') return 'Upper Body';
    if (workout.type === 'lower_body') return 'Lower Body';
    if (workout.type === 'abs') return 'Core';
    return 'General';
  };

  const openUpdateModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setUpdatedWeight(
      (workout.userWeight || workout.weight || '').toString()
    );
    setUpdatedTime(
      (workout.userTime || workout.time || '').toString()
    );
    setModalVisible(true);
  };

  const saveUpdates = async () => {
    if (!selectedWorkout) return;

    try {
      setSaving(true);
      
      const userWeight = updatedWeight ? parseFloat(updatedWeight) : undefined;
      const userTime = updatedTime ? parseFloat(updatedTime) : undefined;

      await ApiService.updateWorkoutProgress(
        selectedWorkout.id,
        userWeight,
        userTime
      );

      const updatedWorkouts = workouts.map(w => {
        if (w.id === selectedWorkout.id) {
          return {
            ...w,
            userWeight: userWeight || w.userWeight,
            userTime: userTime || w.userTime,
          };
        }
        return w;
      });

      setWorkouts(updatedWorkouts);
      setModalVisible(false);
      Alert.alert('Success', 'Progress updated successfully!');
    } catch (error) {
      console.error('Failed to save progress:', error);
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderWorkout = (workout: Workout) => {
    const typeColor = getWorkoutTypeColor(workout);
    const typeLabel = getWorkoutTypeLabel(workout);
    const displayWeight = workout.userWeight || workout.weight;
    const displayTime = workout.userTime || workout.time;

    return (
      <TouchableOpacity
        key={workout.id}
        style={styles.workoutCard}
        onPress={() => openUpdateModal(workout)}
      >
        <View style={[styles.workoutTypeIndicator, { backgroundColor: typeColor }]} />
        <View style={styles.workoutContent}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>{typeLabel}</Text>
            </View>
          </View>
          
          <View style={styles.workoutDetails}>
            {workout.exerciseType === 'lift' && (
              <>
                {displayWeight && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Weight:</Text>
                    <Text style={styles.detailValue}>{displayWeight} lbs</Text>
                    {workout.userWeight && (
                      <Text style={styles.improvedText}>Updated!</Text>
                    )}
                  </View>
                )}
                {workout.sets && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Sets:</Text>
                    <Text style={styles.detailValue}>{workout.sets}</Text>
                  </View>
                )}
                {workout.reps && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Reps:</Text>
                    <Text style={styles.detailValue}>{workout.reps}</Text>
                  </View>
                )}
              </>
            )}
            
            {(workout.exerciseType === 'timed' || 
              workout.exerciseType === 'class' || 
              workout.exerciseType === 'activity') && displayTime && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{displayTime} min</Text>
                {workout.userTime && (
                  <Text style={styles.improvedText}>Updated!</Text>
                )}
              </View>
            )}
          </View>
          
          {workout.description && (
            <Text style={styles.workoutDescription}>{workout.description}</Text>
          )}
          
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Tap to Update Progress</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routine.name}</Text>
        {routine.description && (
          <Text style={styles.headerDescription}>{routine.description}</Text>
        )}
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {workouts.map(renderWorkout)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Progress</Text>
            <Text style={styles.modalWorkoutName}>{selectedWorkout?.name}</Text>
            
            {selectedWorkout?.exerciseType === 'lift' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={updatedWeight}
                  onChangeText={setUpdatedWeight}
                  keyboardType="numeric"
                  placeholder="Enter new weight"
                />
              </View>
            )}
            
            {(selectedWorkout?.exerciseType === 'timed' || 
              selectedWorkout?.exerciseType === 'class' || 
              selectedWorkout?.exerciseType === 'activity') && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time (minutes)</Text>
                <TextInput
                  style={styles.input}
                  value={updatedTime}
                  onChangeText={setUpdatedTime}
                  keyboardType="numeric"
                  placeholder="Enter new time"
                />
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, saving && styles.disabledButton]}
                onPress={saveUpdates}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  workoutCard: {
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
  workoutTypeIndicator: {
    width: 4,
  },
  workoutContent: {
    flex: 1,
    padding: 15,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutName: {
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
  workoutDetails: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    width: 60,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  improvedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalWorkoutName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default RoutineDetail;