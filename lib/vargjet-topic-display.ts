/** Datumi mbi kartën (në vend të «Tema»), sipas sortOrder — titulli në DB mbetet i pandryshuar. */
const VARGJET_TOPIC_DATE_BY_SORT_ORDER: Readonly<Record<number, string>> = {
  1: "02.04.2026",
  2: "23.04.2026",
  3: "07.05.2026",
};

export function vargjetTopicDateLabel(sortOrder: number): string | undefined {
  return VARGJET_TOPIC_DATE_BY_SORT_ORDER[sortOrder];
}
