import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fonts, radius } from '../theme';
import { Card, Header, Badge, Chip } from '../components';

export default function MatchesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState([
    {
      id: '1',
      name: 'Ana Júlia',
      age: 21,
      course: 'Psicologia',
      status: 'online',
      lastMessage: 'Oi! Como vai? 😊',
      time: 'agora',
      compatibility: 94,
      emoji: '👩‍🦱',
    },
    {
      id: '2',
      name: 'Mariana',
      age: 20,
      course: 'Arquitetura',
      status: 'online',
      lastMessage: 'Amei seu perfil!',
      time: '2 min',
      compatibility: 91,
      emoji: '👩‍🎨',
    },
    {
      id: '3',
      name: 'Sofia',
      age: 22,
      course: 'Direito',
      status: 'offline',
      lastMessage: 'Tmj! 🎉',
      time: '1 hora',
      compatibility: 87,
      emoji: '👩‍⚖️',
    },
  ]);

  const [activeTab, setActiveTab] = useState('matches');
  const [bottomNavActive, setBottomNavActive] = useState('match');

  useFocusEffect(
    useCallback(() => {
      const requested = route?.params?.activeTab;
      if (requested === 'messages') {
        setActiveTab('messages');
        setBottomNavActive('chat');
      } else if (requested === 'matches') {
        setActiveTab('matches');
        setBottomNavActive('match');
      } else {
        // default when arriving to MatchesTab
        setActiveTab((prev) => prev || 'matches');
        setBottomNavActive((prev) => prev || 'match');
      }

      // clear the param so subsequent focuses don't reapply it unexpectedly
      if (route?.params?.activeTab) {
        navigation.setParams({ activeTab: undefined });
      }
    }, [route?.params?.activeTab])
  );

  const sections =
    activeTab === 'matches'
      ? [
          {
            title: 'Conversas Ativas',
            data: matches.filter((m) => m.status === 'online'),
          },
          {
            title: 'Outras Conversas',
            data: matches.filter((m) => m.status === 'offline'),
          },
        ]
      : [
          {
            title: 'Novos Matches',
            data: matches,
          },
        ];

  const renderMatchCard = ({ item }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => {
        console.log('Chat with:', item.name);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.matchLeft}>
        <View style={styles.matchAvatar}>
          <Text style={styles.matchEmoji}>{item.emoji}</Text>
          {item.status === 'online' && (
            <View style={styles.onlineIndicator} />
          )}
        </View>

        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>
            {item.name}, {item.age}
          </Text>
          <Text style={styles.matchCourse}>{item.course}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
      </View>

      <View style={styles.matchRight}>
        <View style={styles.compatBadge}>
          <Text style={styles.compatText}>{item.compatibility}%</Text>
        </View>
        <Text style={styles.matchTime}>{item.time}</Text>
        {activeTab === 'messages' && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.gray}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradientDark}
      style={styles.container}
    >
      <Header
        title="Matches"
        subtitle={`${matches.length} conexões`}
        rightIcon="magnify"
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matches' && styles.tabActive]}
          onPress={() => setActiveTab('matches')}
        >
          <MaterialCommunityIcons
            name="heart"
            size={20}
            color={
              activeTab === 'matches' ? colors.primary : colors.gray
            }
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'matches' && styles.tabLabelActive,
            ]}
          >
            Matches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.tabActive]}
          onPress={() => setActiveTab('messages')}
        >
          <MaterialCommunityIcons
            name="message"
            size={20}
            color={
              activeTab === 'messages' ? colors.primary : colors.gray
            }
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'messages' && styles.tabLabelActive,
            ]}
          >
            Mensagens
          </Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderMatchCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        {[
          { id: 'home', label: 'Início' },
          { id: 'match', label: 'Matches' },
          { id: 'chat', label: 'Mensagens' },
          { id: 'profile', label: 'Perfil' },
        ].map((tab) => {
          let iconName = 'circle';
          if (tab.id === 'home') iconName = bottomNavActive === tab.id ? 'flame' : 'flame-outline';
          else if (tab.id === 'match') iconName = bottomNavActive === tab.id ? 'heart' : 'heart-outline';
          else if (tab.id === 'chat') iconName = bottomNavActive === tab.id ? 'chatbubble' : 'chatbubble-outline';
          else if (tab.id === 'profile') iconName = bottomNavActive === tab.id ? 'person-circle' : 'person-circle-outline';

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => {
                setBottomNavActive(tab.id);
                if (tab.id === 'home') navigation.navigate('HomeTab');
                else if (tab.id === 'match') navigation.navigate('MatchesTab');
                else if (tab.id === 'chat') navigation.navigate('MatchesTab');
                else if (tab.id === 'profile') navigation.navigate('ProfileTab');
              }}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={bottomNavActive === tab.id ? colors.primary : colors.gray}
              />
              <Text style={[styles.navLabel, bottomNavActive === tab.id && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.darkCard,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  tabActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  tabIcon: {
    marginRight: spacing.sm,
  },
  tabLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.gray,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.gray,
    letterSpacing: 0.5,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.darkCard,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  matchLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchAvatar: {
    position: 'relative',
    marginRight: spacing.md,
  },
  matchEmoji: {
    fontSize: 40,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '20',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.darkCard,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: fonts.sizes.md,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  matchCourse: {
    fontSize: fonts.sizes.xs,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    fontSize: fonts.sizes.sm,
    color: colors.gray,
  },
  matchRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  compatBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  compatText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '700',
    color: colors.white,
  },
  matchTime: {
    fontSize: fonts.sizes.xs,
    color: colors.gray,
  },
  bottomNav: { flexDirection: 'row', backgroundColor: colors.dark, borderTopWidth: 1, borderTopColor: colors.darkBorder, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: colors.gray },
  navLabelActive: { color: colors.primary, fontWeight: '600' },
});
