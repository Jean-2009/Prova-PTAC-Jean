import CartaoAviso from './CartaoAviso'

function ListaAvisos({ avisos, carregando, erro, onEditar, onExcluir }) {
  const vazio = !carregando && !erro && avisos.length === 0

  return (
    <section className="lista">
      {avisos.map((aviso) => (
        <CartaoAviso
          key={aviso.chave}
          aviso={aviso}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}

      {carregando && <p className="estado">Carregando avisos...</p>}

      {erro && <p className="estado erro">{erro}</p>}

      {vazio && (
        <p className="estado">
          <span aria-hidden="true">🪴</span> Nenhum aviso publicado — seja a
          primeira pessoa a escrever no mural.
        </p>
      )}
    </section>
  )
}

export default ListaAvisos