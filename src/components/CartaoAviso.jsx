function CartaoAviso({ aviso, onEditar, onExcluir }) {
  return (
    <article className="cartao">
      <h3>
        <span aria-hidden="true">🌱</span> {aviso.title}
      </h3>
      <p className="cartao-texto">{aviso.body}</p>
      <small className="cartao-meta">
        Aviso #{aviso.id} · Autor: usuário {aviso.userId}
      </small>
      <div className="botoes-cartao">
        <button type="button" onClick={() => onEditar(aviso)}>
          Editar
        </button>
        <button
          type="button"
          className="secundario"
          onClick={() => onExcluir(aviso)}
        >
          Excluir
        </button>
      </div>
    </article>
  )
}

export default CartaoAviso