export interface Tokens {
  access_token: string
  id_token: string
  refresh_token?: string
  expiry_date: number
  scope: string
  token_type: string
}
