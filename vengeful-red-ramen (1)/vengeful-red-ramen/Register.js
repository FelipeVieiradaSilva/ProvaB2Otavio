import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { supabase } from '../supabase';

export default function Register({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar se a requisição está em andamento

  // Função de validação de e-mail
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Função para validar a senha
  const validatePassword = (senha) => {
    return senha.length >= 6; // Verifica se a senha tem pelo menos 6 caracteres
  };

  // Função de autenticação
  const handleRegister = async () => {
    // Limpa a mensagem anterior
    setMessage('');
    setMessageType('');
    
    // Verifica se todos os campos estão preenchidos
    if (!nomeCompleto || !email || !senha) {
      setMessage('Por favor, preencha todos os campos.');
      setMessageType('error');
      return;
    }

    // Valida o e-mail
    if (!validateEmail(email)) {
      setMessage('Por favor, insira um e-mail válido.');
      setMessageType('error');
      return;
    }

    // Valida a senha
    if (!validatePassword(senha)) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true); // Inicia o processo de submissão

    try {
      // Inserir o aluno na tabela 'Aluno' do Supabase
      const { data, error } = await supabase
        .from('Aluno')
        .insert([
          {
            email: email,
            senha: senha, // Considerando que no Supabase você deve hash a senha no backend
            nome_completo: nomeCompleto,
          },
        ]);

      if (error) {
        console.log('Erro Supabase:', error.message);
        if (error.message.includes('Row-level security policy')) {
          setMessage('Falha no registro devido a políticas de segurança da tabela.');
        } else {
          setMessage('Houve um problema ao criar sua conta. Tente novamente.');
        }
        setMessageType('error');
      } else {
        setMessage('Conta criada com sucesso!');
        setMessageType('success');
        setTimeout(() => {
          navigation.navigate('Login'); // Navega para a tela de login
        }, 2000);
      }
    } catch (err) {
      console.log('Erro inesperado:', err);
      setMessage('Erro inesperado. Por favor, tente novamente mais tarde.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false); // Finaliza o processo de submissão
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.p1}>CRIANDO UMA CONTA!</Text>

      {message ? (
        <Text style={[styles.message, messageType === 'success' ? styles.success : styles.error]}>
          {message}
        </Text>
      ) : null}

      <TextInput
        label="Nome Completo"
        value={nomeCompleto}
        onChangeText={text => setNomeCompleto(text)}
        style={styles.textInput}
        theme={{ colors: { primary: '#ffaf1b' } }}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.textInput}
        theme={{ colors: { primary: '#ffaf1b' } }}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={text => setSenha(text)}
        secureTextEntry={true}
        style={styles.textInput}
        theme={{ colors: { primary: '#ffaf1b' } }}
      />

      <View style={styles.container3}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.cancelar}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isSubmitting} // Desabilita o botão durante a requisição
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Criando...' : 'Criar conta'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006673',
  },

  container3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
  },

  p1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9cae28',
    marginBottom: 25,
    textAlign: 'center',
  },

  textInput: {
    backgroundColor: 'white',
    marginBottom: 15,
    width: '70%',
    height: 55,
    borderRadius: 10,
    paddingLeft: 10,
  },

  cancelar: {
    color: '#ffaf1b',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#ffaf1b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#006673',
    fontWeight: 'bold',
    fontSize: 18,
  },

  message: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },

  error: {
    color: '#FF0000',
  },

  success: {
    color: '#00FF35',
  },
});
