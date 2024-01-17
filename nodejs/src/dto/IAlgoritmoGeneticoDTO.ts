export default interface IAlgGenDTO {
    numero_geracoes: number,
    dimensao_populacao: number,
    prob_cruzamento: number,
    prob_mutacao: number,
    valor_minimo: number,
    data: string,
}
export default interface IAlgGenResultadoDTO {
    percurso: string,
}