// utils/format.js

/**
 * Verilen string'i "Title Case" formatına çevirir.
 * Örnek: "yeni sezon ürünleri" => "Yeni Sezon Ürünleri"
 */
export const toTitleCase = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  