const buttons = require("../../data/buttons");
const AutocompleteComponent = require("../../structure/AutocompleteComponent");

module.exports = new AutocompleteComponent({
    commandName: 'them-nut',
    run: async (client, interaction) => {
        
        const currentInput = interaction.options.getFocused();
        const filteredButtons = buttons.filter(button => button.label.toLowerCase().startsWith(currentInput.toLowerCase()));

        await interaction.respond(filteredButtons.map(button => ({ name: button.label, value: button.customId })));
    }
}).toJSON();