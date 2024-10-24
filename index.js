let navs = document.getElementsByClassName("nav-link");
let divHome = document.getElementById("home");
let divQuiz = document.getElementById("quiz");
let divResults = document.getElementById("results");
Array.from(navs).forEach(nav => {
    nav.addEventListener("click",(e)=>{
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

function quitarDisplayNone(){
    divHome.className = "d-none"
    divQuiz.className = "d-none"
    divResults.className = "d-none"
}

function quitarActive(navs){
    Array.from(navs).forEach(nav => {
        nav.className = "nav-link"
    });
}
document.getElementById("bQuiz").addEventListener("click",()=>{
    quitarDisplayNone()
    quitarActive(navs);
    document.getElementById("titleHeader").innerText = "Quiz"
    navs[1].className = "nav-link active";
    divQuiz.className = "d-block"
})
document.getElementById("bResults").addEventListener("click",()=>{
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

function obtenerRespuestas(i){
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

document.getElementById("bStart").addEventListener("click",()=>{
    
    document.getElementById("bStart").className = "btn btn-primary d-none";
    document.getElementById("bNext").className = "btn btn-primary "
    mostrarPregunta();

    
})

function quitarSeleccionado(){
    let answers = document.getElementsByClassName("answers");
    Array.from(answers).forEach(element => {
        element.className = "answers m-2 p-2"
    });
}
function mostrarPregunta(){
    let preguntasAux = (obtenerRespuestas(actualQuestionIndex));
    preguntasAux = mezclarArray(preguntasAux); // ya tenemos todas las respuestas en un array mezclado
    document.getElementById("currentQuestionText").innerText = peticion[actualQuestionIndex].question;
    document.getElementById("CurrentQuestionAnswers").innerHTML = ""
    preguntasAux.forEach(pregunta => {
        let pAux = document.createElement("p");
        pAux.className = "m-2 p-2 answers";
        pAux.setAttribute("style","border:1px solid gray");
        pAux.innerText = pregunta;
        pAux.addEventListener("click",(e)=>{
            console.log(e.target);
            quitarSeleccionado();
            e.target.className = "answers selected m-2 p-2";
            
        })
        
        document.getElementById("CurrentQuestionAnswers").appendChild(pAux);
    });

}
//cuando le demos a next vamos a guardar el p que se selecciono y despues lo validaremos con la peticion porque estan en el mismo orden indexado