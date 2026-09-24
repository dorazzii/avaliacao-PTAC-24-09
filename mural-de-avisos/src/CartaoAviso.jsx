export default function CartaoAviso({ aviso, onEditar, onExcluir }) {
  return (
    <article className="cartao">
      <h3>{aviso.title}</h3>
      <p>{aviso.body}</p>
      <p className="meta">Post {aviso.id} — autor {aviso.userId}</p>
      <div className="botoes">
        <button onClick={() => onEditar(aviso)}>Editar</button>
        <button className="secundario" onClick={() => onExcluir(aviso.id)}>Excluir</button>
      </div>
    </article>
  )
}
