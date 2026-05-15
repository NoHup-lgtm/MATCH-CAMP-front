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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as api from '../services/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.58;
const SWIPE_THRESHOLD = 100;

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166', '#06D6A0', '#FF9F1C'];

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

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDiscovery({ limit: 10 });
      setProfiles(data.profiles || data || []);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar perfis.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const swipe = useCallback(async (direction) => {
    if (swiping || profiles.length === 0) return;
    const current = profiles[0];
    setSwiping(true);
    const x = direction === 'right' ? width * 1.5 : -width * 1.5;

    Animated.timing(position, { toValue: { x, y: 0 }, duration: 300, useNativeDriver: false }).start(async () => {
      position.setValue({ x: 0, y: 0 });
      setProfiles(prev => prev.slice(1));
      setSwiping(false);
      try {
        const result = await api.recordSwipe(current.id, direction);
        if (result && result.matched) {
          setMatchAlert(current.display_name);
          setTimeout(() => setMatchAlert(null), 3000);
        }
      } catch {}
    });
  }, [swiping, profiles, position]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !swiping,
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, { dx }) => {
      if (dx > SWIPE_THRESHOLD) swipe('right');
      else if (dx < -SWIPE_THRESHOLD) swipe('left');
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  });

  const current = profiles[0];
  const next = profiles[1];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoFire}>🔥</Text>
          <Text style={styles.logoText}>MatchCamp</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={loadProfiles}>
          <Ionicons name="refresh-outline" size={22} color="#9898B3" />
        </TouchableOpacity>
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
            <TouchableOpacity style={styles.reloadBtn} onPress={loadProfiles}>
              <Text style={styles.reloadBtnText}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {next && (
              <View style={[styles.card, styles.cardBack]}>
                <CardContent profile={next} />
              </View>
            )}
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}
            >
              <CardContent profile={current}>
                <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
                  <Text style={styles.stampText}>LIKE 💚</Text>
                </Animated.View>
                <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}>
                  <Text style={[styles.stampText, { color: '#FF4B6E' }]}>NOPE ✕</Text>
                </Animated.View>
              </CardContent>
            </Animated.View>
          </>
        )}
      </View>

      {/* Action buttons */}
      {!loading && profiles.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionNope]} onPress={() => swipe('left')}>
            <Text style={styles.actionNopeTxt}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionLike]} onPress={() => swipe('right')}>
            <Text style={styles.actionLikeTxt}>♥</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function CardContent({ profile, children }) {
  const colorIdx = profile.id ? profile.id.charCodeAt(0) % AVATAR_COLORS.length : 0;
  const photo = profile.photos && profile.photos.length > 0 ? profile.photos[0] : null;

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
        {profile.course && (
          <View style={styles.courseRow}>
            <Ionicons name="school-outline" size={14} color="#9898B3" />
            <Text style={styles.courseText}>{profile.course}</Text>
          </View>
        )}
        {profile.campus && (
          <View style={styles.courseRow}>
            <Ionicons name="location-outline" size={14} color="#FF4B6E" />
            <Text style={styles.distanceText}>{profile.campus}</Text>
          </View>
        )}
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
  stampText: { fontSize: 18, fontWeight: '900', color: '#06D6A0', letterSpacing: 1 },
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
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, paddingVertical: 16 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  actionNope: { backgroundColor: '#1E1E35', borderWidth: 2, borderColor: '#2A2A45', shadowColor: '#000' },
  actionNopeTxt: { fontSize: 26, color: '#FF4B6E' },
  actionLike: { backgroundColor: '#FF4B6E', shadowColor: '#FF4B6E' },
  actionLikeTxt: { fontSize: 28, color: '#fff' },
  emptyCard: { alignItems: 'center', gap: 12 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptySubtitle: { fontSize: 14, color: '#9898B3', textAlign: 'center' },
  reloadBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#FF4B6E', borderRadius: 12 },
  reloadBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
