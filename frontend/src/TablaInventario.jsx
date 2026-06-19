import React from 'react';
export default function TablaInventario({ maniquies, handleEliminar, prepararEdicion }) {
  
  const obtenerClaseEstado = (estado) => {
    if (estado === 'Disponible') return 'badge-disponible';
    if (estado === 'En Proceso') return 'badge-proceso';
    if (estado === 'Vendido') return 'badge-vendido';
    return 'badge-exhibicion';
  };

  return (
    <div className="table-box">
      <h3>Inventario de Maniquíes</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Materiales</th>
            <th>Colores</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maniquies.map((m) => (
            <tr key={m.id_maniqui} className="row-centered">
              <td className="text-bold">#{m.id_maniqui}</td>
              <td>{m.nombre_modelo}</td>
              <td className="text-detail">{m.materiales}</td>
              <td className="text-detail">{m.colores}</td>
              <td>
                <span className={`badge-status ${obtenerClaseEstado(m.estado)}`}>
                  {m.estado}
                </span>
              </td>
              <td>
                <button 
                  onClick={() => prepararEdicion(m)} 
                  className="btn-editar"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleEliminar(m.id_maniqui)} 
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          
          {maniquies.length === 0 && (
           <tr>
              <td colSpan="6" className="text-center text-detail td-vacia">
                No hay maniquíes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}