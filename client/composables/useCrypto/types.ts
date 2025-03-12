export type BinanceKline = [
  number, // Время открытия свечи (мс)
  string, // Цена открытия
  string, // Максимальная цена
  string, // Минимальная цена
  string, // Цена закрытия
  string, // Объём торгов
  number, // Время закрытия свечи (мс)
  string, // Объём торгов в quote asset
  number, // Количество сделок
  string, // Объём покупок у тейкеров (base asset)
  string, // Объём покупок у тейкеров (quote asset)
  string // Игнорируемое поле (всегда "0")
]

export type BinanceKlinesResponse = BinanceKline[]

export type Candle = [
  string, // open
  string, // high
  string, // low
  string // close
]

export type ChartData = {
  x: number,
  y: Candle
}[]


export type Series = {
  data: ChartData
}[]