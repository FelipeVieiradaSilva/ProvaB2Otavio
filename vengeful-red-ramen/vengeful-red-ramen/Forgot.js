import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { supabase } from '../supabase';

export default function Forgot({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  // Função para lidar com a redefinição de senha
  const handlePasswordReset = async () => {
    if (!email) {
      setMessage('Por favor, informe o e-mail.');
      setMessageType('error');
      return;
    }

    try {
      const { error } = await supabase.auth.api
        .resetPasswordForEmail(email);

      if (error) {
        setMessage('Erro ao tentar redefinir a senha.');
        setMessageType('error');
        console.log('Erro Supabase:', error.message);
        Alert.alert('Erro', 'Não foi possível enviar o link de recuperação.');
      } else {
        setMessage('Link de recuperação enviado! Verifique seu e-mail.');
        setMessageType('success');
        Alert.alert('Sucesso', 'Link de recuperação enviado!');
      }
    } catch (err) {
      setMessage('Erro inesperado. Tente novamente.');
      setMessageType('error');
      console.log('Erro inesperado:', err);
      Alert.alert('Erro', 'Houve um erro ao tentar redefinir a senha.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.p1}>REDEFINIÇÃO DE SENHA!</Text>

      <Text style={styles.p2}>
        Informe o e-mail para o qual deseja redefinir a sua senha.
      </Text>

      {message ? (
        <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
          {message}
        </Text>
      ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        theme={{ colors: { primary: '#ffaf1b' } }} // Muda a cor de foco
        keyboardType="email-address" // Forçando o teclado para e-mail
        autoCapitalize="none" // Evita a capitalização automática
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar link de recuperação</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.cancelar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00334d', // Tom de azul mais profundo para o fundo
  },

  p1: {
    color: '#ffaf1b', // Cor amarela para o título
    fontSize: 26, // Tamanho de fonte um pouco maior para destaque
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Espaçamento inferior para separar do conteúdo
  },

  p2: {
    color: '#b0b0b0', // Cinza mais suave para o texto secundário
    fontSize: 14,
    paddingHorizontal: 15, // Ajustando o padding para texto
    textAlign: 'center',
    width: '80%',
    marginBottom: 20, // Maior espaçamento inferior
  },

  input: {
    backgroundColor: '#e0e0e0', // Cor de fundo mais clara para os campos de entrada
    marginBottom: 15, // Maior espaçamento entre os campos
    width: '80%', // Proporção adequada para inputs
    height: 55,
    borderRadius: 10, // Bordas arredondadas
    paddingLeft: 10, // Espaço interno para o texto
  },

  button: {
    backgroundColor: '#ffaf1b', // Cor amarela para o botão
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8, // Bordas arredondadas
  },

  buttonText: {
    color: '#00334d', // Texto em cor escura para o botão
    fontSize: 14,
    fontWeight: 'bold',
  },

  cancelar: {
    textAlign: 'center',
    color: '#ffaf1b',
    marginTop: 20, // Maior espaçamento superior
    textDecorationLine: 'underline',
    fontSize: 16,
  },

  message: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
  },

  error: {
    color: '#FF0000',
  },

  success: {
    color: '#00FF35',
  },
});
