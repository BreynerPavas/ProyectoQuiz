let navs = document.getElementsByClassName("nav-link");
let divHome = document.getElementById("home");
let divQuiz = document.getElementById("quiz");
let divResults = document.getElementById("results");
let bPreguntas = document.getElementsByClassName("bPregunta");

Array.from(navs).forEach(nav => {
    nav.addEventListener("click", (e) => {
        quitarActive(navs);
        e.target.className = "nav-link active";
        document.getElementById("titleHeader").innerText = e.target.innerText

        switch (e.target.id) {
            case "navHome":
                quitarDisplayNone();
                divHome.className = "d-block"
                break;
            case "navQuiz":
                quitarDisplayNone();
                divQuiz.className = "d-block"
                break;
            case "navResults":
                quitarDisplayNone();
                divResults.className = "d-block"
                break;
            default:
                break;
        }
    })
});

function quitarDisplayNone() {
    divHome.className = "d-none"
    divQuiz.className = "d-none"
    divResults.className = "d-none"
}

function quitarActive(navs) {
    Array.from(navs).forEach(nav => {
        nav.className = "nav-link"
    });
}
document.getElementById("bQuiz").addEventListener("click", () => {
    quitarDisplayNone()
    quitarActive(navs);
    document.getElementById("titleHeader").innerText = "Quiz"
    navs[1].className = "nav-link active";
    divQuiz.className = "d-block"
})
document.getElementById("bResults").addEventListener("click", () => {
    quitarDisplayNone()
    quitarActive(navs);
    navs[2].className = "nav-link active";
    document.getElementById("titleHeader").innerText = "Results"
    divResults.className = "d-block"
})

let peticion = [];
let actualQuestionIndex = 0;

axios.get("https://opentdb.com/api.php?amount=10&type=multiple")

    .then((res) => {
        peticion = res.data.results;
    })

    .catch((err) => console.error(err));

function obtenerRespuestas(i) {
    let preguntasNoOrdenadas = [];
    preguntasNoOrdenadas.push(peticion[i].correct_answer);
    peticion[i].incorrect_answers.forEach(respuesta => {
        preguntasNoOrdenadas.push(respuesta)
    });
    return preguntasNoOrdenadas;
}

function mezclarArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        // Generar un índice aleatorio entre 0 y i
        const j = Math.floor(Math.random() * (i + 1));

        // Intercambiar los elementos arr[i] y arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

document.getElementById("bStart").addEventListener("click", () => {

    document.getElementById("bStart").className = "btn btn-primary d-none";
    document.getElementById("divBotonesPreguntas").classList.remove("d-none");
    document.getElementById("divBotonesPreguntas").classList.add("d-flex");
    document.getElementById("bNext").className = "btn btn-primary float-end"
    mostrarPregunta();


})

