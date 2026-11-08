const lista = JSON.parse(localStorage.getItem("obras")) || []
let id = 0

lista.forEach(function (obra) {
    if (obra.id > id) {
        id = obra.id
    }
})

//CRUD
Create()
Read()
Update()
Delete()

// Funções de pesquisa, filtragem, ordenação e API
Pesquisa()
Filtragem_Ordenacao()
AutocompletarAPI()


function Create() {
    const corpocadastro = document.querySelector("#corpo-cadastro")

    if (corpocadastro === null) {
        return
    }

    corpocadastro.addEventListener("reset", function () {
        const previewCapa = document.querySelector("#preview-capa")
        const sugestoesApi = document.querySelector("#sugestoes-api")

        if (previewCapa !== null) {
            previewCapa.src = ""
            previewCapa.hidden = true
        }

        if (sugestoesApi !== null) {
            sugestoesApi.innerHTML = ""
        }
    })

    corpocadastro.addEventListener("submit", function (event) {
        event.preventDefault()

        // Selecionando os inputs/campos de digitação
        const titulo = document.querySelector("#input-titulo").value
        const tipo = document.querySelector("#input-tipo-da-midia").value
        const generos = document.querySelector("#input-genero").value
        const anolancamento = document.querySelector("#input-ano-lancamento").value
        const elenco = document.querySelector("#input-elenco").value
        const avaliacaogeral = document.querySelector("#input-avaliacao-geral").value
        const imagem = document.querySelector("#input-imagem").value
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

        if (dadosvalidos === false) {
            return
        }

        // Dependência de edição
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
                obraSelecionada.imagem = imagem
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

        function validador(titulo, tipo, genero, anolancamento, alertas) {
            if (titulo === "") {
                alertas.textContent = "Digite um título"
                return false
            } else if (titulo.length < 3) {
                alertas.textContent = "O título precisa de no mínimo 3 caracteres"
                return false
            } else if (tipo === "") {
                alertas.textContent = "Selecione o tipo da mídia"
                return false
            } else if (genero === "") {
                alertas.textContent = "Selecione o gênero da obra"
                return false
            } else if (anolancamento === "") {
                alertas.textContent = "Insira o ano de lançamento da obra"
                return false
            } else {
                alertas.textContent = ""
                return true
            }
        }

        id += 1

        const dicionario = {
            id: id,
            titulo: titulo,
            tipo: tipo,
            genero: generos,
            anolancamento: anolancamento,
            elenco: elenco,
            avaliacaogeral: avaliacaogeral,
            imagem: imagem,
            status: infopessoal_status,
            notapessoal: infopessoal_nota,
            observacoes: infopessoal_observacoes
        }

        lista.push(dicionario)
        localStorage.setItem("obras", JSON.stringify(lista))
        corpocadastro.reset()
        alertas.textContent = "Obra cadastrada com sucesso!"
        console.log(lista)
    })
}


