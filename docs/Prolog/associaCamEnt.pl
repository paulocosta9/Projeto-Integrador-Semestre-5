
:- dynamic pesoAtual/2.

capacidadeMaxima(0.8).

:-consult(entregas).
:-consult(camiao_t_e_ta).

ordenarEntregas(ListaEnt):-findall(Massa,entrega(_,_,Massa,_,_,_),L),sort(L,ListaMassa),idsAssociadosMassas(ListaMassa,ListaEnt). /*Ids das Entregas de Maior para Menor Peso*/

camioes(ListaCams):-findall(Nome,carateristicasCam(Nome,_,_,_,_,_),ListaCams).

idsAssociadosMassas([],[]).
idsAssociadosMassas([M|ListaMassas],LEntregas):-idsAssociadosMassas(ListaMassas,LEntregas1),findall(Id,entrega(Id,_,M,_,_,_),Entregas),append(LEntregas1,Entregas,LEntregas).

carregarAssociacoes():- inicializarPesos,findall(associaCamEnt(Entrega, Cam), associaCamEnt(Entrega, Cam), Associacoes),escreverAssociacoes(Associacoes,V),close(V),apagarPesos.

escreverAssociacoes([],V):-open('camiaoEntrega.pl',write,V).
escreverAssociacoes([A|Associacoes],V):-escreverAssociacoes(Associacoes,V),write(V,"entregaParaCamiao("),A = associaCamEnt(E,T),write(V,E),write(V,","),write(V,T),write(V,").\n").


associaCamEnt(Entrega, Camiao) :-
    ordenarEntregas(ListaEntregas),
    quantosCamioes(ListaCamiao),
    length(ListaCamiao, NumCams), /*Saber o numero de camioes existentes*/
    nth0(Index, ListaEntregas, Entrega),/*Buscar a entrega a listaEntregas com o index Entrega = ListaEntregas[Index]*/
    nth0(CamIndex, ListaCamiao, Camiao),
    CamIndex is Index mod NumCams, /*Para sabermos que camiao associar a entrega pegando entao no index da entrega*/
    carateristicasCam(Camiao,_,PesoMax,_,_,_), /*PesoMax de dado camiao*/
    entrega(Entrega,_,Massa,_,_,_), /*Peso da determinada entrega*/
    pesoAtual(Camiao,Peso), /*Peso que o camiao transporta*/
    capacidadeMaxima(P), /*Capacidade do camiao*/
    NovoPeso is Peso + Massa, /*Peso que tera se for adicionada a entrega*/
    NovoPeso < PesoMax * P,
    retract(pesoAtual(Camiao,_)), /*Caso consiga apagar o peso antigo e atribuir o novo*/
    assert(pesoAtual(Camiao,NovoPeso)).



inicializarPesos:-quantosCamioes(L),init(L).
init([]).
init([X|L]):-init(L),assert(pesoAtual(X,0)).

apagarPesos:-retractall(pesoAtual(_,_)).


% Ver numero de camioes necessarios e fazer a lista de camioes

quantosCamioes(L):-findall(Peso,entrega(_,_,Peso,_,_,_),LPesos),somaPesos(LPesos,P),camioesParaPeso(P,L).

somaPesos([],0).
somaPesos([X|L],P):-somaPesos(L,P1),P is X + P1.

camioesParaPeso(P,L):-capacidadeMaxima(Percentagem),carateristicasCam(_,_,PesoMaxTransporte,_,_,_),!,N1 is P/(PesoMaxTransporte*Percentagem),numeroDeCams(N1,N),camioes(LCam),nElementos(LCam,N,L).

nElementos(_,0,[]).
nElementos([X|T],N,[X|L]):-N1 is N-1,nElementos(T,N1,L),!.

numeroDeCams(N,Result):-X is N - floor(N), (X >= 0.8,Result is ceiling(N) + 1);Result is ceiling(N).


%Ver o peso que cada camiao ter�
pesoDeCadaCamiao(L):-consult(camiaoEntrega),quantosCamioes(I),pesos(I,L).

pesos([],[]).
pesos([X|T],Pesos):-pesoDeCamiao(X,_),pesos(T,Pesos).

pesoDeCamiao(X,P):-findall(Id,entregaParaCamiao(Id,X),L),pesosEntregas(L,P),write(X),write(" "),write(P),write("\n").

pesosEntregas([],0).
pesosEntregas([X|L],P):-pesosEntregas(L,P1),entrega(X,_,M,_,_,_),P is P1 +M.
