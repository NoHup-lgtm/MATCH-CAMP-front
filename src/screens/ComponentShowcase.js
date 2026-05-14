// Exemplos de uso dos componentes MatchCamp

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme';

import {
  Button,
  Card,
  Input,
  Header,
  Badge,
  StatsCard,
  FeatureCard,
  BottomSheet,
  ProgressBar,
  Alert,
  Chip,
  Divider,
} from '../components';

export default function ComponentShowcase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0.65);
  const [selectedChips, setSelectedChips] = useState(['react', 'native']);

  const bottomSheetItems = [
    { label: 'Editar Perfil', icon: 'pencil', color: colors.primary },
    { label: 'Configurações', icon: 'cog', color: colors.secondary },
    { label: 'Sair', icon: 'logout', color: colors.error },
  ];

  const interests = ['React', 'JavaScript', 'Mobile', 'UI/UX', 'NodeJS'];

  return (
    <LinearGradient colors={colors.gradientDark} style={styles.container}>
      <Header title="Componentes" subtitle="Galeria de exemplos" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Buttons */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📌 Botões</Text>
          <Button label="Primary" onPress={() => {}} variant="primary" />
          <Button
            label="Secondary"
            onPress={() => {}}
            variant="secondary"
            style={styles.marginTop}
          />
          <Button
            label="Outline"
            onPress={() => {}}
            variant="outline"
            style={styles.marginTop}
          />
          <Button
            label="Pequeno"
            onPress={() => {}}
            variant="primary"
            size="sm"
            style={styles.marginTop}
          />
        </Card>

        {/* Inputs */}
        <Card style={styles.section} variant="surface">
          <Text style={styles.sectionTitle}>📝 Inputs</Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            icon="email-outline"
          />
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            icon="lock-outline"
            secureTextEntry
            style={styles.marginTop}
          />
        </Card>

        {/* Badges */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Badges</Text>
          <View style={styles.badgesRow}>
            <Badge label="Verificado" icon="check-circle" variant="success" />
            <Badge label="Novo" icon="star" variant="warning" />
          </View>
          <View style={styles.badgesRow}>
            <Badge label="Info" icon="information" variant="primary" />
            <Badge label="Erro" variant="error" />
          </View>
        </Card>

        {/* Stats Cards */}
        <Card style={styles.section} variant="surface">
          <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
          <View style={styles.statsRow}>
            <StatsCard icon="heart" label="Likes" value="42" />
          </View>
          <View style={styles.statsRow}>
            <StatsCard icon="fire" label="Matches" value="12" />
          </View>
        </Card>

        {/* Feature Cards */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Features</Text>
          <FeatureCard
            icon="chat"
            title="Chat Seguro"
            description="Converse com segurança"
            gradient={['#6C63FF', '#FF4B6E']}
            onPress={() => {}}
          />
          <FeatureCard
            icon="heart"
            title="Smart Match"
            description="Algoritmo inteligente"
            gradient={['#FF4B6E', '#FFD166']}
            onPress={() => {}}
          />
        </Card>

        {/* Progress Bar */}
        <Card style={styles.section} variant="surface">
          <Text style={styles.sectionTitle}>📈 Progresso</Text>
          <ProgressBar progress={progress} animated={true} />
        </Card>

        {/* Alerts */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Alertas</Text>
          <Alert
            type="success"
            title="Sucesso!"
            message="Operação realizada com sucesso"
          />
          <Alert
            type="warning"
            title="Aviso"
            message="Cuidado com essa ação"
            style={styles.marginTop}
          />
          <Alert
            type="error"
            title="Erro"
            message="Algo deu errado"
            style={styles.marginTop}
          />
        </Card>

        {/* Chips */}
        <Card style={styles.section} variant="surface">
          <Text style={styles.sectionTitle}>💠 Chips</Text>
          <View style={styles.chipsContainer}>
            {interests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                variant="primary"
                size="sm"
                selected={selectedChips.includes(interest.toLowerCase())}
                onPress={() => {}}
              />
            ))}
          </View>
        </Card>

        {/* Divider */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>〰️ Divisor</Text>
          <Text style={styles.text}>Antes</Text>
          <Divider />
          <Text style={styles.text}>Depois</Text>
        </Card>

        {/* Bottom Sheet */}
        <Card style={styles.section} variant="surface">
          <Text style={styles.sectionTitle}>📍 Bottom Sheet</Text>
          <Button
            label="Abrir Menu"
            onPress={() => setVisible(true)}
            variant="primary"
          />
          <BottomSheet
            visible={visible}
            title="Menu"
            items={bottomSheetItems}
            onClose={() => setVisible(false)}
            onSelect={(item) => {
              console.log('Selecionado:', item);
              setVisible(false);
            }}
          />
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.lg,
  },
  marginTop: {
    marginTop: spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statsRow: {
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  text: {
    color: colors.white,
    fontSize: 14,
  },
});
