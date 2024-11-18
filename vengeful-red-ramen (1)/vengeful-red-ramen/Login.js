import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { supabase } from '../supabase'; 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Função para validar o e-mail
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Função para lidar com o login
  const handleLogin = async () => {
    if (!email || !senha) {
      setMessage('Por favor, preencha todos os campos.');
      setMessageType('error');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Por favor, insira um e-mail válido.');
      setMessageType('error');
      return;
    }

    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password: senha
      });

      if (error) {
        setMessage('E-mail ou senha incorretos.');
        setMessageType('error');
        Alert.alert('Erro', 'E-mail ou senha incorretos');
      } else if (user) {
        setMessage('Login realizado com sucesso!');
        setMessageType('success');
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        setTimeout(() => {
          navigation.navigate('Main');
        }, 2000);
      }
    } catch (err) {
      setMessage('Houve um problema ao tentar fazer login. Tente novamente.');
      setMessageType('error');
      console.log('Erro inesperado:', err);
      Alert.alert('Erro', 'Houve um erro ao tentar realizar o login. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.p}>ÁREA DE LOGIN</Text>

      {message ? (
        <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
          {message}
        </Text>
      ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        theme={{ colors: { primary: '#ffaf1b' } }}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
        style={styles.textInput}
        theme={{ colors: { primary: '#ffaf1b' } }}
      />

      <View style={styles.container2}>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
          <Text style={styles.esqueceu}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.esqueceu}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b3a42', // Cor de fundo mais escura
  },

  container2: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 30,
  },

  p: {
    marginBottom: 40,
    fontSize: 32, // Tamanho da fonte menor
    fontWeight: '600', // Peso da fonte mais leve
    color: '#f8c56e', // Cor amarela suave
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#f8c56e', // Cor de fundo do botão mais suave
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30, // Maior espaçamento superior
  },

  buttonText: {
    color: '#2b3a42', // Texto escuro para contraste
    fontWeight: '700',
    fontSize: 20, // Aumento do tamanho da fonte do botão
  },

  textInput: {
    backgroundColor: '#ffffff', // Cor de fundo branca para os campos de input
    marginBottom: 20, // Espaçamento aumentado entre os campos
    width: '80%', // Mantendo a largura consistente
    height: 60, // Aumento da altura para tornar os campos mais fáceis de digitar
    borderRadius: 12, // Borda mais arredondada
    paddingLeft: 15, // Aumento do padding à esquerda para mais conforto
    fontSize: 16, // Aumento da fonte dentro do campo
  },

  esqueceu: {
    textAlign: 'center',
    color: '#f8c56e', // Cor amarela suave
    fontSize: 16, // Aumento do tamanho da fonte
    marginTop: 12,
    textDecorationLine: 'underline',
  },

  message: {
    marginBottom: 25,
    fontSize: 18, // Aumento do tamanho da fonte
    textAlign: 'center',
    width: '80%',
  },

  error: {
    color: '#e74c3c', // Cor vermelha mais forte para erro
  },

  success: {
    color: '#27ae60', // Verde mais escuro para sucesso
  },
});
