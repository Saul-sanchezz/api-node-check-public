const luhnAlgorithm = (ccNumber) => {
  const length = ccNumber.length;
  let count = 0;

  if (length % 2 == 0) {
    /** Traverse the whole credit card number.
     *  Starts at the beginning of the number and begins doubling from the first number.
    */
    for (let i = 0; i < length; i++) {
      let currentDigit = parseInt(ccNumber[i]);
      if (i % 2 == 0) // I only want to double every other number, starts doubling with the second-to-last number. I don't want to double the last number.
      {
        if ((currentDigit *= 2) > 9) {
          // Separate the number into component parts and then add them together.
          let trailingNumber = currentDigit % 10;
          let firstNumber = parseInt(currentDigit / 10);

          // If currentDigit was 18 then currentDigit is now 9.
          currentDigit = firstNumber + trailingNumber;
        }
      }

      count += currentDigit;
    }
  }
  else {
    /** Traverse the whole credit card number.
     *  Starts at the end of the number and begins doubling from the second-to-last number. This fixes the case for odd-numbered length credit card numbers, like AMEX cards.
    */
    for (let i = length - 1; i >= 0; i--) {
      let currentDigit = parseInt(ccNumber[i]);
      if ((i - 1) % 2 == 0) // I only want to double every other number, starts doubling with the second-to-last number. I don't want to double the last number.
      {
        if ((currentDigit *= 2) > 9) {
          // Separate the number into component parts and then add them together.
          let trailingNumber = currentDigit % 10;
          let firstNumber = parseInt(currentDigit / 10);

          // If currentDigit was 18 then currentDigit is now 9.
          currentDigit = firstNumber + trailingNumber;
        }
      }

      count += currentDigit;
    }
  }

  return (count % 10) === 0;
}

const crearArrayCC = (CC) => {
  let cardCC = Number(CC)
  const arrayCC = [CC.toString()]
  for (let i = 0; i < 40; i++) {
    cardCC++
    let cardString = cardCC.toString()
    arrayCC.push(cardString)
  }
  return arrayCC
}

function rangeYear() {
  const max = new Date().getFullYear() + 6
  const min = new Date().getFullYear()
  const years = []

  for (let i = max; i >= min; i--) {
    let year = i.toString()
    // .substring(2, 4)
    years.push(year)
  }
  return years
}

function isValidAmex(cardNumber) {
  // Elimina espacios y caracteres no numéricos
  cardNumber = cardNumber.replace(/\D/g, '');

  // Verifica si el número de tarjeta tiene 15 dígitos y comienza con 34 o 37
  const amexPattern = /^3[47]\d{13}$/;
  if (!amexPattern.test(cardNumber)) {
    return false;
  }
  return true;
  // Verifica el número usando el algoritmo de Luhn
  // return isLuhnValid(cardNumber);
};

function isLuhnValid(cardNumber) {
  if (cardNumber === "") return false;
  let sum = 0;
  let shouldDouble = false;

  // Recorre los dígitos de la tarjeta de derecha a izquierda
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  // Verifica si la suma es divisible por 10
  return (sum % 10 === 0);
};

const crearArrayCCAmex = (CC) => {
  let cardCC = Number(CC)
  const arrayCC = [CC.toString()]
  for (let i = 0; i < 80; i++) {
    cardCC++
    let cardString = cardCC.toString()
    arrayCC.push(cardString)
  }
  return arrayCC
};

