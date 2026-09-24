export default function FormularioAviso({
    titulo, texto, onTitulo, onTexto,
    editando, enviando, erro, onSubmit, onCancelar,
}) {
    return (
        <form className="formulario" onSubmit={onSubmit}>
            <h2>{editando ? 'Editar aviso' : 'Novo aviso'}</h2>

            <label htmlFor="titulo">Título</label>
            <input
                id="titulo"
                value={titulo}
                onChange={(e) => onTitulo(e.target.value)}
                placeholder="Ex.: Prova de PTAC4 remarcada"
            />

            <label htmlFor="texto">Texto do aviso</label>
            <textarea
                id="texto"
                rows="6"
                value={texto}
                onChange={(e) => onTexto(e.target.value)}
                placeholder="Escreva o que a turma precisa saber"
            />

            {erro && <p className="erro">{erro}</p>}

            <div className="botoes">
                <button disabled={enviando}>
                    {enviando ? 'Enviando...' : editando ? 'Salvar' : 'Publicar aviso'}
                </button>
                {editando && (
                    <button type="button" className="secundario" onClick={onCancelar} disabled={enviando}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}
