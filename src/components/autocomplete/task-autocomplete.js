const buttons = require("../../data/buttons");
const Project = require("../../Models/Project");
const AutocompleteComponent = require("../../structure/AutocompleteComponent");
const { error } = require("../../utils/Console");

module.exports = new AutocompleteComponent({
  commandName: "task",
  run: async (client, interaction) => {
    const currentInput = interaction.options.getFocused();
    try {
      const listProject = await Project.find().limit(25);

      await interaction.respond(
        listProject.map(project => ({
            name: project.projectName,
            value: project._id.toString()
        }))
      );
    } catch (e) {
        error("Error when fetch list project: "+ e);
        console.log(e);
    }
  },
}).toJSON();