const generarArrayObjetosValidCC = (tarjeta, numTargetasPorCrear) => {
  const meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const anios = ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035"];
  // Separar la tarjeta en las partes correspondientes
  let partesCC = tarjeta.split("|");
  // Extraer la parte que contiene las "x"
  let numeroTarjeta = partesCC[0].replace(/X/gi, 'x');
  let mesTarjeta = partesCC[1].replace(/X/gi, 'x');
  let anioTarjeta = partesCC[2].replace(/X/gi, 'x');
  let cvvTarjeta = "xxx";

  const generarNumeroAleatorio = () => {
    return Math.floor(Math.random() * 12);
  };

  const generarNuevoAnio = () => {
    return anios[generarNumeroAleatorio()]
  };

  const generarNuevoMes = () => {
    return meses[generarNumeroAleatorio()]
  };

  const generarNuevoCvv = () => {
    let nuevoCvv = "";
    for (let i = 0; i < cvvTarjeta.length; i++) {
      if (cvvTarjeta[i] === 'x') {
        nuevoCvv += Math.floor(Math.random() * 10); // Reemplaza "x" con un dígito aleatorio
      } else {
        nuevoCvv += cvvTarjeta[i]; // Mantiene el dígito si no es "x"
      }
    }
    return nuevoCvv;
  };
  // Reemplazar las "x" con dígitos aleatorios
  const generarNuevaTargeta = () => {
    let nuevaTarjeta = "";
    for (let i = 0; i < numeroTarjeta.length; i++) {
      if (numeroTarjeta[i] === 'x') {
        nuevaTarjeta += Math.floor(Math.random() * 10); // Reemplaza "x" con un dígito aleatorio
      } else {
        nuevaTarjeta += numeroTarjeta[i]; // Mantiene el dígito si no es "x"
      }
    }
    return nuevaTarjeta;
  };

  const generarTargetaValida = () => {
    let targeta = "";
    do {
      targeta = generarNuevaTargeta();
    } while (!isLuhnValid(targeta));
    return targeta;
  };

  const generarTargetaCompleta = () => {
    let numberCard = generarTargetaValida();
    // let cvvCard = generarNuevoCvv();
    let mesCard = mesTarjeta.includes("x") ?
      generarNuevoMes() : mesTarjeta;
    let anioCard = anioTarjeta.includes("x") ?
      generarNuevoAnio() : anioTarjeta;

    // agregarlo para validacion de luhn numero de targeta y cvv
    // let targeta = "";
    // do {
    //   targeta = `${numberCard}${generarNuevoCvv()}`
    // } while (!isLuhnValid(targeta));
    // let cvvCard = targeta.substring(16);

    let cvvCard = generarNuevoCvv();

    let tarjetaFinal = `${numberCard}|${mesCard}|${anioCard}|${cvvCard}`;
    return tarjetaFinal;
  };

  let cantidad = numTargetasPorCrear || 1
  const arrayTargetasValidas = [];
  for (let i = 0; i < cantidad; i++) {
    const targeta = generarTargetaCompleta();
    let ccActualizada = { number: targeta, msg: "validCard", error: false }
    arrayTargetasValidas.push(ccActualizada);
  }
  return arrayTargetasValidas;
};

const generadorCVVAmex = () => {
  let numero = Math.floor(Math.random() * 10000); // Genera un número entre 0 y 9999
  return numero.toString().padStart(4, '0'); // Asegura que el número tenga 4 dígitos
};

const generadorCVV = () => {
  let numero = Math.floor(Math.random() * 1000); // Genera un número entre 0 y 999
  return numero.toString().padStart(3, '0'); // Asegura que el número tenga 3 dígitos
};

const esValidoLuhnMaxLenght = (numeroTarjeta) => {
  // Convertir el número de tarjeta a una cadena y revertirla
  const digitos = numeroTarjeta.toString().split('').reverse().map(Number);

  let suma = 0;

  for (let i = 0; i < digitos.length; i++) {
    let digito = digitos[i];

    // Doblar cada segundo dígito (índices impares porque está revertido)
    if (i % 2 !== 0) {
      digito *= 2;
      // Si el resultado es mayor que 9, restar 9
      if (digito > 9) {
        digito -= 9;
      }
    }

    // Sumar todos los dígitos
    suma += digito;
  }

  // Si la suma es divisible por 10, el número es válido
  return suma % 10 === 0;
}

module.exports = {
  isLuhnValid,
  luhnAlgorithm,
  crearArrayCC,
  rangeYear,
  isValidAmex,
  crearArrayCCAmex,
  generarArrayObjetosValidCC,
  generadorCVVAmex,
  generadorCVV,
  esValidoLuhnMaxLenght,
}