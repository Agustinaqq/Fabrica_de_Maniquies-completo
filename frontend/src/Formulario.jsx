import React from 'react';

export default function Formulario({ 

  nombreModelo, setNombreModelo, 
  estado, setEstado, 
  material, setMaterial, 
  color, setColor, 
  handleSubmit,
  maniquiAEditar,
  cancelarEdicion
}) {

  return (
    <div className="form-box">
      <h3>{maniquiAEditar ? 'Editar Maniquí' : 'Nuevo Maniquí'}</h3>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Nombre del Modelo:</label>
          <input 
            type="text" 
            className="form-input"
            value={nombreModelo} 
            onChange={(e) => setNombreModelo(e.target.value)}
            placeholder="Ej: Modelo Slim A1"
            required 
          />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <select className="form-input" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Disponible">Disponible</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Vendido">Vendido</option>
            <option value="En Exhibición">En Exhibición</option>
          </select>
        </div>

        <div className="form-group">
          <label>Material Principal:</label>
          <select className="form-input" value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="Plástico ABS">Plástico ABS</option>
            <option value="Fibra de Vidrio">Fibra de Vidrio</option>
            <option value="Madera de Haya">Madera</option>
            <option value="Silicona">Silicona</option>
          </select>
        </div>

        <div className="form-group">
          <label>Color:</label>
          <select className="form-input" value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="Blanco Mate">Blanco Mate</option>
            <option value="Negro Mate">Negro Mate</option>
            <option value="Piel Claro">Piel Claro</option>
            <option value="Gris Metalizado">Gris Metalizado</option>
          </select>
        </div>

        <button type="submit" className="btn-guardar">
          {maniquiAEditar ? 'Actualizar' : 'Guardar'}
        </button>

        {maniquiAEditar && (
          <button 
            type="button" 
            onClick={cancelarEdicion} 
            className="btn-cancelar"
          >
            Cancelar Edición
          </button>
        )}
      </form>
    </div>
  );
}