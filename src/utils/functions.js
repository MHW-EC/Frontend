const stringDay = (stringDate) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', "Jueves", "Viernes", "Sábado"]
  return days[new Date(Date.parse(stringDate)).getDay()]
}
const interval = (stringDateA, stringDateB) => {
  return stringDay(stringDateA) + "  " +
    stringDateA.split(["T"])[1].substring(0, 5) + " - "
    + stringDateB.split(["T"])[1].substring(0, 5)
}
const intervalExam = (stringDateA, stringDateB) => {
  return stringDateA.split("T")[0] + " " +
    stringDateA.split(["T"])[1].substring(0, 5) +
    "-" + stringDateB.split(["T"])[1].substring(0, 5)
}
const eventoToAppointment = (materia, evento, lenLista, esClase) => {
  return {
    id: lenLista,
    title: `${materia.nombre} ${materia.codigo} ${materia.paralelo}`,
    startDate: new Date(Date.parse(evento['inicio'])),
    endDate: new Date(Date.parse(evento['fin'])),
    location: esClase ? `${evento['aula']} ${evento['detalle_aula']}` : "",
    nombre: materia.nombre,
    codigo: materia.codigo,
    paralelo: materia.paralelo,
    profesor: materia.profesor
  }
}

module.exports = {
  formatters: {
    interval,
    intervalExam
  },
  parsers: {
    eventoToAppointment
  }
}