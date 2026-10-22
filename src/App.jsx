import { useEffect, useState } from 'react'
import './App.css'
import FormularioAviso from './components/FormularioAviso'
import ListaAvisos from './components/ListaAvisos'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'
const HEADERS_JSON = { 'Content-Type': 'application/json' }

function App() {
  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [avisoEmEdicao, setAvisoEmEdicao] = useState(null)
  const [mensagemForm, setMensagemForm] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarAvisos() {
      try {
        const response = await fetch(`${API_URL}?_limit=15`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`)
        }
        await response.json()
        setAvisos([])
      } catch (e) {
        if (e.name === 'AbortError') {
          return
        }
        setErro(
          'Não foi possível conectar à API. Verifique sua internet e recarregue a página.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    carregarAvisos()

    return () => controller.abort()
  }, [])

  function limparFormulario() {
    setTitulo('')
    setTexto('')
    setAvisoEmEdicao(null)
    setMensagemForm('')
  }

  function handleEditar(aviso) {
    setAvisoEmEdicao(aviso)
    setTitulo(aviso.title)
    setTexto(aviso.body)
    setMensagemForm('')
  }

  async function publicarAviso() {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify({ userId: 1, title: titulo, body: texto }),
    })
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`)
    }
    const dados = await response.json()
    const novoAviso = { ...dados, chave: crypto.randomUUID(), local: true }
    setAvisos((atual) => [novoAviso, ...atual])
  }

  async function salvarEdicao() {
    if (!avisoEmEdicao.local) {
      const response = await fetch(`${API_URL}/${avisoEmEdicao.id}`, {
        method: 'PUT',
        headers: HEADERS_JSON,
        body: JSON.stringify({
          userId: avisoEmEdicao.userId,
          id: avisoEmEdicao.id,
          title: titulo,
          body: texto,
        }),
      })
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`)
      }
    }
    setAvisos((atual) =>
      atual.map((aviso) =>
        aviso.chave === avisoEmEdicao.chave
          ? { ...aviso, title: titulo, body: texto }
          : aviso,
      ),
    )
  }

  async function handleSubmit(evento) {
    evento.preventDefault()

    if (!titulo.trim() || !texto.trim()) {
      setMensagemForm('Preencha o título e o texto antes de publicar.')
      return
    }

    setMensagemForm('')
    setErro('')
    setEnviando(true)

    try {
      if (avisoEmEdicao) {
        await salvarEdicao()
      } else {
        await publicarAviso()
      }
      limparFormulario()
    } catch {
      setErro('Não foi possível salvar o aviso. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  async function handleExcluir(aviso) {
    const copiaDaLista = avisos
    setErro('')
    setAvisos(avisos.filter((item) => item.chave !== aviso.chave))

    if (avisoEmEdicao && avisoEmEdicao.chave === aviso.chave) {
      limparFormulario()
    }

    try {
      if (!aviso.local) {
        const response = await fetch(`${API_URL}/${aviso.id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`)
        }
      }
    } catch {
      setAvisos(copiaDaLista)
      setErro('Não foi possível excluir o aviso. Ele voltou para a lista.')
    }
  }

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>
          <span aria-hidden="true">🌿</span> Mural de Avisos da Turma{' '}
          <span aria-hidden="true">🪴</span>
        </h1>
      </header>

      <div className="conteudo">
        <aside className="coluna-formulario">
          <FormularioAviso
            titulo={titulo}
            texto={texto}
            editando={avisoEmEdicao !== null}
            mensagem={mensagemForm}
            enviando={enviando}
            onMudarTitulo={setTitulo}
            onMudarTexto={setTexto}
            onSubmit={handleSubmit}
            onCancelar={limparFormulario}
          />
        </aside>

        <main className="area-lista">
          <ListaAvisos
            avisos={avisos}
            carregando={carregando}
            erro={erro}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
          />
        </main>
      </div>
    </div>
  )
}

export default App