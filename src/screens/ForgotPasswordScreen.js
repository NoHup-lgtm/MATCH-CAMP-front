import React, { useState, useRef } from 'react';
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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    setLoading(true);
    try {
      await api.forgotPassword(trimmed);
      setSent(true);
    } catch {
      // API sempre retorna 204 para não vazar dados — mas mostramos sucesso de qualquer forma
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#16162A', '#0D0D1A']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#9898B3" />
        </TouchableOpacity>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>📬</Text>
            <Text style={styles.title}>Verifique seu e-mail</Text>
            <Text style={styles.subtitle}>Se esse e-mail estiver cadastrado, você vai receber um link para redefinir sua senha em breve.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLoginBtn}>
              <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.btnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>Voltar ao Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Esqueceu a{'\n'}senha? 🔑</Text>
              <Text style={styles.subtitle}>Digite seu e-mail e enviaremos um link para você criar uma nova senha.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
                <Ionicons name="mail-outline" size={20} color={focused ? '#FF4B6E' : '#9898B3'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#555570"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSend} disabled={loading} style={styles.sendBtn}>
              <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.btnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>{loading ? 'Enviando...' : 'Enviar link 📩'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
              <Text style={styles.loginLinkText}>Lembrei minha senha — Entrar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginTop: 56, marginBottom: 8 },
  header: { marginTop: 16, marginBottom: 32 },
  title: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', lineHeight: 40, letterSpacing: -0.5, marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#9898B3', lineHeight: 22 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#C4C4D8', marginBottom: 8, letterSpacing: 0.3 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E35', borderRadius: 14, borderWidth: 1.5, borderColor: '#2A2A45', paddingHorizontal: 16, height: 56 },
  inputWrapperFocused: { borderColor: '#FF4B6E', backgroundColor: 'rgba(255,75,110,0.05)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  sendBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  btnInner: { height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF4B6E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  btnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  loginLink: { alignItems: 'center', marginTop: 24 },
  loginLinkText: { color: '#FF4B6E', fontSize: 15, fontWeight: '600' },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  successEmoji: { fontSize: 64, marginBottom: 20 },
});
