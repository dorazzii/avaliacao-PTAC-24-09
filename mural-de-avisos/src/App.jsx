import { useEffect, useState } from 'react'
import FormularioAviso from './FormularioAviso'
import ListaAvisos from './ListaAvisos'

const API = 'https://jsonplaceholder.typicode.com/posts'

function App() {

  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)


  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [editando, setEditando] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroForm, setErroForm] = useState(null)


  useEffect(() => {
    const controle = new AbortController()
    const signal = controle.signal

    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch(`${API}?_limit=15`, { signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        setAvisos(data)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro('Não foi possível conectar à API. Verifique sua conexão e recarregue a página.')
        }
      } finally {
        setCarregando(false)
      }
    }
    buscar()

    return () => controle.abort()
  }, [])

  function cancelar() {
    setEditando(null)
    setTitulo('')
    setTexto('')
    setErroForm(null)
  }

  function iniciarEdicao(aviso) {
    setEditando(aviso)
    setTitulo(aviso.title)
    setTexto(aviso.body)
    setErroForm(null)
  }


  async function enviar(e) {
    e.preventDefault()


    if (!titulo.trim() || !texto.trim()) {
      setErroForm('Preencha o título e o texto antes de publicar.')
      return
    }

    setEnviando(true)
    setErroForm(null)

    try {
      if (editando) {
        const resp = await fetch(`${API}/${editando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editando.userId,
            id: editando.id,
            title: titulo,
            body: texto,
          }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        setAvisos(prev => prev.map(a => (a.id === editando.id ? data : a)))
      } else {
        const resp = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, title: titulo, body: texto }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()

        const maiorId = avisos.reduce((acc, a) => Math.max(acc, a.id), 0)
        const novo = { userId: data.userId, id: maiorId + 1, title: data.title, body: data.body }
        setAvisos(prev => [novo, ...prev])
      }
      cancelar()
    } catch (e) {

      setErroForm(`Não foi possível salvar o aviso (${e.message}). Tente novamente.`)
    } finally {
      setEnviando(false)
    }
  }


  async function excluir(id) {
    const anterior = avisos
    setErro(null)
    setAvisos(anterior.filter(a => a.id !== id))
    if (editando && editando.id === id) cancelar()
    try {
      const resp = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    } catch (e) {
      setAvisos(anterior)
      setErro(`Não foi possível excluir o aviso (${e.message}). Ele voltou para a lista.`)
    }
  }

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>Mural de Avisos</h1>
        <p>PTAC4 — avisos e recados da turma</p>
      </header>

      <div className="layout">
        <FormularioAviso
          titulo={titulo}
          texto={texto}
          onTitulo={setTitulo}
          onTexto={setTexto}
          editando={editando}
          enviando={enviando}
          erro={erroForm}
          onSubmit={enviar}
          onCancelar={cancelar}
        />
        <ListaAvisos
          avisos={avisos}
          carregando={carregando}
          erro={erro}
          onEditar={iniciarEdicao}
          onExcluir={excluir}
        />
      </div>

      <footer className="rodape">
        Vite + React + fetch GET/POST/PUT/DELETE · jsonplaceholder.typicode.com/posts
      </footer>
    </div>
  )
}

export default App
