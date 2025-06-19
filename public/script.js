document.addEventListener("DOMContentLoaded", function () {
    const modalLogin = document.getElementById("modal-login");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnEntrar = document.getElementById("btn-entrar");
    const btnIrCadastro = document.getElementById("btn-ir-cadastro");
    const btnLogin = document.getElementById("btn-login");
    const mensagemErro = document.getElementById("mensagem-erro");
    const totalLikes = document.getElementById("total-likes");
    const totalDislikes = document.getElementById("total-dislikes");
    const perfilContainer = document.getElementById("perfil-container");
    const perfilFotoCanto = document.getElementById("perfil-foto-canto");
    let usuarioLogado = localStorage.getItem('usuarioLogado');
    let usuarioLogadoId = localStorage.getItem('usuarioLogadoId');

    function atualizarInterfaceLogin() {
        if (usuarioLogado && btnLogin) {
            btnLogin.textContent = `Olá, ${usuarioLogado}`;
            fetch(`/api/perfil/${usuarioLogado}`)
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao buscar perfil: " + response.status);
                    return response.json();
                })
                .then(data => {
                    if (data.success && data.foto) {
                        if (perfilFotoCanto) perfilFotoCanto.src = data.foto;
                    } else {
                        if (perfilFotoCanto) perfilFotoCanto.src = "images/perfil-padrao.png";
                    }
                })
                .catch(error => {
                    console.error("Erro ao carregar foto do perfil:", error);
                    if (perfilFotoCanto) perfilFotoCanto.src = "images/perfil-padrao.png";
                });

            if (btnIrCadastro) btnIrCadastro.style.display = "none";
            let btnSair = document.getElementById("btn-sair");
            if (!btnSair) {
                btnSair = document.createElement("button");
                btnSair.id = "btn-sair";
                btnSair.textContent = "Sair";
                btnSair.classList.add("btn-login");
                btnIrCadastro.parentNode.insertBefore(btnSair, btnIrCadastro.nextSibling);
                
                btnSair.addEventListener("click", () => {
                    localStorage.removeItem('usuarioLogado');
                    localStorage.removeItem('usuarioLogadoId');
                    usuarioLogado = null;
                    usuarioLogadoId = null;
                    btnLogin.textContent = "Login";
                    totalLikes.textContent = "0";
                    totalDislikes.textContent = "0";
                    btnSair.remove();
                    if (btnIrCadastro) btnIrCadastro.style.display = "block";
                    if (perfilContainer) perfilContainer.style.display = "none";
                    carregarInteracoes();
                });
            }

            if (perfilContainer) {
                perfilContainer.style.display = "block";
                perfilFotoCanto.addEventListener("click", () => {
                    window.location.href = "altera_perfil.html";
                });
            }
        } else {
            if (btnIrCadastro) btnIrCadastro.style.display = "block";
            const btnSair = document.getElementById("btn-sair");
            if (btnSair) btnSair.remove();
            if (perfilContainer) perfilContainer.style.display = "none";
        }
    }

    atualizarInterfaceLogin();

    if (btnIrCadastro) {
        btnIrCadastro.addEventListener("click", () => {
            window.location.href = "cadastro.html";
        });
    }

    if (btnLogin) {
        btnLogin.addEventListener("click", function () {
            if (modalLogin && !usuarioLogado) modalLogin.style.display = "block";
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            if (modalLogin) modalLogin.style.display = "none";
        });
    }

    if (btnEntrar) {
        btnEntrar.addEventListener("click", function () {
            const nickname = document.getElementById("nickname").value;
            const senha = document.getElementById("senha").value;

            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, senha })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('usuarioLogado', nickname);
                    localStorage.setItem('usuarioLogadoId', data.usuarioId);
                    usuarioLogado = nickname;
                    usuarioLogadoId = data.usuarioId;
                    if (modalLogin) modalLogin.style.display = "none";
                    atualizarInterfaceLogin();
                    carregarInteracoes();
                } else if (mensagemErro) {
                    mensagemErro.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Erro ao fazer o login:', error);
                if (mensagemErro) mensagemErro.textContent = "Ocorreu um erro. Tente novamente.";
            });
        });
    }

    const formCadastro = document.getElementById("form-cadastro");
    if (formCadastro) {
        console.log("Formulário de cadastro encontrado!");
        formCadastro.addEventListener("submit", (event) => {
            event.preventDefault();

            const nome = document.getElementById("nome-cadastro").value;
            const email = document.getElementById("email-cadastro").value;
            const nickname = document.getElementById("nickname-cadastro").value;
            const senha = document.getElementById("senha-cadastro").value;

            console.log("Dados enviados para cadastro:", { nome, email, nickname, senha });

            fetch('http://localhost:3000/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, nickname, senha })
            })
            .then(response => {
                console.log("Resposta do servidor (status):", response.status);
                return response.json();
            })
            .then(data => {
                console.log("Resposta do servidor (dados):", data);
                if (data.success) {
                    localStorage.setItem('usuarioLogado', nickname);
                    localStorage.setItem('usuarioLogadoId', data.usuarioId);
                    usuarioLogado = nickname;
                    usuarioLogadoId = data.usuarioId;
                    const mensagemErro = document.getElementById("mensagem-erro");
                    if (mensagemErro) mensagemErro.textContent = "";
                    alert("Cadastro realizado com sucesso!");
                    window.location.href = "index.html";
                } else {
                    const mensagemErro = document.getElementById("mensagem-erro");
                    if (mensagemErro) mensagemErro.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Erro ao fazer o cadastro:', error);
                const mensagemErro = document.getElementById("mensagem-erro");
                if (mensagemErro) mensagemErro.textContent = "Ocorreu um erro. Tente novamente.";
            });
        });
    }

    const btnAlterarPerfil = document.getElementById("btn-alterar-perfil");
    if (btnAlterarPerfil) {
        btnAlterarPerfil.addEventListener("click", function() {
            window.location.href = "altera_perfil.html";
        });
    }

    const formAlterarPerfil = document.getElementById("form-alterar-perfil");
    if (formAlterarPerfil) {
        const mensagemSucesso = document.getElementById("mensagem-sucesso");
        const mensagemErroAlterar = document.getElementById("mensagem-erro");

        formAlterarPerfil.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!usuarioLogado) {
                alert("Você precisa estar logado para alterar o perfil!");
                window.location.href = "index.html";
                return;
            }

            const novaFoto = document.getElementById("nova-foto").files[0];
            const novoNickname = document.getElementById("novo-nickname").value.trim();

            if (!novaFoto && !novoNickname) {
                mensagemErroAlterar.textContent = "Preencha pelo menos um campo para alterar!";
                mensagemErroAlterar.style.display = "block";
                mensagemSucesso.style.display = "none";
                return;
            }

            const formData = new FormData();
            formData.append("nicknameAtual", usuarioLogado);
            if (novoNickname) formData.append("novoNickname", novoNickname);
            if (novaFoto) formData.append("novaFoto", novaFoto);

            console.log("Enviando dados para /api/alterar_perfil:", { nicknameAtual, novoNickname, temFoto: !!novaFoto });

            fetch("http://localhost:3000/api/alterar_perfil", {
                method: "POST",
                body: formData
            })
            .then(response => {
                console.log("Status da pesquisa:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("Resposta do servidor:", data);
                if (data.message === "Perfil alterado com sucesso!") {
                    mensagemSucesso.style.display = "block";
                    mensagemErroAlterar.style.display = "none";
                    if (novoNickname) {
                        localStorage.setItem("usuarioLogado", novoNickname);
                        usuarioLogado = novoNickname;
                    }
                    setTimeout(() => window.location.href = "index.html", 1500);
                } else {
                    throw new Error(data.message || "Erro desconhecido");
                }
            })
            .catch(error => {
                console.error("Erro ao alterar perfil:", error);
                mensagemSucesso.style.display = "none";
                mensagemErroAlterar.textContent = error.message || "Ocorreu um erro. Tente novamente.";
                mensagemErroAlterar.style.display = "block";
            });
        });
    }

    // Função para criar botões de apagar e editar
    function criarBotoesComentario(comentarioElement, comentarioId, textoElement, usuarioIdComentario, numComentarios) {
        if (usuarioLogadoId && usuarioIdComentario == usuarioLogadoId) {
            const btnApagar = document.createElement("img");
            btnApagar.src = "images/lixeira_deletar.svg";
            btnApagar.classList.add("btn-apagar");
            btnApagar.dataset.comentarioId = comentarioId;
            btnApagar.style.cursor = "pointer";
            btnApagar.style.width = "20px";
            btnApagar.style.height = "20px";

            btnApagar.addEventListener("click", () => {
                fetch(`/api/comentario/${comentarioId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuarioId: usuarioLogadoId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        comentarioElement.remove();
                        numComentarios.textContent = parseInt(numComentarios.textContent) - 1;
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error("Erro ao deletar comentário:", error));
            });

            const btnEditar = document.createElement("img");
            btnEditar.src = "images/lapis_editar.svg";
            btnEditar.classList.add("btn-editar");
            btnEditar.dataset.comentarioId = comentarioId;
            btnEditar.style.cursor = "pointer";
            btnEditar.style.width = "20px";
            btnEditar.style.height = "20px";
            btnEditar.style.marginLeft = "10px";

            btnEditar.addEventListener("click", () => {
                const novoTexto = prompt("Edite seu comentário:", textoElement.textContent.split(': ')[1]);
                if (novoTexto && novoTexto.trim() !== "" && novoTexto !== textoElement.textContent.split(': ')[1]) {
                    fetch(`/api/comentario/${comentarioId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            usuarioId: usuarioLogadoId,
                            texto: novoTexto 
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            textoElement.textContent = `${usuarioLogado}: ${novoTexto}`;
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => console.error("Erro ao editar comentário:", error));
                }
            });

            comentarioElement.appendChild(btnApagar);
            comentarioElement.appendChild(btnEditar);
        }
    }

    // Função para atualizar apenas os comentários de uma publicação
    async function atualizarComentarios(publicacaoId, comentarioLista, numComentarios) {
        const comentariosResponse = await fetch('/api/comentarios');
        const comentariosData = await comentariosResponse.json();
        const comentarios = comentariosData.success ? comentariosData.comentarios : {};

        if (comentarios[publicacaoId]) {
            numComentarios.textContent = comentarios[publicacaoId].length;
            comentarioLista.innerHTML = '';
            comentarios[publicacaoId].forEach(com => {
                const novoComentario = document.createElement("div");
                novoComentario.classList.add("comentario-item");
                const textoComentario = document.createElement("p");
                textoComentario.textContent = `${com.usuario}: ${com.texto}`;
                novoComentario.appendChild(textoComentario);

                criarBotoesComentario(novoComentario, com.id, textoComentario, com.usuarioid, numComentarios);

                comentarioLista.appendChild(novoComentario);
            });
        } else {
            numComentarios.textContent = 0;
            comentarioLista.innerHTML = '';
        }
    }

    async function carregarInteracoes() {
        const publicacoes = document.querySelectorAll(".publicacao");
        if (!publicacoes.length) return;

        const curtidasResponse = await fetch('/api/curtidas');
        const curtidasData = await curtidasResponse.json();
        const curtidas = curtidasData.success ? curtidasData.curtidas : {};

        let usuarioCurtidas = { likes: 0, deslikes: 0, interacoes: {} };
        if (usuarioLogadoId) {
            const usuarioCurtidasResponse = await fetch(`/api/curtidas/usuario/${usuarioLogadoId}`);
            const usuarioCurtidasData = await usuarioCurtidasResponse.json();
            if (usuarioCurtidasData.success) {
                usuarioCurtidas = {
                    likes: usuarioCurtidasData.likes,
                    deslikes: usuarioCurtidasData.deslikes,
                    interacoes: usuarioCurtidasData.interacoes
                };
            }
        }

        const comentariosResponse = await fetch('/api/comentarios');
        const comentariosData = await comentariosResponse.json();
        const comentarios = comentariosData.success ? comentariosData.comentarios : {};

        publicacoes.forEach(publicacao => {
            const likeBtn = publicacao.querySelector(".like");
            const dislikeBtn = publicacao.querySelector(".dislike");
            const likeCount = publicacao.querySelector(".likes");
            const dislikeCount = publicacao.querySelector(".dislikes");
            const comentarioBtn = publicacao.querySelector(".comentarios");
            const numComentarios = publicacao.querySelector(".num-comentarios");
            const comentarioInput = publicacao.querySelector(".comentario-container input");
            const comentarioEnviar = publicacao.querySelector(".btn-comentar");
            const comentarioLista = publicacao.querySelector(".comentarios-lista");
            const publicacaoId = publicacao.getAttribute("data-publicacao-id");

            const curtida = curtidas[publicacaoId] || { likes: 0, deslikes: 0 };
            likeCount.textContent = curtida.likes;
            dislikeCount.textContent = curtida.deslikes;

            const interacaoUsuario = usuarioCurtidas.interacoes[publicacaoId];
            likeBtn.classList.remove("active");
            dislikeBtn.classList.remove("active");
            likeBtn.src = "images/flecha_cima_vazia.svg";
            dislikeBtn.src = "images/flecha_baixo_vazia.svg";

            if (interacaoUsuario === 'like') {
                likeBtn.classList.add("active");
                likeBtn.src = "images/flecha_cima_cheia.svg";
            } else if (interacaoUsuario === 'deslike') {
                dislikeBtn.classList.add("active");
                dislikeBtn.src = "images/flecha_baixo_cheia.svg";
            }

            if (comentarios[publicacaoId]) {
                numComentarios.textContent = comentarios[publicacaoId].length;
                comentarioLista.innerHTML = '';
                comentarios[publicacaoId].forEach(com => {
                    const novoComentario = document.createElement("div");
                    novoComentario.classList.add("comentario-item");
                    const textoComentario = document.createElement("p");
                    textoComentario.textContent = `${com.usuario}: ${com.texto}`;
                    novoComentario.appendChild(textoComentario);

                    criarBotoesComentario(novoComentario, com.id, textoComentario, com.usuarioid, numComentarios);

                    comentarioLista.appendChild(novoComentario);
                });
            } else {
                numComentarios.textContent = 0;
            }

            comentarioBtn.addEventListener("click", function () {
                publicacao.querySelector(".comentario-container").style.display = 
                    publicacao.querySelector(".comentario-container").style.display === "none" ? "block" : "none";
            });

            const novoBotaoEnviar = comentarioEnviar.cloneNode(true);
            comentarioEnviar.parentNode.replaceChild(novoBotaoEnviar, comentarioEnviar);

            novoBotaoEnviar.addEventListener("click", function () {
                if (!usuarioLogadoId) {
                    alert("Você precisa estar logado para comentar!");
                    return;
                }
                if (comentarioInput.value.trim() !== "") {
                    const novoComentario = document.createElement("div");
                    novoComentario.classList.add("comentario-item");
                    const textoComentario = document.createElement("p");
                    textoComentario.textContent = `${usuarioLogado}: ${comentarioInput.value}`;
                    novoComentario.appendChild(textoComentario);

                    fetch('/comentario', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            usuarioid: usuarioLogadoId,
                            publicacaoid: publicacaoId,
                            comentario: comentarioInput.value
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            criarBotoesComentario(novoComentario, data.comentarioId, textoComentario, usuarioLogadoId, numComentarios);
                            comentarioInput.value = "";
                            comentarioLista.appendChild(novoComentario);
                            numComentarios.textContent = parseInt(numComentarios.textContent) + 1;
                            atualizarComentarios(publicacaoId, comentarioLista, numComentarios);
                        }
                    })
                    .catch(error => console.error("Erro ao salvar comentário:", error));
                }
            });

            likeBtn.addEventListener("click", async function () {
                if (!usuarioLogadoId) {
                    alert("Você precisa estar logado para curtir!");
                    return;
                }

                const publicacaoId = publicacao.getAttribute("data-publicacao-id");
                let tipoInteracao = likeBtn.classList.contains("active") ? "none" : "like";

                try {
                    const response = await fetch('/interacao', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            usuarioId: usuarioLogadoId,
                            publicacaoId: publicacaoId,
                            tipo_interacao: tipoInteracao
                        })
                    });
                    const data = await response.json();

                    if (data.success) {
                        likeCount.textContent = data.curtidas.likes;
                        dislikeCount.textContent = data.curtidas.deslikes;
                        totalLikes.textContent = data.usuarioLikes;
                        totalDislikes.textContent = data.usuarioDislikes;

                        likeBtn.classList.toggle("active", tipoInteracao === "like");
                        likeBtn.src = tipoInteracao === "like" ? "images/flecha_cima_cheia.svg" : "images/flecha_cima_vazia.svg";
                        if (tipoInteracao === "like") {
                            dislikeBtn.classList.remove("active");
                            dislikeBtn.src = "images/flecha_baixo_vazia.svg";
                        }
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error("Erro ao registrar like:", error);
                }
            });

            dislikeBtn.addEventListener("click", async function () {
                if (!usuarioLogadoId) {
                    alert("Você precisa estar logado para descurtir!");
                    return;
                }

                const publicacaoId = publicacao.getAttribute("data-publicacao-id");
                let tipoInteracao = dislikeBtn.classList.contains("active") ? "none" : "deslike";

                try {
                    const response = await fetch('/interacao', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            usuarioId: usuarioLogadoId,
                            publicacaoId: publicacaoId,
                            tipo_interacao: tipoInteracao
                        })
                    });
                    const data = await response.json();

                    if (data.success) {
                        likeCount.textContent = data.curtidas.likes;
                        dislikeCount.textContent = data.curtidas.deslikes;
                        totalLikes.textContent = data.usuarioLikes;
                        totalDislikes.textContent = data.usuarioDislikes;

                        dislikeBtn.classList.toggle("active", tipoInteracao === "deslike");
                        dislikeBtn.src = tipoInteracao === "deslike" ? "images/flecha_baixo_cheia.svg" : "images/flecha_baixo_vazia.svg";
                        if (tipoInteracao === "deslike") {
                            likeBtn.classList.remove("active");
                            likeBtn.src = "images/flecha_cima_vazia.svg";
                        }
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error("Erro ao registrar dislike:", error);
                }
            });
        });

        totalLikes.textContent = usuarioCurtidas.likes;
        totalDislikes.textContent = usuarioCurtidas.deslikes;
    }

    carregarInteracoes();
});