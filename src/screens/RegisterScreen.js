import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const COURSES = ['Engenharia', 'Direito', 'Medicina', 'ADM', 'TI', 'Psicologia', 'Arquitetura', 'Outros'];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  const animateProgress = (toStep) => {
    Animated.timing(progress, {
      toValue: (toStep - 1) / 2,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const goToStep = (s) => {
    animateProgress(s);
    setStep(s);
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        let root = navigation;
        while (root.getParent && root.getParent() != null) {
          root = root.getParent();
        }
        root.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'App' }],
          })
        );
      } catch (e) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'App' }],
          })
        );
      }
    }, 1500);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['33%', '100%'],
  });

  const InputField = ({ label, icon, iconFamily, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, maxLength, rightElement, focused, onFocus, onBlur }) => {
    const IconComponent = iconFamily === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused, multiline && styles.inputWrapperMulti]}>
          <IconComponent name={icon} size={20} color={focused ? '#FF4B6E' : '#9898B3'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          placeholder={placeholder}
          placeholderTextColor="#555570"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false}
        />
        {rightElement}
        </View>
      </View>
    );
  };

  const [focusStates, setFocusStates] = useState({});
  const setFocus = (key, val) => setFocusStates(prev => ({ ...prev, [key]: val }));

  return (
    <LinearGradient colors={['#0D0D1A', '#16162A', '#0D0D1A']} style={styles.gradient}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => step > 1 ? goToStep(step - 1) : navigation.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#9898B3" />
            </TouchableOpacity>
            <Text style={styles.stepLabel}>Passo {step} de 3</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 1 && 'Crie sua\nconta 🎉'}
              {step === 2 && 'Sua vida\nacadêmica 🎓'}
              {step === 3 && 'Fale sobre\nvocê ✨'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 && 'Só leva 2 minutinhos, prometo'}
              {step === 2 && 'Vamos conectar você com a galera certa'}
              {step === 3 && 'Seu perfil vai bombar 🔥'}
            </Text>
          </View>

          {/* Step 1 - Basic info */}
          {step === 1 && (
            <View style={styles.form}>
              <InputField label="Nome completo" icon="person-outline" iconFamily="Ionicons" value={name} onChangeText={setName} placeholder="Como você se chama?" focused={focusStates.name} onFocus={() => setFocus('name', true)} onBlur={() => setFocus('name', false)} />
              <InputField label="E-mail institucional" icon="mail-outline" iconFamily="Ionicons" value={email} onChangeText={setEmail} placeholder="seu@faculdade.edu.br" keyboardType="email-address" focused={focusStates.email} onFocus={() => setFocus('email', true)} onBlur={() => setFocus('email', false)} />
              <InputField label="Senha" icon="lock-closed-outline" iconFamily="Ionicons" value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres" secureTextEntry={!showPassword} focused={focusStates.pass} onFocus={() => setFocus('pass', true)} onBlur={() => setFocus('pass', false)}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9898B3" />
                  </TouchableOpacity>
                }
              />
              <InputField label="Confirmar senha" icon="shield-checkmark-outline" iconFamily="Ionicons" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repita sua senha" secureTextEntry focused={focusStates.conf} onFocus={() => setFocus('conf', true)} onBlur={() => setFocus('conf', false)} />
              <TouchableOpacity onPress={() => goToStep(2)} style={styles.continueBtn}>
                <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.continueBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.continueBtnText}>Continuar →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 - Academic */}
          {step === 2 && (
            <View style={styles.form}>
              <Text style={styles.label}>Seu curso</Text>
              <View style={styles.coursesGrid}>
                {COURSES.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setCourse(c)} style={[styles.courseChip, course === c && styles.courseChipActive]}>
                    <Text style={[styles.courseChipText, course === c && styles.courseChipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField label="Semestre atual" icon="school-outline" iconFamily="Ionicons" value={semester} onChangeText={setSemester} placeholder="Ex: 4º semestre" keyboardType="number-pad" focused={focusStates.sem} onFocus={() => setFocus('sem', true)} onBlur={() => setFocus('sem', false)} />

              <Text style={styles.label}>Gênero</Text>
              <View style={styles.genderRow}>
                {['Homem', 'Mulher', 'Outro'].map((g) => (
                  <TouchableOpacity key={g} onPress={() => setGender(g)} style={[styles.genderChip, gender === g && styles.genderChipActive]}>
                    <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={() => goToStep(3)} style={styles.continueBtn}>
                <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.continueBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.continueBtnText}>Continuar →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3 - Bio */}
          {step === 3 && (
            <View style={styles.form}>
              <InputField label="Bio (opcional)" icon="chatbubble-outline" iconFamily="Ionicons" value={bio} onChangeText={setBio} placeholder="Me conta um pouco sobre você..." multiline maxLength={200} focused={focusStates.bio} onFocus={() => setFocus('bio', true)} onBlur={() => setFocus('bio', false)} />
              {bio.length > 0 && <Text style={styles.charCount}>{bio.length}/200</Text>}

              <View style={styles.termsBox}>
                <Ionicons name="checkmark-circle" size={18} color="#FF4B6E" />
                <Text style={styles.termsText}>
                  Ao criar conta, você concorda com os{' '}
                  <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
                  <Text style={styles.termsLink}>Política de Privacidade</Text>
                </Text>
              </View>

              <TouchableOpacity onPress={handleFinish}>
                <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.continueBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.continueBtnText}>{loading ? 'Criando perfil... 🔥' : 'Criar perfil 🚀'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  blob1: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: '#6C63FF', opacity: 0.05, top: -60, left: -60 },
  blob2: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#FF4B6E', opacity: 0.05, bottom: 80, right: -40 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 56, marginBottom: 16 },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  stepLabel: { color: '#9898B3', fontSize: 13, fontWeight: '500' },
  progressTrack: { height: 4, backgroundColor: '#2A2A45', borderRadius: 2, marginBottom: 28 },
  progressFill: { height: 4, backgroundColor: '#FF4B6E', borderRadius: 2 },
  header: { marginBottom: 28 },
  title: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', lineHeight: 40, letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#9898B3' },
  form: { gap: 0 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#C4C4D8', marginBottom: 8, letterSpacing: 0.3 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E35', borderRadius: 14, borderWidth: 1.5, borderColor: '#2A2A45', paddingHorizontal: 16, height: 56 },
  inputWrapperFocused: { borderColor: '#FF4B6E', backgroundColor: 'rgba(255,75,110,0.05)' },
  inputWrapperMulti: { height: 110, alignItems: 'flex-start', paddingVertical: 14 },
  inputIcon: { marginRight: 12, marginTop: 2 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  inputMulti: { textAlignVertical: 'top', paddingTop: 0 },
  eyeButton: { padding: 4 },
  coursesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  courseChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1E1E35', borderWidth: 1.5, borderColor: '#2A2A45' },
  courseChipActive: { backgroundColor: 'rgba(255,75,110,0.12)', borderColor: '#FF4B6E' },
  courseChipText: { color: '#9898B3', fontSize: 14, fontWeight: '500' },
  courseChipTextActive: { color: '#FF4B6E', fontWeight: '700' },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#1E1E35', borderWidth: 1.5, borderColor: '#2A2A45', alignItems: 'center' },
  genderChipActive: { backgroundColor: 'rgba(255,75,110,0.12)', borderColor: '#FF4B6E' },
  genderChipText: { color: '#9898B3', fontSize: 14, fontWeight: '500' },
  genderChipTextActive: { color: '#FF4B6E', fontWeight: '700' },
  continueBtn: { marginTop: 8, marginBottom: 4 },
  continueBtnInner: { height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF4B6E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  continueBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  charCount: { color: '#555570', fontSize: 12, textAlign: 'right', marginTop: -10, marginBottom: 12 },
  termsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20, padding: 14, backgroundColor: 'rgba(255,75,110,0.07)', borderRadius: 12 },
  termsText: { flex: 1, color: '#9898B3', fontSize: 13, lineHeight: 20 },
  termsLink: { color: '#FF4B6E', fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  loginText: { color: '#9898B3', fontSize: 15 },
  loginLink: { color: '#FF4B6E', fontSize: 15, fontWeight: '700' },
});
