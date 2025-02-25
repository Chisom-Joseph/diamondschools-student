const { Class, Subject } = require("../models");

module.exports = async (ClassId) => {
  try {
    if(!ClassId) return []
    
    const classWithSubjects  = await Class.findOne({
      where: { id: ClassId },
      include: {
        model: Subject,
        through: { attributes: [] }, // Exclude junction table data
      },
    });

    if(classWithSubjects <= 0) return []

    return classWithSubjects.Subjects || []
  } catch (error) {
    console.error("ERROR GETTING SUBJECTS", error);
    return [];
  }
};