function quitarSeleccionado() {
    let answers = document.getElementsByClassName("answers");
    Array.from(answers).forEach(element => {
        element.className = "answers m-2 p-2"
    });
}
function mostrarPregunta() {
    let preguntasAux = (obtenerRespuestas(actualQuestionIndex));
    preguntasAux = mezclarArray(preguntasAux); // ya tenemos todas las respuestas en un array mezclado
    document.getElementById("currentQuestionText").innerText = peticion[actualQuestionIndex].question;
    document.getElementById("CurrentQuestionAnswers").innerHTML = ""
    preguntasAux.forEach(pregunta => {
        let pAux = document.createElement("p");
        pAux.className = "m-2 p-2 answers";
        pAux.setAttribute("style", "border:1px solid gray");
        pAux.innerText = pregunta;
        pAux.addEventListener("click", (e) => {
            quitarSeleccionado();
            e.target.className = "answers selected m-2 p-2";
            document.getElementById("bNext").removeAttribute("disabled")


        })

        document.getElementById("CurrentQuestionAnswers").appendChild(pAux);
    });

}
let respuestasFinales = ["","","","","","","","","",""]
let correctas = 0;
//aqui vamos a hacer la logica para ver si las preguntas estan bien o no
function mostrarResultados(){
    
    for(var i = 0; i<respuestasFinales.length;i++){
        if(respuestasFinales[i] == peticion[i].correct_answer){
            correctas++;
            document.getElementById(i).style.backgroundColor = "lightgreen"
        }else{
            console.log("malas");
            
            //console.log(document.getElementById(i));
            document.getElementById(i).style.backgroundColor = "lightcoral"
            // document.getElementById(i).style.backgroundColor = "lightred"
        }
    }
    document.getElementById("userScore").innerText = correctas;
    if(correctas<=4){
        setColor("red")
        document.getElementById("statusScore").innerText = "Status: Fail"
    }else{
        setColor("green")
        document.getElementById("statusScore").innerText = "Status: Success"

    }
}
function setColor(color){
    document.getElementById("userScore").style.color = color;
    document.getElementById("statusScore").style.color = color;
    document.getElementById("scoreTitle").style.color = color;
    document.getElementById("maxScore").style.color = color;
    document.getElementById("scoreboard").style.border = `5px solid ${color}`;

}
const intentosPrevios = {
    score: JSON.parse(localStorage.getItem("intentosPrevios"))?.score || []
}
//cuando le demos a next vamos a guardar el p que se selecciono y despues lo validaremos con la peticion porque estan en el mismo orden indexado
document.getElementById("bNext").addEventListener("click",(e) => {
    
    if(actualQuestionIndex==8){
        document.getElementById("bNext").innerText = "Finish";
        preguntaActual();

    }
    if(actualQuestionIndex>=9){// aqui tenemos que hacer la logica cuando acabemos las preguntas
        actualQuestionIndex = 0;
        let seleccion = document.getElementsByClassName("selected");
        respuestasFinales[actualQuestionIndex]=(seleccion[0].innerText);
        quitarDisplayNone();
        quitarActive(navs);
        document.getElementById("titleHeader").innerText = "Results"
        navs[2].className = "nav-link active";
        divResults.className = "d-block";
        document.getElementById("correctionAnswers").classList.remove("d-none")
        //aqui vamos a ver cuales han sido las respuestas del usuario
        
        mostrarResultados();
        //ahora vamos a guardarlos en el localStorage
        intentosPrevios.score.push(correctas);
        localStorage.setItem("intentosPrevios",JSON.stringify(intentosPrevios))
        
    }else{
        let seleccion = document.getElementsByClassName("selected");
        respuestasFinales[actualQuestionIndex]=(seleccion[0].innerText);
        actualQuestionIndex++;
        mostrarPregunta();
        preguntaActual();
        document.getElementById("bNext").setAttribute("disabled","")
    }
})
function preguntaActual(){
    limpiarActiveBotones();
    console.log(document.getElementById("b"+actualQuestionIndex));
    
    document.getElementById("b"+actualQuestionIndex).classList.add("active");
}

//intento de mi grafica
let labels = [];
const nIntentos = JSON.parse(localStorage.getItem("intentosPrevios"))?.score.length || 0;
for (let index = 0; index < nIntentos; index++) {
    labels.push(index)
}
const data = {
    labels: labels,
    datasets: [{
      label: 'Previous Tries',
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      data: JSON.parse(localStorage.getItem("intentosPrevios"))?.score, // aqui va el array de valores
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {}
  };
  window.onload = () => { // aqui es necesario hacerlo una vez cargue
    const myChart = new Chart('myChart', config);
  }
  
  let circlesQuestion = document.getElementsByClassName("questionsCircle");
  Array.from(circlesQuestion).forEach((circle)=>{
      circle.style.cursor = "pointer"
      circle.addEventListener("click",(e)=>{
        document.getElementById("exampleModalLabel").innerText = peticion[e.target.id].question;
        document.getElementById("correctAnswer").innerText = peticion[e.target.id].correct_answer;
        document.getElementById("userAnswer").innerText = respuestasFinales[e.target.id]

          //console.log(e.target.id); //Aqui obtenemos el id de la pregunta
          
      })
  })
// para hacer los botones tengo pensado hacer 10 botones que esten disabled hasta las preguntas ya contestadas
//que cuando le haga click a ese boton me haga la misma funcionalidad de


function limpiarActiveBotones(){
    Array.from(bPreguntas).forEach((bPregunta)=>{
        bPregunta.classList.remove("active")
    })
}
Array.from(bPreguntas).forEach((bPregunta)=>{
    console.log(bPregunta);
    
    bPregunta.addEventListener("click",(e)=>{
        // console.log("hola");
        
        limpiarActiveBotones();
        let idBoton = e.target.id[1];
        console.log(idBoton);
        actualQuestionIndex = idBoton;
        mostrarPregunta();
        
        e.target.classList.add("active")
    })
})
