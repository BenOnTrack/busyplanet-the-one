import { bookmarkdb } from '$lib/bookmarks/bookmarkdb';
export const prerender = false;
export const csr = true;
export const ssr = false;
export async function load({ params }) {
	try {
		console.log(params)
		const bookmark = await bookmarkdb.ids
			.where({ id: Number(parseInt(params.bookmarkID)) })
			.first();

		console.log("we're on the route");
		console.log(bookmark);

		return {
			bookmark,
		};
	} catch (error) {
		console.error("Error loading bookmark:", error);
		return {
			status: 500,
			error: new Error("Internal Server Error"),
		};
	}
}
