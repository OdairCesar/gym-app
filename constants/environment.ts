// Configurações de ambiente
export const ENV = {
  // Verifica se está em desenvolvimento
  isDevelopment: __DEV__,

  // Configurações de UI baseadas no ambiente
  showSuccessAlerts: __DEV__, // Mostra alerts de sucesso apenas em desenvolvimento
  showDebugInfo: __DEV__, // Mostra informações de debug apenas em desenvolvimento

  // Configurações de API
  apiTimeout: __DEV__ ? 30000 : 15000, // Timeout maior em desenvolvimento

  // Configurações de log
  enableConsoleLog: __DEV__,
}

// Função helper para logs condicionais
export const devLog = (message: string, ...args: unknown[]) => {
  if (ENV.enableConsoleLog) {
    console.log(`[DEV] ${message}`, ...args)
  }
}

// Função helper para logs de erro (sempre habilitado)
export const errorLog = (message: string, ...args: unknown[]) => {
  console.error(`[ERROR] ${message}`, ...args)
}
