function formatDate(b) {
    return Math.floor(b / (60000 * 60)) + " hours, " + Math.floor(b / (60000) - 60 * Math.floor(b / (60000 * 60))) + " minutes and " + Math.floor(b / (1000) - 60 * Math.floor(b / (60000))) + " seconds ago";
}

module.exports = {
    name: "mkwroom",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, args, rest) => {
        const req = await rest.wiimmfi.getMKWRoomStats(args.join(" "));
        return [{
            embed: {
                title: `Room statistics (Room: ${req.name} | ID: ${req.id})`,
                color: 0x3498db,
                description: `This room was created ${formatDate(Date.now() - req.roomStart * 1000)}. The last race started ${formatDate(Date.now() - req.raceStart * 1000)}`,
                fields: [
                    {
                        name: "Average VR",
                        value: Math.floor(req.averageVR) || "-"
                    },
                    {
                        name: "Highest VR",
                        value: req.highestVR ? `${req.highestVR.name[0]} (${req.highestVR.ev} VR)` : "-"
                    },
                    {
                        name: "Lowest VR",
                        value: req.lowestVR ? `${req.lowestVR.name[0]} (${req.lowestVR.ev} VR)` : "-"
                    }
                ]
            }
        }];
    }
};
