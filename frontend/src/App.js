import { useState } from "react";
import "./App.css";

export default function App() {
  const [inputs, setInputs] = useState({
    modelo1: {}, // Iris
    modelo2: {}, // Penguins
    modelo3: {}, // Titanic
    modelo4: {}, // German Credit
  });

  const [resultados, setResultados] = useState({});

  // Manejar cambios en inputs
  const handleChange = (modelo, campo, valor) => {
    setInputs((prev) => ({
      ...prev,
      [modelo]: { ...prev[modelo], [campo]: valor },
    }));
  };

  // Enviar datos al backend
  const handlePredict = async (modelo) => {
    let url = "";
    switch (modelo) {
      case "modelo1":
        url = "http://localhost:8000/predict/iris";
        break;
      case "modelo2":
        url = "http://localhost:8000/predict/penguins";
        break;
      case "modelo3":
        url = "http://localhost:8000/predict/titanic";
        break;
      case "modelo4":
        url = "http://localhost:8000/predict/german_credit";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs[modelo]),
      });
      const data = await response.json();
      setResultados((prev) => ({ ...prev, [modelo]: JSON.stringify(data, null, 2) }));
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        [modelo]: "Error al conectar con el backend",
      }));
    }
  };

  // Renderizar formularios específicos para cada modelo
  const renderInputs = (modelo) => {
    switch (modelo) {
      case "modelo1": // IRIS
        return (
          <>
            <input type="number" placeholder="Sepal Length"
              onChange={(e) => handleChange(modelo, "sepal_length", parseFloat(e.target.value))} />
            <input type="number" placeholder="Sepal Width"
              onChange={(e) => handleChange(modelo, "sepal_width", parseFloat(e.target.value))} />
            <input type="number" placeholder="Petal Length"
              onChange={(e) => handleChange(modelo, "petal_length", parseFloat(e.target.value))} />
            <input type="number" placeholder="Petal Width"
              onChange={(e) => handleChange(modelo, "petal_width", parseFloat(e.target.value))} />
          </>
        );

      case "modelo2": // PENGUINS
        return (
          <>
            <input type="number" placeholder="Bill Length (mm)"
              onChange={(e) => handleChange(modelo, "bill_length_mm", parseFloat(e.target.value))} />
            <input type="number" placeholder="Bill Depth (mm)"
              onChange={(e) => handleChange(modelo, "bill_depth_mm", parseFloat(e.target.value))} />
            <input type="number" placeholder="Flipper Length (mm)"
              onChange={(e) => handleChange(modelo, "flipper_length_mm", parseFloat(e.target.value))} />
            <input type="number" placeholder="Body Mass (g)"
              onChange={(e) => handleChange(modelo, "body_mass_g", parseFloat(e.target.value))} />
          </>
        );

      case "modelo3": // TITANIC
        return (
          <>
            <input type="number" placeholder="Pclass"
              onChange={(e) => handleChange(modelo, "pclass", parseInt(e.target.value))} />
            <input type="text" placeholder="Sex (male/female)"
              onChange={(e) => handleChange(modelo, "sex", e.target.value)} />
            <input type="number" placeholder="Age"
              onChange={(e) => handleChange(modelo, "age", parseFloat(e.target.value))} />
            <input type="number" placeholder="Siblings/Spouses (sibsp)"
              onChange={(e) => handleChange(modelo, "sibsp", parseInt(e.target.value))} />
            <input type="number" placeholder="Parents/Children (parch)"
              onChange={(e) => handleChange(modelo, "parch", parseInt(e.target.value))} />
            <input type="number" placeholder="Fare"
              onChange={(e) => handleChange(modelo, "fare", parseFloat(e.target.value))} />
            <input type="text" placeholder="Embarked (C/Q/S)"
              onChange={(e) => handleChange(modelo, "embarked", e.target.value)} />
          </>
        );

      case "modelo4": // GERMAN CREDIT
        return (
          <>
            <input type="number" placeholder="ID (Unnamed_0)"
              onChange={(e) => handleChange(modelo, "Unnamed_0", parseInt(e.target.value))} />
            <input type="number" placeholder="Age"
              onChange={(e) => handleChange(modelo, "Age", parseInt(e.target.value))} />
            <input type="text" placeholder="Sex (male/female)"
              onChange={(e) => handleChange(modelo, "Sex", e.target.value)} />
            <input type="number" placeholder="Job"
              onChange={(e) => handleChange(modelo, "Job", parseInt(e.target.value))} />
            <input type="text" placeholder="Housing"
              onChange={(e) => handleChange(modelo, "Housing", e.target.value)} />
            <input type="text" placeholder="Saving Accounts"
              onChange={(e) => handleChange(modelo, "Saving_accounts", e.target.value)} />
            <input type="text" placeholder="Checking Account"
              onChange={(e) => handleChange(modelo, "Checking_account", e.target.value)} />
            <input type="number" placeholder="Credit Amount"
              onChange={(e) => handleChange(modelo, "Credit_amount", parseInt(e.target.value))} />
            <input type="number" placeholder="Duration"
              onChange={(e) => handleChange(modelo, "Duration", parseInt(e.target.value))} />
            <input type="text" placeholder="Purpose"
              onChange={(e) => handleChange(modelo, "Purpose", e.target.value)} />
          </>
        );

      default:
        return null;
    }
  };

  const renderModelo = (modelo, nombre) => (
    <div key={modelo} className="card">
      <h2>{nombre}</h2>
      <div className="form-section">
        {renderInputs(modelo)}
        <button onClick={() => handlePredict(modelo)}>Predecir</button>
        {resultados[modelo] && (
          <pre className="resultado">{resultados[modelo]}</pre>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid">
      {renderModelo("modelo1", "Modelo Iris")}
      {renderModelo("modelo2", "Modelo Penguins")}
      {renderModelo("modelo3", "Modelo Titanic")}
      {renderModelo("modelo4", "Modelo German Credit")}
    </div>
  );
}
