function FormularioAviso({
  titulo,
  texto,
  editando,
  mensagem,
  enviando,
  onMudarTitulo,
  onMudarTexto,
  onSubmit,
  onCancelar,
}) {
  return (
    <form className="formulario" onSubmit={onSubmit}>
      <h2>{editando ? '✏️ Editar aviso' : '🌱 Novo aviso'}</h2>

      <label htmlFor="titulo">Título</label>
      <input
        id="titulo"
        type="text"
        value={titulo}
        onChange={(evento) => onMudarTitulo(evento.target.value)}
        placeholder="Ex.: Prova remarcada"
      />

      <label htmlFor="texto">Texto do aviso</label>
      <textarea
        id="texto"
        rows="6"
        value={texto}
        onChange={(evento) => onMudarTexto(evento.target.value)}
        placeholder="Escreva o aviso completo aqui..."
      />

      {mensagem && <p className="mensagem-form">{mensagem}</p>}

      <div className="botoes-form">
        <button type="submit" disabled={enviando}>
          {editando ? 'Salvar' : 'Publicar aviso'}
        </button>
        {editando && (
          <button type="button" className="secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormularioAviso