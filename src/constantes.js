function diasAMilisegundos(dias) {
  const milisegundosPorDia = 24 * 60 * 60 * 1000; // 86,400,000 milisegundos en un día
  return dias * milisegundosPorDia;
};

function horasAMilisegundos(horas) {
  const milisegundosPorHora = 60 * 60 * 1000; // 60 minutos en una hora, 60 segundos en un minuto, 1000 milisegundos en un segundo
  return horas * milisegundosPorHora;
};
function minutosAMilisegundos(minutos) {
  const milisegundosPorMinuto = 60 * 1000; // 60 segundos en un minuto, y 1000 milisegundos en un segundo
  return minutos * milisegundosPorMinuto;
};


const QUINCE_MINUTOS = minutosAMilisegundos(15);
const TREINTA_MINUTOS = minutosAMilisegundos(30);
const CUATRO_HORAS = horasAMilisegundos(4);
const UN_DIA = diasAMilisegundos(1);
const DOS_DIAS = diasAMilisegundos(2);
const SIETE_DIAS = diasAMilisegundos(7);
const QUINCE_DIAS = diasAMilisegundos(15);
const TREINTA_DIAS = diasAMilisegundos(30);

module.exports = {
  QUINCE_MINUTOS,
  TREINTA_MINUTOS,
  CUATRO_HORAS,
  UN_DIA,
  SIETE_DIAS,
  QUINCE_DIAS,
  TREINTA_DIAS,
  DOS_DIAS
}