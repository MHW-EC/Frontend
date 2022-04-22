
const notArrayError = new Error("TARGET IS NOT A ARRAY INSTANCE") 

const difference = (array, anotherArray, equals) => {
  const result = []
  if(!(array instanceof Array) || !(anotherArray instanceof Array)){
    throw notArrayError;
  }
  if(array.length == 0 || anotherArray.length == 0) return array;
  for(let i = 0; i < array.length; i++){
    const arrayValue = array[i];
    let valueFound = false;
    for(let j = 0; j < anotherArray.length; j++){
      const anotherValue = anotherArray[j]
      valueFound = equals(arrayValue, anotherValue)
      if(valueFound) break;
    }
    if(!valueFound) result.push(arrayValue);
  }
  return result;
}
const intersection = (array, anotherArray, equals) => {
  const result = []
  if(!(array instanceof Array) || !(anotherArray instanceof Array)){
    throw notArrayError;
  }
  if(array.length == 0 || anotherArray.length == 0) return result;
  for(let i = 0; i < array.length; i++){
    const arrayValue = array[i];
    let valueFound = false;
    for(let j = 0; j < anotherArray.length; j++){
      const anotherValue = anotherArray[j]
      valueFound = equals(arrayValue, anotherValue)
      if(valueFound) break;
    }
    if(valueFound) result.push(arrayValue);
  }
  return result;
}
const union = (array, anotherArray, equals) => {
  const result = []
  if(!(array instanceof Array) || !(anotherArray instanceof Array)){
    throw notArrayError;
  }
  for(let i = 0; i < array.length; i++){
    const arrayValue = array[i];
    let valueFound = false;
    for(let j = 0; j < result.length; j++){
      valueFound = equals(arrayValue, result[j]);
      if(valueFound) break;
    }
    if(!valueFound) result.push(arrayValue);
  }
  for(let i = 0; i < anotherArray.length; i++){
    const arrayValue = anotherArray[i];
    let valueFound = false;
    for(let j = 0; j < result.length; j++){
      valueFound = equals(arrayValue, result[j]);
      if(valueFound) break;
    }
    if(!valueFound) result.push(arrayValue);
  }
  return result;
}

module.exports = {
  Array: {
    difference,
    intersection,
    union
  }
}