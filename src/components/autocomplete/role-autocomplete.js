const buttons = require("../../data/buttons");
const Project = require("../../Models/Project");
const AutocompleteComponent = require("../../structure/AutocompleteComponent");
const { error } = require("../../utils/Console");

module.exports = new AutocompleteComponent({
  commandName: "tao-matkhau",
  run: async (client, interaction) => {
    const currentInput = interaction.options.getFocused();
    try {
      const availableRoles = ["admin", "manager", "member"];

      const filteredRoles = availableRoles.filter(role =>
        role.toLowerCase().includes(currentInput.toLowerCase())
      );

      await interaction.respond(
        filteredRoles.map(role => ({
          name: role.charAt(0).toUpperCase() + role.slice(1),
          value: role
        }))
      );
    } catch (e) {
      error("Error when fetching roles: " + e);
      console.log(e);
    }
  },
}).toJSON();
