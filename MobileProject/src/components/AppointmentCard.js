import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import * as Paper from 'react-native-paper';
import {Calendar, Clock, MapPin} from 'lucide-react-native';
import BRAND_COLORS from '../styles/colors';

const AppointmentCard = ({
  appointment,
  type,
  onAccept,
  onReject,
  onStart,
  onFinish,
}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'requested':
        return '#FEF3C7';
      case 'accepted':
        return '#DCFCE7';
      case 'ongoing':
        return '#DBEAFE';
      default:
        return '#F3F4F6';
    }
  };

  const canShowStartButton = () => {
    if (type !== 'upcoming') return false;
    const startTime = new Date(appointment.startTime);
    const now = new Date();
    const diffInHours = (startTime - now) / (1000 * 60 * 60);
    return diffInHours <= 1 && diffInHours > 0;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Paper.Text style={styles.serviceType}>
            {appointment.mainService} - {appointment.subService}
          </Paper.Text>
          <Paper.Text style={styles.appointmentId}>
            ID: {appointment.appointmentID.slice(0, 8)}...
          </Paper.Text>
        </View>
        <Paper.Text
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(appointment.status)},
          ]}>
          {appointment.status.charAt(0).toUpperCase() +
            appointment.status.slice(1)}
        </Paper.Text>
      </View>

      <View style={styles.detail}>
        <Calendar size={16} color={BRAND_COLORS.textSecondary} />
        <Paper.Text style={styles.detailText}>
          {new Date(appointment.startTime).toLocaleDateString()}
        </Paper.Text>
      </View>

      <View style={styles.detail}>
        <Clock size={16} color={BRAND_COLORS.textSecondary} />
        <Paper.Text style={styles.detailText}>
          {`${new Date(
            appointment.startTime,
          ).toLocaleTimeString()} - ${new Date(
            appointment.endTime,
          ).toLocaleTimeString()}`}
        </Paper.Text>
      </View>

      <View style={styles.detail}>
        <MapPin size={16} color={BRAND_COLORS.textSecondary} />
        <Paper.Text style={styles.detailText}>
          {appointment.address.fullAddress}
        </Paper.Text>
      </View>

      <View style={styles.durationContainer}>
        <Paper.Text style={styles.durationText}>
          Duration: {appointment.duration} hours
        </Paper.Text>
      </View>

      {type === 'assigned' && (
        <View style={styles.buttonContainer}>
          <Paper.Button
            mode="contained"
            onPress={() => onAccept(appointment._id)}
            style={[styles.button, styles.acceptButton]}>
            Accept
          </Paper.Button>
          <Paper.Button
            mode="outlined"
            onPress={() => onReject(appointment._id)}
            style={[styles.button, styles.rejectButton]}
            textColor={BRAND_COLORS.error}>
            Reject
          </Paper.Button>
        </View>
      )}

      {type === 'upcoming' && canShowStartButton() && (
        <Paper.Button
          mode="contained"
          onPress={() => onStart(appointment._id)}
          style={styles.startButton}>
          Start Appointment
        </Paper.Button>
      )}

      {type === 'ongoing' && (
        <Paper.Button
          mode="contained"
          onPress={() => onFinish(appointment._id)}
          style={styles.finishButton}>
          Finish Appointment
        </Paper.Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  serviceType: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 4,
  },
  appointmentId: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
    flex: 1,
  },
  durationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: BRAND_COLORS.primary,
  },
  rejectButton: {
    borderColor: BRAND_COLORS.error,
    borderWidth: 1,
  },
  startButton: {
    marginTop: 15,
    backgroundColor: BRAND_COLORS.primary,
  },
  finishButton: {
    marginTop: 15,
    backgroundColor: BRAND_COLORS.secondary,
  },
});

export default AppointmentCard;
