import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'http://192.168.144.110:3001';

export default function App() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    buscarLivros();
  }, []);

  async function buscarLivros() {
    try {
      setCarregando(true);
      const resposta = await fetch(`${API_URL}/livros`);
      const dados = await resposta.json();
      setLivros(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalCriar() {
    setLivroEditando(null);
    setTitulo('');
    setAutor('');
    setAno('');
    setModalVisivel(true);
  }

  function abrirModalEditar(livro) {
    setLivroEditando(livro);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setAno(String(livro.ano));
    setModalVisivel(true);
  }

  async function salvar() {
    if (!titulo.trim() || !autor.trim() || !ano.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const corpo = { titulo, autor, ano };

    try {
      if (livroEditando) {
        await fetch(`${API_URL}/livros/${livroEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
        });
      } else {
        await fetch(`${API_URL}/livros`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
        });
      }

      setModalVisivel(false);
      buscarLivros();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  }

  async function deletar(id) {
    Alert.alert('Confirmar', 'Deseja deletar este livro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${API_URL}/livros/${id}`, { method: 'DELETE' });
            buscarLivros();
          } catch (erro) {
            Alert.alert('Erro', 'Não foi possível deletar.');
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    return (
      <View style={estilos.card}>
        <View style={estilos.cardInfo}>
          <Text style={estilos.cardTitulo}>{item.titulo}</Text>
          <Text style={estilos.cardSub}>{item.autor} · {item.ano}</Text>
        </View>
        <View style={estilos.cardAcoes}>
          <TouchableOpacity style={estilos.btnEditar} onPress={() => abrirModalEditar(item)}>
            <Text style={estilos.btnEditarTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.btnDeletar} onPress={() => deletar(item.id)}>
            <Text style={estilos.btnDeletarTexto}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>📚 Meus Livros</Text>

      <TouchableOpacity style={estilos.btnAdicionar} onPress={abrirModalCriar}>
        <Text style={estilos.btnAdicionarTexto}>+ Adicionar Livro</Text>
      </TouchableOpacity>

      {carregando ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={livros}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={estilos.vazio}>Nenhum livro cadastrado.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalFundo}>
          <View style={estilos.modal}>
            <Text style={estilos.modalTitulo}>
              {livroEditando ? 'Editar Livro' : 'Novo Livro'}
            </Text>

            <TextInput
              style={estilos.input}
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={estilos.input}
              placeholder="Autor"
              value={autor}
              onChangeText={setAutor}
            />
            <TextInput
              style={estilos.input}
              placeholder="Ano"
              value={ano}
              onChangeText={setAno}
              keyboardType="numeric"
            />

            <TouchableOpacity style={estilos.btnSalvar} onPress={salvar}>
              <Text style={estilos.btnSalvarTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={estilos.btnCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  btnAdicionar: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnAdicionarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  cardAcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEditar: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnEditarTexto: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
  btnDeletar: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnDeletarTexto: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 24,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  btnSalvar: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnSalvarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnCancelar: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
    fontSize: 14,
  },
});
