//! Datos necesarios
const pesoDelAluminioModenaAlto = 0.64 + 0.58; // alcemar jamba + encuentro x mt lineal
const pesoDelAluminioModenaAncho = 0.64 + 1.26; // alcemar dintel + zocalo x mt lineal
const pesoDelAluminioA30Alto = 1.198 + 1.17; // alcemar jamba + encuentro x mt lineal
const pesoDelAluminioA30Ancho = 0.862 + 1.38; // alcemar dintel + zocalo x mt lineal
const pesoDelPVCJumbo = 3.6 * 2; // peso del perfil de PVC por metro lineal de ambos lados
const pesoDelPVCPrime = 2.8 * 2; // peso del perfil de PVC por metro lineal de ambos lados
const pesoDelVidrioConstante = 2.5; // constante para el peso del vidrio

//! Llamado a los elementos HTML
const anchoVentana = document.querySelector("#anchoVentana");
const altoVentana = document.querySelector("#altoVentana");
const cantidadHojas = document.querySelector("#cantidadHojas");
const espesorVidrio = document.querySelector("#espesorVidrio");
const lineas = document.querySelector("#lineas");
const obra = document.querySelector("#obra");
const botonenviar = document.querySelector("#enviar");
const formulario = document.querySelector("#form-analizador");
const contenedor = document.querySelector("#contenedor-ventanas-calculadas");
const vacio = document.querySelector("#vacio");


//! Clase Ruedas
class Ruedas {
    constructor(modelo, codigo, peso) {
        this.nombre = modelo;
        this.codigo = codigo;
        this.peso = peso;
    }
    seleccionada() {
        let ruedatexto = document.createElement("p");
        ruedatexto.innerText = `Debes colocar ${this.nombre} su código es ${this.codigo} y soporta ${this.peso} kg `;
        return ruedatexto
    }
}
//! Ruedas por línea
let ruedaSimpleModena = new Ruedas("Rueda simple Modena", "ROL119", 60);
let ruedaDobleModena = new Ruedas("Rueda doble Modena", "ROL120", 120);
let ruedaSimpleA30 = new Ruedas("Rueda simple A30", "ROL126", 110);
let ruedaDobleA30 = new Ruedas("Rueda doble A30", "ROL127", 220);
let ruedaCarroPrime = new Ruedas("Rueda doble carro plástica", "L-25004-21-0-1", 70);
let ruedaSimplePrime = new Ruedas("Rueda simple Ducasse para Balconera", "L-23230-70-0-8", 140);
let ruedaDoblePrime = new Ruedas("Rueda doble Ducasse para Balconera", "L-23300-00-0-8", 280);
let ruedaSimpleJumbo = new Ruedas("Rueda simple Jumbo", "L-25006-59-0-6", 140);
let ruedaDobleJumbo = new Ruedas("Rueda doble Jumbo", "L-25008-59-0-6", 280);

// Arrays agrupados por línea
const ruedasModena = [ruedaSimpleModena, ruedaDobleModena];
const ruedasA30 = [ruedaSimpleA30, ruedaDobleA30];
const ruedasPrime = [ruedaCarroPrime, ruedaSimplePrime, ruedaDoblePrime];
const ruedasJumbo = [ruedaSimpleJumbo, ruedaDobleJumbo];

//! Función de asignación genérica
function asignarRueda(ventanas, linea, ruedas, pesoAluminioAlto, pesoAluminioAncho) {
    let ventanasLinea = ventanas.filter((ventana) => ventana.linea === linea);
    ventanasLinea.forEach(objeto => {
        let anchoHoja = objeto.anchoVentana / objeto.cantidadHojas;
        let pesoDelVidrioEnHoja = anchoHoja * objeto.altoVentana * pesoDelVidrioConstante * objeto.espesorVidrio;
        let pesoHoja = (anchoHoja * pesoAluminioAncho) + (objeto.altoVentana * pesoAluminioAlto) + pesoDelVidrioEnHoja;
        let div = document.createElement("div");
        div.classList.add("ventana-agregada");
        div.innerHTML = `
                <h3>${objeto.obra}</h3>
                <div class="caracteristicas-ventana-agregada  ${linea} "> 
                <p>${objeto.linea}</p>
                <p>${objeto.anchoVentana} mts X ${objeto.altoVentana} mts</p>
                <p>${objeto.cantidadHojas} hojas</p>
                <p>${objeto.espesorVidrio} mm de espesor de vidrio</p>
                </div>
                <p> Cada hoja tiene un peso de ${pesoHoja.toFixed(2)} kg.</p>
            `;
        // Buscar la rueda adecuada
        const ruedaAdecuada = ruedas.find(rueda => pesoHoja < rueda.peso);

        if (ruedaAdecuada) {
            let parrafo = ruedaAdecuada.seleccionada();
            div.append(parrafo);
        } else {
            let parrafo = document.createElement("p");
            parrafo.innerText = "La ventana es muy grande para esta línea";
            div.append(parrafo);
        }
        contenedor.prepend(div);
    });

}

// funcionamiento
let ventanas = JSON.parse(localStorage.getItem("ventanas-calculadas")) || [];
function datos() {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const fechaActual = new Date().toLocaleDateString("es-AR");
        ventanas.push({
            anchoVentana: parseFloat(anchoVentana.value),
            altoVentana: parseFloat(altoVentana.value),
            cantidadHojas: parseFloat(cantidadHojas.value),
            espesorVidrio: parseFloat(espesorVidrio.value),
            linea: lineas.value,
            obra: obra.value,
            fecha: fechaActual
        });
        formulario.reset();
        localStorage.setItem("ventanas-calculadas", JSON.stringify(ventanas));
        mostrarVentanasHoy(); // Mostrar solo ventanas de hoy
    });
}

function mostrarVentanasHoy() {
    const fechaHoy = new Date().toLocaleDateString("es-AR"); ;
    const ventanasHoy = ventanas.filter((ventana) => ventana.fecha === fechaHoy);

    contenedor.innerHTML = ""; // Limpiar el contenedor
    if (ventanasHoy.length > 0) {
        vacio.classList.add("none");
        calcular(ventanasHoy);
    } else {
        vacio.classList.remove("none");
    }
}

// Cargar ventanas de hoy al inicio
function cargarVentanasHoy() {
    ventanas = JSON.parse(localStorage.getItem("ventanas-calculadas")) || [];
    mostrarVentanasHoy();
}

cargarVentanasHoy();
datos();



function calcular(ventanas) {
    vacio.classList.add("none");
    //modena
    asignarRueda(ventanas, "Modena", ruedasModena, pesoDelAluminioModenaAlto, pesoDelAluminioModenaAncho);

    // A30
    asignarRueda(ventanas, "A30", ruedasA30, pesoDelAluminioA30Alto, pesoDelAluminioA30Ancho);

    // Prime
    asignarRueda(ventanas, "Prime", ruedasPrime, pesoDelPVCPrime, pesoDelPVCPrime);

    // Jumbo
    asignarRueda(ventanas, "Jumbo", ruedasJumbo, pesoDelPVCJumbo, pesoDelPVCJumbo);
}

