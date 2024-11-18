import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar } from 'react-native-paper';
import { supabase } from '../supabase';

function Card({ elemento }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.pCard}>Grupo: {elemento.nome_grupo}</Text>

      <TouchableOpacity onPress={toggleDetails}>
        <Text style={styles.toggleText}>{showDetails ? 'Ver Menos' : 'Ver Mais'}</Text>
      </TouchableOpacity>

      {showDetails && (
        <>
          <Text style={styles.pCard}>Descrição: {elemento.descricao}</Text>
          <Text style={styles.pCard}>Integrantes: {elemento.integrantes.join(', ')}</Text>
          <Text style={styles.pCard}>Nota: {elemento.nota_gp || 'Ainda não avaliado'}</Text>
        </>
      )}
    </View>
  );
}


export default function Main({ navigation }) {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data, error } = await supabase
          .from('Grupo')
          .select(`
          id,
          descricao,
          nome_grupo,
          Aluno (nome_completo),
          Avaliacao (nota)
        `);

        if (error) {
          console.error('Erro ao buscar os dados:', error);
        } else {
          const gruposFormatados = data.map(grupo => ({
            ...grupo,
            integrantes: grupo.Aluno.map(aluno => aluno.nome_completo),
            nota_gp: grupo.Avaliacao?.nota || 'Ainda não avaliado'
          }));
          setGrupos(gruposFormatados);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffaf1b" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.navigate('Login')} />
      </Appbar.Header>
      <View style={styles.container1}>
        <Text style={styles.p}>Olá, confira os projetos para o InovaWeek 2025!</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {grupos.map((grupo, index) => (
            <Card key={index} elemento={grupo} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: 12, // Mais arredondado para suavizar o visual
    backgroundColor: '#ffaf1b', // Cor vibrante do card
    marginBottom: 15, // Aumentei o espaçamento inferior para maior separação
    marginTop: 15, // Aumentei o espaçamento superior também
    padding: 20, // Aumentei o padding para dar mais espaço interno
    justifyContent: 'center',
    overflow: 'hidden',
  },

  header: {
    backgroundColor: '#006673', // Cor escura para destacar o cabeçalho
    height: 60,
    justifyContent: 'center', // Centralizando o conteúdo do cabeçalho
    alignItems: 'center',
  },

  pCard: {
    color: '#006673', // Cor escura para o texto dentro do card
    fontSize: 16, // Aumentei um pouco o tamanho da fonte para tornar mais legível
    fontWeight: 'bold',
    textAlign: 'center', // Centralizando o texto
  },

  toggleText: {
    color: 'white',
    fontSize: 16, // Tamanho maior para melhorar a legibilidade
    fontWeight: 'bold',
    marginTop: 8, // Aumentei o espaçamento superior para maior respiro
    textAlign: 'center', // Centralizando o texto para ficar mais harmônico
  },

  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006673', // Cor de fundo consistente
  },

  p: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 22, // Aumentei um pouco o tamanho da fonte para mais destaque
    marginTop: 40, // Maior espaçamento superior
    marginBottom: 25, // Maior espaçamento inferior
    padding: 5,
    textAlign: 'center', // Alinhamento centralizado
  },

  scrollView: {
    flex: 1, // Ajustei para que o ScrollView ocupe toda a altura disponível
    paddingHorizontal: 10, // Ajustei o padding para dar mais espaço nas laterais
    alignItems: 'center', // Centralizando os itens dentro do ScrollView
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006673', // Mantendo a cor de fundo consistente
  },

  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center', // Centralizando o texto de carregamento
  },
});


