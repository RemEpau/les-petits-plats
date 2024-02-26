export function normalizedName(filtreName) {
    return filtreName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}