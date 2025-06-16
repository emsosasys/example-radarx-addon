import {
  homeView,
  addWeeklyAttachment,
  addSchoolAttachment,

  // ! School Progress
  studentSchoolProgressView,
  teacherSchoolProgressView,

  // ! Weekly Progress
  studentWeeklyProgressView,
  teacherWeeklyProgressView,
} from "@/controllers/addon.controller"

import express from "express"

const router = express.Router()

router.use((req, res, next) => {
  res.locals.user = req.session.user || null
  res.locals.layout = "./layouts/main"
  next()
})

router
  .get("/", homeView)
  .get("/students/school/progress", studentSchoolProgressView)
  .get("/teachers/school/progress", teacherSchoolProgressView)

  .get("/students/weekly/progress", studentWeeklyProgressView)
  .get("/teachers/weekly/progress", teacherWeeklyProgressView)

  .get("/attachments/weekly", addWeeklyAttachment)
  .get("/attachments/school", addSchoolAttachment)

export default router
