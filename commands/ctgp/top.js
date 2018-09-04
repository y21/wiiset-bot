const fetch = require("node-fetch");

// Country codes
const countryCodes = {
    "1": "Japan",
    "8": "Anguilla",
    "9": "Antigua and Barbuda",
    "10": "Argentina",
    "11": "Aruba",
    "12": "Bahamas",
    "13": "Barbados",
    "14": "Belize",
    "15": "Bolivia",
    "16": "Brazil",
    "17": "British Virgin Islands",
    "18": "Canada",
    "19": "Cayman Islands",
    "20": "Chile",
    "21": "Colombia",
    "22": "Costa Rica",
    "23": "Dominica",
    "24": "Dominican Republic",
    "25": "Ecuador",
    "26": "El Salvador",
    "27": "French Guiana",
    "28": "Grenada",
    "29": "Guadeloupe",
    "30": "Guatemala",
    "31": "Guyana",
    "32": "Haiti",
    "33": "Honduras",
    "34": "Jamaica",
    "35": "Martinique",
    "36": "Mexico",
    "37": "Monsterrat",
    "38": "Netherlands Antilles",
    "39": "Nicaragua",
    "40": "Panama",
    "41": "Paraguay",
    "42": "Peru",
    "43": "St. Kitts and Nevis",
    "44": "St. Lucia",
    "45": "St. Vincent and the Grenadines",
    "46": "Suriname",
    "47": "Trinidad and Tobago",
    "48": "Turks and Caicos Islands",
    "49": "United States",
    "50": "Uruguay",
    "51": "US Virgin Islands",
    "52": "Venezuela",
    "64": "Albania",
    "65": "Australia",
    "66": "Austria",
    "67": "Belgium",
    "68": "Bosnia and Herzegovina",
    "69": "Botswana",
    "70": "Bulgaria",
    "71": "Croatia",
    "72": "Cyprus",
    "73": "Czech Republic",
    "74": "Denmark",
    "75": "Estonia",
    "76": "Finland",
    "77": "France",
    "78": "Germany",
    "79": "Greece",
    "80": "Hungary",
    "81": "Iceland",
    "82": "Ireland",
    "83": "Italy",
    "84": "Latvia",
    "85": "Lesotho",
    "86": "Lichtenstein",
    "87": "Lithuania",
    "88": "Luxembourg",
    "89": "F.Y.R of Macedonia",
    "90": "Malta",
    "91": "Montenegro",
    "92": "Mozambique",
    "93": "Namibia",
    "94": "Netherlands",
    "95": "New Zealand",
    "96": "Norway",
    "97": "Poland",
    "98": "Portugal",
    "99": "Romania",
    "100": "Russia",
    "101": "Serbia",
    "102": "Slovakia",
    "103": "Slovenia",
    "104": "South Africa",
    "105": "Spain",
    "106": "Swaziland",
    "107": "Sweden",
    "108": "Switzerland",
    "109": "Turkey",
    "110": "United Kingdom",
    "111": "Zambia",
    "112": "Zimbabwe",
    "113": "Azerbaijan",
    "114": "Mauritania (Islamic Republic of Mauritania)",
    "115": "Mali (Republic of Mali)",
    "116": "Niger (Republic of Niger)",
    "117": "Chad (Republic of Chad)",
    "118": "Sudan (Republic of the Sudan)",
    "119": "Eritrea (State of Eritrea)",
    "120": "Djibouti (Republic of Djibouti)",
    "121": "Somalia (Somali Republic)",
    "128": "Taiwan",
    "136": "South Korea",
    "144": "Hong Kong",
    "145": "Macao",
    "152": "Indonesia",
    "153": "Singapore",
    "154": "Thailand",
    "155": "Philippines",
    "156": "Malaysia",
    "160": "China",
    "168": "U.A.E.",
    "169": "India",
    "170": "Egypt",
    "171": "Oman",
    "172": "Qatar",
    "173": "Kuwait",
    "174": "Saudi Arabia",
    "175": "Syria",
    "176": "Bahrain",
    "177": "Jordan"
};

module.exports = async message => {
    try {
        const timestamp = Date.now();
        if (message.args.length < 2) return message.reply("No course name provided.");
        const track = message.tracks.find(val => val.name === message.args.slice(1).join(" "));
        if (track === undefined) return message.reply("Course was not found.");
        let result = JSON.parse((await (await fetch(`http://tt.chadsoft.co.uk${track.href}`)).text()).replace(/^\s+/, ""));
        let counter = 0;
        message.channel.send("Took " + ((Date.now() - timestamp) / 1000).toFixed(1) + " seconds to fetch...", { embed: {
            color: (message.member || { displayColor: 0x00FF00 }).displayColor,
            title: "Top 10 ghosts for " + track.name,
            fields: result.ghosts.slice(0, 10).map(val => { return {
                name: "#" + (++counter) + ": " + val.player,
                value: "Time: `" + val.finishTimeSimple + "`\n"
                    + "Country: " + countryCodes[val.country] || "???"
            }})
        }}).catch();
    } catch(e) {
        message.reply("An error occured while executing the command." + e);
    }
}
