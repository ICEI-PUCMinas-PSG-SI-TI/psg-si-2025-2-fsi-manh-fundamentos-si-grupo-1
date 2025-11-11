export const CONFIG_KEY_ID = 'TREM.id'
export const CONFIG_KEY_NOME = 'TREM.nome'
export const CONFIG_KEY_LOGIN = 'TREM.login'
export const CONFIG_KEY_DARK_THEME = 'TREM.modoEscuro'
export const CONFIG_KEY_PERMS = 'TREM.nivelPermissoes'
export const CONFIG_KEY_FOTO = 'TREM.foto'

export function limparConfiguracoes() {
  localStorage.clear()
}
