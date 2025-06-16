import env from "@/config/env"
import { SchoolReport, WeeklyReport } from "@/types/reports"
import { RadarXProfile } from "@/types/user"
import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios"

type ServiceResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export class RadarXService {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string = env.RADAR_X_URL) {
    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/api/v1`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.RADAR_X_API_KEY,
      },
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message)
        return Promise.reject(error)
      },
    )
  }

  private async fetchData<T>(
    endpoint: string,
    defaultErrorMsg: string,
  ): Promise<ServiceResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint)
      return { success: true, data: response.data }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const isConnRefused = error.code === "ECONNREFUSED"
        const isTimeout = error.code === "ETIMEDOUT"

        console.error("RadarX error:", {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
          config: error.config?.url,
        })

        let errorMsg = defaultErrorMsg

        if (isConnRefused) {
          errorMsg = "No se pudo conectar con el servicio. Revisa la conexión."
        } else if (isTimeout) {
          errorMsg =
            "La solicitud al servicio tardó demasiado. Inténtalo más tarde."
        } else if (error.response?.status === 500) {
          errorMsg = "El servidor encontró un error al procesar la solicitud."
        }

        return { success: false, error: errorMsg }
      }

      console.error("RadarX unknown error:", error)
      return {
        success: false,
        error: "Error desconocido. Inténtalo más tarde.",
      }
    }
  }

  async getProfileByEmail(
    email: string,
  ): Promise<ServiceResponse<RadarXProfile | null>> {
    const endpoint = `/addon/profile/${encodeURIComponent(email)}`
    return this.fetchData<RadarXProfile | null>(
      endpoint,
      "No se pudo obtener el perfil. Inténtalo más tarde.",
    )
  }

  async getStudentWeeklyProgress(
    email: string,
  ): Promise<ServiceResponse<WeeklyReport>> {
    const endpoint = `/addon/student/progress/weekly/${encodeURIComponent(
      email,
    )}`
    return this.fetchData<WeeklyReport>(
      endpoint,
      "No se pudo obtener el progreso semanal. Inténtalo más tarde.",
    )
  }

  async getStudentSchoolProgress(
    email: string,
  ): Promise<ServiceResponse<SchoolReport>> {
    const endpoint = `/addon/student/progress/school/${encodeURIComponent(
      email,
    )}`
    return this.fetchData<SchoolReport>(
      endpoint,
      "No se pudo obtener el progreso escolar. Inténtalo más tarde.",
    )
  }

  async getTeacherWeeklyProgress(): Promise<ServiceResponse<WeeklyReport>> {
    return this.fetchData<WeeklyReport>(
      "/addon/teacher/progress/weekly",
      "No se pudo obtener el progreso semanal. Inténtalo más tarde.",
    )
  }

  async getTeacherSchoolProgress(): Promise<ServiceResponse<SchoolReport>> {
    return this.fetchData<SchoolReport>(
      "/addon/teacher/progress/school",
      "No se pudo obtener el progreso escolar. Inténtalo más tarde.",
    )
  }
}
