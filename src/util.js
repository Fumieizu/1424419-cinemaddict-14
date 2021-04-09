export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//Число с плаваюзей точкой из диапазона
export const getRandomFloatNumber = (min, max, floatPoint) => {
  if (min > max) {
    throw new Error('Неверно указан числовой диапазон');
  }
  const randomFloat = Math.random() * (max - min) + min;
  return randomFloat.toFixed(floatPoint);
};

export const getRandomIndexElement = (element) => {
  const randomIndex = getRandomInteger(0, element.length - 1);
  return element[randomIndex];
};
//Массив случайной длины
export const getRandomArrayLength = (array) => {
  const newArray = [];

  for (let i = 0; i < getRandomInteger(1, array.length); i++) {
    newArray.push(array[i]);
  }
  return newArray;
};