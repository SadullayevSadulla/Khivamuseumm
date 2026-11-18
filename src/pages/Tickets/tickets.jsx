import { useTranslation } from "react-i18next";

export default function Tickets() {
	const { t } = useTranslation();

	return (
		<main className="container py-12 text-white">
			<h1 className="text-center text-3xl font-bold">{t("header.aTickets")}</h1>
		</main>
	);
}
