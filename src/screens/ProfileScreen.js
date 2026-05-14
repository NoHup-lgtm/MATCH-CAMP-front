import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fonts, radius } from '../theme';
import {
  Card,
  StatsCard,
  Badge,
  Header,
  Chip,
  Divider,
  Alert,
} from '../components';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [bottomNavActive, setBottomNavActive] = useState('profile');
  
  useFocusEffect(
    useCallback(() => {
      setBottomNavActive('profile');
    }, [])
  );

  const [profile, setProfile] = useState({
    name: 'Gabriel Silva',
    age: 22,
    course: 'Engenharia de Software',
    semester: '7º semestre',
    bio: 'Apaixonado por tecnologia, games e novas amizades 🚀',
    location: 'Campus Principal',
    verified: true,
    stats: {
      likes: 42,
      matches: 12,
      views: 186,
    },
    interests: ['Tecnologia', 'Games', 'Café', 'Música'],
    photos: 3,
  });

  const [isEditingMode, setIsEditingMode] = useState(false);

  return (
    <LinearGradient
      colors={colors.gradientDark}
      style={styles.container}
    >
      <Header
        title={isEditingMode ? 'Editar Perfil' : 'Meu Perfil'}
        subtitle={isEditingMode ? 'Atualize suas informações' : 'Você está incrível!'}
        rightIcon={isEditingMode ? 'check' : 'pencil'}
        onRightPress={() => setIsEditingMode(!isEditingMode)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <Card style={styles.profileCard} gradient>
          <LinearGradient
            colors={['transparent', colors.dark]}
            style={styles.profileGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>👨‍💻</Text>
                </View>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={16}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{profile.name}</Text>
                  {profile.verified && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color={colors.success}
                      style={styles.verifiedBadge}
                    />
                  )}
                </View>
                <Text style={styles.age}>{profile.age} anos</Text>
                <Text style={styles.course}>{profile.course}</Text>
              </View>

              <TouchableOpacity style={styles.shareButton}>
                <MaterialCommunityIcons
                  name="share-variant"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{profile.bio}</Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon="heart"
            label="Likes"
            value={profile.stats.likes}
            color={colors.primary}
          />
          <StatsCard
            icon="fire"
            label="Matches"
            value={profile.stats.matches}
            color={colors.accent}
          />
          <StatsCard
            icon="eye"
            label="Visualizações"
            value={profile.stats.views}
            color={colors.secondary}
          />
        </View>

        {/* Alert */}
        <Alert
          type="info"
          title="Perfil Incompleto"
          message="Adicione mais fotos para aumentar suas chances de match"
        />

        {/* Photos Section */}
        <Card style={styles.sectionCard} variant="surface">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fotos</Text>
            <TouchableOpacity style={styles.addButton}>
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.photosGrid}>
            {[1, 2, 3].map((i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.photoItem,
                  i <= profile.photos && styles.photoItemFilled,
                ]}
              >
                {i <= profile.photos ? (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoEmoji}>📷</Text>
                  </View>
                ) : (
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={colors.gray}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Interests Section */}
        <Card style={styles.sectionCard} variant="surface">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Interesses</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="pencil"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.interests}>
            {profile.interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                variant="primary"
                size="sm"
                onClose={() => {}}
              />
            ))}
            <Chip
              label="Adicionar novo"
              icon="plus"
              variant="default"
              size="sm"
            />
          </View>
        </Card>

        {/* Settings Section */}
        <Card style={styles.sectionCard} variant="surface">
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons
              name="cog"
              size={20}
              color={colors.gray}
            />
            <Text style={styles.settingsLabel}>Privacidade</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.gray}
              style={styles.settingsChevron}
            />
          </TouchableOpacity>

          <Divider variant="horizontal" margin={false} />

          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons
              name="bell"
              size={20}
              color={colors.gray}
            />
            <Text style={styles.settingsLabel}>Notificações</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.gray}
              style={styles.settingsChevron}
            />
          </TouchableOpacity>

          <Divider variant="horizontal" margin={false} />

          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons
              name="shield-account"
              size={20}
              color={colors.gray}
            />
            <Text style={styles.settingsLabel}>Segurança</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.gray}
              style={styles.settingsChevron}
            />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginRight: spacing.xs,
  },
  verifiedBadge: {
    marginTop: 2,
  },
  age: {
    fontSize: fonts.sizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  course: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  shareButton: {
    padding: spacing.sm,
  },
  bioContainer: {
    marginTop: spacing.md,
  },
  bio: {
    fontSize: fonts.sizes.md,
    color: colors.offWhite,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: fonts.sizes.sm,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.white,
  },
  addButton: {
    padding: spacing.xs,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.darkCard,
    borderWidth: 2,
    borderColor: colors.darkBorder,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoItemFilled: {
    borderStyle: 'solid',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEmoji: {
    fontSize: 32,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontSize: fonts.sizes.md,
    color: colors.white,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  settingsChevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.darkBorder,
  },
  logoutText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.error,
  },
  bottomNav: { flexDirection: 'row', backgroundColor: colors.dark, borderTopWidth: 1, borderTopColor: colors.darkBorder, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: colors.gray },
  navLabelActive: { color: colors.primary, fontWeight: '600' },
});
