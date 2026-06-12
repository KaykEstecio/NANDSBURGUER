// Common constants
export const EMPTY_ARRAY = Object.freeze([]);
export const EMPTY_OBJECT = Object.freeze({});

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  UNAUTHORIZED: 'Você não tem permissão para isso.',
  NOT_FOUND: 'Recurso não encontrado.',
  INVALID_INPUT: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  REGISTER_SUCCESS: 'Conta criada com sucesso!',
  LOGOUT_SUCCESS: 'Desconectado com sucesso!',
  ORDER_CREATED: 'Pedido criado com sucesso!',
  PRODUCT_ADDED: 'Produto adicionado ao carrinho!',
  PRODUCT_REMOVED: 'Produto removido do carrinho!',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#D62828', // Vermelho
  SECONDARY: '#F77F00', // Laranja
  DARK: '#111111',
  LIGHT: '#faf3ed',
  GRAY: '#f3a29c',
} as const;
