import CartaoAviso from './CartaoAviso'

export default function ListaAvisos({ avisos, carregando, erro, onEditar, onExcluir }) {
  return (
    <section className="lista">
      <h2>Avisos publicados ({avisos.length})</h2>

      {avisos.map(a => (
        <CartaoAviso key={a.id} aviso={a} onEditar={onEditar} onExcluir={onExcluir} />
      ))}

      {carregando && <p className="status">Carregando avisos...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && avisos.length === 0 && (
        <p className="status">Nenhum aviso publicado — seja a primeira pessoa a escrever no mural.</p>
      )}
    </section>
  )
}
