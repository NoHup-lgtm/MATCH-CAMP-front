import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.58;
const SWIPE_THRESHOLD = 100;

const MOCK_PROFILES = [
  { id: '1', name: 'Ana Júlia', age: 21, course: 'Psicologia', semester: '5º sem', bio: 'Apaixonada por café, livros e discussões filosóficas às 2am ☕📚', emoji: '👩‍🦱', tags: ['Café', 'Leitura', 'Yoga'], distance: '200m do RU', compat: 94 },
  { id: '2', name: 'Pedro H.', age: 22, course: 'Engenharia', semester: '7º sem', bio: 'Faço robótica, jogo videogame e sei cozinhar macarrão 🤖🎮', emoji: '👨‍💻', tags: ['Tech', 'Games', 'Robótica'], distance: '1 sala de você', compat: 87 },
  { id: '3', name: 'Mariana', age: 20, course: 'Arquitetura', semester: '4º sem', bio: 'Amo arte, trilhas e pessoas com senso de humor 🎨🏔️', emoji: '👩‍🎨', tags: ['Arte', 'Trilha', 'Música'], distance: '3km', compat: 91 },
];

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166'];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [activeTab, setActiveTab] = useState('home');
  const [matchAlert, setMatchAlert] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD) swipe('right');
      else if (gestureState.dx < -SWIPE_THRESHOLD) swipe('left');
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  });

  const swipe = (direction) => {
    const x = direction === 'right' ? width * 1.5 : -width * 1.5;
    Animated.timing(position, { toValue: { x, y: 0 }, duration: 300, useNativeDriver: false }).start(() => {
      if (direction === 'right' && Math.random() > 0.4) {
        setMatchAlert(profiles[0]);
        setTimeout(() => setMatchAlert(null), 2500);
      }
      setProfiles((prev) => prev.slice(1));
      position.setValue({ x: 0, y: 0 });
    });
  };

  const current = profiles[0];
  const next = profiles[1];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="tune-vertical" size={22} color="#9898B3" />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Text style={styles.logoFire}>🔥</Text>
          <Text style={styles.logoText}>MatchCamp</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="bell" size={22} color="#9898B3" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Match alert */}
      {matchAlert && (
        <View style={styles.matchAlert}>
          <LinearGradient colors={['#FF4B6E', '#6C63FF']} style={styles.matchAlertInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.matchAlertText}>🎉 Match com {matchAlert.name}!</Text>
          </LinearGradient>
        </View>
      )}

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {profiles.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎓</Text>
            <Text style={styles.emptyTitle}>Você viu todo mundo!</Text>
            <Text style={styles.emptySubtitle}>Volte amanhã para novos perfis do campus</Text>
          </View>
        ) : (
          <>
            {/* Next card */}
            {next && (
              <View style={[styles.card, styles.cardBack]}>
                <View style={styles.cardAvatarArea}>
                  <Text style={{ fontSize: 80 }}>{next.emoji}</Text>
                </View>
              </View>
            )}

            {/* Current card */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                  ],
                },
              ]}
            >
              <LinearGradient colors={['#1E1E35', '#16162A']} style={styles.cardInner}>
                {/* Like / Nope stamps */}
                <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
                  <Text style={styles.stampText}>LIKE 💚</Text>
                </Animated.View>
                <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}>
                  <Text style={[styles.stampText, { color: '#FF4B6E' }]}>NOPE ✕</Text>
                </Animated.View>

                {/* Avatar */}
                <View style={styles.cardAvatarArea}>
                  <LinearGradient
                    colors={[AVATAR_COLORS[profiles.indexOf(current) % 3] + '33', AVATAR_COLORS[profiles.indexOf(current) % 3] + '11']}
                    style={styles.avatarBg}
                  >
                    <Text style={styles.avatarEmoji}>{current.emoji}</Text>
                  </LinearGradient>

                  {/* Compat badge */}
                  <View style={styles.compatBadge}>
                    <LinearGradient colors={['#FF4B6E', '#C9284A']} style={styles.compatBadgeInner}>
                      <Text style={styles.compatText}>⚡ {current.compat}%</Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.cardName}>{current.name}</Text>
                    <Text style={styles.cardAge}>, {current.age}</Text>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#06D6A0" style={{ marginLeft: 6 }} />
                  </View>
                  <View style={styles.courseRow}>
                    <MaterialCommunityIcons name="school-outline" size={14} color="#9898B3" />
                    <Text style={styles.courseText}>{current.course} • {current.semester}</Text>
                  </View>
                  <View style={styles.distanceRow}>
                    <MaterialCommunityIcons name="map-marker" size={14} color="#FF4B6E" />
                    <Text style={styles.distanceText}>{current.distance}</Text>
                  </View>
                  <Text style={styles.cardBio}>{current.bio}</Text>

                  <View style={styles.tagsRow}>
                    {current.tags.map((t) => (
                      <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </>
        )}
      </View>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionNope]} onPress={() => swipe('left')}>
            <Text style={styles.actionNopeTxt}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionStar]}>
            <Text style={{ fontSize: 22 }}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionLike]} onPress={() => swipe('right')}>
            <Text style={styles.actionLikeTxt}>♥</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        {[ 
          { id: 'home', label: 'Início' },
          { id: 'match', label: 'Matches' },
          { id: 'chat', label: 'Mensagens' },
          { id: 'profile', label: 'Perfil' },
        ].map((tab) => {
          let iconName = 'circle';
          if (tab.id === 'home') iconName = activeTab === tab.id ? 'flame' : 'flame-outline';
          else if (tab.id === 'match') iconName = activeTab === tab.id ? 'heart' : 'heart-outline';
          else if (tab.id === 'chat') iconName = activeTab === tab.id ? 'chatbubble' : 'chatbubble-outline';
          else if (tab.id === 'profile') iconName = activeTab === tab.id ? 'person-circle' : 'person-circle-outline';

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => {
                setActiveTab(tab.id);
                const rootNav = (() => {
                  let r = navigation;
                  while (r && r.getParent && r.getParent() != null) r = r.getParent();
                  return r || navigation;
                })();

                if (tab.id === 'home') rootNav.navigate('HomeTab');
                else if (tab.id === 'match') rootNav.navigate('MatchesTab', { activeTab: 'matches' });
                else if (tab.id === 'chat') rootNav.navigate('MatchesTab', { activeTab: 'messages' });
                else if (tab.id === 'profile') rootNav.navigate('ProfileTab');
              }}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={activeTab === tab.id ? '#FF4B6E' : '#555570'}
              />
              <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E1E35', alignItems: 'center', justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoFire: { fontSize: 22 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4B6E', position: 'absolute', top: 8, right: 8 },
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
  cardAvatarArea: { height: CARD_HEIGHT * 0.46, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarBg: { width: 120, height: 120, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 72 },
  compatBadge: { position: 'absolute', bottom: 8, right: 20, borderRadius: 20, overflow: 'hidden' },
  compatBadgeInner: { paddingHorizontal: 12, paddingVertical: 6 },
  compatText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cardInfo: { flex: 1, paddingHorizontal: 20, paddingVertical: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  cardAge: { fontSize: 22, color: '#C4C4D8', fontWeight: '400' },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  courseText: { color: '#9898B3', fontSize: 14 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  distanceText: { color: '#FF4B6E', fontSize: 13, fontWeight: '500' },
  cardBio: { color: '#C4C4D8', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(255,75,110,0.12)', borderWidth: 1, borderColor: 'rgba(255,75,110,0.3)' },
  tagText: { color: '#FF7A94', fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, paddingVertical: 16 },
  actionBtn: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  actionNope: { backgroundColor: '#1E1E35', borderWidth: 2, borderColor: '#2A2A45', shadowColor: '#000' },
  actionNopeTxt: { fontSize: 24, color: '#FF4B6E' },
  actionStar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1E1E35', borderWidth: 2, borderColor: '#2A2A45' },
  actionLike: { backgroundColor: '#FF4B6E', shadowColor: '#FF4B6E' },
  actionLikeTxt: { fontSize: 26, color: '#fff' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#16162A', borderTopWidth: 1, borderTopColor: '#2A2A45', paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: '#555570' },
  navLabelActive: { color: '#FF4B6E', fontWeight: '600' },
  emptyCard: { alignItems: 'center', gap: 12 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptySubtitle: { fontSize: 14, color: '#9898B3', textAlign: 'center' },
});
