import { useState } from "react";
import "./App.css";
import logoLong from "./assets/logo_long.png";
import logo from "./assets/logo.png";

function App() {
  // État pour stocker la valeur de l'input
  const [inputValue, setInputValue] = useState("");

  // État pour stocker le type de paramètre sélectionné
  const [paramType, setParamType] = useState("Tracking");

  // État pour stocker les données récupérées
  const [data, setData] = useState(null);

  // État pour gérer les erreurs
  const [error, setError] = useState(null);

  // État pour gérer le chargement
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les données
  const fetchData = (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Construire l'URL en fonction du type de paramètre sélectionné
    const url = `https://sheetdb.co/api/v1/qms48o92dvn20/search?${paramType}=${encodeURIComponent(
      inputValue
    )}`;

    console.log(paramType);

    setLoading(true); // Démarre le chargement
    setError(null);
    setData(null);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((res) => {
        setData(res); // Met à jour l'état avec les données récupérées
        setLoading(false); // Arrête le chargement
      })
      .catch((error) => {
        setError(error.message); // Met à jour l'état des erreurs
        setError("Une erreur est survenue"); // Met à jour l'état des erreurs
        setData(null); // Réinitialise les données en cas d'erreur
        setLoading(false); // Arrête le chargement
      });
  };
  // Fonction pour mettre à jour l'état lorsque l'input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Fonction pour mettre à jour le type de paramètre sélectionné
  const handleParamTypeChange = (event) => {
    setParamType(event.target.value);
  };

  // Fonction pour formater la date
  const formatDate = (dateStr) => {
    // Définir les options pour le formatage
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };

    // Convertir la chaîne en un objet Date
    const [day, month, year] = dateStr
      .split("/")
      .map((num) => parseInt(num, 10));
    const date = new Date(year, month - 1, day); // mois-1 car en JavaScript, janvier est 0

    // Formater la date en utilisant les options spécifiées
    return date.toLocaleDateString("fr-FR", options);
  };

  // Fonction pour obtenir le label de l'envoi
  const getEnvoiLabel = (envoi) => {
    const labels = {
      Maritime: "Maritime",
      "Maritime -0,15m³": "Maritime -0,15m³",
      "Maritime ML": "Maritime Marchandise Lourde",
      "Air Normal": "Air Normal",
      "Air Normal BAT": "Air Normal avec batterie",
      "Air Normal P/L": "Air Normal Poudre/Liquide",
      "Air Express": "Air Express",
      "Air Express BAT": "Air Express avec batterie",
      "Air Express P/L": "Air Express Poudre/Liquide",
    };
    return labels[envoi] || envoi; // Affiche la valeur par défaut si aucune condition n'est remplie
  };

  // Fonction pour formater les prix avec séparateurs de milliers
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "";
    }
    return parseFloat(price).toLocaleString("fr-FR");
  };

  return (
    <div className="main">
      <div className="container">
        <div className="head">
          <img src={logoLong} width={"350px"} alt="logo" />
          <p className="head_1">Service de tracking </p>
        </div>

        <div className="formulaire">
          <form onSubmit={fetchData}>
            <br />
            <select
              id="paramType"
              value={paramType}
              onChange={handleParamTypeChange}
            >
              <option value="Tracking">Tracking Number</option>
              <option value="Pseudo">Pseudo</option>
              {/* Ajoutez d'autres options ici si nécessaire */}
            </select>
            <input
              type="text"
              placeholder="Entrez la valeur..."
              id="inputValue"
              value={inputValue}
              onChange={handleInputChange}
            />
            {loading ? (
              <button type="button" disabled>
                Chargement...
              </button>
            ) : (
              <button type="submit">Rechercher</button>
            )}
          </form>
        </div>

        {error && <div className="error"> {error}</div>}
        {loading && (
          <>
            <div className="loading">
              <img src={logo} alt="Chargement..." width={"200px"} />
            </div>
          </>
        )}

        {/* Affichage des résultats si data est disponible */}
        {data && data.length > 0 && (
          <>
            <div className="info">
              <table
                style={{
                  color: "white",
                  paddingTop: "30px",
                }}
              >
                {data.map((item) => (
                  <>
                    <tr>
                      <td style={{ color: "#ff4732" }}>Pseudo</td>
                      <td>: {item.Pseudo}</td>
                    </tr>

                    <tr>
                      <td style={{ color: "#ff4732" }}>Tracking Number</td>
                      <td>: {item.Tracking}</td>
                    </tr>

                    <tr>
                      <td style={{ color: "#ff4732" }}>Date de départ</td>
                      <td>
                        :{" "}
                        {item.Départ == "EN ATTENTE"
                          ? "EN ATTENTE"
                          : formatDate(item.Départ)}
                      </td>
                    </tr>

                    <tr>
                      <td style={{ color: "#ff4732" }}>Type d&apos;envoi</td>
                      <td>: {getEnvoiLabel(item.Envoi)}</td>
                    </tr>

                    <tr>
                      <td style={{ color: "#ff4732" }}>Date de réception</td>
                      <td>: {formatDate(item.Réception)}</td>
                    </tr>

                    <tr>
                      <td style={{ color: "#ff4732" }}>Tarif</td>
                      <td>
                        : {formatPrice(item.Tarif)}{" "}
                        <span>
                          {!item.Envoi.includes("Maritime")
                            ? "Ariary / kg"
                            : "$ / m³"}
                        </span>
                      </td>
                    </tr>

                    {item.Envoi.includes("Maritime") ? (
                      <tr>
                        <td style={{ color: "#ff4732" }}>Volume</td>
                        <td>
                          : {item.Volume} m<sup>3</sup>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td style={{ color: "#ff4732" }}>Poids</td>
                        <td>: {item.Poids} kg</td>
                      </tr>
                    )}

                    {item.Poids_volumétrique ? (
                      <tr>
                        <td style={{ color: "#ff4732" }}>Poids volumétrique</td>
                        <td>: {item.Poids_volumétrique} kg </td>
                      </tr>
                    ) : (
                      ""
                    )}

                    {!item.Commentaires ? (
                      ""
                    ) : (
                      <tr>
                        <td style={{ color: "#ff4732" }}>Commentaires</td>
                        <td>
                          <div className="commentaire">{item.Commentaires}</div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </table>
            </div>

            {data.map((item, index) => (
              <div className="progression" key={index}>
                <ul>
                  <li>
                    {" "}
                    <i className="icon uil uil-yen-circle"></i>
                    <div
                      className={`progress one ${
                        item.Statut == "ACHAT EFFECTUE" ||
                        item.Statut == "ENTREPOT CHINE" ||
                        item.Statut == "EN TRANSIT" ||
                        item.Statut == "EN DOUANE MDG" ||
                        item.Statut == "ARRIVEE A MDG"
                          ? "active"
                          : ""
                      }`}
                    >
                      <p>1</p>
                      <i className="uil uil-check"></i>
                    </div>
                    <p className="text">Achat effectué</p>
                  </li>

                  <li>
                    {/* <i className="icon uil-plane"></i> */}
                    <i className="icon uil uil-clipboard-notes"></i>
                    <div
                      className={`progress two ${
                        item.Statut == "ENTREPOT CHINE" ||
                        item.Statut == "EN TRANSIT" ||
                        item.Statut == "EN DOUANE MDG" ||
                        item.Statut == "ARRIVEE A MDG"
                          ? "active"
                          : ""
                      }`}
                    >
                      <p>2</p>
                      <i className="uil uil-check"></i>
                    </div>
                    <p className="text">Entrepôt Chine</p>
                  </li>

                  <li>
                    {/* <i className="icon uil-plane"></i> */}
                    <i
                      className={`icon ${
                        item.Envoi.includes("Maritime")
                          ? "uil-ship"
                          : "uil-plane"
                      }`}
                    ></i>
                    <div
                      className={`progress two ${
                        (item.Statut == "EN TRANSIT" ||
                          item.Statut == "EN DOUANE MDG" ||
                          item.Statut == "ARRIVEE A MDG") &&
                        "active"
                      }`}
                    >
                      <p>3</p>
                      <i className="uil uil-check"></i>
                    </div>
                    <p className="text">En transit</p>
                  </li>

                  {/* EN DOUANE MDG au port MDG */}
                  {item.Envoi.includes("Maritime") ? (
                    <li>
                      <i
                        className={`icon ${
                          item.Envoi.includes("Maritime")
                            ? "uil-store-alt"
                            : "uil-plane"
                        }`}
                      ></i>
                      <div
                        className={`progress three ${
                          (item.Statut == "EN DOUANE MDG" ||
                            item.Statut == "ARRIVEE A MDG") &&
                          "active"
                        }`}
                      >
                        <p>{item.Envoi.includes("Maritime") ? "4" : "3"}</p>
                        <i className="uil uil-check"></i>
                      </div>
                      <p className="text">En Douane MDG</p>
                    </li>
                  ) : (
                    ""
                  )}

                  <li>
                    <i
                      className="icon uil uil-map-marker"
                      style={{
                        color: `${
                          item.Statut == "ARRIVEE A MDG" ? "#4caf50" : ""
                        }`,
                      }}
                    ></i>
                    <div
                      className={`progress ${
                        item.Envoi.includes("Maritime") && "four"
                      } three ${item.Statut == "ARRIVEE A MDG" && "active"}`}
                    >
                      <p>{item.Envoi.includes("Maritime") ? "5" : "4"}</p>
                      <i className="uil uil-check"></i>
                    </div>
                    <p
                      className="text"
                      style={{
                        color: `${
                          item.Statut == "ARRIVEE A MDG" ? "#4caf50" : ""
                        }`,
                      }}
                    >
                      Colis arrivé
                    </p>
                    {/* <p className="text">Colis arrivé</p> */}
                  </li>
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
