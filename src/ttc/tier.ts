export const enum Tiers {
    BRONZE = 1,
    SILVER = 2,
    GOLD = 3,
    PLATINUM = 4,
    DIAMOND = 5
}

export function tierToString(tier: Tiers) {
    switch (tier) {
        case Tiers.BRONZE:
            return 'Bronze';
        case Tiers.SILVER:
            return 'Silver';
        case Tiers.GOLD:
            return 'Gold';
        case Tiers.PLATINUM:
            return 'Platinum';
        case Tiers.DIAMOND:
            return 'Diamond';
        default:
            return '';
    }
}

export function getTier(rating: number) {
    const tier = (~~(rating / 2400)) + 1;
    return tier >= Tiers.DIAMOND ? Tiers.DIAMOND : tier;
}