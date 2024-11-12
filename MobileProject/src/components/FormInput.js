import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Home,
  Road,
  Building2,
  MapPin,
  Briefcase,
  Star,
  Clock,
  Building,
  Stethoscope,
  AlertCircle,
  Users,
  CreditCard,
  Code,
  Smartphone,
} from 'lucide-react-native';

const BRAND_COLORS = {
  orange: '#FF7F50',
  blue: '#2196F3',
};

// Map Material icons to Lucide icon components
const iconMap = {
  account: User,
  calendar: Calendar,
  phone: Phone,
  email: Mail,
  home: Home,
  road: Road,
  city: Building2,
  'map-marker': MapPin,
  post: Mail,
  briefcase: Briefcase,
  star: Star,
  clock: Clock,
  building: Building,
  stethoscope: Stethoscope,
  'alert-circle': AlertCircle,
  users: Users,
  'credit-card': CreditCard,
  code: Code,
  smartphone: Smartphone,
};

export default function FormInput({
  label,
  value,
  onChangeText,
  icon,
  keyboardType = 'default',
  ...props
}) {
  // Get the corresponding Lucide icon component
  const IconComponent = iconMap[icon] || User;

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, styles.inputContainer]}
      mode="flat"
      theme={inputTheme}
      underlineStyle={{display: 'none'}}
      contentStyle={styles.inputContent}
      keyboardType={keyboardType}
      left={
        <TextInput.Icon
          icon={({size, color}) => (
            <View style={styles.iconContainer}>
              <IconComponent
                size={22}
                color={value ? BRAND_COLORS.orange : '#94A3B8'}
                strokeWidth={2}
              />
            </View>
          )}
        />
      }
      outlineStyle={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: value ? BRAND_COLORS.orange : '#E2E8F0',
      }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 45,
  },
  inputContainer: {
    height: 55,
    backgroundColor: '#F8FAFC',
  },
  inputContent: {
    paddingLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingTop: 20,
    height: 55,
    marginTop: 8,
  },
  iconContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
});

const inputTheme = {
  colors: {
    primary: BRAND_COLORS.orange,
    background: '#F8FAFC',
    placeholder: '#94A3B8',
    text: '#1E293B',
    accent: BRAND_COLORS.blue,
    surface: '#F8FAFC',
    onSurfaceVariant: '#64748B',
  },
  roundness: 12,
};
