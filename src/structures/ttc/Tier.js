const Tiers = {
    Bronze3ID: 1,
	Bronze2ID: 2,
	Bronze1ID: 3,
	Silver3ID: 4,
	Silver2ID: 5,
	Silver1ID: 6,
	Gold3ID: 7,
	Gold2ID: 8,
	Gold1ID: 9,
	Platinum3ID: 10,
	Platinum2ID: 11,
	Platinum1ID: 12,
	Diamond3ID: 13,
	Diamond2ID: 14,
	Diamond1ID: 15
};

function TierToString(tier) {
	switch (tier) {
	case Tiers.Bronze3ID:
		return "Bronze 3";
	case Tiers.Bronze2ID:
		return "Bronze 2";
	case Tiers.Bronze1ID:
		return "Bronze 1";
	case Tiers.Silver3ID:
		return "Silver 3";
	case Tiers.Silver2ID:
		return "Silver 2";
	case Tiers.Silver1ID:
		return "Silver 1";
	case Tiers.Gold3ID:
		return "Gold 3";
	case Tiers.Gold2ID:
		return "Gold 2";
	case Tiers.Gold1ID:
		return "Gold 1";
	case Tiers.Platinum3ID:
		return "Platinum 3";
	case Tiers.Platinum2ID:
		return "Platinum 2";
	case Tiers.Platinum1ID:
		return "Platinum 1";
	case Tiers.Diamond3ID:
		return "Diamond 3";
	case Tiers.Diamond2ID:
		return "Diamond 2";
	case Tiers.Diamond1ID:
		return "Diamond 1";
	default:
		return "<unknown>";
	}
}

function GetTier(rating) {
    const index = rating >= 700 ? Math.floor(rating / 700) - 1 : 0;
    return Object.values(Tiers)[index];
}

module.exports = { Tiers, TierToString, GetTier };