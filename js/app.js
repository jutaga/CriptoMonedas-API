//TOP LIST API https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD

const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptoMoneda: '',
}

//Crear un promisa
const obtenerCriptoMonedas = criptoMonedas => new Promise(resolve => {
    resolve(criptoMonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptoMonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptoMonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptoMonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptoMonedas(resultado.Data))
        .then(criptoMonedas => selectCriptoMonedas(criptoMonedas));

}

function selectCriptoMonedas(criptoMonedas) {
    criptoMonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = `${FullName} - (${Name})`;
        criptoMonedasSelect.appendChild(option);
    })
}

//Escribir en el objeto
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //validar
    const { moneda, criptoMoneda } = objBusqueda;
    if (moneda === '' || criptoMoneda === '') {
        mostrarAlerta('Debe seleccionar ambos Campos');
        return;
    }

    //Consultar API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje) {

    const existeError = document.querySelector('.error');

    if (!existeError){
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        },3000)
    }
}

function consultarAPI(){
    const { moneda, criptoMoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMoneda}&tsyms=${moneda}`;

    
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado =>  mostrarCotizacionHTML(resultado.DISPLAY[criptoMoneda][moneda]))
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML(resultado);

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más Alto del Dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más Bajo del Dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `Variacion ultimas 24H: <span>${CHANGEPCT24HOUR} %</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Ultima Actualizacion: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner(){
    limpiarHTML(resultado);
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;
    resultado.appendChild(spinner);
    
}

function limpiarHTML(etiqueta){
    while(etiqueta.firstChild){
        etiqueta.removeChild(etiqueta.firstChild);
    }
}