import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as api from '../services/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.56;
const SWIPE_THRESHOLD = 100;

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166', '#06D6A0', '#FF9F1C'];
const COURSES = ['Engenharia', 'Direito', 'Medicina', 'ADM', 'TI', 'Psicologia', 'Arquitetura', 'Outros'];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function DiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchAlert, setMatchAlert] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: '', campus: '' });
  const [pendingFilters, setPendingFilters] = useState({ course: '', campus: '' });

  const position = useRef(new Animated.ValueXY()).current;
  const superLikeScale = useRef(new Animated.Value(1)).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const superLikeOpacity = position.y.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const loadProfiles = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = { limit: 10 };
      const f = activeFilters ?? filters;
      if (f.course) params.course = f.course;
      if (f.campus) params.campus = f.campus;
      const data = await api.getDiscovery(params);
      setProfiles(data.profiles || data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar perfis.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadProfiles(); }, []);

  const doSwipe = useCallback(async (action, targetX, targetY) => {
    if (swiping || profiles.length === 0) return;
    const current = profiles[0];
    setSwiping(true);

    Animated.timing(position, {
      toValue: { x: targetX, y: targetY },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      position.setValue({ x: 0, y: 0 });
      setProfiles(prev => prev.slice(1));
      setSwiping(false);
      try {
        const result = await api.recordSwipe(current.id, action);
        if (result?.matched) {
          setMatchAlert(current.display_name);
          setTimeout(() => setMatchAlert(null), 3500);
        }
      } catch {}
    });
  }, [swiping, profiles, position]);

  const swipeLeft  = useCallback(() => doSwipe('pass', -width * 1.5, 0), [doSwipe]);
  const swipeRight = useCallback(() => doSwipe('like', width * 1.5, 0), [doSwipe]);
  const superLike  = useCallback(() => {
    Animated.sequence([
      Animated.spring(superLikeScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(superLikeScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    doSwipe('super_like', 0, -height * 1.5);
  }, [doSwipe, superLikeScale]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !swiping,
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, { dx, dy }) => {
      if (dx > SWIPE_THRESHOLD) swipeRight();
      else if (dx < -SWIPE_THRESHOLD) swipeLeft();
      else if (dy < -SWIPE_THRESHOLD) superLike();
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  });

  const activeFiltersCount = [filters.course, filters.campus].filter(Boolean).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoFire}>🔥</Text>
          <Text style={styles.logoText}>MatchCamp</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {
            setPendingFilters(filters);
            setShowFilters(true);
          }}>
            <Ionicons name="options-outline" size={20} color={activeFiltersCount > 0 ? '#FF4B6E' : '#9898B3'} />
            {activeFiltersCount > 0 && <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeFiltersCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => loadProfiles()}>
            <Ionicons name="refresh-outline" size={22} color="#9898B3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Match alert */}
      {matchAlert && (
        <View style={styles.matchAlert}>
          <LinearGradient colors={['#FF4B6E', '#6C63FF']} style={styles.matchAlertInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.matchAlertText}>🎉 Match com {matchAlert}!</Text>
          </LinearGradient>
        </View>
      )}

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF4B6E" />
        ) : profiles.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎓</Text>
            <Text style={styles.emptyTitle}>Você viu todo mundo!</Text>
            <Text style={styles.emptySubtitle}>Volte amanhã para novos perfis do campus</Text>
            <TouchableOpacity style={styles.reloadBtn} onPress={() => loadProfiles()}>
              <Text style={styles.reloadBtnText}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {profiles[1] && (
              <View style={[styles.card, styles.cardBack]}>
                <CardContent profile={profiles[1]} />
              </View>
            )}
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.card, {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              }]}
            >
              <CardContent profile={profiles[0]}>
                <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
                  <Text style={styles.stampLikeText}>LIKE 💚</Text>
                </Animated.View>
                <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}>
                  <Text style={styles.stampNopeText}>NOPE ✕</Text>
                </Animated.View>
                <Animated.View style={[styles.stamp, styles.stampSuper, { opacity: superLikeOpacity }]}>
                  <Text style={styles.stampSuperText}>SUPER ⭐</Text>
                </Animated.View>
              </CardContent>
            </Animated.View>
          </>
        )}
      </View>

      {/* Action buttons */}
      {!loading && profiles.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionNope]} onPress={swipeLeft}>
            <Text style={styles.actionNopeTxt}>✕</Text>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: superLikeScale }] }}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionSuper]} onPress={superLike}>
              <Text style={styles.actionSuperTxt}>⭐</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity style={[styles.actionBtn, styles.actionLike]} onPress={swipeRight}>
            <Text style={styles.actionLikeTxt}>♥</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Modal */}
      <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filtros</Text>

            <Text style={styles.filterLabel}>Curso</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.filterChip, !pendingFilters.course && styles.filterChipActive]}
                onPress={() => setPendingFilters(p => ({ ...p, course: '' }))}
              >
                <Text style={[styles.filterChipText, !pendingFilters.course && styles.filterChipTextActive]}>Todos</Text>
              </TouchableOpacity>
              {COURSES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.filterChip, pendingFilters.course === c && styles.filterChipActive]}
                  onPress={() => setPendingFilters(p => ({ ...p, course: c }))}
                >
                  <Text style={[styles.filterChipText, pendingFilters.course === c && styles.filterChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => {
                setPendingFilters({ course: '', campus: '' });
              }}>
                <Text style={styles.clearBtnText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => {
                setFilters(pendingFilters);
                setShowFilters(false);
                loadProfiles(pendingFilters);
              }}>
                <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.applyBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.applyBtnText}>Aplicar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function CardContent({ profile, children }) {
  const colorIdx = profile.id ? profile.id.charCodeAt(0) % AVATAR_COLORS.length : 0;
  const photos = Array.isArray(profile.photos) ? profile.photos : [];
  const photo = photos.length > 0 ? photos[0] : null;

  return (
    <LinearGradient colors={['#1E1E35', '#16162A']} style={styles.cardInner}>
      {children}
      <View style={styles.cardAvatarArea}>
        {photo ? (
          <Image source={{ uri: photo.url }} style={styles.cardPhoto} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[AVATAR_COLORS[colorIdx] + '55', AVATAR_COLORS[colorIdx] + '22']}
            style={styles.avatarBg}
          >
            <Text style={styles.avatarInitials}>{getInitials(profile.display_name)}</Text>
          </LinearGradient>
        )}
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.cardName}>{profile.display_name}</Text>
          {profile.age != null && <Text style={styles.cardAge}>, {profile.age}</Text>}
        </View>
        {profile.course ? (
          <View style={styles.courseRow}>
            <Ionicons name="school-outline" size={14} color="#9898B3" />
            <Text style={styles.courseText}>{profile.course}</Text>
          </View>
        ) : null}
        {profile.campus ? (
          <View style={styles.courseRow}>
            <Ionicons name="location-outline" size={14} color="#FF4B6E" />
            <Text style={styles.distanceText}>{profile.campus}</Text>
          </View>
        ) : null}
        {profile.bio ? (
          <Text style={styles.cardBio} numberOfLines={3}>{profile.bio}</Text>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E1E35', alignItems: 'center', justifyContent: 'center' },
  filterBadge: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF4B6E', alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoFire: { fontSize: 22 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  matchAlert: { marginHorizontal: 24, marginBottom: 8, borderRadius: 12, overflow: 'hidden' },
  matchAlertInner: { paddingVertical: 10, alignItems: 'center' },
  matchAlertText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cardsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  card: { position: 'absolute', width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 15 },
  cardBack: { top: 12, transform: [{ scale: 0.95 }], opacity: 0.6 },
  cardInner: { flex: 1 },
  stamp: { position: 'absolute', top: 24, zIndex: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 3 },
  stampLike: { left: 20, borderColor: '#06D6A0', transform: [{ rotate: '-15deg' }] },
  stampNope: { right: 20, borderColor: '#FF4B6E', transform: [{ rotate: '15deg' }] },
  stampSuper: { alignSelf: 'center', left: CARD_WIDTH / 2 - 70, borderColor: '#4FC3F7', transform: [{ rotate: '0deg' }] },
  stampLikeText: { fontSize: 18, fontWeight: '900', color: '#06D6A0', letterSpacing: 1 },
  stampNopeText: { fontSize: 18, fontWeight: '900', color: '#FF4B6E', letterSpacing: 1 },
  stampSuperText: { fontSize: 18, fontWeight: '900', color: '#4FC3F7', letterSpacing: 1 },
  cardAvatarArea: { height: CARD_HEIGHT * 0.46, alignItems: 'center', justifyContent: 'center' },
  cardPhoto: { width: '100%', height: '100%' },
  avatarBg: { width: 120, height: 120, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 48, fontWeight: '700', color: '#fff' },
  cardInfo: { flex: 1, paddingHorizontal: 20, paddingVertical: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  cardAge: { fontSize: 22, color: '#C4C4D8', fontWeight: '400' },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  courseText: { color: '#9898B3', fontSize: 14 },
  distanceText: { color: '#FF4B6E', fontSize: 13, fontWeight: '500' },
  cardBio: { color: '#C4C4D8', fontSize: 14, lineHeight: 20, marginTop: 6 },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, paddingVertical: 16 },
  actionBtn: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  actionNope: { backgroundColor: '#1E1E35', borderWidth: 2, borderColor: '#2A2A45', shadowColor: '#000' },
  actionNopeTxt: { fontSize: 24, color: '#FF4B6E' },
  actionSuper: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1E2A3A', borderWidth: 2, borderColor: '#4FC3F7', shadowColor: '#4FC3F7' },
  actionSuperTxt: { fontSize: 20 },
  actionLike: { backgroundColor: '#FF4B6E', shadowColor: '#FF4B6E' },
  actionLikeTxt: { fontSize: 26, color: '#fff' },
  emptyCard: { alignItems: 'center', gap: 12 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptySubtitle: { fontSize: 14, color: '#9898B3', textAlign: 'center' },
  reloadBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#FF4B6E', borderRadius: 12 },
  reloadBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  // Modal filters
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: '#16162A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#2A2A45', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 20 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#C4C4D8', marginBottom: 10, letterSpacing: 0.3 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1E1E35', borderWidth: 1.5, borderColor: '#2A2A45', marginRight: 8 },
  filterChipActive: { backgroundColor: 'rgba(255,75,110,0.12)', borderColor: '#FF4B6E' },
  filterChipText: { color: '#9898B3', fontSize: 14, fontWeight: '500' },
  filterChipTextActive: { color: '#FF4B6E', fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  clearBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: '#1E1E35', borderWidth: 1.5, borderColor: '#2A2A45', alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { color: '#9898B3', fontWeight: '600', fontSize: 15 },
  applyBtn: { flex: 2, borderRadius: 14, overflow: 'hidden' },
  applyBtnInner: { height: 52, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
