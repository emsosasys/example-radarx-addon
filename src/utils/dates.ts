export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "2-digit",
    hour12: true,
  }

  const formattedDateTime = new Date(date).toLocaleDateString(
    "es-DO",
    options ?? defaultOptions,
  )

  return formattedDateTime
}

export function humanReadableDifference(
  startDateStr: string,
  endDateStr: string,
): string {
  let startDate = new Date(startDateStr)
  let endDate = new Date(endDateStr)

  if (startDate > endDate) [startDate, endDate] = [endDate, startDate]

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()
  let hours = endDate.getHours() - startDate.getHours()
  let minutes = endDate.getMinutes() - startDate.getMinutes()
  let seconds = endDate.getSeconds() - startDate.getSeconds()
  let milliseconds = endDate.getMilliseconds() - startDate.getMilliseconds()

  if (milliseconds < 0) {
    milliseconds += 1000
    seconds--
  }

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += previousMonth.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  const parts = [
    years ? `${years} ${years === 1 ? "año" : "años"}` : null,
    months ? `${months} ${months === 1 ? "mes" : "meses"}` : null,
    days ? `${days} ${days === 1 ? "día" : "días"}` : null,
    hours ? `${hours} ${hours === 1 ? "hora" : "horas"}` : null,
    minutes ? `${minutes} ${minutes === 1 ? "minuto" : "minutos"}` : null,
  ].filter(Boolean)

  const formattedParts =
    parts.length > 1
      ? parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1]
      : parts[0] || "0 segundos"

  return formattedParts
}

export function humanReadableDifferenceShort(
  startDateStr: string,
  endDateStr: string,
): string {
  let startDate = new Date(startDateStr)
  let endDate = new Date(new Date(endDateStr).getTime() + 1000 * 60 * 60 * 4)

  if (startDate > endDate) [startDate, endDate] = [endDate, startDate]

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += previousMonth.getDate()
    months--
  }

  if (months < 0) {
    months += 12
    years--
  }

  const parts = [
    years ? `${years} ${years === 1 ? "año" : "años"}` : null,
    months ? `${months} ${months === 1 ? "mes" : "meses"}` : null,
    days ? `${days} ${days === 1 ? "día" : "días"}` : null,
  ].filter(Boolean)

  const formattedParts =
    parts.length > 1
      ? parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1]
      : parts[0] || "<1 día"

  return formattedParts
}

export const formatRecruitmentDate = (d: Date) => {
  const date = new Date(d)
  return `${date.getUTCDate().toString().padStart(2, "0")}/${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getUTCFullYear()}`
}
