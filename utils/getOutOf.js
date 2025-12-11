const { StudentTermPerformance } = require("../models")

module.exports = async ({classId, termId}) => {
    try {
        const outOf = await StudentTermPerformance.count({ where: {ClassId: classId, TermId: termId} })
        if(!outOf) return 0
        return outOf
    } catch (error) {
        console.error("ERROR GETTING STUDENT TERM PERFORMANCE")
        console.error(error)
        return 0
    }
}