function Read(listaParaExibir = lista) {
    const corpopagconsulta = document.querySelector("#lista-obras")

    if (corpopagconsulta === null) {
        return
    }

    corpopagconsulta.innerHTML = ""

    listaParaExibir.forEach(function (i) {
        const imagemCapa = i.imagem
            ? `<img class="capa-obra" src="${i.imagem}" alt="Capa de ${i.titulo}">`
            : ""

        corpopagconsulta.innerHTML += `
        <article class="obra" data-id="${i.id}">
            <section class="apresentacao-obra">
                <h3>${i.titulo}</h3>
                ${imagemCapa}
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
        const corpocadastro = document.querySelector("#corpo-cadastro")

        if (corpocadastro === null) {
            return
        }

        const parametros = new URLSearchParams(window.location.search)
        const idEdicao = Number(parametros.get("editar"))

        if (idEdicao === 0) {
            return
        }

        const obraSelecionada = lista.find(function (obra) {
            return obra.id === idEdicao
        })

        if (obraSelecionada === undefined) {
            return
        }

        const botaoSalvar = document.querySelector("#botao-salvar")

        if (botaoSalvar !== null) {
            botaoSalvar.textContent = "Salvar alterações"
        }

        document.querySelector("#input-titulo").value = obraSelecionada.titulo

        document.querySelector("#input-tipo-da-midia").value = obraSelecionada.tipo

        document.querySelector("#input-genero").value = obraSelecionada.genero

        document.querySelector("#input-ano-lancamento").value = obraSelecionada.anolancamento

        document.querySelector("#input-elenco").value = obraSelecionada.elenco

        document.querySelector("#input-avaliacao-geral").value = obraSelecionada.avaliacaogeral

        document.querySelector("#input-imagem").value = obraSelecionada.imagem || ""

        document.querySelector("#input-infopessoal-status").value = obraSelecionada.status

        document.querySelector("#input-infopessoal-avaliacao-pessoal").value = obraSelecionada.notapessoal

        document.querySelector("#input-infopessoal-observacoes").value = obraSelecionada.observacoes

        const previewCapa = document.querySelector("#preview-capa")
        if (previewCapa !== null && obraSelecionada.imagem) {
            previewCapa.src = obraSelecionada.imagem
            previewCapa.hidden = false
        }
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


function Pesquisa() {
    const formularioPesquisa = document.querySelector(".pesquisa form")

    if (formularioPesquisa === null) {
        return
    }

    formularioPesquisa.addEventListener("submit", function (event) {
        event.preventDefault()
        AplicarConsulta()
    })
}


function Filtragem_Ordenacao() {
    const formularioFiltros = document.querySelector(".filtros form")

    if (formularioFiltros === null) {
        return
    }

    formularioFiltros.addEventListener("submit", function (event) {
        event.preventDefault()
        AplicarConsulta()
    })

    formularioFiltros.addEventListener("reset", function () {
        const campoPesquisa = document.querySelector("#pesquisa")

        if (campoPesquisa !== null) {
            campoPesquisa.value = ""
        }

        setTimeout(function () {
            Read(lista)
        }, 0)
    })
}


function AplicarConsulta() {
    const campoPesquisa = document.querySelector("#pesquisa")
    const campoGenero = document.querySelector("#filtro-genero")
    const campoTipo = document.querySelector("#filtro-tipo")
    const campoStatus = document.querySelector("#filtro-status")
    const campoOrdenacao = document.querySelector("#ordenacao")

    if (
        campoPesquisa === null ||
        campoGenero === null ||
        campoTipo === null ||
        campoStatus === null ||
        campoOrdenacao === null
    ) {
        return
    }

    const pesquisa = campoPesquisa.value.toLowerCase().trim()
    const genero = campoGenero.value
    const tipo = campoTipo.value
    const status = campoStatus.value
    const ordenacao = campoOrdenacao.value

    const resultado = lista.filter(function (obra) {
        const tituloCompativel = obra.titulo
            .toLowerCase()
            .includes(pesquisa)

        const generoCompativel =
            genero === "" || obra.genero === genero

        const tipoCompativel =
            tipo === "" || obra.tipo === tipo

        const statusCompativel =
            status === "" || obra.status === status

        return (
            tituloCompativel &&
            generoCompativel &&
            tipoCompativel &&
            statusCompativel
        )
    })

    if (ordenacao === "titulo") {
        resultado.sort(function (obraA, obraB) {
            return obraA.titulo.localeCompare(obraB.titulo)
        })
    }

    if (ordenacao === "ano") {
        resultado.sort(function (obraA, obraB) {
            return (
                Number(obraA.anolancamento) -
                Number(obraB.anolancamento)
            )
        })
    }

    if (ordenacao === "avaliacao") {
        resultado.sort(function (obraA, obraB) {
            return (
                Number(obraB.avaliacaogeral) -
                Number(obraA.avaliacaogeral)
            )
        })
    }

    Read(resultado)
}


function AutocompletarAPI() {
    // Cole sua Chave da API (32 caracteres) abaixo. O .trim() remove espaços acidentais.
    const CHAVE_TMDB = "1851cb764ef4d4cf026d939f7261574b".trim()

    const botaoBuscar = document.querySelector("#botao-buscar-api")
    const inputTitulo = document.querySelector("#input-titulo")
    const inputImagem = document.querySelector("#input-imagem")
    const previewCapa = document.querySelector("#preview-capa")
    const containerSugestoes = document.querySelector("#sugestoes-api")
    const alertas = document.querySelector("#alertas")

    if (botaoBuscar === null || inputTitulo === null || containerSugestoes === null) {
        return
    }

    if (inputImagem !== null && previewCapa !== null) {
        inputImagem.addEventListener("input", function () {
            const url = inputImagem.value.trim()
            if (url !== "") {
                previewCapa.src = url
                previewCapa.hidden = false
            } else {
                previewCapa.src = ""
                previewCapa.hidden = true
            }
        })
    }

    const mapaGeneroTMDB = {
        28: "acao",
        10759: "acao",
        16: "animacao",
        12: "aventura",
        35: "comedia",
        99: "documentario",
        18: "drama",
        878: "ficcao-cientifica",
        10765: "ficcao-cientifica",
        10749: "romance",
        53: "suspense",
        9648: "suspense",
        80: "suspense",
        27: "terror"
    }

    botaoBuscar.addEventListener("click", async function () {
        const termo = inputTitulo.value.trim()

        if (termo.length < 2) {
            alertas.textContent = "Digite pelo menos 2 caracteres no título para buscar"
            return
        }

        alertas.textContent = "Buscando no TMDB..."
        containerSugestoes.innerHTML = ""

        try {
            // Se o usuário colou o Token de Leitura (começa com eyJ) ou a Chave de 32 caracteres, aceita ambos!
            const usaTokenBearer = CHAVE_TMDB.startsWith("eyJ")
            const paramKey = usaTokenBearer ? "" : `api_key=${encodeURIComponent(CHAVE_TMDB)}&`
            const opcoesFetch = usaTokenBearer
                ? { headers: { Authorization: `Bearer ${CHAVE_TMDB}`, accept: "application/json" } }
                : {}

            // Busca Filmes e Séries separadamente para não misturar com perfis de atores
            const [respFilmes, respSeries] = await Promise.all([
                fetch(
                    `https://api.themoviedb.org/3/search/movie?${paramKey}language=pt-BR&query=${encodeURIComponent(termo)}`,
                    opcoesFetch
                ),
                fetch(
                    `https://api.themoviedb.org/3/search/tv?${paramKey}language=pt-BR&query=${encodeURIComponent(termo)}`,
                    opcoesFetch
                )
            ])

            const dadosFilmes = await respFilmes.json()
            const dadosSeries = await respSeries.json()

            // Se a chave do TMDB estiver incorreta ou inativa, mostra o erro oficial do TMDB na tela
            if (!respFilmes.ok) {
                alertas.textContent = "Erro TMDB: " + (dadosFilmes.status_message || respFilmes.status)
                return
            }

            const listaFilmes = (dadosFilmes.results || []).map(function (f) {
                f.media_type = "movie"
                return f
            })
            const listaSeries = (dadosSeries.results || []).map(function (s) {
                s.media_type = "tv"
                return s
            })

            // Junta filmes e séries e ordena pelos mais populares primeiro
            const combinados = listaFilmes
                .concat(listaSeries)
                .sort(function (a, b) {
                    return (b.popularity || 0) - (a.popularity || 0)
                })
                .slice(0, 5)

            if (combinados.length === 0) {
                alertas.textContent = "Nenhuma obra encontrada"
                return
            }

            alertas.textContent = "Selecione uma obra da lista abaixo:"

            combinados.forEach(function (item) {
                const titulo = item.title || item.name || ""
                const data = item.release_date || item.first_air_date || ""
                const ano = data ? data.slice(0, 4) : ""
                const tipo = item.media_type === "tv" ? "serie" : "filme"
                const tipoLegivel = item.media_type === "tv" ? "Série" : "Filme"
                const capa = item.poster_path ? "https://image.tmdb.org/t/p/w300" + item.poster_path : ""
                const miniatura = item.poster_path ? "https://image.tmdb.org/t/p/w92" + item.poster_path : ""
                const nota = item.vote_average ? Number(item.vote_average).toFixed(1) : ""

                let genero = ""
                if (Array.isArray(item.genre_ids)) {
                    for (let i = 0; i < item.genre_ids.length; i++) {
                        const idGen = item.genre_ids[i]
                        if (mapaGeneroTMDB[idGen]) {
                            genero = mapaGeneroTMDB[idGen]
                            break
                        }
                    }
                }

                const opcao = document.createElement("div")
                opcao.className = "item-sugestao"

                opcao.innerHTML = `
                    ${miniatura ? `<img src="${miniatura}" alt="Capa">` : ""}
                    <span>
                        <strong>${titulo}</strong> (${ano || "S/A"}) - ${tipoLegivel}
                    </span>
                    <button type="button">Selecionar</button>
                `

                opcao.addEventListener("click", async function () {
                    document.querySelector("#input-titulo").value = titulo
                    document.querySelector("#input-ano-lancamento").value = ano
                    document.querySelector("#input-tipo-da-midia").value = tipo
                    document.querySelector("#input-imagem").value = capa

                    if (genero !== "") {
                        document.querySelector("#input-genero").value = genero
                    }
                    if (nota !== "") {
                        document.querySelector("#input-avaliacao-geral").value = nota
                    }

                    if (previewCapa !== null) {
                        if (capa !== "") {
                            previewCapa.src = capa
                            previewCapa.hidden = false
                        } else {
                            previewCapa.src = ""
                            previewCapa.hidden = true
                        }
                    }

                    containerSugestoes.innerHTML = ""
                    alertas.textContent = "Carregando elenco principal..."

                    try {
                        const respCreditos = await fetch(
                            `https://api.themoviedb.org/3/${item.media_type}/${item.id}/credits?${paramKey}language=pt-BR`,
                            opcoesFetch
                        )
                        const dadosCreditos = await respCreditos.json()

                        if (dadosCreditos && Array.isArray(dadosCreditos.cast)) {
                            document.querySelector("#input-elenco").value = dadosCreditos.cast
                                .slice(0, 5)
                                .map(function (ator) {
                                    return ator.name
                                })
                                .join(", ")
                        }
                    } catch (erroElenco) {
                        console.error(erroElenco)
                    }

                    alertas.textContent = "Campos preenchidos pela API!"
                })

                containerSugestoes.appendChild(opcao)
            })
        } catch (erro) {
            console.error(erro)
            alertas.textContent = "Erro de conexão com o TMDB: " + erro.message
        }
    })
}