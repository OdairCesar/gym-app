/**
 * A API pode retornar lista direta ou resposta paginada { data: [...], meta }.
 * Esta função desembrulha ambos os formatos e sempre retorna um array.
 */
export const extractList = <T>(result: unknown): T[] => {
  if (Array.isArray(result)) return result as T[]
  if (
    result !== null &&
    typeof result === 'object' &&
    Array.isArray((result as { data: unknown }).data)
  ) {
    return (result as { data: T[] }).data
  }
  return []
}
