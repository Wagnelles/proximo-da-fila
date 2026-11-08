const lista = JSON.parse(localStorage.getItem("obras")) || []
let id = 0

lista.forEach(function (obra) {
    if (obra.id > id) {
        id = obra.id
    }
})

Create()
Read()
Update()
Delete()

function Create() {
    const corpocadastro = document.querySelector("#corpo-cadastro")

    if (corpocadastro === null) {return}

    //eventlistener
    corpocadastro.addEventListener("submit", function (event) {
    event.preventDefault()

    //Selecionando os inputs/campos de digitação
    const titulo = document.querySelector("#input-titulo").value
    const tipo = document.querySelector("#input-tipo-da-midia").value
    const generos = document.querySelector("#input-genero").value
    const anolancamento = document.querySelector("#input-ano-lancamento").value
    const elenco = document.querySelector("#input-elenco").value
    const avaliacaogeral = document.querySelector("#input-avaliacao-geral").value
    const infopessoal_status = document.querySelector("#input-infopessoal-status").value
    const infopessoal_nota = document.querySelector("#input-infopessoal-avaliacao-pessoal").value
    const infopessoal_observacoes = document.querySelector("#input-infopessoal-observacoes").value
    const alertas = document.querySelector("#alertas")

    const dadosvalidos = validador(
        titulo,
        tipo,
        generos,
        anolancamento,
        alertas
    )

    if (dadosvalidos === false){
        return
    }

    //dependência de edição

    const parametros = new URLSearchParams(window.location.search)
    const idEdicao = Number(parametros.get("editar"))

    if (idEdicao > 0) {
        const obraSelecionada = lista.find(function (obra) {
        return obra.id === idEdicao
    })

    if (obraSelecionada !== undefined) {
        obraSelecionada.titulo = titulo
        obraSelecionada.tipo = tipo
        obraSelecionada.genero = generos
        obraSelecionada.anolancamento = anolancamento
        obraSelecionada.elenco = elenco
        obraSelecionada.avaliacaogeral = avaliacaogeral
        obraSelecionada.status = infopessoal_status
        obraSelecionada.notapessoal = infopessoal_nota
        obraSelecionada.observacoes = infopessoal_observacoes

        localStorage.setItem(
            "obras",
            JSON.stringify(lista)
        )

        window.location.href = "consulta.html"

        return
    }
}

    //função validador
        function validador(titulo, tipo, genero, anolancamento, alertas) {
            if (titulo === "") {
                alertas.textContent = "Digite um título"
                return false
            } else if (titulo.length < 3){
                alertas.textContent = "O titulo precisa de no mínimo 3 caracteres"
                return false
            } else if (tipo === "") {
                alertas.textContent = "Selecione o tipo da mídia"
                return false
            } else if (genero === ""){
                alertas.textContent = "Selecione o gênero da obra"     
                return false   
            } else if (anolancamento === ""){
                alertas.textContent = "Insira o ano de lançamento da obra"
                return false
            } else {
                alertas.textContent = ""
                return true
            }

        }


    id+=1
    const dicionario = {
        id: id,
        titulo: titulo,
        tipo: tipo,
        genero: generos,
        anolancamento: anolancamento,
        elenco: elenco,
        avaliacaogeral: avaliacaogeral,
        status: infopessoal_status,
        notapessoal: infopessoal_nota,
        observacoes: infopessoal_observacoes
    }

    lista.push(dicionario)
    localStorage.setItem("obras", JSON.stringify(lista))
    corpocadastro.reset()
    console.log(lista)

    })

}

function Read() {
    const corpopagconsulta = document.querySelector("#lista-obras")
    if (corpopagconsulta === null) {return}
    corpopagconsulta.innerHTML = ""

    lista.forEach(function(i) {
        corpopagconsulta.innerHTML += `
        <article class="obra" data-id="${i.id}">
            <section class = "apresentacao-obra">
                <h3>${i.titulo}</h3>
            </section>
        

            <section class="informacoes-obra">
                <h3>Detalhes de ${i.titulo}</h3>
                <p><strong>Tipo:</strong> ${i.tipo}</p>
                <p><strong>Gênero:</strong> ${i.genero}</p>
                <p><strong>Ano de lançamento:</strong> ${i.anolancamento}</p>
                <p><strong>Nota Geral:</strong> ${i.avaliacaogeral}</p>
                <p><strong>Status:</strong> ${i.status}</p>
                <p><strong>Nota Pessoal:</strong> ${i.notapessoal}</p>
                <p><strong>Elenco:</strong> ${i.elenco}</p>
                <p><strong>Observações:</strong> ${i.observacoes}</p>
                
                <section class="acoes-obra">
                    <button class="botao-editar" type="button" data-id="${i.id}">Editar</button>
                    <button class="botao-excluir" type="button" data-id="${i.id}">Excluir</button>
                </section>
            </section>
        </article>
        `
    })
}

function Update() {

    const corpopagconsulta = document.querySelector("#lista-obras")

    if (corpopagconsulta !== null) {
        corpopagconsulta.addEventListener("click", function (event) {
            if (event.target.classList.contains("botao-editar")) {
                const idSelecionado = event.target.dataset.id

                window.location.href =
                    "cadastro.html?editar=" + idSelecionado
            }
        })
    }

    function prepararEdicao() {
        const corpocadastro =
            document.querySelector("#corpo-cadastro")

        if (corpocadastro === null) {
            return
        }

        const parametros =
            new URLSearchParams(window.location.search)

        const idEdicao =
            Number(parametros.get("editar"))

        if (idEdicao === 0) {
            return
        }

        const obraSelecionada =
            lista.find(function (obra) {
                return obra.id === idEdicao
            })

        if (obraSelecionada === undefined) {
            return
        }

        const botaoSalvar =
            document.querySelector("#botao-salvar")
            
        if (botaoSalvar !== null) {
            botaoSalvar.textContent = "Salvar alterações"
        }

        document.querySelector("#input-titulo").value =
            obraSelecionada.titulo

        document.querySelector("#input-tipo-da-midia").value =
            obraSelecionada.tipo

        document.querySelector("#input-genero").value =
            obraSelecionada.genero

        document.querySelector("#input-ano-lancamento").value =
            obraSelecionada.anolancamento

        document.querySelector("#input-elenco").value =
            obraSelecionada.elenco

        document.querySelector("#input-avaliacao-geral").value =
            obraSelecionada.avaliacaogeral

        document.querySelector("#input-infopessoal-status").value =
            obraSelecionada.status

        document.querySelector(
            "#input-infopessoal-avaliacao-pessoal"
        ).value = obraSelecionada.notapessoal

        document.querySelector(
            "#input-infopessoal-observacoes"
        ).value = obraSelecionada.observacoes
    }

    prepararEdicao()

}

function Delete() {
    const corpopagconsulta = document.querySelector("#lista-obras")

    if (corpopagconsulta === null) {
        return
    }

    corpopagconsulta.addEventListener("click", function (event) {
        if (event.target.classList.contains("botao-excluir")) {
            const idSelecionado = Number(event.target.dataset.id)

            const posicaoObra = lista.findIndex(function (obra) {
                return obra.id === idSelecionado
            })

            if (posicaoObra === -1) {
                return
            }

            const confirmarExclusao = confirm(
                "Deseja realmente excluir esta obra?"
            )

            if (confirmarExclusao === false) {
                return
            }

            lista.splice(posicaoObra, 1)

            localStorage.setItem(
                "obras",
                JSON.stringify(lista)
            )

            Read()
        }
    })
}

