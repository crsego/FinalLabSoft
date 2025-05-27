import React, { useState, useEffect } from 'react';
import styles from './TestVocacional.module.css'; // Assuming this CSS module exists and is correctly configured

function TestVocacional() {
  // State variables for the test functionality
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [carrerasRecomendadas, setCarrerasRecomendadas] = useState([]);
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    carrera_seleccionada: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/preguntas/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPreguntas(data);
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        alert('Hubo un error al cargar las preguntas. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    obtenerPreguntas();
  }, []);

  const handleRespuestaSeleccionada = (preguntaId, respuestaKey) => {
    setRespuestasUsuario({
      ...respuestasUsuario,
      [preguntaId]: respuestaKey,
    });
  };

  const siguientePregunta = () => {
    if (preguntaActualIndex < preguntas.length - 1) {
      setPreguntaActualIndex(preguntaActualIndex + 1);
    }
  };

  const preguntaActual = preguntas[preguntaActualIndex];

  const analizarRespuestas = (preguntas, respuestasUsuario) => {
    const conteoCarreras = {};

    preguntas.forEach((pregunta) => {
      const respuestaSeleccionada = respuestasUsuario[pregunta.id];
      if (respuestaSeleccionada && pregunta.respuestas[respuestaSeleccionada]) {
        const respuestaTexto = pregunta.respuestas[respuestaSeleccionada];
        let carreraGeneral = '';

        if (pregunta.pregunta.includes('Te gusta el trabajo de oficina')) {
          if (respuestaTexto.includes('con la interaccion')) {
            carreraGeneral = 'Administración/Gestión';
          } else if (respuestaTexto.includes('sin interactura')) {
            carreraGeneral = 'Análisis/Investigación';
          }
        } else if (pregunta.pregunta.includes('¿Qué prefieres en tu día a día?')) {
          if (respuestaTexto.includes('Resolver problemas técnicos')) {
            carreraGeneral = 'Ingeniería/Técnico';
          } else if (respuestaTexto.includes('Acompañar a personas')) {
            carreraGeneral = 'Ciencias Sociales/Humanidades';
          }
        } else if (pregunta.pregunta.includes('¿Cómo te sientes al hablar frente a grupos?')) {
          if (respuestaTexto.includes('Cómodo/a y con buena expresión')) {
            carreraGeneral = 'Comunicación/Marketing';
          } else if (respuestaTexto.includes('Prefiero escuchar')) {
            carreraGeneral = 'Análisis/Investigación';
          }
        } else if (pregunta.pregunta.includes('¿Cuál sería tu entorno laboral ideal?')) {
          if (respuestaTexto.includes('Ambiente creativo')) {
            carreraGeneral = 'Diseño/Artes';
          } else if (respuestaTexto.includes('Ambiente estructurado')) {
            carreraGeneral = 'Ingeniería/Técnico';
          }
        } else if (pregunta.pregunta.includes('¿Qué te resulta más atractivo?')) {
          if (respuestaTexto.includes('Diseñar, crear o imaginar')) {
            carreraGeneral = 'Diseño/Artes';
          } else if (respuestaTexto.includes('Ejecutar procesos')) {
            carreraGeneral = 'Administración/Gestión de Operaciones';
          }
        } else if (pregunta.pregunta.includes('¿Te gusta resolver problemas complejos?')) {
          if (respuestaTexto.includes('Sí, disfruto de los retos lógicos')) {
            carreraGeneral = 'Ingeniería/Técnico';
          } else if (respuestaTexto.includes('Prefiero tareas prácticas')) {
            carreraGeneral = 'Oficios/Técnico';
          }
        }

        if (carreraGeneral) {
          conteoCarreras[carreraGeneral] = (conteoCarreras[carreraGeneral] || 0) + 1;
        }
      }
    });

    const carrerasOrdenadas = Object.entries(conteoCarreras).sort(([, a], [, b]) => b - a);
    const topDosCarreras = carrerasOrdenadas.slice(0, 2).map((item) => item[0]);
    return topDosCarreras;
  };

  const finalizarTest = () => {
    const resultados = analizarRespuestas(preguntas, respuestasUsuario);
    setCarrerasRecomendadas(resultados);
    setMostrarResultados(true);
  };

  const repetirTest = () => {
    setRespuestasUsuario({});
    setCarrerasRecomendadas([]);
    setPreguntaActualIndex(0);
    setMostrarResultados(false);
    setCarreraSeleccionada('');
    setMostrarFormularioRegistro(false);
    setFormData({ nombre: '', email: '', arrera_seleccionada: '' });
  };

  const handleSeleccionarCarrera = (event) => {
    setCarreraSeleccionada(event.target.value);
  };

  const mostrarFormulario = () => {
    if (carreraSeleccionada) {
      setFormData({ ...formData, carrera_seleccionada: carreraSeleccionada });
      setMostrarFormularioRegistro(true);
    } else {
      alert('Por favor, selecciona una carrera antes de registrarte.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/inscritos/registrar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {

        const responseData = await response.json();
        console.log('Registro exitoso:', responseData);
        alert('¡Te has registrado con éxito!');
        repetirTest();
      } else {

        const errorData = await response.json();
        console.error('Error en el registro:', errorData);

        const errorMessage = errorData.email ? `Email: ${errorData.email}` : JSON.stringify(errorData);
        alert(`Error al registrar: ${errorMessage}`);
      }
    } catch (error) {

      console.error('Error de red al intentar registrar:', error);
      alert('Hubo un problema de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (preguntas.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  if (mostrarFormularioRegistro) {
    return (
      <div className={styles.formularioContenedor}>
        <h2>Formulario de Registro</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className={styles.labelFormulario}>
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className={styles.inputFormulario}
            />
          </div>
          <div>
            <label htmlFor="email" className={styles.labelFormulario}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.inputFormulario}
            />
          </div>
          <div>
            <label htmlFor="carrera" className={styles.labelFormulario}>
              Carrera Seleccionada:
            </label>
            <input
              type="text"
              id="carrera"
              name="carrera"
              value={formData.carrera_seleccionada}
              readOnly // Make this field read-only as it's pre-filled
              className={styles.inputFormulario}
            />
          </div>
          <div className={styles.botonesFormulario}>
            <button type="submit" className={styles.boton} disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <button type="button" className={styles.boton} onClick={repetirTest} disabled={isLoading}>
              Repetir Test
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render test results if `mostrarResultados` is true
  if (mostrarResultados) {
    return (
      <div className={styles.resultadosContenedor}>
        <h2>Resultados del Test Vocacional</h2>
        {carrerasRecomendadas.length > 0 ? (
          <div>
            <h3>Selecciona una Carrera:</h3>
            <div className={styles.contenedorCarreras}>
              {carrerasRecomendadas.map((carrera, index) => (
                <div key={index} className={styles.opcionCarrera}>
                  <label>
                    <input
                      type="radio"
                      name="carreraSeleccionada"
                      value={carrera}
                      checked={carreraSeleccionada === carrera}
                      onChange={handleSeleccionarCarrera}
                      required
                    />
                    {carrera}
                  </label>
                </div>
              ))}
            </div>

            <h3>Tus Respuestas:</h3>
            <ul className={styles.listaRespuestas}>
              {preguntas.map((pregunta) => (
                <li key={pregunta.id} className={styles.itemRespuesta}>
                  <strong>{pregunta.pregunta}:</strong>{' '}
                  {pregunta.respuestas[respuestasUsuario[pregunta.id]] ||
                    'No respondida'}
                </li>
              ))}
            </ul>
            <div className={styles.botonesResultados}>
              <button
                className={styles.boton}
                onClick={mostrarFormulario}
                disabled={!carreraSeleccionada || isLoading}
              >
                Continuar con el Registro
              </button>
            </div>
          </div>
        ) : (
          <p>
            No se encontraron suficientes respuestas para generar
            recomendaciones.
          </p>
        )}
        <button className={styles.boton} onClick={repetirTest} disabled={isLoading}>
          Repetir Test
        </button>
      </div>
    );
  }

  // Render the test questions
  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Test Vocacional</h2>
      {preguntaActual && (
        <div>
          <h3 className={styles.pregunta}>{preguntaActual.pregunta}</h3>
          <div className={styles.contenedorRespuestas}>
            {Object.entries(preguntaActual.respuestas).map(([key, value]) => (
              <label key={key} className={styles.labelRespuesta}>
                <input
                  type="radio"
                  name={preguntaActual.id}
                  value={key}
                  checked={respuestasUsuario[preguntaActual.id] === key}
                  onChange={() => handleRespuestaSeleccionada(preguntaActual.id, key)}
                />
                {value}
              </label>
            ))}
          </div>
          <div className={styles.botonesPregunta}>
            {preguntaActualIndex < preguntas.length - 1 ? (
              <button
                className={styles.boton}
                onClick={siguientePregunta}
                disabled={!respuestasUsuario[preguntaActual.id] || isLoading}
              >
                Siguiente
              </button>
            ) : (
              <button
                className={styles.boton}
                onClick={finalizarTest}
                disabled={!respuestasUsuario[preguntaActual.id] || isLoading}
              >
                Ver Resultados
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#c9e3ff' }}>Descubre que puedes estudiar</h1>
      <TestVocacional />
    </div>
  );
}

export default App;