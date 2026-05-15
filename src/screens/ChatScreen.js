import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { WS_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_COLORS = ['#FF4B6E', '#6C63FF', '#FFD166', '#06D6A0', '#FF9F1C'];

function colorFor(id) {
  if (!id) return AVATAR_COLORS[0];
  return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function ChatScreen({ route, navigation }) {
  const { conversationId, partnerName, partnerPhoto } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const ws = useRef(null);
  const flatRef = useRef(null);
  const typingTimeout = useRef(null);
  const color = colorFor(partnerName);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMessages(conversationId, { limit: 50 });
      const msgs = data.messages || data || [];
      setMessages(msgs.reverse());
    } catch {}
    finally { setLoading(false); }
  }, [conversationId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    let mounted = true;

    async function connectWS() {
      const token = await AsyncStorage.getItem('matchcamp_token');
      const url = token
        ? `${WS_URL}/v1/ws?token=${token}`
        : `${WS_URL}/v1/ws`;

      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onmessage = (e) => {
        if (!mounted) return;
        try {
          const event = JSON.parse(e.data);
          if (event.type === 'message' && event.conversation_id === conversationId) {
            const incoming = {
              id: event.id,
              conversation_id: conversationId,
              sender_user_id: event.sender_user_id,
              body: event.text || event.body,
              created_at: event.created_at,
            };
            setMessages(prev => [incoming, ...prev]);
            setPartnerTyping(false);
          }
          if (event.type === 'typing' && event.conversation_id === conversationId) {
            setPartnerTyping(true);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setPartnerTyping(false), 3000);
          }
        } catch {}
      };

      socket.onerror = () => {};
      socket.onclose = () => {};
    }

    connectWS();

    return () => {
      mounted = false;
      ws.current?.close();
      clearTimeout(typingTimeout.current);
    };
  }, [conversationId]);

  const sendTyping = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'typing', conversation_id: conversationId }));
    }
  }, [conversationId]);

  const send = useCallback(async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText('');
    try {
      const msg = await api.sendMessage(conversationId, body);
      setMessages(prev => [msg, ...prev]);
    } catch {
      setText(body);
    } finally {
      setSending(false);
    }
  }, [text, sending, conversationId]);

  const renderMessage = ({ item }) => {
    const isMe = item.sender_user_id === user?.id;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {item.body || item.text}
          </Text>
          <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
            {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.partnerInfo}>
          {partnerPhoto ? (
            <Image source={{ uri: partnerPhoto }} style={styles.partnerAvatar} />
          ) : (
            <View style={[styles.partnerAvatarFallback, { backgroundColor: color + '33' }]}>
              <Text style={[styles.partnerAvatarInitials, { color }]}>{getInitials(partnerName)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.partnerName}>{partnerName}</Text>
            {partnerTyping && <Text style={styles.typingText}>digitando...</Text>}
          </View>
        </View>
      </View>

      {/* Messages */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF4B6E" />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item, idx) => item.id || String(idx)}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(t) => { setText(t); sendTyping(); }}
          placeholder="Mensagem..."
          placeholderTextColor="#555570"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!text.trim() || sending}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1E1E35', alignItems: 'center', justifyContent: 'center' },
  partnerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  partnerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E1E35' },
  partnerAvatarFallback: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  partnerAvatarInitials: { fontSize: 16, fontWeight: '700' },
  partnerName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  typingText: { fontSize: 12, color: '#9898B3', fontStyle: 'italic' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  msgList: { paddingHorizontal: 16, paddingVertical: 12 },
  msgRow: { marginBottom: 8 },
  msgRowMe: { alignItems: 'flex-end' },
  msgRowThem: { alignItems: 'flex-start' },
  bubble: { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleMe: { backgroundColor: '#FF4B6E', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#1E1E35', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: '#fff' },
  bubbleTextThem: { color: '#E0E0F0' },
  msgTime: { fontSize: 11, color: 'rgba(255,255,255,0.5)', alignSelf: 'flex-end' },
  msgTimeMe: { color: 'rgba(255,255,255,0.6)' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: 10, backgroundColor: '#0D0D1A' },
  input: { flex: 1, backgroundColor: '#1E1E35', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 15, maxHeight: 120, borderWidth: 1, borderColor: '#2A2A45' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF4B6E', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
});
