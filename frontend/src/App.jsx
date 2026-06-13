import { useState, useEffect } from 'react';
import './App.css'; 
import Formulario from './Formulario'; 
import TablaInventario from './TablaInventario'; 

function App() {
  const [maniquies, setManiquies] = useState([]);
  const [nombreModelo, setNombreModelo] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [material, setMaterial] = useState('Plástico ABS');
  const [color, setColor] = useState('Blanco Mate');
  
  const [maniquiAEditar, setManiquiAEditar] = useState(null);

  const API_URL = 'http://localhost:3000/maniquies';

  useEffect(() => {
    cargarManiquies();
  }, []);

  const cargarManiquies = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setManiquies(datos); 
    } catch (error) {
      console.error('Error al traer los maniquíes de MySQL:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const urlDestino = maniquiAEditar ? `${API_URL}/${maniquiAEditar.id_maniqui}` : API_URL;
    const metodo = maniquiAEditar ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(urlDestino, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre_modelo: nombreModelo, 
          estado: estado,
          material: material, 
          color: color       
        })
      });

      if (respuesta.ok) {

        setNombreModelo('');
        setEstado('Disponible');
        setMaterial('Plástico ABS');
        setColor('Blanco Mate');
        setManiquiAEditar(null);
        cargarManiquies(); 
      } else {
        const errData = await respuesta.json();
        alert(`Error: ${errData.detalle || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const prepararEdicion = (maniqui) => {
    setManiquiAEditar(maniqui);
    setNombreModelo(maniqui.nombre_modelo);
    setEstado(maniqui.estado);
    
    const primerMaterial = maniqui.materiales ? maniqui.materiales.split(', ')[0] : 'Plástico ABS';
    const primerColor = maniqui.colores ? maniqui.colores.split(', ')[0] : 'Blanco Mate';
    
    setMaterial(primerMaterial);
    setColor(primerColor);
  };

  const cancelarEdicion = () => {
    setManiquiAEditar(null);
    setNombreModelo('');
    setEstado('Disponible');
    setMaterial('Plástico ABS');
    setColor('Blanco Mate');
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este maniquí?')) return;
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (respuesta.ok) {
        cargarManiquies(); 
      } else {
        const resultado = await respuesta.json();
        alert(`No se pudo eliminar: ${resultado.detalle || resultado.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div className="container-maniquies">
      <h1 className="text-center main-title">Fábrica de Maniquíes</h1>
      
      <div className="flex-layout">
        <Formulario 
          nombreModelo={nombreModelo} setNombreModelo={setNombreModelo}
          estado={estado} setEstado={setEstado}
          material={material} setMaterial={setMaterial}
          color={color} setColor={setColor}
          handleSubmit={handleSubmit}
          maniquiAEditar={maniquiAEditar}
          cancelarEdicion={cancelarEdicion}
        />

        <TablaInventario 
          maniquies={maniquies} 
          handleEliminar={handleEliminar} 
          prepararEdicion={prepararEdicion}
        />
      </div>
    </div>
  );
}

export default App;