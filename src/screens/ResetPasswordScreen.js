import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../services/api';

export default function ResetPasswordScreen({ navigation, route }) {
  const token = route?.params?.token || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState({});

  useEffect(() => {
    if (!token) {
      Alert.alert('Link inválido', 'Token de redefinição não encontrado.');
    }
  }, [token]);

  const handleReset = async () => {
    if (password.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Link expirado ou inválido.');
    } finally {
      setLoading(false);
    }
  };

  const setF = (k, v) => setFocused(prev => ({ ...prev, [k]: v }));

  return (
    <LinearGradient colors={['#0D0D1A', '#16162A', '#0D0D1A']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {done ? (
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.title}>Senha redefinida!</Text>
            <Text style={styles.subtitle}>Sua senha foi alterada com sucesso. Agora você pode entrar com a nova senha.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btn}>
              <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.btnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>Entrar agora 🚀</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Nova senha 🔒</Text>
              <Text style={styles.subtitle}>Crie uma senha forte com pelo menos 8 caracteres.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha</Text>
              <View style={[styles.inputWrapper, focused.pass && styles.inputWrapperFocused]}>
                <Ionicons name="lock-closed-outline" size={20} color={focused.pass ? '#FF4B6E' : '#9898B3'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#555570"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  onFocus={() => setF('pass', true)}
                  onBlur={() => setF('pass', false)}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9898B3" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={[styles.inputWrapper, focused.conf && styles.inputWrapperFocused]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={focused.conf ? '#FF4B6E' : '#9898B3'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita sua senha"
                  placeholderTextColor="#555570"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  onFocus={() => setF('conf', true)}
                  onBlur={() => setF('conf', false)}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleReset} disabled={loading} style={styles.btn}>
              <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.btnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>{loading ? 'Salvando...' : 'Redefinir senha'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', lineHeight: 40, letterSpacing: -0.5, marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#9898B3', lineHeight: 22 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#C4C4D8', marginBottom: 8, letterSpacing: 0.3 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E35', borderRadius: 14, borderWidth: 1.5, borderColor: '#2A2A45', paddingHorizontal: 16, height: 56 },
  inputWrapperFocused: { borderColor: '#FF4B6E', backgroundColor: 'rgba(255,75,110,0.05)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  eyeBtn: { padding: 4 },
  btn: { marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  btnInner: { height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF4B6E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  btnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successEmoji: { fontSize: 64, marginBottom: 20 },
});
