:-use_module(library(http/thread_httpd)).
:-use_module(library(http/http_dispatch)).
:-use_module(library(http/json_convert)).
:-use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

:-ensure_loaded(lapr5).


:- dynamic nomeCamiao/1.

:- json_object route(percurso:list,tempo:float).
:- set_setting(http:cors, [*]).
:- cors_enable.
server :- server(7000).

server(Port):-
    http_server(http_dispatch,[port(Port)]).

:- http_handler('/percurso',calcularRota,[]).
:- http_handler('/menorTempo',heuristicaTempo,[]).
:- http_handler('/maiorPeso',heuristicaPeso,[]).
:- http_handler('/combinado',heuristicaTempoEPeso,[]).


calcularRota(Request):-
   carregarDados(Request),
   consult(lapr5),
   nomeCamiao(M),
   seq_tempo_min(M,K,T),
   R = route(K,T),
   prolog_to_json(R,JSON),
   reply_json(JSON).

heuristicaTempo(Request):-
   carregarDados(Request),
   consult(lapr5),
   nomeCamiao(M),
   heuristica_menor_tempo(M,K,T),
   R = route(K,T),
   prolog_to_json(R,JSON),
   reply_json(JSON).

heuristicaPeso(Request):-
   carregarDados(Request),
   consult(lapr5),
   nomeCamiao(M),
   heuristica_maior_massa(M,K,T),
   R = route(K,T),
   prolog_to_json(R,JSON),
   reply_json(JSON).

heuristicaTempoEPeso(Request):-
   carregarDados(Request),
   consult(lapr5),
   nomeCamiao(M),
   heuristica_combinada(M,K,T),
   R = route(K,T),
   prolog_to_json(R,JSON),
   reply_json(JSON).




%Carregar Dados

carregarDados(Request):-
   http_read_json(Request,J),
   json_to_prolog(J,L),
   getArmazens(L,Armazens),
   getEntregas(L,Entregas),
   getCamiao(L,Camiao),
   getRotas(L,Rotas),
   writeArmazens(Armazens),
   writeEntregas(Entregas),
   writeRotas(Camiao,Rotas).
   %format('Content-type: application/json~n~n').
   /*format('~w',Armazens),format('~w',Entregas),format('~w',Camiao),format('~w',Rotas).*/

%Armazens

getArmazens(json(L),V):-
    member(arm=M,L),
    getListadeArms(M,V).

getListadeArms(json(L),V):-
    member(arms=M,L),
    criarArmazens(M,X),
    member(pc=PC,L),
    criarPartidaChegada(PC,X,V).

criarArmazens([],"").
criarArmazens([A|T],Writer):-
    criarLinhaArm(A,S),
    criarArmazens(T,Writer1),
    concatenate([Writer1,S],Writer).

criarLinhaArm(A,S):-
    atom_number(A,IdArm),
    concatenate(["idArmazem(",IdArm,").","\n"],S).

criarPartidaChegada(PC,S,Writer):-
    atom_number(PC,IdArm),
    concatenate([S,'partida_chegada(',IdArm,').',"\n"],Writer).

%Entregas

getEntregas(json(L),S):-
    member(ent=M,L),
    jsonEntregasToFile(M,S).

jsonEntregasToFile([],"").
jsonEntregasToFile([json(X)|Json],S):-
    member(id=Id,X), /*write(Id), write('\n'),*/
    member(dataEntrega=J,X),atom_string(J,K),re_replace("-","",K,G),re_replace("-","",G,Data),/*write(Data), write('\n'),*/
    member(massaEntrega=M,X),Massa is round(M), /*write(Massa),write('\n'),*/
    member(armazemEntrega=H,X),atom_number(H,IdArm), /*write(IdArm), write('\n'),*/
    member(tempoCarregarEntrega=T1,X), TCarregamento is round(T1),/*write(TCarregamento), write('\n'),*/
    member(tempoDescarregarEntrega=T2,X),TDescarregamento is round(T2), /*write(TDescarregamento), write('\n'),*/
    criarEntregas(Id,Data,Massa,IdArm,TCarregamento,TDescarregamento,S1),
    jsonEntregasToFile(Json,S2),
    concatenate([S2,S1],S).

criarEntregas(Id,Data,Massa,IdArm,TCarregamento,TDescarregamento,String):-concatenate(["entrega(",Id,",",Data,",",Massa,",",IdArm,",",TCarregamento,",",TDescarregamento,").","\n"],String).

%Camiao

getCamiao(json(L),S):-member(camiao=C,L),jsonCamToFile(C,S).

jsonCamToFile(json(X),S):- /*member(matricula=Matricula,X),*/
    member(nome=Nome,X),
    retractall(nomeCamiao(_)),
    assertz(nomeCamiao(Nome)),
    member(tara=Tara,X),
    member(capacidadeCarga=CapacidadeCarga,X),
    member(cargaTotalBat=CargaTotalBat,X),
    member(autonomiaCargaMax=AutonomiaCargaMax,X),
    member(tempoCarregamento=TempoCarregamento,X),
    concatenate(["carateristicasCam(",Nome,",",Tara,",",CapacidadeCarga,",",CargaTotalBat,",",AutonomiaCargaMax,",",TempoCarregamento,").","\n"],S).

%Rotas

getRotas(json(L),S):-member(rotas=M,L),jsonRotasToFile(M,S).

jsonRotasToFile([],"").
jsonRotasToFile([json(X)|Json],S):-
    member(armazemInicial=I,X),atom_number(I,ArmIn),
    member(armazemFinal=F,X),atom_number(F,ArmFin),
    member(duracao=Duracao,X),
    member(energiaGasta=EnergiaGasta,X),
    %member(distancia=Distancia,X),
    member(tempExtra=TempoAdicional,X),
    nomeCamiao(Nome),
    criarRota(Nome,ArmIn,ArmFin,Duracao,EnergiaGasta,TempoAdicional,S1),
    jsonRotasToFile(Json,S2),
    concatenate([S2,S1],S).

criarRota(Nome,ArmIn,ArmFin,Duracao,EnergiaGasta,TempoAdicional,S):-concatenate(["dadosCam_t_e_ta(",Nome,",",ArmIn,",",ArmFin,",",Duracao,",",EnergiaGasta,",",TempoAdicional,").","\n"],S).

concatenate(StringList, StringResult) :-
    maplist(atom_chars, StringList, Lists),
    append(Lists, List),
    atom_chars(StringResult, List).


%Escrever em ficheiros

writeArmazens(Armazens):-open('armazens.pl',write,V),write(V,Armazens),close(V).

writeEntregas(Entregas):-open('entregas.pl',write,V),write(V,Entregas),close(V).

writeRotas(Camiao,Rotas):-concatenate([Camiao,Rotas],S),open('camiao_t_e_ta.pl',write,V),write(V,S),close(V).











