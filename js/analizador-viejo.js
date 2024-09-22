alert("Vamos a analizar que rueda necesita tu ventana corrediza");

//! Datos necesarios
const pesoDelAluminioModenaAlto = 0.64 + 0.58; // alcemar jamba + encuentro x mt lineal
const pesoDelAluminioModenaAncho = 0.64 + 1.26; // alcemar dintel + zocalo x mt lineal
const pesoDelAluminioA30Alto = 1.198 + 1.17; // alcemar jamba + encuentro x mt lineal
const pesoDelAluminioA30Ancho = 0.862 + 1.38; // alcemar dintel + zocalo x mt lineal
const pesoDelPVCJumbo = 3.6*2; // peso del perfil de PVC por metro lineal de ambos lados
const pesoDelPVCPrime = 2.8*2; // peso del perfil de PVC por metro lineal de ambos lados
const pesoDelVidrioConstante = 2.5; // constante para el peso del vidrio

//! Función de chequeo
function Chequeo(ingreso, maximo, error) {
    let nombre;
    for (nombre = parseFloat(prompt(ingreso)); isNaN(nombre) || nombre > maximo; nombre = parseFloat(prompt(ingreso))) {
        if (nombre > maximo) {
            alert(error);
        } else {
            alert("No se ingresó un número. Intente nuevamente.");
        }
    }
    return nombre;
}

//! Función de recolección de datos y array de ventanas
function datos() {
    let ventanas = [];
    let continuar = true;
    while (continuar === true) {
        let anchoVentana = Chequeo("Ingrese el ancho de la ventana total en metros", 100, "El número es mayor a 100. Intente nuevamente.");
        let altoVentana = Chequeo("Ingrese el alto de la ventana total en metros", 100, "El número es mayor a 100. Intente nuevamente.");
        let espesorVidrio = Chequeo("Ingrese el espesor del vidrio en milímetros", 50, "El número es mayor a 50. Intente nuevamente.");

        let cantidadHojas = parseInt(prompt("Ingrese cuántas hojas tiene la ventana (mínimo 2 y máximo 6)"));
        while (isNaN(cantidadHojas) || cantidadHojas < 2 || cantidadHojas > 6) {
            alert("Selección inválida. Intente nuevamente.");
            cantidadHojas = parseInt(prompt("Ingrese cuántas hojas tiene la ventana (mínimo 2 y máximo 6)"));
        }

        let linea = parseInt(prompt(`Seleccione la línea de la ventana:
        1. Modena
        2. A30
        3. Jumbo
        4. Prime`));
        while (isNaN(linea) || linea < 1 || linea > 4) {
            alert("Selección inválida. Intente nuevamente.");
            linea = parseInt(prompt(`Seleccione la línea de la ventana:
            1. Modena
            2. A30
            3. Jumbo
            4. Prime`));
        }

        ventanas.push({ anchoVentana: anchoVentana, altoVentana: altoVentana, cantidadHojas: cantidadHojas, espesorVidrio: espesorVidrio, linea: linea });

        let respuesta = prompt("¿Querés calcular otra ventana? Si/No").toLowerCase();
        if (respuesta === "si") {
            continuar = true;
        } else if (respuesta === "no") {
            alert("Abri la consola para ver los resultados.");
            continuar = false;
        }
    }
    return ventanas;
}

//! Clase Ruedas
class Ruedas {
    constructor(modelo, codigo, peso) {
        this.nombre = modelo;
        this.codigo = codigo;
        this.peso = peso;
    }
    seleccionada() {
        console.log("Debes colocar " + this.nombre + ", su código es " + this.codigo + " y soporta " + this.peso + "kg");
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
    console.log(`%c----------- Ventanas de la línea ${linea} -----------`, "color: orange");

    ventanasLinea.forEach(objeto => {
        let anchoHoja = objeto.anchoVentana / objeto.cantidadHojas;
        let pesoDelVidrioEnHoja = anchoHoja * objeto.altoVentana * pesoDelVidrioConstante * objeto.espesorVidrio;
        let pesoHoja = (anchoHoja * pesoAluminioAncho) + (objeto.altoVentana * pesoAluminioAlto) + pesoDelVidrioEnHoja;

        console.log(`La ventana con un ancho de ${objeto.anchoVentana} mts, un alto de ${objeto.altoVentana} mts separada en ${objeto.cantidadHojas} hojas con un espesor de vidrio de ${objeto.espesorVidrio} mm tiene un peso de ${pesoHoja.toFixed(2)} kg.`);

        // Buscar la rueda adecuada
        const ruedaAdecuada = ruedas.find(rueda => pesoHoja < rueda.peso);
        
        if (ruedaAdecuada) {
            ruedaAdecuada.seleccionada();
        } else {
            console.log("La ventana es muy grande para esta línea. El peso de la hoja es :" + Math.round(pesoHoja) + "kg");
        }
    });
}

//! Ejecutar para cada línea de ventanas
function calcular() {
    let ventanas = datos();
    const hoy = new Date();
    console.log(`%cHoy ${hoy.toLocaleDateString("es-Ar")} calculaste las ruedas de las siguientes ventanas:`, "color: purple");

    // Modena
    asignarRueda(ventanas, 1, ruedasModena, pesoDelAluminioModenaAlto, pesoDelAluminioModenaAncho);

    // A30
    asignarRueda(ventanas, 2, ruedasA30, pesoDelAluminioA30Alto, pesoDelAluminioA30Ancho);

    // Prime
    asignarRueda(ventanas, 4, ruedasPrime, pesoDelPVCPrime, pesoDelPVCPrime);  // En este caso usas el mismo peso para alto y ancho

    // Jumbo
    asignarRueda(ventanas, 3, ruedasJumbo, pesoDelPVCJumbo, pesoDelPVCJumbo);  // Igual que en Prime, mismo peso
}

calcular();





/* function datos() {
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
        contenedor.innerHTML = "";
        /* calcular(ventanasHoy); 
    })
}
/*  let ventanasHoy= datosAlmacenados();  

function datosAlmacenados() {
    const fechaHoy = new Date().toLocaleDateString("es-AR");
    let ventanasHoy = ventanas.filter((ventana) => ventana.fecha === fechaHoy);
    console.log(ventanasHoy);
        while (ventanasHoy.length !== 0 || ventanas.length !== 0) {
            vacio.classList.add("none");
            calcular(ventanasHoy);
            datos();
            ventanasHoy= ventanas.filter((ventana) => ventana.fecha === fechaHoy);
        }
        if(ventanas.length === 0){
            vacio.classList.remove("none");
        }
    return ventanasHoy
}
/* function datosAlmacenados() {
    const fechaHoy = new Date().toLocaleDateString("es-AR");
    let ventanasHoy = ventanas.filter((ventana) => ventana.fecha === fechaHoy);
    if (ventanasHoy.length !== 0 || ventanas.length !== 0) {
        vacio.classList.remove("none");
        datos();
        calcular(ventanas);
        vacio.classList.add("none");
    } else {
        vacio.classList.add("none");
        calcular(ventanas);
        datos();
    }

} 

let ventanasHoy= datosAlmacenados();  */
/* datosAlmacenados(); */