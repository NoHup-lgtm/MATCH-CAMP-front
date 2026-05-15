import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166', '#06D6A0', '#FF9F1C'];

function colorFor(id) {
  if (!id) return AVATAR_COLORS[0];
  return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function ProfileScreen() {
  const { user, logout, refreshMe } = useAuth();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', course: '', campus: '' });

  const load = useCallback(async () => {
    try {
      const me = await api.getMe();
      setProfile(me);
      setForm({
        display_name: me.display_name || '',
        bio: me.bio || '',
        course: me.course || '',
        campus: me.campus || '',
      });
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        display_name: form.display_name.trim() || undefined,
        bio: form.bio.trim() || undefined,
        course: form.course.trim() || undefined,
        campus: form.campus.trim() || undefined,
      });
      await load();
      await refreshMe();
      setEditing(false);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickPhoto = async () => {
    const currentPhotos = profile?.photos || [];
    if (currentPhotos.length >= 3) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;

    const usedPositions = new Set(currentPhotos.map(p => p.position));
    const position = [0, 1, 2].find(p => !usedPositions.has(p)) ?? currentPhotos.length;

    setUploading(true);
    try {
      await api.uploadProfilePhoto(result.assets[0].uri, position);
      await load();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível enviar a foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = (photoId) => {
    Alert.alert('Remover foto', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteProfilePhoto(photoId);
            await load();
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const displayName = profile?.display_name || user?.name || 'Usuário';
  const color = colorFor(user?.id);
  const firstPhoto = profile?.photos?.[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#9898B3" />
          </TouchableOpacity>
        </View>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarTap} onPress={handlePickPhoto} disabled={uploading}>
            {firstPhoto ? (
              <Image source={{ uri: firstPhoto.url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: color + '33' }]}>
                <Text style={[styles.avatarInitials, { color }]}>{getInitials(displayName)}</Text>
              </View>
            )}
            <View style={styles.avatarEdit}>
              {uploading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="camera" size={16} color="#fff" />
              }
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{displayName}</Text>
          {profile?.age && <Text style={styles.profileAge}>{profile.age} anos</Text>}
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Photo grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos (máx. 3)</Text>
          <View style={styles.photoGrid}>
            {(profile?.photos || []).map((photo, idx) => (
              <View key={photo.id} style={styles.photoWrap}>
                <Image source={{ uri: photo.url }} style={styles.photoThumb} />
                <TouchableOpacity style={styles.photoDelete} onPress={() => handleDeletePhoto(photo.id)}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
                {idx === 0 && (
                  <View style={styles.photoPrimary}>
                    <Text style={styles.photoPrimaryText}>Principal</Text>
                  </View>
                )}
              </View>
            ))}
            {(profile?.photos?.length ?? 0) < 3 && (
              <TouchableOpacity style={styles.photoAdd} onPress={handlePickPhoto} disabled={uploading}>
                {uploading ? <ActivityIndicator color="#555570" /> : <Ionicons name="add" size={28} color="#555570" />}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sobre mim</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editLink}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View style={styles.form}>
              <Field label="Nome" icon="person-outline" value={form.display_name} onChangeText={v => setForm(p => ({ ...p, display_name: v }))} placeholder="Seu nome" />
              <Field label="Bio" icon="chatbubble-outline" value={form.bio} onChangeText={v => setForm(p => ({ ...p, bio: v }))} placeholder="Conte sobre você..." multiline maxLength={200} />
              <Field label="Curso" icon="school-outline" value={form.course} onChangeText={v => setForm(p => ({ ...p, course: v }))} placeholder="Ex: Engenharia de Software" />
              <Field label="Campus" icon="location-outline" value={form.campus} onChangeText={v => setForm(p => ({ ...p, campus: v }))} placeholder="Ex: Campus Central" />

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.saveBtnGradient}>
                    <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <InfoRow icon="person-outline" label="Nome" value={profile?.display_name} />
              <InfoRow icon="chatbubble-outline" label="Bio" value={profile?.bio} />
              <InfoRow icon="school-outline" label="Curso" value={profile?.course} />
              <InfoRow icon="location-outline" label="Campus" value={profile?.campus} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, icon, value, onChangeText, placeholder, multiline, maxLength }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldWrap, multiline && styles.fieldWrapMulti]}>
        <Ionicons name={icon} size={18} color="#9898B3" style={styles.fieldIcon} />
        <TextInput
          style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#555570"
          multiline={multiline}
          maxLength={maxLength}
          autoCapitalize="sentences"
          autoCorrect={false}
        />
      </View>
      {multiline && value?.length > 0 && (
        <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
      )}
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#9898B3" />
      <View style={styles.infoRowContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  logoutBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E1E35', alignItems: 'center', justifyContent: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  avatarTap: { position: 'relative', marginBottom: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1E1E35' },
  avatarFallback: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 40, fontWeight: '700' },
  avatarEdit: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF4B6E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0D0D1A' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileAge: { fontSize: 15, color: '#9898B3' },
  profileEmail: { fontSize: 14, color: '#555570' },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  editLink: { color: '#FF4B6E', fontSize: 15, fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoWrap: { position: 'relative' },
  photoThumb: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#1E1E35' },
  photoDelete: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  photoPrimary: { position: 'absolute', bottom: 4, left: 4, backgroundColor: '#FF4B6E', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  photoPrimaryText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  photoAdd: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#1E1E35', borderWidth: 1.5, borderColor: '#2A2A45', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  infoList: { gap: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoRowContent: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 12, color: '#555570', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#E0E0F0' },
  form: { gap: 14 },
  fieldGroup: {},
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#C4C4D8', marginBottom: 8 },
  fieldWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E35', borderRadius: 12, borderWidth: 1.5, borderColor: '#2A2A45', paddingHorizontal: 14, height: 52 },
  fieldWrapMulti: { height: 100, alignItems: 'flex-start', paddingVertical: 12 },
  fieldIcon: { marginRight: 10, marginTop: 2 },
  fieldInput: { flex: 1, color: '#fff', fontSize: 15 },
  fieldInputMulti: { textAlignVertical: 'top' },
  charCount: { color: '#555570', fontSize: 12, textAlign: 'right', marginTop: 4 },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1.5, borderColor: '#2A2A45', alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { color: '#9898B3', fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  saveBtnGradient: { height: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
