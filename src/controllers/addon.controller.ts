import { classroom_v1, google } from "googleapis"
import { Request, Response } from "express"
import env from "@/config/env"
import { RadarXService } from "@/services/radarx.service"
import {
  formatDateTime,
  formatRecruitmentDate,
  humanReadableDifference,
  humanReadableDifferenceShort,
} from "@/utils/dates"
import { STUDENT_STATUS_COLORS } from "@/utils/constants"

// * Controller for home view
export const homeView = async (req: Request, res: Response) => {
  const user = req?.session?.user
  const tokens = req?.tokens
  const addon = req?.session?.addon

  if (!user || !tokens) {
    return res.redirect("/auth/signin")
  }

  console.log(addon)

  res.render("addon/home", {
    title: "Inicio",
    userName: user.fullName,
    user,
    insideAddon: addon && Object.keys(addon).length > 0,
  })
}

// * Controller for school progress view for teacher
export const teacherSchoolProgressView = async (
  req: Request,
  res: Response,
) => {
  const user = req.session.user
  const tokens = req.tokens

  if (!user || !user.refresh_token || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  const radarXService = new RadarXService()
  const result = await radarXService.getTeacherSchoolProgress()

  if (!result.success) {
    if (req.headers["x-fetch-data-only"] === "true") {
      return res.render("addon/partials/error-message", {
        message: result.error,
        layout: false,
      })
    }

    return res.render("addon/reports/school", {
      title: "Estatus académica",
      error: result.error,
    })
  }

  if (req.headers["x-fetch-data-only"] === "true") {
    return res.render("addon/reports/partials/school-content", {
      data: result.data || [],
      STUDENT_STATUS_COLORS,
      formatDateTime,
      humanReadableDifference,
      humanReadableDifferenceShort,
      formatRecruitmentDate,
      layout: false,
    })
  }

  res.render("addon/reports/school", {
    title: "Estatus académica",
  })
}

// * Controller for school progress view for student
export const studentSchoolProgressView = async (
  req: Request,
  res: Response,
) => {
  const user = req.session.user
  const tokens = req.tokens

  if (!user || !user.refresh_token || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  const radarXService = new RadarXService()
  const result = await radarXService.getStudentSchoolProgress(user.email)

  if (!result.success) {
    if (req.headers["x-fetch-data-only"] === "true") {
      return res.render("addon/partials/error-message", {
        message: result.error,
        layout: false,
      })
    }

    return res.render("addon/reports/school", {
      title: "Estatus académica",
      error: result.error,
    })
  }

  if (req.headers["x-fetch-data-only"] === "true") {
    return res.render("addon/reports/partials/school-content", {
      data: result.data || [],
      STUDENT_STATUS_COLORS,
      formatDateTime,
      humanReadableDifference,
      humanReadableDifferenceShort,
      formatRecruitmentDate,
      layout: false,
    })
  }

  res.render("addon/reports/school", {
    title: "Estatus académica",
  })
}

// * Controller for weekly progress view for teacher
export const teacherWeeklyProgressView = async (
  req: Request,
  res: Response,
) => {
  const user = req.session.user
  const tokens = req.tokens

  if (!user || !user.refresh_token || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  const radarXService = new RadarXService()
  const result = await radarXService.getTeacherWeeklyProgress()

  if (!result.success) {
    if (req.headers["x-fetch-data-only"] === "true") {
      return res.render("addon/partials/error-message", {
        message: result.error,
        layout: false,
      })
    }

    return res.render("addon/reports/weekly", {
      title: "Progreso académica",
      error: result.error,
    })
  }

  const data = {
    ...result.data,
    datesFormatted: {
      from: new Date(result?.data?.dates["4w"] ?? "").toLocaleDateString(
        "en-GB",
      ),
      to: new Date(result?.data?.dates.current ?? "").toLocaleDateString(
        "en-GB",
      ),
    },
  }

  if (req.headers["x-fetch-data-only"] === "true") {
    return res.render("addon/reports/partials/weekly-content", {
      data,
      STUDENT_STATUS_COLORS,
      formatDateTime,
      humanReadableDifference,
      humanReadableDifferenceShort,
      formatRecruitmentDate,
      TOTAL_WEEKS: 4,
      layout: false,
    })
  }

  res.render("addon/reports/weekly", {
    title: "Progreso académica",
  })
}

// * Controller for weekly progress view for student
export const studentWeeklyProgressView = async (
  req: Request,
  res: Response,
) => {
  const user = req.session.user
  const tokens = req.tokens

  if (!user || !user.refresh_token || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  const radarXService = new RadarXService()
  const result = await radarXService.getStudentWeeklyProgress(user.email)

  if (!result.success) {
    if (req.headers["x-fetch-data-only"] === "true") {
      return res.render("addon/partials/error-message", {
        message: result.error,
        layout: false,
      })
    }

    return res.render("addon/reports/weekly", {
      title: "Progreso académica",
      error: result.error,
    })
  }

  const data = {
    ...result.data,
    datesFormatted: {
      from: new Date(result?.data?.dates["4w"] ?? "").toLocaleDateString(
        "en-GB",
      ),
      to: new Date(result?.data?.dates.current ?? "").toLocaleDateString(
        "en-GB",
      ),
    },
  }

  if (req.headers["x-fetch-data-only"] === "true") {
    return res.render("addon/reports/partials/weekly-content", {
      data,
      STUDENT_STATUS_COLORS,
      formatDateTime,
      humanReadableDifference,
      humanReadableDifferenceShort,
      formatRecruitmentDate,
      TOTAL_WEEKS: 4,
      layout: false,
    })
  }

  res.render("addon/reports/weekly", {
    title: "Progreso académica",
  })
}

// * Controller to create a weekly progress attachment
export const addWeeklyAttachment = async (req: Request, res: Response) => {
  const user = req.session.user
  const tokens = req.tokens
  const courseId = req.session?.addon?.courseId
  const itemId = req.session?.addon?.itemId
  const addOnToken = req.session?.addon?.addOnToken

  if (!user || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials(tokens)

    const classroom = google.classroom({ version: "v1", auth: oauth2Client })
    const attachment: classroom_v1.Schema$AddOnAttachment | undefined = {
      title: "Reporte de Progreso",
      teacherViewUri: {
        uri: `${env.CLIENT_URL}/teachers/weekly/progress`,
      },
      studentViewUri: {
        uri: `${env.CLIENT_URL}/students/weekly/progress`,
      },
    }

    try {
      await classroom.courses.announcements.addOnAttachments.create({
        auth: oauth2Client,
        courseId,
        itemId,
        addOnToken,
        requestBody: attachment,
      })
    } catch (err) {
      console.error("Error al crear el adjunto", err)
    }

    res.redirect("/")
  } catch (error) {
    console.error("Error al obtener cursos de Classroom:", error)
  }
}

// * Controller to create a school progress attachment
export const addSchoolAttachment = async (req: Request, res: Response) => {
  const user = req.session.user
  const tokens = req.tokens
  const courseId = req.session?.addon?.courseId
  const itemId = req.session?.addon?.itemId
  const addOnToken = req.session?.addon?.addOnToken

  if (!user || !tokens) {
    return res.redirect(`/auth/signin/?redirectTo=${req.originalUrl}`)
  }

  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials(tokens)

    const classroom = google.classroom({ version: "v1", auth: oauth2Client })
    const attachment: classroom_v1.Schema$AddOnAttachment | undefined = {
      title: "Reporte de Estatus",
      teacherViewUri: {
        uri: `${env.CLIENT_URL}/teachers/school/progress`,
      },
      studentViewUri: {
        uri: `${env.CLIENT_URL}/students/school/progress`,
      },
    }

    try {
      await classroom.courses.announcements.addOnAttachments.create({
        auth: oauth2Client,
        courseId,
        itemId,
        addOnToken,
        requestBody: attachment,
      })
    } catch (err) {
      console.error("Error al crear el adjunto", err)
    }

    res.redirect("/")
  } catch (error) {
    console.error("Error al obtener cursos de Classroom:", error)
  }
}
