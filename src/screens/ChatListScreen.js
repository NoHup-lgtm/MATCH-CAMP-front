import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as api from '../services/api';

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166', '#06D6A0', '#FF9F1C'];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function colorFor(id) {
  if (!id) return AVATAR_COLORS[0];
  return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now - d) / 3600000;
  if (diffH < 24) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (diffH < 168) return d.toLocaleDateString('pt-BR', { weekday: 'short' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function ChatListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await api.getConversations();
      setConversations(data.conversations || data || []);
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const renderItem = ({ item }) => {
    const partner = item.partner || {};
    const photo = partner.photo_url;
    const color = colorFor(partner.id);
    const lastMsg = item.last_message;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Chat', {
          conversationId: item.conversation_id,
          partnerName: partner.display_name,
          partnerPhoto: photo,
        })}
        activeOpacity={0.7}
      >
        <View style={styles.avatarWrap}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: color + '33' }]}>
              <Text style={[styles.avatarInitials, { color }]}>{getInitials(partner.display_name)}</Text>
            </View>
          )}
          {partner.online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.info}>
          <View style={styles.infoTop}>
            <Text style={styles.name}>{partner.display_name || 'Usuário'}</Text>
            {lastMsg && <Text style={styles.time}>{formatTime(lastMsg.created_at)}</Text>}
          </View>
          {lastMsg ? (
            <Text style={styles.lastMsg} numberOfLines={1}>
              {lastMsg.from_me ? 'Você: ' : ''}{lastMsg.text}
            </Text>
          ) : (
            <Text style={styles.newMatch}>Diga oi! 👋</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mensagens</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF4B6E" />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
          <Text style={styles.emptySubtitle}>Faça um match para começar a conversar!</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.conversation_id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#FF4B6E" />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  list: { paddingHorizontal: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1E1E35' },
  avatarFallback: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 20, fontWeight: '700' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#06D6A0', borderWidth: 2, borderColor: '#0D0D1A' },
  info: { flex: 1, gap: 4 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#fff' },
  time: { fontSize: 12, color: '#555570' },
  lastMsg: { fontSize: 14, color: '#9898B3' },
  newMatch: { fontSize: 14, color: '#FF4B6E', fontWeight: '600' },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptySubtitle: { fontSize: 14, color: '#9898B3', textAlign: 'center', paddingHorizontal: 32 },
});
