const elements = {
	about: document.getElementById("sel-about"),
	flags: document.getElementById("sel-flags")
},
texts = {
	about: `There are still people out there who are playing Wii games such as Mario Kart Wii and enjoy it, including me! Luckily Wiimm, Leseratte and other people made a Nintendo WFC replacement called Wiimmfi, which allows us to play Wii games with friends all around the world even though the Nintendo servers shut down in 2014.
	"So why don't we have a Discord bot that gives us information about Wii games such as Mario Kart Wii" is what I asked myself. This is where the development of Wiiset began.
	<b>TL;DR</b>: This bot gives you useful information such as VR (versus rating) in Mario Kart Wii, the amount of rooms in Super Smash Bros. Brawl and much more.
	
	<h2>Inviting the bot</h2>Interesting, but how do I invite the bot to my Discord server you might ask. 
	To invite the Discord Bot, you basically only need administrator permissions on the server where you want to add the bot. If you are the server owner, you automatically have that permission.
	Alright, now that you have administrator permissions, you can invite the bot to your server by simply clicking <a class="rlink" href="https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=8&scope=bot">this link.</a>
	Congratulations, you successfully invited the bot to your server, go and try it out by typing w.help
	
	<h2>Getting started</h2>The most important command is obviously the help command since it gives you a list with <u>ALL</u> existing commands. To get that list, simply type w.help in any channel or via direct messages.
	
	<h2>Categories</h2>Most of Wiiset's commands are in a category. All categories and its commands are shown on the help page. Commands without a category are listed under <i>general</i>.
	When executing commands, the category (if present) is provided as first argument, e.g.: w.<u>mkw</u> list
	<div class="quote">If a command does not have a category, the first parameter is the command name, e.g.: w.<u>help</u></div>`,
	flags: `<div class="quote">This feature is unstable and might not be working as expected for now.</div>Flags are very useful, especially when you want a command to act different.
	You can imagine them as options.
	Here's a list with flags:
	<table>
		<tr>
			<th>Flag</th>
			<th>Available in (category:command)</th>
			<th>Description</th>
			<th>Status</th>
		</tr>
		<tr>
			<td>i</td>
			<td>mkw:user</td>
			<td>The <u>i</u>(ncludes) flag searches for a Mii name that includes a specific string that is given as argument.</td>
			<td><span class="green"><b>Stable</b></span></td>
		</tr>
		<tr>
			<td>del</td>
			<td>any command</td>
			<td>The <u>del</u>(ete) flag deletes a command (the message from the message author, respectively)</td>
			<td><span class="red"><b>Unavailable</b></span></td>
		</tr>
		<tr>
			<td>s</td>
			<td>any command</td>
			<td>The <u>s</u>(ilent) flag executes a command without sending the message (only useful in rare cases)</td>
			<td><span class="red"><b>Unavailable</b></span></td>
		</tr>
	</table>
	<h2>Table legend</h2>
	If you don't really know what that table or a specific row/column means, this section might be useful for you.<br/><br/>
	<span class="green">Stable</span>${"&nbsp;".repeat(15)}The flag works fine and has been tested several times.<br/>
	<span class="red">Unavailable</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This flag is not available, in other words: it either isn't ready because it's not implemented yet or a bug has been found and developers are trying to fix it.
	
	
	<h2>Using flags in commands</h2>
	Using flags is not as hard as it sounds. You basically only append -flag:<i>[flag here]</i> to your message. When using multiple flags, make sure to seperate them with a comma. Here's a short example of how using flags works:
	<codeblock>
	w.mkw user 21 -flag:i
	</codeblock>
	This command would search for a user in Mario Kart Wii where its Mii name <b>includes</b> 21 (in this example). If I would be in a room and my Mii name is y21, it would find me, because y21 includes "21".`
},
textElement = document.getElementById("text"),
headingElement = document.getElementById("heading-ct");

// Setup
setContent(texts.about.replace(/\n/g, "<br/>"), "About");
console.log("%cWoohoo, you found a secret.", "color:#663399");

function setContent(text, heading){
	textElement.innerHTML = text;
	headingElement.innerHTML = heading;
}

function removeSelection(elements, blacklist) {
	for (const element of elements) {
		if (element[1].className.includes("selected") && element[0] != blacklist) {
			element[1].className = element[1].className.replace(/selected/g, "");
		}
	}
}

elements.about.addEventListener("click", function () {
	if (!elements.about.className.includes("selected")) {
		elements.about.className += " selected";
	}
	setContent(texts.about.replace(/\n/g, "<br/>"), "About");
	document.title = "Wiiset Discord Bot | About";
	removeSelection(Object.entries(elements), "about");
});

elements.flags.addEventListener("click", function () {
	if (!elements.flags.className.includes("selected")) {
		elements.flags.className += " selected";
	}
	setContent(texts.flags, "Flags");
	document.title = "Wiiset Discord Bot | Flags";
	removeSelection(Object.entries(elements), "flags");
});
