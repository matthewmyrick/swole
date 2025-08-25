import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { ApiService } from '../services/api';
import { Routine, Workout } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface RoutineDetailProps {
  route: any;
  navigation: any;
}

const { width } = Dimensions.get('window');

const RoutineDetail: React.FC<RoutineDetailProps> = ({ route, navigation }) => {
  const { routine }: { routine: Routine } = route.params;
  const [workouts, setWorkouts] = useState<Workout[]>(routine.workouts);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [updatedWeight, setUpdatedWeight] = useState('');
  const [updatedTime, setUpdatedTime] = useState('');
  const [saving, setSaving] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

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

  const getWorkoutTypeInfo = (workout: Workout) => {
    if (workout.exerciseType === 'class') return {
      color: colors.workoutTypes.class.main,
      gradient: colors.workoutTypes.class.gradient,
      icon: 'people',
      label: 'Class'
    };
    
    if (workout.exerciseType === 'activity') return {
      color: colors.workoutTypes.activity.main,
      gradient: colors.workoutTypes.activity.gradient,
      icon: 'walk',
      label: 'Activity'
    };
    
    if (workout.type === 'upper_body') return {
      color: colors.workoutTypes.upperBody.main,
      gradient: colors.workoutTypes.upperBody.gradient,
      icon: 'body',
      label: 'Upper Body'
    };
    
    if (workout.type === 'lower_body') return {
      color: colors.workoutTypes.lowerBody.main,
      gradient: colors.workoutTypes.lowerBody.gradient,
      icon: 'footsteps',
      label: 'Lower Body'
    };
    
    if (workout.type === 'abs') return {
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

  const openUpdateModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setUpdatedWeight((workout.userWeight || workout.weight || '').toString());
    setUpdatedTime((workout.userTime || workout.time || '').toString());
    setModalVisible(true);
    
    Animated.spring(modalScaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalScaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
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
      closeModal();
      Alert.alert('Success', 'Progress updated successfully!');
    } catch (error) {
      console.error('Failed to save progress:', error);
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderWorkout = (workout: Workout, index: number) => {
    const typeInfo = getWorkoutTypeInfo(workout);
    const displayWeight = workout.userWeight || workout.weight;
    const displayTime = workout.userTime || workout.time;
    const hasBeenUpdated = workout.userWeight || workout.userTime;

    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    };

    return (
      <Animated.View key={workout.id} style={[animatedStyle, { marginBottom: spacing.md }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openUpdateModal(workout)}
        >
          <View style={styles.workoutCard}>
            <LinearGradient
              colors={typeInfo.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.workoutIconContainer}
            >
              <Icon name={typeInfo.icon} size={24} color={colors.text.inverse} />
            </LinearGradient>
            
            <View style={styles.workoutContent}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View style={styles.typeBadge}>
                    <View style={[styles.typeDot, { backgroundColor: typeInfo.color }]} />
                    <Text style={styles.typeText}>{typeInfo.label}</Text>
                  </View>
                </View>
                {hasBeenUpdated && (
                  <View style={styles.progressBadge}>
                    <Icon name="checkmark-circle" size={16} color={colors.success.main} />
                  </View>
                )}
              </View>
              
              <View style={styles.workoutDetails}>
                {workout.exerciseType === 'lift' && (
                  <View style={styles.detailsRow}>
                    {displayWeight && (
                      <View style={styles.detailItem}>
                        <Icon name="barbell-outline" size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailValue}>{displayWeight} lbs</Text>
                      </View>
                    )}
                    {workout.sets && (
                      <View style={styles.detailItem}>
                        <Icon name="repeat-outline" size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailValue}>{workout.sets} sets</Text>
                      </View>
                    )}
                    {workout.reps && (
                      <View style={styles.detailItem}>
                        <Icon name="fitness-outline" size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailValue}>{workout.reps} reps</Text>
                      </View>
                    )}
                  </View>
                )}
                
                {(workout.exerciseType === 'timed' || 
                  workout.exerciseType === 'class' || 
                  workout.exerciseType === 'activity') && displayTime && (
                  <View style={styles.detailItem}>
                    <Icon name="time-outline" size={14} color={colors.text.tertiary} />
                    <Text style={styles.detailValue}>{displayTime} min</Text>
                  </View>
                )}
              </View>
              
              {workout.description && (
                <Text style={styles.workoutDescription}>{workout.description}</Text>
              )}
              
              <TouchableOpacity style={styles.updateButton}>
                <LinearGradient
                  colors={colors.primary.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateButtonGradient}
                >
                  <Icon name="create-outline" size={16} color={colors.text.inverse} />
                  <Text style={styles.updateButtonText}>Update Progress</Text>
                </LinearGradient>
              </TouchableOpacity>
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
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.primary.main} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{routine.name}</Text>
            {routine.description && (
              <Text style={styles.headerDescription}>{routine.description}</Text>
            )}
          </View>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {workouts.map((workout, index) => renderWorkout(workout, index))}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContent,
                { transform: [{ scale: modalScaleAnim }] }
              ]}
            >
              <LinearGradient
                colors={colors.primary.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalHeader}
              >
                <Icon name="trending-up" size={24} color={colors.text.inverse} />
                <Text style={styles.modalTitle}>Update Progress</Text>
              </LinearGradient>
              
              <View style={styles.modalBody}>
                <Text style={styles.modalWorkoutName}>{selectedWorkout?.name}</Text>
                
                {selectedWorkout?.exerciseType === 'lift' && (
                  <View style={styles.inputContainer}>
                    <View style={styles.inputLabel}>
                      <Icon name="barbell-outline" size={16} color={colors.text.secondary} />
                      <Text style={styles.inputLabelText}>Weight (lbs)</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={updatedWeight}
                      onChangeText={setUpdatedWeight}
                      keyboardType="numeric"
                      placeholder="Enter new weight"
                      placeholderTextColor={colors.text.tertiary}
                    />
                  </View>
                )}
                
                {(selectedWorkout?.exerciseType === 'timed' || 
                  selectedWorkout?.exerciseType === 'class' || 
                  selectedWorkout?.exerciseType === 'activity') && (
                  <View style={styles.inputContainer}>
                    <View style={styles.inputLabel}>
                      <Icon name="time-outline" size={16} color={colors.text.secondary} />
                      <Text style={styles.inputLabelText}>Duration (minutes)</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={updatedTime}
                      onChangeText={setUpdatedTime}
                      keyboardType="numeric"
                      placeholder="Enter duration"
                      placeholderTextColor={colors.text.tertiary}
                    />
                  </View>
                )}
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeModal}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.disabledButton]}
                    onPress={saveUpdates}
                    disabled={saving}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={colors.success.gradient}
                      style={styles.saveButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {saving ? (
                        <ActivityIndicator size="small" color={colors.text.inverse} />
                      ) : (
                        <>
                          <Icon name="checkmark" size={20} color={colors.text.inverse} />
                          <Text style={styles.saveButtonText}>Save</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </Modal>
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
  headerDescription: {
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
  workoutCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    padding: spacing.md,
    ...colors.shadow.md,
  },
  workoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  workoutContent: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
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
  progressBadge: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.round,
    backgroundColor: colors.success.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDetails: {
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailValue: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  workoutDescription: {
    ...typography.body2,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  updateButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  updateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  updateButtonText: {
    ...typography.body2,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - spacing.xl * 2,
    maxWidth: 400,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...colors.shadow.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text.inverse,
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalWorkoutName: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  inputLabelText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.neutral.gray100,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default RoutineDetail;