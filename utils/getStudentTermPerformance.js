const { StudentTermPerformance } = require("../models")

module.exports = async ({studentId, classId, termId}) => {
    try {
        const studentTermPerformance = await StudentTermPerformance.findOne({ where: {StudentId: studentId, ClassId: classId, TermId: termId} })
        if(!studentTermPerformance) return {}
        return studentTermPerformance
    } catch (error) {
        console.error("ERROR GETTING STUDENT TERM PERFORMANCE")
        console.error(error)
        return {}
    }
}