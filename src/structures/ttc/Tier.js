const Tiers = {
    BronzeID: 1,
    SilverID: 2,
    GoldID: 3,
    PlatinumID: 4,
    DiamondID: 5
};

function TierToString(tier) {
	switch (tier) {
        case Tiers.BronzeID:
            return "Bronze";
        case Tiers.SilverID:
            return "Silver";
        case Tiers.GoldID:
            return "Gold";
        case Tiers.PlatinumID:
            return "Platinum";
        case Tiers.DiamondID:
            return "Diamond";
	    default:
		    return "<unknown>";
	}
}

function GetTier(rating) {
    const tier = Math.floor(rating / 2400) + 1
    return tier >= Tiers.DiamondID ? Tiers.DiamondID : tier;
}

module.exports = { Tiers, TierToString, GetTier };